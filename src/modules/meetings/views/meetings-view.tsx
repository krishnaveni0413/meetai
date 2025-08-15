"use client";

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

export const MeetingsView=()=>{
    const trpc =useTRPC()
    const {data} =useQuery(trpc.meetings.getMany.queryOptions({}))

    return (
        <div>
            {JSON.stringify(data)}
        </div>
    )
}
export const MeetingViewLoading = ()=>{
    return (
        <LoadingState
        title="Loading Agents"
        discription="this may take a few seconds"
        />
    )
}
export const MeetingViewError = ()=>{
    return (
        <ErrorState
        title="Error Loading Agents"
        discription="Something went wrong"
        />
    )
}