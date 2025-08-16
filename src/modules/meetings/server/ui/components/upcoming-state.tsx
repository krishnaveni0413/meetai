import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"
import Link from "next/link"

import { BanIcon, VideoIcon } from "lucide-react"

interface Props {
    meetingId:string;
    onCancleMeeting: ()=>void;
    isCancelling:boolean;
}

export const UpcomingState = ({
    meetingId,
    onCancleMeeting,
    isCancelling
}:Props) => {
    
    return (
        <div className="bg-white rounded-lg px-4 py-5 flex flex-col gap-y-8 items-center">
            <EmptyState
                image="/upcoming.svg"
                title="Not started yet"
                discription="Once you start this meeting, a summary will appear here"
            />
            <div className="flex flex-col-reverse lg:flex-row lg:justify-center items-center gap-2">
                <Button
                variant="secondary"
                className="w-full lg:w-auto"
                onClick={onCancleMeeting}
                disabled={isCancelling}
                >
                    <BanIcon />
                    Cancel meeting
                </Button>
                <Button disabled={isCancelling} asChild className="w-full lg:w-auto">
                    <Link href={`/call/${meetingId}`}>
                    <VideoIcon />
                        Start meeting
                    </Link>
                </Button>

            </div>
        </div>
    )
}