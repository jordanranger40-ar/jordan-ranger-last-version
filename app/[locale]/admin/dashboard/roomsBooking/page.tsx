import { roomBookingsColumns } from "@/components/columns/roomBooking-columns";
import { DataTable } from "@/components/data-table";
import { deleteRoomBooking } from "./(fetch)/deleteRoomBooking";
import { getRoomBookingByDate } from "@/app/models/db/lib/services/room_booking";
import { Card, CardContent } from "@/components/ui/card";
import { FolderOpen } from "lucide-react";
import DateRangeFilter from "@/components/DateRangeFilter";
import {RoomBookingWithDetails} from "@/types/index"
interface Props {
  searchParams?: Promise<{ start?: string; end?: string }>;
}

export default async function RoomsBookingTable({ searchParams }: Props) {
  const params = searchParams ? await searchParams : {};
  const startDate = params.start ? new Date(params.start) : null;
  const endDate = params.end ? new Date(params.end) : null;

  const allRoomsBookings = (await getRoomBookingByDate(startDate,endDate))?.data || [];
  console.log("allRoomsBookings: ",allRoomsBookings);
  

  return (
    <main className="flex flex-col lg:justify-center justify-start items-center lg:ml-7 ml-2 lg:w-[75vw] w-[92vw]">
      {/* Header */}
      <div className="flex flex-col justify-start items-start mb-6 border-b border-gray-300 w-full">
        <h1 className="text-lg md:text-2xl font-bold">Rooms Booking</h1>
        <h2 className="text-sm md:text-lg text-gray-600">
          A list of Rooms Booking.
        </h2>
      </div>

      {/* Filter */}
      <DateRangeFilter start={params?.start} end={params?.end} />
      {/* Conditional rendering */}
      {allRoomsBookings.length === 0 ? (
        <Card className="w-full h-64 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 bg-gray-50">
          <CardContent className="flex flex-col items-center text-center">
            <FolderOpen className="w-10 h-10 text-gray-400 mb-3" />
            <h3 className="text-gray-600 text-lg font-medium">
              No upcoming bookings found
            </h3>
            <p className="text-gray-500 text-sm">
              There are no room bookings yet.
            </p>
          </CardContent>
        </Card>
      ) : (
       <DataTable<RoomBookingWithDetails>
  columns={roomBookingsColumns}
  data={allRoomsBookings}
  routeName="roomsBooking"
  deleteAction={deleteRoomBooking}
/>

      )}
    </main>
  );
}
