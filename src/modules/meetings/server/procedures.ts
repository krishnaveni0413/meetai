import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { z } from 'zod';
import { db } from "@/db"
import { meetings, agents } from "@/db/schema";
import { and, desc, eq, getTableColumns, ilike, sql, count } from "drizzle-orm"
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE, } from "@/constants";
import { TRPCError } from "@trpc/server";
import { meetingsInsertSchema, meetingsUpdateShema } from "../schema";
import { MeetingStatus } from "../types";


export const meetingsRouters = createTRPCRouter({
     update:protectedProcedure
        .input(meetingsUpdateShema)
        .mutation(async ({ctx, input})=>{
            const [updatedmeetings] =await db
            .update(meetings)
            .set(input)
            .where(
                and(
                    eq(meetings.id, input.id),
                    eq(meetings.userId, ctx.auth.user.id),
                )
            )
            .returning();
    
             if(!updatedmeetings){
                throw new TRPCError({
                    code:"NOT_FOUND",
                    message:"Meeting not found",
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
    //todo:ctraet strem call upset users
                return createdmeeting;
        }),
    
    getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
        const [existingmeeting] = await db
            .select({
                ...getTableColumns(meetings),
                //ToDo: change to actual count
            })
            .from(meetings)
            .where(
                and(
                    eq(meetings.id, input.id),
                    eq(meetings.userId, ctx.auth.user.id),

                )
            )
            if( !existingmeeting){
                throw new TRPCError({code: "NOT_FOUND", message: "Meeting not found"})
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
                    agent:agents,
                    duration:sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as("duration"),
                })
                .from(meetings)
                .innerJoin(agents,eq(meetings.agentId, agents.id))
                .where(
                    and(
                        eq(meetings.userId, ctx.auth.user.id),
                        search ? ilike(meetings.name, `%${search}%`) : undefined,
                        status ? eq(meetings.status, status): undefined,
                        agentId ? eq(meetings.agentId, agentId): undefined,
                    )
                )
                .orderBy(desc(meetings.cratedAt), desc(meetings.id))
                .limit(pageSize)
                .offset((page - 1) * pageSize)

            const [total] = await db
                .select({ count: count() })
                .from(meetings)
                .innerJoin(agents,eq(meetings.agentId, agents.id))
                .where(
                    and(
                        eq(meetings.userId, ctx.auth.user.id),
                        search ? ilike(meetings.name, `%${search}%)`) : undefined,
                         status ? eq(meetings.status, status): undefined,
                        agentId ? eq(meetings.agentId, agentId): undefined,

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