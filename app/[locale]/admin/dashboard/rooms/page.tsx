import { roomsColumns } from "@/components/columns/rooms-columns";
import { DataTable } from "@/components/data-table";
import { deleteRoom } from "./(fetch)/deleteRoom";
import { getAllRooms } from "@/app/models/db/lib/services/rooms";
import { Card, CardContent } from "@/components/ui/card";
import { FolderOpen } from "lucide-react";
import NavigationButton from "@/components/NavigationButton";

export default async function RoomsTable() {
  const allRooms = (await getAllRooms()) || [];

  return (
    <main className="flex flex-col justify-center items-center ml-7 w-[75vw]">
      {/* Header */}
      <div className="flex flex-col justify-start items-start mb-6 border-b border-gray-300 w-full">
        <h1 className="text-lg md:text-2xl font-bold">Rooms</h1>
        <h2 className="text-sm md:text-lg text-gray-600">
          A list of Rooms.
        </h2>
      </div>

      {/* Conditional rendering */}
      {allRooms.length === 0 ? (
        <Card className="w-full h-64 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 bg-gray-50">
          <CardContent className="flex flex-col items-center text-center">
            <FolderOpen className="w-10 h-10 text-gray-400 mb-3" />
            <h3 className="text-gray-600 text-lg font-medium">
              No rooms found
            </h3>
            <p className="text-gray-500 text-sm mb-4">
              You haven’t added any rooms yet.
            </p>
            <NavigationButton routeName="newRoom" value="Add New Room" />
          </CardContent>
        </Card>
      ) : (
        <>
          <DataTable
            columns={roomsColumns}
            data={allRooms}
            routeName="rooms"
            deleteAction={deleteRoom}
          />
          <NavigationButton routeName="newRoom" value="Add New Room" />
        </>
      )}
    </main>
  );
}
