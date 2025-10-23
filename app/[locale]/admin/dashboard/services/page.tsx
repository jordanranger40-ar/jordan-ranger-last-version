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
import { SquarePen, Plus } from "lucide-react";
import { getAllServices } from "@/app/models/db/lib/services/services";
import DeleteServiceButton from "@/components/services/deleteServiceForm";
import { deleteService } from "./(fetch)/deleteService";

export default async function ServicesTable() {
  const services = await getAllServices();
  console.log("services3: ",services);
  

  return (
    <main className="flex flex-col justify-center items-center xl:ml-5 m-2">
      {/* Header */}
      <div className="flex flex-col justify-start items-start mb-6 border-b border-gray-300 w-full">
        <h1 className="text-lg md:text-2xl font-bold">Services</h1>
        <h2 className="text-sm md:text-lg text-gray-600">
          A list of your Services.
        </h2>
      </div>

      {/* If no services */}
      {services.length === 0 ? (
        <div className="w-full text-center py-10 text-gray-500 text-lg min-w-[75vw]">
          No services found. Please add a new service.
        </div>
      ) : (
        /* Table container */
        <div className="w-full overflow-x-auto border border-gray-300 rounded-2xl p-2">
          <div className="min-w-[75vw]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden xl:table-cell">Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead></TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service, i) => (
                  <TableRow key={i}>
                    <TableCell className="text-xs sm:text-base">
                      {service.name_en}
                    </TableCell>

                    {/* Description */}
                    <TableCell className="text-xs sm:text-base hidden xl:table-cell">
                      {service.description_en?.substring(0, 50)}...
                    </TableCell>

                    {/* Category */}
                    <TableCell className="text-xs sm:text-base">
                      {service.category_name_en}
                    </TableCell>

                    {/* Edit Icon */}
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link href={`/admin/dashboard/services/${service.id}`}>
                              <SquarePen className="w-5 h-5 text-[#125892] cursor-pointer hover:text-[#0f4473]" />
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
                      <DeleteServiceButton
                        serviceId={service.id ?? ""}
                        deleteAction={deleteService}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Add Button under the table */}
      <div className="w-full flex justify-end mt-4">
        <Link
          href="/admin/dashboard/services/newService"
          className="bg-[#125892] hover:bg-[#0f4473] text-white px-5 py-3 rounded-md flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add
        </Link>
      </div>
    </main>
  );
}
