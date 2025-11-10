"use client";

import { ColumnDef } from "@tanstack/react-table";
import { user } from "@/types/index";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown } from "lucide-react";

// Define the columns for the User table
export const userColumns: ColumnDef<user>[] = [
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
    accessorKey: "first_name",
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-1 cursor-pointer"
      >
        First Name
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "last_name",
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-1 cursor-pointer"
      >
        Last Name
        <ArrowUpDown className="h-4 w-4" />
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
        Email
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => {
      const email = row.getValue("email") as string;
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
    accessorKey: "role",
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-1 cursor-pointer"
      >
        Role
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      return (
        <>
          {role === "admin" ? (
            <div className="text-red-800 uppercase ">{role}</div>
          ) : (
            <div className="uppercase">{role}</div>
          )}
        </>
      );

    },
    enableSorting:true
  },
];
