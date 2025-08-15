import { ResponsiveDialog } from "@/components/responsive-dialog";
import { AgentForm } from "./agent-form";
import { AgentGetOne } from "../types";

interface UpdateAgentDialogprops {
    open :boolean;
    onOpenChange :(open:boolean)=>void;
    initialValues: AgentGetOne;
};

export const UpdateAgentDialog =({
    open,
    onOpenChange,
    initialValues
}:UpdateAgentDialogprops)=>{
    return (
        <ResponsiveDialog
        title="Edit Agent"
        description="Edit the agent details"
        open={open}
        onOpenChange={onOpenChange}
        >
           <AgentForm
           onSuccess={()=>onOpenChange(false)}
           onCancle={()=> onOpenChange(false)}
           initaialValue={initialValues}/>
        </ResponsiveDialog>
    )
}