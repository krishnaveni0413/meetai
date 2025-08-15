import { AgentIdView, AgentIdViewLoding,AgentsViewError } from "@/modules/agents/ui/views/agents-id-views";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";

interface Props {
    params:Promise<{agentId: string}>
}

const Page =async ({params}:Props)=>{
    const {agentId}= await params;

    const queryClient=getQueryClient();
    void queryClient.prefetchQuery(
        trpc.agents.getOne.queryOptions({id:agentId})
    )
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<AgentIdViewLoding/>}>
                <ErrorBoundary fallback={<AgentsViewError/>}>
                    <AgentIdView agentId={agentId}/>
                </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
     );
}

export default Page;