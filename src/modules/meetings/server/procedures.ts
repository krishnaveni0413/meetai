import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { z } from 'zod';
import { db } from "@/db"
import { meetings, agents } from "@/db/schema";
import { and, desc, eq, getTableColumns, ilike, sql, count } from "drizzle-orm"
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE, } from "@/constants";
import { TRPCError } from "@trpc/server";
import { meetingsInsertSchema, meetingsUpdateShema } from "../schema";
// import { MeetingStatus } from "./ui/types";
import { MeetingStatus } from "../ui/types";
import { streamVidio } from "@/lib/stream-video";
import { generateAvatarUri } from "@/lib/avatar";


export const meetingsRouters = createTRPCRouter({
    generatedToken: protectedProcedure.mutation(async ({ ctx }) => {
        await streamVidio.upsertUsers([
            {
                id: ctx.auth.user.id,
                name: ctx.auth.user.name,
                role: "admin",
                image:
                    ctx.auth.user.image ??
                    generateAvatarUri({ seed: ctx.auth.user.name, varient: "initials" }),
            }
        ])
        const expirationTime = Math.floor(Date.now() / 1000) + 3600;
        const issuedAt = Math.floor(Date.now() / 1000) - 60;

        const token = streamVidio.generateUserToken({
            user_id: ctx.auth.user.id,
            exp: expirationTime,
            validity_in_seconds: issuedAt,
        })
        return token

    }),
    remove: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const [removedMeeting] = await db
                .delete(meetings)
                .where(
                    and(
                        eq(meetings.id, input.id),
                        eq(meetings.userId, ctx.auth.user.id),
                    )
                )
                .returning();

            if (!removedMeeting) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Meeting not found",
                })
            }
            return removedMeeting

        }),
    update: protectedProcedure
        .input(meetingsUpdateShema)
        .mutation(async ({ ctx, input }) => {
            const [updatedmeetings] = await db
                .update(meetings)
                .set(input)
                .where(
                    and(
                        eq(meetings.id, input.id),
                        eq(meetings.userId, ctx.auth.user.id),
                    )
                )
                .returning();

            if (!updatedmeetings) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Meeting not found",
                })
            }
            return updatedmeetings

        }),

    create: protectedProcedure
        .input(meetingsInsertSchema)
        .mutation(async ({ input, ctx }) => {
            const [createdmeeting] = await db
                .insert(meetings)
                .values({
                    ...input,
                    userId: ctx.auth.user.id,
                })
                .returning();
         
            const call = streamVidio.video.call("default", createdmeeting.id);
            await call.create({
                data: {
                    created_by_id: ctx.auth.user.id,
                    custom: {
                        meetingId: createdmeeting.id,
                        meetingName: createdmeeting.name
                    },
                    settings_override: {
                        transcription: {
                            language: "en",
                            mode: "auto-on",
                            closed_caption_mode: "auto-on",
                        },
                        recording: {
                            mode: "auto-on",
                            quality: "1080p"
                        }
                    }
                }
            })

            const [existingAgent] = await db
                .select()
                .from(agents)
                .where(eq(agents.id, createdmeeting.agentId));

            if (!existingAgent) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Agent not found",
                })
            }

            await streamVidio.upsertUsers([
                       {
                    id: existingAgent.id,
                    name: existingAgent.name,
                    role: "user",
                    image: generateAvatarUri({
                        seed: existingAgent.name,
                        varient: "botttsNeutral",

                    })
                }
            ])
                return createdmeeting;
}),

    getOne: protectedProcedure
        .input(z.object({ id: z.string() }))
            .query(async ({ input, ctx }) => {
                const [existingmeeting] = await db
                    .select({
                        ...getTableColumns(meetings),
                        agent: agents,
                        duration: sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as("duration"),
                        //ToDo: change to actual count
                    })
                    .from(meetings)
                    .innerJoin(agents, eq(meetings.agentId, agents.id))
                    .where(
                        and(
                            eq(meetings.id, input.id),
                            eq(meetings.userId, ctx.auth.user.id),

                        )
                    )
                if (!existingmeeting) {
                    throw new TRPCError({ code: "NOT_FOUND", message: "Meeting not found" })
                }

                return existingmeeting;
            }),
            getMany: protectedProcedure
                .input(
                    z.object({
                        page: z.number().default(DEFAULT_PAGE),
                        pageSize: z
                            .number()
                            .min(MIN_PAGE_SIZE)
                            .max(MAX_PAGE_SIZE)
                            .default(DEFAULT_PAGE_SIZE),
                        search: z.string().nullish(),
                        agentId: z.string().nullish(),
                        status: z
                            .enum([
                                MeetingStatus.Upcoming,
                                MeetingStatus.Active,
                                MeetingStatus.Completed,
                                MeetingStatus.Processing,
                                MeetingStatus.Cancelled,

                            ])
                            .nullish(),

                    }))
                .query(async ({ ctx, input }) => {

                    const { search, page, pageSize, status, agentId } = input
                    const data = await db
                        .select({
                            ...getTableColumns(meetings),
                            agent: agents,
                            duration: sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as("duration"),
                        })
                        .from(meetings)
                        .innerJoin(agents, eq(meetings.agentId, agents.id))
                        .where(
                            and(
                                eq(meetings.userId, ctx.auth.user.id),
                                search ? ilike(meetings.name, `%${search}%`) : undefined,
                                status ? eq(meetings.status, status) : undefined,
                                agentId ? eq(meetings.agentId, agentId) : undefined,
                            )
                        )
                        .orderBy(desc(meetings.cratedAt), desc(meetings.id))
                        .limit(pageSize)
                        .offset((page - 1) * pageSize)

                    const [total] = await db
                        .select({ count: count() })
                        .from(meetings)
                        .innerJoin(agents, eq(meetings.agentId, agents.id))
                        .where(
                            and(
                                eq(meetings.userId, ctx.auth.user.id),
                                search ? ilike(meetings.name, `%${search}%)`) : undefined,
                                status ? eq(meetings.status, status) : undefined,
                                agentId ? eq(meetings.agentId, agentId) : undefined,

                            )
                        )

                    const totalPages = Math.ceil(total.count / pageSize);



                    return {
                        items: data,
                        total: total.count,
                        totalPages,
                    }


                }),
})