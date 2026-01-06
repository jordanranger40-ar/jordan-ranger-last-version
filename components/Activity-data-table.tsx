"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
  SortingState,
  RowData,
} from "@tanstack/react-table";
import DeleteButton from "@/components/deleteButton";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  SquarePen,
} from "lucide-react";
import BulkDeleteButton from "./BulkDeleteButton";
import { useRouter, useSearchParams } from "next/navigation";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    hiddenByDefault?: boolean;
  }
}

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  routeName: string;
  deleteAction: (id: string) => Promise<void>;
  totalPages: number;
}

const PAGE_SIZE = 15;

export function ActivityDataTable<TData>({
  columns,
  data,
  routeName,
  deleteAction,
  totalPages,
}: DataTableProps<TData>) {
  /* ============================
     Column visibility (unchanged)
  ============================ */
  const initialVisibility: VisibilityState = Object.fromEntries(
    columns
      .map((col) => {
        const key =
          col.id ?? (col as { accessorKey?: string }).accessorKey ?? undefined;
        if (!key) return [];
        return [key, col.meta?.hiddenByDefault ? false : true];
      })
      .filter((entry): entry is [string, boolean] => entry.length === 2)
  );

  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>(initialVisibility);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});

  /* ============================
     Pagination + URL sync
  ============================ */
  const router = useRouter();
  const searchParams = useSearchParams();

  const pageFromUrl = Number(searchParams.get("page") ?? 1) - 1;

  const [pagination, setPagination] = useState({
    pageIndex: pageFromUrl,
    pageSize: PAGE_SIZE,
  });

  // 🔁 Sync pagination when URL changes
  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: pageFromUrl,
    }));
  }, [pageFromUrl]);

  const updatePageInUrl = (pageIndex: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(pageIndex + 1));
    router.push(`?${params.toString()}`, { scroll: false });
  };

  /* ============================
     Columns + Actions
  ============================ */
  const columnsWithActions: ColumnDef<TData>[] = [
    ...columns,
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const rowData = row.original as TData & { id: string };
        return (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => router.push(`${routeName}/${rowData.id}`)}
            >
              <SquarePen />
            </Button>
            <DeleteButton id={rowData.id} deleteAction={deleteAction} />
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
  ];

  /* ============================
     React Table
  ============================ */
  const table = useReactTable({
    data,
    columns: columnsWithActions,
    manualPagination: true,
    pageCount: totalPages,
    state: {
      pagination,
      columnVisibility,
      sorting,
      rowSelection,
    },
    onPaginationChange: (updater) => {
      setPagination((old) => {
        const next =
          typeof updater === "function" ? updater(old) : updater;
        updatePageInUrl(next.pageIndex);
        return next;
      });
    },
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const selectedRows = table.getSelectedRowModel().flatRows;
  const selectedIds = selectedRows.map(
    (row) => (row.original as TData & { id: string }).id
  );

  /* ============================
     Render
  ============================ */
  return (
    <div className="space-y-4 ml-0 mr-0 lg:ml-4 lg:mr-4 w-full text-gray-600">
      {/* === Top Actions === */}
      <div className="flex justify-end items-end gap-2">
        {selectedIds.length > 0 && (
          <BulkDeleteButton
            ids={selectedIds}
            deleteAction={deleteAction}
            onFinish={() => {
              setRowSelection({});
              router.refresh?.();
            }}
          />
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              View <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {table
              .getAllLeafColumns()
              .filter((col) => col.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) =>
                    column.toggleVisibility(!!value)
                  }
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* === Table === */}
      <div className="rounded-md border border-gray-300">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columnsWithActions.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* === Pagination Controls === */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRight />
        </Button>
      </div>

      <div className="text-sm text-muted-foreground flex justify-end mr-4">
        Page {pagination.pageIndex + 1} of {table.getPageCount()}
      </div>
    </div>
  );
}
