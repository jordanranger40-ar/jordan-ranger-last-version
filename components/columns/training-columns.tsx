"use client";
import { ColumnDef } from "@tanstack/react-table";
import { newTraining } from "@/types/index";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown } from "lucide-react";

export const trainingColumns: ColumnDef<newTraining>[] = [
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
      const type = row.getValue("category_en") as string;
      const englishName = row.getValue("name_en") as string;
      return (
        <>
          {type === "Schools Training" ? (
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
      const type = row.getValue("category_en") as string;
      const arabicName = row.getValue("name_ar") as string;
      return (
        <>
          {type === "Schools Training" ? (
            <div className="text-[#676e32]  ">{arabicName}</div>
          ) : (
            <div className="">{arabicName}</div>
          )}
        </>
      );
    },
    enableSorting: true,
    meta: { hiddenByDefault: true },
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
      const type = row.getValue("category_en") as string;
      const englishDesc = row.getValue("description_en") as string;
      return (
        <>
          {type === "Schools Training" ? (
            <div className="text-[#676e32]  ">{englishDesc}</div>
          ) : (
            <div className="">{englishDesc}</div>
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
      const type = row.getValue("category_en") as string;
      const arabicDesc = row.getValue("description_ar") as string;
      return (
        <>
          {type === "Schools Training" ? (
            <div className="text-[#676e32]  ">{arabicDesc}</div>
          ) : (
            <div>{arabicDesc}</div>
          )}
        </>
      );
    },
    enableSorting: true,
    meta: { hiddenByDefault: true },
  },
  {
    accessorKey: "category_en",
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
      const type = row.getValue("category_en") as string;

      return (
        <>
          {type === "Schools Training" ? (
            <div className="text-[#676e32]  ">{type}</div>
          ) : (
            <div>{type}</div>
          )}
        </>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "category_ar",
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
      const type = row.getValue("category_en") as string;
      const arType = row.getValue("category_ar") as string;

      return (
        <>
          {type === "Schools Training" ? (
            <div className="text-[#676e32]  ">{arType}</div>
          ) : (
            <div className="">{arType}</div>
          )}
        </>
      );
    },
    enableSorting: true,
    enableHiding: true,

    meta: { hiddenByDefault: true },
  },
  {
    accessorKey: "capacity",
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-1 cursor-pointer"
      >
        Capacity
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => {
      const type = row.getValue("category_en") as string;
      const capacity = row.getValue("capacity") as string;

      return (
        <>
          {type === "Schools Training" ? (
            <div className="text-[#676e32]  ">{capacity}</div>
          ) : (
            <div className="">{capacity}</div>
          )}
        </>
      );
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-1 cursor-pointer"
      >
        Price
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => {
      const type = row.getValue("category_en") as string;
      const price = row.getValue("price") as string;

      return (
        <>
          {type === "Schools Training" ? (
            <div className="text-[#676e32]  ">{price}</div>
          ) : (
            <div className="">{price}</div>
          )}
        </>
      );
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
        Start Date
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => {
      const type = row.getValue("category_en") as string;
      const startDate = new Date(row.original.start_date);

      return (
        <>
          {type === "Schools Training" ? (
            <div className="text-[#676e32]  ">
              {startDate.toLocaleDateString()}
            </div>
          ) : (
            <div className="">{startDate.toLocaleDateString()}</div>
          )}
        </>
      );
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
        End Date
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => {
      const type = row.getValue("category_en") as string;
      const endDate = new Date(row.original.end_date);

      return (
        <>
          {type === "Schools Training" ? (
            <div className="text-[#676e32]  ">
              {endDate.toLocaleDateString()}
            </div>
          ) : (
            <div className="">{endDate.toLocaleDateString()}</div>
          )}
        </>
      );
    },
    enableSorting: true,
  },
];
