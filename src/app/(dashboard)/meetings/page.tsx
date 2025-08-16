import { MeetingsView, MeetingViewError, MeetingViewLoading } from "@/modules/meetings/views/meetings-view";
import { getQueryClient, trpc } from "@/trpc/server"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import { MeetingListHeader } from "@/modules/meetings/server/ui/components/meetings-list-header";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const Page =  async () => {
     const session = await auth.api.getSession({
                headers: await headers(),
            });
        
            if(!session) {
                redirect("/sign-in")
            }
    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(
        trpc.meetings.getMany.queryOptions({})
    );
    return (
        <>
        <MeetingListHeader/>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <Suspense fallback={<MeetingViewLoading />}>
                    <ErrorBoundary fallback={<MeetingViewError />} >
                        <MeetingsView />
                    </ErrorBoundary>
                </Suspense>
            </HydrationBoundary>
        </>
    )
}


export default Page