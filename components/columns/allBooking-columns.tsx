"use client";

import { ColumnDef } from "@tanstack/react-table";
import { UnifiedBooking } from "@/types";
import { ArrowUpDown } from "lucide-react";

export const bookingsColumns: ColumnDef<UnifiedBooking>[] = [
  {
    accessorKey: "type",
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-1 cursor-pointer"
      >
        Booking Type <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => {
      const t = row.original.type;
      return t === "activity" ? "Activity" : t === "training" ? "Training" : "Room";
    },
    enableSorting: true,
  },
  {
    accessorKey: "name_en",
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-1 cursor-pointer"
      >
        Title <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "first_name",
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-1 cursor-pointer"
      >
        User First Name <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "start",
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-1 cursor-pointer"
      >
        Start Date <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => {
      const d = row.original.start ? new Date(row.original.start) : null;
      return d ? d.toLocaleString() : "—";
    },
    enableSorting: true,
  },
  {
    accessorKey: "end",
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-1 cursor-pointer"
      >
        End Date <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => {
      const d = row.original.end ? new Date(row.original.end) : null;
      return d ? d.toLocaleString() : "—";
    },
    enableSorting: true,
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-1 cursor-pointer"
      >
        Price <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => (row.original.price ? `${row.original.price} JOD` : "—"),
    enableSorting: true,
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-1 cursor-pointer"
      >
        Created At <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => {
      const d = row.original.created_at ? new Date(row.original.created_at) : null;
      return d ? d.toLocaleString() : "—";
    },
    enableSorting: true,
  },
  {
    accessorKey: "is_confirmed",
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-1 cursor-pointer"
      >
        Confirmed <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => (
      <span
        className={row.original.is_confirmed ? "text-green-600" : "text-red-600"}
      >
        {row.original.is_confirmed ? "Yes" : "No"}
      </span>
    ),
    enableSorting: true,
  },
];
