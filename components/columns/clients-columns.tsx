"use client";
import { ColumnDef } from "@tanstack/react-table";
import { newClient } from "@/types/index";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown } from "lucide-react";
import Image from "next/image";

export const clientsColumns: ColumnDef<newClient>[] = [
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
    accessorKey: "name",
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-1 cursor-pointer"
      >
        Name
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      return <div className="text-gray-800 font-medium">{name}</div>;
    },
    enableSorting: true,
  },
  {
    accessorKey: "logo",
    header: "Logo",
    cell: ({ row }) => {
      const logo = row.getValue("logo") as string;
      const name = row.getValue("name") as string;
      return (
        <div className="flex items-center gap-2">
          <Image
            src={logo || "/placeholder-logo.png"}
            alt={name}
            width={50}
            height={50}
            className="rounded-full object-cover"
            unoptimized
          />
          <span>{name}</span>
        </div>
      );
    },
    enableSorting: false,
  },
];
