import { getAllusers } from "@/app/models/db/lib/services/users";
import { userColumns } from "@/components/columns/user-columns";
import { DataTable } from "@/components/data-table";
import { deleteUser } from "./(fetch)/deleteUser";
export default async function UsersTable() {
  const users = await getAllusers();
  return (
    <main className="flex flex-col justify-center items-center ml-7 w-[80vw]">
      {/* Header */}
      <div className="flex flex-col justify-start items-start mb-6 border-b border-gray-300 w-full">
        <h1 className="text-lg md:text-2xl font-bold">Users</h1>
        <h2 className="text-sm md:text-lg text-gray-600">
          A list of your users.
        </h2>
      </div>

      {/* Table container */}
      <DataTable columns={userColumns} data={users} routeName="users" deleteAction={deleteUser}/>
    </main>
  );
}
