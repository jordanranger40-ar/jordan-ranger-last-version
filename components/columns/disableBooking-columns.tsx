// components/columns/disableBooking-columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DisableBookingData } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown } from "lucide-react";

export const disableBookingsColumns = (
  activityMap: Record<string, string>,
  roomMap: Record<string, string>
): ColumnDef<DisableBookingData>[] => [
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
    accessorKey: "type",
    header: ({ column }) => (
      <button onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center gap-1 cursor-pointer">
        Type <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    enableSorting: true,
  },

  {
    accessorKey: "ref_id",
    header: ({ column }) => (
      <button onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center gap-1 cursor-pointer">
        Activity / Room <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => {
      const { type, ref_id } = row.original;
      const name = type === "activity" ? activityMap[ref_id] || "Unknown Activity" : roomMap[ref_id] || "Unknown Room";
      return <span>{name}</span>;
    },
    enableSorting: true,
  },

  {
    accessorKey: "start_date",
    header: ({ column }) => (
      <button onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center gap-1 cursor-pointer">
        Start Date <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => {
      const d = row.original.start_date ? new Date(row.original.start_date) : null;
      return d ? d.toLocaleDateString() : "-";
    },
    enableSorting: true,
  },

  {
    accessorKey: "end_date",
    header: ({ column }) => (
      <button onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center gap-1 cursor-pointer">
        End Date <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => {
      const d = row.original.end_date ? new Date(row.original.end_date) : null;
      return d ? d.toLocaleDateString() : "-";
    },
    enableSorting: true,
  },
];
