import { useTRPC } from "@/trpc/client";
import { z } from "zod"
import { AgentGetOne } from "../types";
// import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { agentInsertSchema } from "../../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import { GeneratedAvatar } from "@/components/generate-avatar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AgentFormProps {
    onSuccess?: () => void;
    onCancle?: () => void;
    initaialValue?: AgentGetOne;
};

export const AgentForm = ({
    onSuccess,
    onCancle,
    initaialValue,
}: AgentFormProps) => {
    const trpc = useTRPC();
    // const router =useRouter()
    const queryClient = useQueryClient();

    const createAgent = useMutation(
        trpc.agents.create.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(
                    trpc.agents.getMany.queryOptions({}),
                );
                if (initaialValue?.id) {
                    await queryClient.invalidateQueries(
                        trpc.agents.getOne.queryOptions({ id: initaialValue.id })
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
    const UpdateAgent = useMutation(
        trpc.agents.update.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(
                    trpc.agents.getMany.queryOptions({}),
                );
                if (initaialValue?.id) {
                    await queryClient.invalidateQueries(
                        trpc.agents.getOne.queryOptions({ id: initaialValue.id })
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
    const form = useForm<z.infer<typeof agentInsertSchema>>({
        resolver: zodResolver(agentInsertSchema),
        defaultValues: {
            name: initaialValue?.name ?? "",
            instructions: initaialValue?.instructions ?? "",
        }
    })
    const isEdit = !!initaialValue?.id;
    const isPending = createAgent.isPending || UpdateAgent.isPending;

    const onSubmit = (values: z.infer<typeof agentInsertSchema>) => {
        if (isEdit) {
            UpdateAgent.mutate({...values, id:initaialValue.id})
        }
        else {
            createAgent.mutate(values);
        }
    }

    return (
        <Form {...form}>
            <form className="space-y-4 px-2" onSubmit={form.handleSubmit(onSubmit)}>
                <GeneratedAvatar
                    seed={form.watch("name")}
                    variant="botttsNeutral"
                    className="border size-16"
                />
                <FormField
                    name="name"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="e.g. Math Tutor" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    name="instructions"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Instructions</FormLabel>
                            <FormControl>
                                <Textarea {...field} placeholder="You are a helpfull math assistant that can answer questions and help with assignment." />
                            </FormControl>
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
    )

}