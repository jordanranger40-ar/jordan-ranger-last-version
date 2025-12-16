"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { XCircle, SlidersHorizontal } from "lucide-react";

export default function UserIdFilter({ user_id }: { user_id?: string }) {
  const [userId, setUserId] = useState<string>(user_id ?? "");

  const clearFilter = () => {
    setUserId("");
    window.location.href = window.location.pathname;
  };

  return (
    <form
      method="GET"
      className="flex flex-col lg:flex-row items-start lg:ml-3 ml-0 lg:items-end gap-6 mb-6 w-[90%] lg:w-[50vw] justify-start"
    >
      {/* USER ID INPUT */}
      <div className="flex flex-col w-full lg:w-fit">
        <label className="text-sm font-medium mb-1">
          {" "}
          <span className="text-red-700 ml-1"> *</span> User ID
        </label>

        <input
          type="text"
          name="user_id"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Enter User ID"
          className="w-full lg:w-[350px] border rounded-md px-3 py-2 text-sm outline-none focus:ring focus:ring-[#676e32]/40"
        />
      </div>

      {/* BUTTONS */}
      <div className="flex gap-3">
        <Button
          type="submit"
          className="bg-[#676e32] text-white rounded-md cursor-pointer hover:bg-[#7b8444] transition"
        >
          <SlidersHorizontal className="mr-1" /> Filter
        </Button>

        {userId && (
          <Button
            type="button"
            variant="destructive"
            className="px-4 flex items-center gap-1 cursor-pointer"
            onClick={clearFilter}
          >
            <XCircle className="w-4 h-4" />
            Clear
          </Button>
        )}
      </div>
    </form>
  );
}
