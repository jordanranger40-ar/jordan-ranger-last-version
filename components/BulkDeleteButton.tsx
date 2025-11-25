"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

interface DeleteActionProps {
  ids: string[]; // can be 1 or many
  deleteAction: (id: string) => Promise<void>;
  onFinish?: () => void;
}

export default function BulkDeleteButton({
  ids,
  deleteAction,
  onFinish,
}: DeleteActionProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleBulkDelete() {
    if (ids.length === 0) return;

    setLoading(true);

    try {
      for (const id of ids) {
        await deleteAction(id); 
      }

      if (onFinish) onFinish(); 
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* BUTTON THAT OPENS THE DIALOG */}
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          disabled={ids.length === 0}
          className="flex items-center gap-2"
        >
          <Trash2 className="w-5 h-5" />
          Delete ({ids.length})
        </Button>
      </DialogTrigger>

      {/* CONFIRMATION DIALOG */}
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {ids.length} item(s)?  
            <br />
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 flex justify-end gap-2">
          {/* Cancel Button */}
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>

          {/* Confirm Button */}
          <Button
            variant="destructive"
            onClick={handleBulkDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Confirm"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
