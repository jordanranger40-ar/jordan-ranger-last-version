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
import Image from "next/image";
import { getAllClients } from "@/app/models/db/lib/services/clients";
import DeleteClientrButton from "@/components/clients/deleteClientForm";
import { deleteClient } from "./(fetch)/deleteClient";

export default async function ClientsTable() {
  const clients = await getAllClients();

  return (
    <main className="flex flex-col justify-center items-center xl:ml-5 m-2">
      {/* Header */}
      <div className="flex flex-col justify-start items-start mb-6 border-b border-gray-300 w-full">
        <h1 className="text-lg md:text-2xl font-bold">Clients</h1>
        <h2 className="text-sm md:text-lg text-gray-600">
          A list of your Clients.
        </h2>
      </div>

      {/* If no Clients */}
      {clients.length === 0 ? (
        <div className="w-full text-center py-10 text-gray-500 text-lg min-w-[80vw]">
          No Clients found. Please add a new Client.
        </div>
      ) : (
        /* Table container */
        <div className="w-full overflow-x-auto border border-gray-300 rounded-2xl p-2">
          <div className="min-w-[80vw]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client, i) => (
                  <TableRow key={i}>
                    <TableCell className="text-xs sm:text-base">
                      {client.name}
                    </TableCell>

                    {/* Image */}
                    <TableCell className="text-xs sm:text-base">
                      <Image
                        src={client.logo.trim() ?? ""}
                        alt={client.name}
                        width={75}
                        height={75}
                        className="rounded-full object-cover"
                      />
                    </TableCell>

                    {/* Created At */}
                    <TableCell className="text-xs sm:text-base">
                      {client.created_at?.toLocaleDateString()}
                    </TableCell>

                    {/* Edit + Delete Icons */}
                    <TableCell>
                      <div className="flex items-center justify-center gap-[10px]">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Link
                                href={`/admin/dashboard/clients/${client.id}`}
                              >
                                <SquarePen className="w-5 h-5 text-[#125892] cursor-pointer hover:text-[#0f4473]" />
                              </Link>
                            </TooltipTrigger>
                            <TooltipContent side="top" align="center">
                              <p>Edit</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <DeleteClientrButton
                          clientId={client.id ?? ""}
                          deleteAction={deleteClient}
                        />
                      </div>
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
          href="/admin/dashboard/clients/newClient"
          className="bg-[#125892] hover:bg-[#0f4473] text-white px-5 py-3 rounded-md flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add
        </Link>
      </div>
    </main>
  );
}
