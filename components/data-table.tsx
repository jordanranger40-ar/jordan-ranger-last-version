"use client";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
  SortingState,
  RowData,
} from "@tanstack/react-table";
import DeleteButton from "@/components/deleteButton";
import { useState } from "react";
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
import { useRouter } from "next/navigation";
import BulkDeleteButton from "./BulkDeleteButton";
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
}

export function DataTable<TData>({
  columns,
  data,
  routeName,
  deleteAction,
}: DataTableProps<TData>) {
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

  const router = useRouter();

  const columnsWithActions: ColumnDef<TData>[] = [
    ...columns,
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const rowData = row.original as TData & { id: string };
        return (
          <div className="flex gap-2">
            {<Button
              size="sm"
              variant="outline"
              onClick={() => router.push(`${routeName}/${rowData.id}`)}
              className="cursor-pointer"
            >
              <SquarePen />
            </Button>
            }<DeleteButton id={rowData.id ?? ""} deleteAction={deleteAction} />
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
  ];

  const table = useReactTable({
    data,
    columns: columnsWithActions,
    state: {
      columnVisibility,
      sorting,
      rowSelection,
    },
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const selectedRows = table.getSelectedRowModel().flatRows;
console.log("table.getSelectedRowModel(): ",table.getSelectedRowModel());

  const selectedIds = selectedRows.map(
    (row) => (row.original as TData & { id: string }).id
  );

  return (
    <div className="space-y-4 mb-20 ml-0 mr-0 lg:ml-4 lg:mr-4 w-full">
      {/* === Column Visibility Menu === */}
      <div className="flex justify-end flex-row items-end gap-2">
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
            <Button variant="outline" className="">
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
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
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
              <TableRow
                key={headerGroup.id}
                className="border-b border-gray-300 hover:bg-gray-50"
              >
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
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-b border-gray-300 hover:bg-gray-50"
                >
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
              <TableRow className="border-b border-gray-300 hover:bg-gray-50">
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

      {/* === Pagination === */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Rows per page:</span>
          <select
            className="border rounded-md p-1 text-sm"
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
          >
            {[5, 10, 20, 50, 100].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="cursor-pointer"
        >
          <ChevronLeft />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="cursor-pointer"
        >
          <ChevronRight />
        </Button>
      </div>

      <div className="text-sm text-muted-foreground flex justify-end mr-4">
        Page {table.getState().pagination.pageIndex + 1} of{" "}
        {table.getPageCount()}
      </div>
    </div>
  );
}
