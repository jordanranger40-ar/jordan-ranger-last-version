"use client";
import { ColumnDef } from "@tanstack/react-table";
import { newBanner } from "@/types/index";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown } from "lucide-react";
import Image from "next/image";

export const BannerColumns: ColumnDef<newBanner>[] = [
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
    accessorKey: "alt",
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
      const name = row.getValue("alt") as string;
      return <div className="text-gray-800 font-medium">{name}</div>;
    },
    enableSorting: true,
  },
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      const image = row.getValue("image") as string;
      const name = row.getValue("alt") as string;
      return (
        <div className="flex items-center gap-2">
          <Image
            src={image || "/placeholder-logo.png"}
            alt={name}
            width={50}
            height={50}
            className="rounded-full object-cover"
            unoptimized
          />
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "description_en",
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-1 cursor-pointer"
      >
        English Description
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => {
      const description_en = row.getValue("description_en") as string;
      return (
        <div className="text-gray-800 font-medium">
          {description_en.slice(0, 35) + "..."}
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "description_ar",
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-1 cursor-pointer"
      >
        Arabic Description
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => {
      const description_ar = row.getValue("description_ar") as string;
      return (
        <div className="text-gray-800 font-medium " dir="ltr">
          {description_ar.slice(0, 35) + "..."}
        </div>
      );
    },
    enableSorting: true,
  },
];
