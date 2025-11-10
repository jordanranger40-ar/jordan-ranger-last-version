import { trainingBookingsColumns } from "@/components/columns/trainingBooking-columns";
import { DataTable } from "@/components/data-table";
import { deleteTrainingBooking } from "./(fetch)/deleteTrainingBooking";
import { getAllTrainingsbookings } from "@/app/models/db/lib/services/training_booking";
import { Card, CardContent } from "@/components/ui/card";
import { FolderOpen } from "lucide-react";

export default async function TrainingBookingTable() {
  const allTrainingBookings = (await getAllTrainingsbookings())?.data || [];

  return (
    <main className="flex flex-col justify-center items-center ml-7 w-[75vw]">
      {/* Header */}
      <div className="flex flex-col justify-start items-start mb-6 border-b border-gray-300 w-full">
        <h1 className="text-lg md:text-2xl font-bold">Training Booking</h1>
        <h2 className="text-sm md:text-lg text-gray-600">
          A list of Training Booking.
        </h2>
      </div>

      {/* Conditional rendering */}
      {allTrainingBookings.length === 0 ? (
        <Card className="w-full h-64 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 bg-gray-50">
          <CardContent className="flex flex-col items-center text-center">
            <FolderOpen className="w-10 h-10 text-gray-400 mb-3" />
            <h3 className="text-gray-600 text-lg font-medium">
              No bookings found
            </h3>
            <p className="text-gray-500 text-sm">
              There are no training bookings yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <DataTable
          columns={trainingBookingsColumns}
          data={allTrainingBookings}
          routeName="trainingsBooking"
          deleteAction={deleteTrainingBooking}
        />
      )}
    </main>
  );
}
