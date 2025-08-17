import { ResponsiveDialog } from "@/components/responsive-dialog";
import { MeetingsForm } from "./meeting-form";
// import { MeetingGetOne } from "../types";
import { MeetingGetOne } from "@/modules/meetings/ui/types";


interface UpdateMeetingDialogprops {
    open :boolean;
    onOpenChange :(open:boolean)=>void;
    initialValues:MeetingGetOne
};

export const UpdateMeetingDialog =({
    open,
    onOpenChange,
    initialValues,
}:UpdateMeetingDialogprops)=>{
    
    return (
        <ResponsiveDialog
        title="Edit Meeting"
        description="Edit the meeting details"
        open={open}
        onOpenChange={onOpenChange}
        >
           <MeetingsForm
           
           onSuccess={()=>onOpenChange(false)}
           onCancle={()=> onOpenChange(false)}
           initaialValue={initialValues}
           />

           
        </ResponsiveDialog>
    )
}