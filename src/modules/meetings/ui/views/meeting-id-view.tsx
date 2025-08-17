"use client"

import { ErrorState } from "@/components/error-state"
import { LoadingState } from "@/components/loading-state"
import { useConfirm } from "@/hooks/use-conform"
import { MeetingIdViewHeader } from "@/modules/agents/ui/components/meeting-id-view-header"
import { useTRPC } from "@/trpc/client"
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { UpdateMeetingDialog } from "../components/update-meeting-dialog"
// import { UpdateMeetingDialog } from "../ui/components/update-meeting-dialog"
import { useState } from "react"
import { UpcomingState } from "../components/upcoming-state"
import { ActiveState } from "../components/active-state"
import { CancelledState } from "../components/cancelled-state"
import { ProcessingState } from "../components/processing-state"

interface Props {
    meetingId: string,
};

export const MeetingIdView =({meetingId }:Props)=>{
    const trpc= useTRPC()
    const router = useRouter()
    const queryClinet= useQueryClient()
    const [updateMeetingDialogOpen, setUpdateMeetingDialogOpen]= useState(false)
    const {data} =useSuspenseQuery(
        trpc.meetings.getOne.queryOptions({id:meetingId}),
    )

    const [RmoveConfirmation, confirmRemove] = useConfirm(
        "Are you Sure?",
        "The Following action will remove this meeting"
    )
    const removeMeeting=useMutation(
        trpc.meetings.remove.mutationOptions({
            onSuccess:()=>{
                queryClinet.invalidateQueries(trpc.meetings.getMany.queryOptions({}))
                router.push("/meetings")
            },
           
        })
    )
    const handleRemoveMeeting = async () =>{
        const ok = await confirmRemove();

        if (!ok) return;

        await removeMeeting.mutateAsync({id:meetingId})
    }

    const isActive = data.status==="active";
    const isUpcoming = data.status==="upcoming"
    const isCancelled = data.status==="cancelled"
    const isCompleted = data.status==="completed"
    const isProcessing = data.status==="processing"


    return (
        <>
            <RmoveConfirmation/>
            <UpdateMeetingDialog 
            open={updateMeetingDialogOpen}
            onOpenChange={setUpdateMeetingDialogOpen}
            initialValues={data}
            />
            <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
                <MeetingIdViewHeader
                meetingId={meetingId}
                meetingName={data.name}
                onEdit={()=>setUpdateMeetingDialogOpen(true)}
                onRemove={handleRemoveMeeting}
                />
                {isCancelled && <CancelledState/>}
                {isProcessing && <ProcessingState/>}
                {isCompleted && <div>Completed</div>}
                {isActive && <ActiveState meetingId={meetingId}/>}
                {isUpcoming && (<UpcomingState
                    meetingId={meetingId}
                    onCancelMeeting={()=>{}}
                    isCancelling={false}
                />)}
                        </div>
        </>
    )
    
}
export const MeetingIdViewLoding =()=>{
    return (
        <LoadingState
        title="Loading Meeting"
        discription="This may take a fews seconds"
        />
    )
}
export const MeetingIdViewError = ()=>{
    return (
        <ErrorState
        title="Error Loading meeting"
        discription="Please try agin later"
        />
    )
}