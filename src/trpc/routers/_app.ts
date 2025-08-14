import { z } from 'zod';
import { agentsRouters } from '@/modules/agents/server/procedures';
import { baseProcedure, createTRPCRouter } from '../init';
import { agents } from '@/db/schema';
export const appRouter = createTRPCRouter({
  agents:agentsRouters,
});
// export type definition of API
export type AppRouter = typeof appRouter;