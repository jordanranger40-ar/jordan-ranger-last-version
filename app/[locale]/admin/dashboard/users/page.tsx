import { getAllusers } from "@/app/models/db/lib/services/users";
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
import { SquarePen} from "lucide-react";
import DeleteUserButton from "@/components/users/deleteUserButton"
import { deleteUser } from "./(fetch)/deleteUser";

export default async function UsersTable() {
  const users = await getAllusers();

  return (
    <main className="flex flex-col justify-center items-center ml-7">
      {/* Header */}
      <div className="flex flex-col justify-start items-start mb-6 border-b border-gray-300 w-full">
        <h1 className="text-lg md:text-2xl font-bold">Users</h1>
        <h2 className="text-sm md:text-lg text-gray-600">
          A list of your users.
        </h2>
      </div>

      {/* Table container */}
      <div className="w-full overflow-x-auto">
        <div className="min-w-[80vw]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead></TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user, i) => (
                <TableRow key={i}>
                  <TableCell className="text-xs sm:text-base">
                    {user.first_name}
                  </TableCell>
                  <TableCell className="text-xs sm:text-base">
                    <a
                      href={`mailto:${user.email}`}
                      className="text-[#125892] hover:underline"
                    >
                      {user.email}
                    </a>
                  </TableCell>
                  <TableCell className="text-xs sm:text-base">
                    {user.role}
                  </TableCell>

                  {/* Edit Icon */}
                  <TableCell>
                    <div className="relative flex justify-center items-center">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link href={`/admin/dashboard/users/${user.id}`}>
                              <SquarePen className="w-5 h-5 text-[#125892] cursor-pointer hover:text-[#125892]" />
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent side="top" align="center">
                            <p>Edit</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>

                  {/* Delete Icon */}
                  <TableCell>
                    <DeleteUserButton userId={user.id} deleteAction={deleteUser}/>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </main>
  );
}
