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
import {toast} from "sonner"
import { useRouter } from "next/navigation";

export default function DeleteButton({
  id,
  deleteAction,
}: {
  id: string;
  deleteAction: (id: string) => Promise<{status:number,message:string, success:boolean}>;
}) {
    const [open, setOpen] = useState<boolean>(false)
 const [loading, setLoading] = useState<boolean>(false);
 const router= useRouter()

 const handleConfirm= async ()=>{
    setLoading(true);
    const result= await deleteAction(id); 
      if (result.status === 201) {
          toast.success(result.message);
          return;
        } else if (result.status === 401) {
          toast.error(result.message);
          router.push("/login");
          return;
        } else if (result.status === 403) {
          toast.error(result.message);
          router.push("/");
          return;
        } else {
          toast.error(result.message);
        }
        
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
            Are you sure you want to delete this user?
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex justify-end gap-2">
          <DialogTrigger asChild>
            <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300" onClick={() => setOpen(false)}>
              Cancel
            </button>
          </DialogTrigger>
          
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              onClick={handleConfirm}
            >
               {loading ? "Deleting..." : "Confirm"}
            </button>
          
        </div>
      </DialogContent>
    </Dialog>
  );
}
