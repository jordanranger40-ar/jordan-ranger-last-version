"use client";
import { ColumnDef } from "@tanstack/react-table";
import { roomFeatures } from "@/types/index";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown } from "lucide-react";

export const roomFeaturesColumns: ColumnDef<roomFeatures>[] = [
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
  {
    accessorKey: "feature_title_en",
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-1 cursor-pointer"
      >
        English Title
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "feature_title_ar",
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-1 cursor-pointer"
      >
        Arabic Title <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "feature_description_en",
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-1 cursor-pointer"
      >
        English Description
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "feature_description_ar",
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-1 cursor-pointer"
      >
        Arabic Description
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    enableSorting: true,
  },
];
