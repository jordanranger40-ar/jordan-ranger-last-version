import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { SquarePen, Trash } from "lucide-react";

export function addActionsColumn<TData>(
  columns: ColumnDef<TData>[],
  handleEdit: (row: TData) => void,
  handleDelete: (row: TData) => void
): ColumnDef<TData>[] {
  return [
    ...columns,
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const rowData = row.original;
        return (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => handleEdit(rowData)}>
              <SquarePen/>
            </Button>
            <Button size="sm" variant="destructive" onClick={() => handleDelete(rowData)}>
              <Trash/>
            </Button>
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
  ];
}
