"use client"

import { format } from "date-fns"
import humanizeDuration from "humanize-duration"

import { ColumnDef } from "@tanstack/react-table"
import { GeneratedAvatar } from "@/components/generate-avatar"
import {
    CircleCheckIcon,
    CircleXIcon,
    CircleArrowUpIcon,
    ClockFadingIcon,
    CornerDownRightIcon,
    LoaderIcon,
    ClockArrowUpIcon
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { MeetingGetMany } from "../types"
// import { MeetingGetMany } from "@/modules/meetings/server/ui/types"
import { cn } from "@/lib/utils"

function formatDuration(seconds: number) {
    return humanizeDuration(seconds * 1000, {
        largest: 1,
        round: true,
        units: ["h", "m", "s"],
    })
}

const statusiconeMap = {
    upcoming: ClockArrowUpIcon,
    active: LoaderIcon,
    completed: CircleCheckIcon,
    processing: LoaderIcon,
    cancelled: CircleXIcon
}
const statusColormap = {
    upcoming: "bg-yellow-500/20 text-yellow-800 border-yellow-800/5",
    active: "bg-blue-500/20 text-blue-800 border-blue-800/5",
    completed: "bg-emerald-500/20 text-emerald-800 border-emerald-800/5",
    processing: "bg-rose-500/20 text-rose-800 border-rose-800/5",
    cancelled: "bg-gray-500/20 text-gray-800 border-gray-800/5"
}


export const columns: ColumnDef<MeetingGetMany[number]>[] = [
    {
        accessorKey: "name",
        header: "Meeting Name",
        cell: ({ row }) => (
            <div className="flex flex-col gap-y-2">
                <span className="font-semibold capitalize">{row.original.name}</span>
                <div className="flexitem-center gap-x-2">
                    <div className="flex items-center gap-x-1">

                        <CornerDownRightIcon className="size-3 text-muted-foreground " />
                        <span className="text-muted-foreground max-w-[200px] truncate capitalize">{row.original.agent.name}</span>
                         <GeneratedAvatar
                    variant="botttsNeutral"
                    seed={row.original.agent.name}
                    className="size-4"
                    />
                    </div>
                   
                    <span className="text-sm text-muted-foreground">{row.original.startedAt ? format(row.original.startedAt, "MMM d") : ""}</span>
                </div>
            </div>
        )
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const Icon = statusiconeMap[row.original.status as keyof typeof statusiconeMap];

            return (
                <Badge
                variant="outline"
                className={cn(
                "capitalize [&>svg]:size-4 text-muted-forground",
                statusColormap[row.original.status as keyof typeof statusColormap])}
                >
                    <Icon
                    className={cn(
                        row.original.status==="processing" && "animate-spin"
                    )}
                    />
                    {row.original.status}
                </Badge>
            )
        },
       
        
    },
    {
            accessorKey:"duration",
            header: "duration",
            
            cell: ({ row }) => {
                return(
                <Badge
                variant="outline"
                className="capitalize [&>svg]:size-4 flex items-center gap-x-2">
                    <ClockFadingIcon className="text-blue-700"/>
                    {row.original.duration ? formatDuration(row.original.duration): "No duration"}

                </Badge>
                )
            }
            
        }

]