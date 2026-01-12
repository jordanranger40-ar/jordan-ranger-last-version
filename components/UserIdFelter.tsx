"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { XCircle, SlidersHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FilterType = "id" | "email";

interface Props {
  user_id?: string;
  email?: string;
}

export default function UserFilter({ user_id, email }: Props) {
  const [filterType, setFilterType] = useState<FilterType>(
    email ? "email" : "id"
  );
  const [value, setValue] = useState(user_id || email || "");

  const clearFilter = () => {
    setValue("");
    window.location.href = window.location.pathname;
  };

  return (
    <form
      method="GET"
      className="flex flex-col lg:flex-row items-start lg:items-end gap-6 mb-6 w-[90%] lg:w-[45vw]"
    >
      {/* FILTER TYPE using Shadcn Select */}
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1 ml-2">Filter by</label>
        <Select
          value={filterType}
          onValueChange={(val) => setFilterType(val as FilterType)}
        >
          <SelectTrigger className="w-[150px] border rounded-md px-3 py-2 text-sm focus:ring focus:ring-[#676e32]/40">
            <SelectValue placeholder="Select filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="id">User ID</SelectItem>
            <SelectItem value="email">Email</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* INPUT */}
      <div className="flex flex-col w-full">
        <label className="text-sm font-medium mb-1">
          <span className="text-red-700">*</span>{" "}
          {filterType === "id" ? "User ID" : "Email"}
        </label>

        <input
          type={filterType === "email" ? "email" : "text"}
          name={filterType === "id" ? "user_id" : "email"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={
            filterType === "id"
              ? "Enter User ID"
              : "Enter user email"
          }
          className="w-full lg:w-[350px] border rounded-md px-3 py-2 text-sm outline-none focus:ring focus:ring-[#676e32]/40"
        />
      </div>

      {/* BUTTONS */}
      <div className="flex gap-3">
        <Button
          type="submit"
          className="bg-[#676e32] text-white hover:bg-[#7b8444]"
        >
          <SlidersHorizontal className="mr-1" /> Filter
        </Button>

        {value && (
          <Button
            type="button"
            variant="destructive"
            onClick={clearFilter}
          >
            <XCircle className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}
      </div>
    </form>
  );
}
