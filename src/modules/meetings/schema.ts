import { text } from "stream/consumers";
import {z} from "zod";

export const meetingsInsertSchema =z.object({
    name: z.string().min(1, {message: "Name is required"}),
    agentId:z.string().min(1, {message:"Agent is requierd"}),
    //  instructions: z.string().optional(),
    

    //i added here as iwasgeteing error in procedure.ts
    // instructions: z.string().min(1, { message: "Instructions are required" }),
})

export const meetingsUpdateShema = meetingsInsertSchema.extend({
    id: z.string().min(1, {message:"Id is required"})
})