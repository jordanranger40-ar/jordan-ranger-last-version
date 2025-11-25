"use client";
import React, { useTransition, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  userId: string;
  userRole: string;
  action: (formData: FormData) => Promise<void>;
}

export default function UpdateRoleForm({ userId, userRole, action }: Props) {
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const handleFormSubmit = (formData: FormData) => {
    startTransition(async () => {
      try {
        await action(formData);
        setToast({ message: "Role Updated Successfully!", type: "success" });

        setTimeout(() => setToast(null), 3000);
      } catch (_error) {
        
        setToast({ message: "Failed to update role.", type: "error" });
        setTimeout(() => setToast(null), 3000);
      }
    });
  };

  return (
    <form action={handleFormSubmit} className="flex flex-col gap-5">
      <input type="hidden" name="userId" value={userId} />

      <div className="flex flex-col gap-3">
        <p className="text-xs lg:text-base text-black font-bold">User Role</p>
        <Select name="newRole" defaultValue={userRole}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Edit Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="user">User</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="w-[90%] text-gray-600 mt-5">
        {" "}
        *Admin users have full access to the dashboard and all management
        features. Regular users have limited access to customer-facing features
        only.{" "}
      </div>
      <div className="flex flex-row gap-3 justify-end mt-8">
        <Button variant="outline" type="button" className="cursor-pointer">
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-[#676e32] text-white cursor-pointer hover:bg-[#87970f]" 
          disabled={isPending}
        >
          {isPending ? "Updating..." : "Update Role"}
        </Button>
      </div>
      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-50 px-5 py-3 rounded-lg shadow-lg text-white font-medium transition-all duration-300 ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.message}
        </div>
      )}
    </form>
  );
}
