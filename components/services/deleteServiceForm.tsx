"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {  Trash2 } from "lucide-react";
export default function DeleteServiceButton({
  serviceId,
  deleteAction,
}: {
  serviceId: string;
  deleteAction: (id: string) => Promise<void>;
}) {
    const [open, setOpen] = useState<boolean>(false)
 const [loading, setLoading] = useState<boolean>(false);

 const handleConfirm= async ()=>{
    setLoading(true);
    await deleteAction(serviceId); 
    setLoading(false);
    setOpen(false);
    
 }
    
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="relative flex justify-center items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Trash2 className="w-5 h-5 text-[#8B0000] cursor-pointer hover:text-[#800000]" />
              </TooltipTrigger>
              <TooltipContent side="top" align="center">
                <p>Delete</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this Service?
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex justify-end gap-2">
          <DialogTrigger asChild>
            <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300" onClick={() => setOpen(false)}>
              Cancel
            </button>
          </DialogTrigger>
          <form action={() => deleteAction(serviceId)}>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              onClick={handleConfirm}
            >
               {loading ? "Deleting..." : "Confirm"}
            </button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
