"use client"

import { Button } from "@/components/ui/button"
import { PlusIcon, XCircleIcon } from "lucide-react"
import { NewMeetingDialog } from "./new-meeting-dialog"
import { useState } from "react"

export const MeetingListHeader = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    
    return (
        <>
           <NewMeetingDialog open= {isDialogOpen} onOpenChange={setIsDialogOpen}/>
            <div className="py-4 px-4 md:px-8 flex flex-col gap-y-4">
                <div className="flex items-center justify-between">
                    <h5 className="font-medium text-xl">My Mettings</h5>
                    <Button onClick={() => setIsDialogOpen(true)}>
                        <PlusIcon />
                        New Mettings
                    </Button>
                </div>
                <div className="flex items-centergap-x-2 p-1">
                    ToDo: Filters
                </div>
            </div>
        </>
    )
}