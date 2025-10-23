import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SquarePen, Plus, Trash2 } from "lucide-react";
import { getAllTraining } from "@/app/models/db/lib/services/training";
import DeleteTrainingButton from "@/components/training/deleteTrainingButton"
import { deleteTraining } from "./(fetch)/deleteTraining";

export default async function trainingTable() {
  const training = await getAllTraining();

  return (
    <main className="flex flex-col justify-center items-center xl:ml-5 m-2">
      {/* Header */}
      <div className="flex flex-col justify-start items-start mb-6 border-b border-gray-300 w-full">
        <h1 className="text-lg md:text-2xl font-bold">Training</h1>
        <h2 className="text-sm md:text-lg text-gray-600">
          A list of your Training.
        </h2>
      </div>

      {/* Table container */}
      <div className="w-full overflow-x-auto border border-gray-300 rounded-2xl p-2">
        <div className="min-w-[75vw]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden xl:table-cell">
                  Description
                </TableHead>
                <TableHead></TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {training.map((ele, i) => (
                <TableRow key={i}>
                  <TableCell className="text-xs sm:text-base">
                    {ele.name_en}
                  </TableCell>

                  {/* Description */}
                  <TableCell className="text-xs sm:text-base hidden xl:table-cell">
                    {ele.description_en?.substring(0, 50)}...
                  </TableCell>
                  {/* Edit Icon */}
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link
                            href={`/admin/dashboard/training/${ele.id}`}
                          >
                            <SquarePen className="w-5 h-5 text-[#125892] cursor-pointer hover:text-[#125892]" />
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent side="top" align="center">
                          <p>Edit</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>

                  {/* Delete Icon */}
                  <TableCell>
                   <DeleteTrainingButton trainingId={ele.id ?? ""} deleteAction={deleteTraining} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Add Button under the table */}
      <div className="w-full flex justify-end mt-4">
        <Link
          href="/admin/dashboard/training/newTraining"
          className="bg-[#125892] hover:bg-[#0f4473] text-white px-5 py-3 rounded-md flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add
        </Link>
      </div>
    </main>
  );
}
