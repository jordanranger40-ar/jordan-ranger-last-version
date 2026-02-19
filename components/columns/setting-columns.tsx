"use client";

import { ColumnDef } from "@tanstack/react-table";
import { newSetting } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown } from "lucide-react";

export const settingsColumns: ColumnDef<newSetting>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  // Key Name EN
  {
    accessorKey: "key_name_en",
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-1 cursor-pointer"
      >
       Setting Name
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    enableSorting: true,
  },



  // Value EN
  {
    accessorKey: "value_en",
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-1 cursor-pointer"
      >
        Setting Value (EN)
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => {
      const val = row.getValue("value_en") as string;

      // Auto-detect images or video
      if (val?.startsWith("http") && (val.endsWith(".jpg") || val.endsWith(".png"))) {
        return (
          <img
            src={val}
            alt="image"
            className="w-14 h-14 rounded object-cover border"
          />
        );
      }

      if (val?.startsWith("http") && val.endsWith(".mp4")) {
        return (
          <video
            src={val}
            className="w-20 rounded border"
            controls
            muted
          />
        );
      }

      return <span className="truncate w-40 block">{val}</span>;
    },
    enableSorting: true,
  },

  // Value AR
  {
    accessorKey: "value_ar",
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-1 cursor-pointer"
      >
        Setting Value (AR)
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => {
      const val = row.getValue("value_ar") as string;
      return (
        <span
          dir="rtl"
          className="truncate w-40 block text-right"
        >
          {val}
        </span>
      );
    },
    enableSorting: true,
  },


];
