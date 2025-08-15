import { MeetingsView, MeetingViewError, MeetingViewLoading } from "@/modules/meetings/views/meetings-view";
import { getQueryClient, trpc } from "@/trpc/server"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";

const Page=()=>{
    const queryClient= getQueryClient();
    void queryClient.prefetchQuery(
        trpc.meetings.getMany.queryOptions({})
    );
    return (
       <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<MeetingViewLoading/>}>
            <ErrorBoundary fallback={<MeetingViewError/>} >
                <MeetingsView/>
            </ErrorBoundary>
        </Suspense>
       </HydrationBoundary>
    )
}


export default Page