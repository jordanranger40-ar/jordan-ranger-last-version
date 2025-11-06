import { roomsColumns } from "@/components/columns/rooms-columns";
import { DataTable } from "@/components/data-table";
import { deleteRoom } from "./(fetch)/deleteRoom";
import { getAllRooms } from "@/app/models/db/lib/services/rooms";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import NavigationButton from "@/components/NavigationButton";
export default async function RoomsFeaturesTable() {
  const allRooms = await getAllRooms();
  return (
    <main className="flex flex-col justify-center items-center ml-7 w-[75vw]">
      {/* Header */}
      <div className="flex flex-col justify-start items-start mb-6 border-b border-gray-300 w-full">
        <h1 className="text-lg md:text-2xl font-bold">Rooms </h1>
        <h2 className="text-sm md:text-lg text-gray-600">A list of Rooms.</h2>
      </div>

      {/* Table container */}
      <DataTable
        columns={roomsColumns}
        data={allRooms}
        routeName="rooms"
        deleteAction={deleteRoom}
      />

      <NavigationButton routeName="newRoom" value="Add New Room"/>
    </main>
  );
}
