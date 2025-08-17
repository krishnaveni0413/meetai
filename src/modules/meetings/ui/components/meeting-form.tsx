import { useTRPC } from "@/trpc/client";
import { z } from "zod"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormDescription,
    FormMessage,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { meetingsInsertSchema } from "@/modules/meetings/schema";
import { MeetingGetOne } from "../types";
// import { MeetingGetOne } from "@/modules/meetings/server/ui/types";
import { useState } from "react";
import { CommandSelect } from "@/components/command-select";
import { GeneratedAvatar } from "@/components/generate-avatar";
import { NewAgentDialog } from "@/modules/agents/ui/components/new-agent-dialog";

interface MeetingFormProps {
    onSuccess?: (id?: string) => void;
    onCancle?: () => void;
    initaialValue?: MeetingGetOne;
};

export const MeetingsForm = ({
    onSuccess,
    onCancle,
    initaialValue,
}: MeetingFormProps) => {
    const trpc = useTRPC();
    // const router =useRouter()
    const queryClient = useQueryClient();

    const [openNewAgentDialog, setOpenNewAgentDialog] = useState(false);
    const [agentSearch, setAgentSearch] = useState("")

    const agents = useQuery(
        trpc.agents.getMany.queryOptions({
            pageSize: 100,
            search: agentSearch,
        })
    )

    const createMeeting = useMutation(
        trpc.meetings.create.mutationOptions({
            onSuccess: async (data) => {
                await queryClient.invalidateQueries(
                    trpc.meetings.getMany.queryOptions({}),
                );
                // if (initaialValue?.id) {
                //     await queryClient.invalidateQueries(
                //         trpc.meetings.getOne.queryOptions({ id: initaialValue.id })
                //     )
                // }
                onSuccess?.(data.id);
            },
            onError: (error) => {
                toast.error(error.message)
                //TODO Check if error code is "FORBIDEN", redirect to"/upgrade"
            },
        })
    )
    const UpdateMeeting = useMutation(
        trpc.meetings.update.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(
                    trpc.meetings.getMany.queryOptions({}),
                );
                if (initaialValue?.id) {
                    await queryClient.invalidateQueries(
                        trpc.meetings.getOne.queryOptions({ id: initaialValue.id })
                    )
                }
                onSuccess?.();
            },
            onError: (error) => {
                toast.error(error.message)
                //TODO Check if error code is "FORBIDEN", redirect to"/upgrade"
            },
        })
    )
    const form = useForm<z.infer<typeof meetingsInsertSchema>>({
        resolver: zodResolver(meetingsInsertSchema),
        defaultValues: {
            name: initaialValue?.name ?? "",
            agentId: initaialValue?.agentId ?? "",
        }
    })
    const isEdit = !!initaialValue?.id;
    const isPending = createMeeting.isPending || UpdateMeeting.isPending;

    const onSubmit = (values: z.infer<typeof meetingsInsertSchema>) => {
        if (isEdit) {
            UpdateMeeting.mutate({ ...values, id: initaialValue.id })
        }
        else {
            createMeeting.mutate(values);
        }
    }

    return (
        <>
        <NewAgentDialog open={openNewAgentDialog} onOpenChange={setOpenNewAgentDialog}/>
        <Form {...form}>
            <form className="space-y-4 px-2" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    name="name"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="e.g. Math Consultations" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    name="agentId"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Agent</FormLabel>
                            <FormControl>
                                <CommandSelect
                                    onSelect={field.onChange}
                                    onSearch={setAgentSearch}
                                    value={field.value}
                                    placeholder="Select anagent"
                                    options={(agents.data?.items ?? []).map((agent) => ({
                                        id: agent.id,
                                        value: agent.id,
                                        children: (
                                            <div className="flex items-center gap-x-2">
                                                <GeneratedAvatar
                                                    seed={agent.name}
                                                    variant="botttsNeutral"
                                                    className="border size-6"
                                                />
                                                <span>{agent.name}</span>
                                            </div>
                                        )
                                    }))} />
                            </FormControl>
                            <FormDescription>
                                Not found what you &apos;re looking for?{" "}
                                <button
                                type="button"
                                className="text-primary hover:underline"
                                onClick={()=>setOpenNewAgentDialog(true)}
                                >
                                    Create new agent
                                </button>
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-between gap-x-2">
                    {onCancle && (
                        <Button
                            variant="ghost"
                            disabled={isPending}
                            type="button"
                            onClick={() => onCancle()}
                        >Cancle
                        </Button>
                    )}
                    <Button disabled={isPending} type="submit">
                        {isEdit ? "Update" : "Create"}
                    </Button>
                </div>

            </form>


        </Form>
        </>
    )

}