"use client";

import { ColumnDef } from "@tanstack/react-table";
import {  TrainingBookingWithDetails } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown } from "lucide-react";

/* 
export type TrainingBookingWithDetails = {
  id: string; // training_booking id
  training_id: string;
  is_confirmed: boolean;
  is_deleted: boolean;
  created_at: Date;
  quantity: number;
  price: number;

  user_id: string;
  first_name: string;
  last_name: string;
  email: string;

  // Training details
  name_en: string;
  description_en: string;
  name_ar: string;
  description_ar: string;
  image: string;
  category_en: string;
  category_ar: string;
  capacity: number;
  training_price: number;
  start_date: Date;
  end_date: Date;
  slug: string;
};
*/

export const trainingBookingsColumns: ColumnDef<TrainingBookingWithDetails>[] = [
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
    accessorKey: "category_en",
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-1 cursor-pointer"
      >
        Training Type <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "name_en",
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-1 cursor-pointer"
      >
        Training Name <ArrowUpDown className="h-4 w-4" />
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
    accessorKey: "email",
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-1 cursor-pointer"
      >
        User Email <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => {
      const email = row.original.email;
      return (
        <a
          href={`mailto:${email}`}
          className="underline text-[#676e32] hover:text-[#a2b41d]"
        >
          {email}
        </a>
      );
    },
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
      const created_at = new Date(row.original.created_at);
      return created_at.toLocaleDateString();
    },
    enableSorting: true,
  },
  {
    accessorKey: "start_date",
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-1 cursor-pointer"
      >
        Start Date <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => {
      const startDate = new Date(row.original.start_date);
      return startDate.toLocaleDateString();
    },
    enableSorting: true,
  },
  {
    accessorKey: "end_date",
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-1 cursor-pointer"
      >
        End Date <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => {
      const endDate = new Date(row.original.end_date);
      return endDate.toLocaleDateString();
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
        Is Confirmed <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => (
      <span
        className={
          row.original.is_confirmed ? "text-green-600" : "text-red-600"
        }
      >
        {row.original.is_confirmed ? "Yes" : "No"}
      </span>
    ),
    enableSorting: true,
  },
];
