"use client";

import { ColumnDef } from "@tanstack/react-table";
import { newTraining } from "@/types/index";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown } from "lucide-react";

/* --------------------------------------------------
   CATEGORY COLOR MAP (NEW)
-------------------------------------------------- */
const categoryColors: Record<string, string> = {
  "Schools Training": "text-[#676e32]",
  "Corporate Team Building": "text-[#2465ed]",
  "Training for Work": "text-[#d97706]",
};

const getCategoryColor = (category: string) =>
  categoryColors[category] || "";

/* --------------------------------------------------
   COLUMNS
-------------------------------------------------- */
export const trainingColumns: ColumnDef<newTraining>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) =>
          table.toggleAllPageRowsSelected(!!value)
        }
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

  /* --------------------------------------------------
     NAME EN
  -------------------------------------------------- */
  {
    accessorKey: "name_en",
    header: ({ column }) => (
      <button
        onClick={() =>
          column.toggleSorting(column.getIsSorted() === "asc")
        }
        className="flex items-center gap-1 cursor-pointer"
      >
        English Name <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => {
      const type = row.getValue("category_en") as string;
      const englishName = row.original.name_en.slice(0, 35);
      const points =
        row.original.name_en.length > 35 ? "..." : "";

      return (
        <div className={getCategoryColor(type)}>
          {englishName}
          {points}
        </div>
      );
    },
    enableSorting: true,
  },

  /* --------------------------------------------------
     NAME AR
  -------------------------------------------------- */
  {
    accessorKey: "name_ar",
    header: ({ column }) => (
      <button
        onClick={() =>
          column.toggleSorting(column.getIsSorted() === "asc")
        }
        className="flex items-center gap-1 cursor-pointer"
      >
        Arabic Name <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => {
      const type = row.getValue("category_en") as string;
      const arabicName = row.original.name_ar.slice(0, 35);
      const points =
        row.original.name_ar.length > 35 ? "..." : "";

      return (
        <div className={getCategoryColor(type)}>
          {arabicName}
          {points}
        </div>
      );
    },
    enableSorting: true,
    meta: { hiddenByDefault: true },
  },

  /* --------------------------------------------------
     DESCRIPTION EN
  -------------------------------------------------- */
  {
    accessorKey: "description_en",
    header: ({ column }) => (
      <button
        onClick={() =>
          column.toggleSorting(column.getIsSorted() === "asc")
        }
        className="flex items-center gap-1 cursor-pointer"
      >
        English Description <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => {
      const type = row.getValue("category_en") as string;
      const englishDesc =
        row.original.description_en.slice(0, 35);
      const points =
        row.original.description_en.length > 35 ? "..." : "";

      return (
        <div className={getCategoryColor(type)}>
          {englishDesc}
          {points}
        </div>
      );
    },
    enableSorting: true,
  },

  /* --------------------------------------------------
     DESCRIPTION AR
  -------------------------------------------------- */
  {
    accessorKey: "description_ar",
    header: ({ column }) => (
      <button
        onClick={() =>
          column.toggleSorting(column.getIsSorted() === "asc")
        }
        className="flex items-center gap-1 cursor-pointer"
      >
        Arabic Description <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => {
      const type = row.getValue("category_en") as string;
      const arabicDesc =
        row.original.description_ar.slice(0, 35);
      const points =
        row.original.description_ar.length > 35 ? "..." : "";

      return (
        <div className={getCategoryColor(type)}>
          {arabicDesc}
          {points}
        </div>
      );
    },
    enableSorting: true,
    meta: { hiddenByDefault: true },
  },

  /* --------------------------------------------------
     CATEGORY EN
  -------------------------------------------------- */
  {
    accessorKey: "category_en",
    header: ({ column }) => (
      <button
        onClick={() =>
          column.toggleSorting(column.getIsSorted() === "asc")
        }
        className="flex items-center gap-1 cursor-pointer"
      >
        Type (English) <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => {
      const type = row.getValue("category_en") as string;

      return (
        <div className={getCategoryColor(type)}>
          {type}
        </div>
      );
    },
    enableSorting: true,
  },

  /* --------------------------------------------------
     CATEGORY AR
  -------------------------------------------------- */
  {
    accessorKey: "category_ar",
    header: ({ column }) => (
      <button
        onClick={() =>
          column.toggleSorting(column.getIsSorted() === "asc")
        }
        className="flex items-center gap-1 cursor-pointer"
      >
        Type (Arabic) <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => {
      const type = row.getValue("category_en") as string;
      const arType = row.getValue("category_ar") as string;

      return (
        <div className={getCategoryColor(type)}>
          {arType}
        </div>
      );
    },
    enableSorting: true,
    meta: { hiddenByDefault: true },
  },

  /* --------------------------------------------------
     CAPACITY
  -------------------------------------------------- */
  {
    accessorKey: "capacity",
    header: ({ column }) => (
      <button
        onClick={() =>
          column.toggleSorting(column.getIsSorted() === "asc")
        }
        className="flex items-center gap-1 cursor-pointer"
      >
        Capacity <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => {
      const type = row.getValue("category_en") as string;
      const capacity = row.getValue("capacity") as string;

      return (
        <div className={getCategoryColor(type)}>
          {capacity}
        </div>
      );
    },
    enableSorting: true,
    enableHiding: true,
  },

  /* --------------------------------------------------
     PRICE
  -------------------------------------------------- */
  {
    accessorKey: "price",
    header: ({ column }) => (
      <button
        onClick={() =>
          column.toggleSorting(column.getIsSorted() === "asc")
        }
        className="flex items-center gap-1 cursor-pointer"
      >
        Price <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => {
      const type = row.getValue("category_en") as string;
      const price = row.getValue("price") as string;

      return (
        <div className={getCategoryColor(type)}>
          {price}
        </div>
      );
    },
    enableSorting: true,
  },

  /* --------------------------------------------------
     START DATE
  -------------------------------------------------- */
  {
    accessorKey: "start_date",
    header: ({ column }) => (
      <button
        onClick={() =>
          column.toggleSorting(column.getIsSorted() === "asc")
        }
        className="flex items-center gap-1 cursor-pointer"
      >
        Start Date <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => {
      const type = row.getValue("category_en") as string;
      const startDate = new Date(row.original.start_date);

      return (
        <div className={getCategoryColor(type)}>
          {startDate.toLocaleDateString()}
        </div>
      );
    },
    enableSorting: true,
  },

  /* --------------------------------------------------
     END DATE
  -------------------------------------------------- */
  {
    accessorKey: "end_date",
    header: ({ column }) => (
      <button
        onClick={() =>
          column.toggleSorting(column.getIsSorted() === "asc")
        }
        className="flex items-center gap-1 cursor-pointer"
      >
        End Date <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => {
      const type = row.getValue("category_en") as string;
      const endDate = new Date(row.original.end_date);

      return (
        <div className={getCategoryColor(type)}>
          {endDate.toLocaleDateString()}
        </div>
      );
    },
    enableSorting: true,
  },
];