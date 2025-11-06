import { roomBookingsColumns } from "@/components/columns/roomBooking-columns";
import { DataTable } from "@/components/data-table";
import { deleteRoomBooking } from "./(fetch)/deleteRoomBooking";
import { getAllRoomsBookings } from "@/app/models/db/lib/services/room_booking";

export default async function RoomsFeaturesTable() {
  const allRoomsBookings =  (await getAllRoomsBookings()).data
  console.log("allRoomsBookings[0].id: ",allRoomsBookings[0].booking_id
  );
  
  return (
    <main className="flex flex-col justify-center items-center ml-7 w-[75vw]">
      {/* Header */}
      <div className="flex flex-col justify-start items-start mb-6 border-b border-gray-300 w-full">
        <h1 className="text-lg md:text-2xl font-bold">Rooms Booking </h1>
        <h2 className="text-sm md:text-lg text-gray-600">A list of Rooms Booking.</h2>
      </div>

      

      {/* Table container */}
      <DataTable
        columns={roomBookingsColumns}
        data={allRoomsBookings}
        routeName="roomsBooking"
        deleteAction={deleteRoomBooking}
      />

    </main>
  );
}
