"use client";
import { ColumnDef } from "@tanstack/react-table";
import { newActivity } from "@/types/index";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown } from "lucide-react";

export const activitiesColumns: ColumnDef<newActivity>[] = [
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
    accessorKey: "name_en",
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-1 cursor-pointer"
      >
        English Name
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => {
      const type = row.getValue("location_type_en") as string;
      const englishName = row.getValue("name_en") as string;
      return (
        <>
          {type === "indoor" ? (
            <div className="text-[#676e32]  ">{englishName}</div>
          ) : (
            <div className="">{englishName}</div>
          )}
        </>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "name_ar",
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-1 cursor-pointer"
      >
        Arabic Name <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => {
      const type = row.getValue("location_type_en") as string;
      const arabicName = row.getValue("name_ar") as string;
      return (
        <>
          {type === "indoor" ? (
            <div className="text-[#676e32]  ">{arabicName}</div>
          ) : (
            <div className="">{arabicName}</div>
          )}
        </>
      );
    },
    enableSorting: true,
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
      const type = row.getValue("location_type_en") as string;
      const englishDesc = row.getValue("description_en") as string;
      return (
        <>
          {type === "indoor" ? (
            <div className="text-[#676e32]  ">{englishDesc.slice(1,35)+"..."}</div>
          ) : (
            <div className="">{englishDesc.slice(1,35)+"..."}</div>
          )}
        </>
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
      const type = row.getValue("location_type_en") as string;
      const arabicDesc = row.getValue("description_ar") as string;
      return (
        <>
          {type === "indoor" ? (
            <div className="text-[#676e32]  ">{arabicDesc.slice(1,35)+"..."}</div>
          ) : (
            <div >{arabicDesc.slice(1,35)+"..."}</div>
          )}
        </>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "location_type_en",
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-1 cursor-pointer"
      >
        Type (English)
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
     cell: ({ row }) => {
      const type = row.getValue("location_type_en") as string;
     
      return (
        <>
          {type === "indoor" ? (
            <div className="text-[#676e32]  ">{type}</div>
          ) : (
            <div >{type}</div>
          )}
        </>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "location_type_ar",
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-1 cursor-pointer"
      >
        Type (Arabic)
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => {
      const type = row.getValue("location_type_en") as string;
      const arType= row.getValue("location_type_ar")as string;
     
      return (
        <>
          {type === "indoor" ? (
            <div className="text-[#676e32]  ">{arType}</div>
          ) : (
            <div className="">{arType}</div>
          )}
        </>
      );
    },
    enableSorting: true,
  },
];
