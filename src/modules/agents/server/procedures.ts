import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import {z} from 'zod';
import {db} from "@/db"
import { agents } from "@/db/schema";
import { agentInsertSchema } from "../schemas";
import {eq} from "drizzle-orm"

export const agentsRouters= createTRPCRouter({
    // todo change getMany to use protectedprocedure
    getOne: protectedProcedure.input(z.object({id: z.string()})).query(async({input})=>{
        const [existingAgents]= await db
        .select()
        .from(agents)
        .where(eq(agents.id, input.id))

        return existingAgents;
    }),
    getMany: protectedProcedure.query(async()=>{
        const data= await db
        .select()
        .from(agents);

        return data;
    }),

    create: protectedProcedure
    .input(agentInsertSchema)
    .mutation(async ({input, ctx})=>{
       const [createdAgent] =await db
       .insert(agents)
       .values({
        ...input,
        userId: ctx.auth.user.id,
       })
       .returning();

       return createdAgent;
    })
})