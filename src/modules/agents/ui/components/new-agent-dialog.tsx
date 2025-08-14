import { ResponsiveDialog } from "@/components/responsive-dialog";
import { AgentForm } from "./agent-form";

interface NewAgentDialogprops {
    open :boolean;
    onOpenChange :(open:boolean)=>void;
};

export const NewAgentDialog =({
    open,
    onOpenChange,
}:NewAgentDialogprops)=>{
    return (
        <ResponsiveDialog
        title="New Agent"
        description="Create a new agent"
        open={open}
        onOpenChange={onOpenChange}
        >
           <AgentForm
           onSuccess={()=>onOpenChange(false)}
           onCancle={()=> onOpenChange(false)}/>
        </ResponsiveDialog>
    )
}