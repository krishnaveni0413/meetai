import { z } from 'zod';
import { agentsRouters } from '@/modules/agents/server/procedures';
import { createTRPCRouter } from '../init';
import { meetingsRouters } from '@/modules/meetings/server/procedures';


export const appRouter = createTRPCRouter({
  agents:agentsRouters,
  meetings:meetingsRouters,
});
// export type definition of API
export type AppRouter = typeof appRouter;