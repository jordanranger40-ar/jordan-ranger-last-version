import { trainingBookingsColumns } from "@/components/columns/trainingBooking-columns";
import { DataTable } from "@/components/data-table";
import { deleteTrainingBooking } from "./(fetch)/deleteTrainingBooking";
import { getTrainingBookingByDate } from "@/app/models/db/lib/services/training_booking";
import { Card, CardContent } from "@/components/ui/card";
import { FolderOpen } from "lucide-react";
import DateRangeFilter from "@/components/DateRangeFilter";
import TrainingFilterSAndD from "@/components/training/TrainingFilterSAndD";
import { getAllTraining } from "@/app/models/db/lib/services/training";

interface Props {
  searchParams?: Promise<{
    start?: string;
    end?: string;
    training_id?: string;
  }>;
}

export default async function TrainingBookingTable({ searchParams }: Props) {
  const params = searchParams ? await searchParams : {};
  const startDate = params.start ? new Date(params.start) : null;
  const endDate = params.end ? new Date(params.end) : null;
  const training_id = params.training_id ? params.training_id : null;
  const allTrainings = (await getAllTraining()).data;

  const allTrainingBookings =
    (await getTrainingBookingByDate(startDate, endDate, training_id))?.data ||
    [];

  console.log("allTrainingBookings: ", allTrainingBookings);
  console.log(training_id);

  return (
    <main className="flex flex-col lg:justify-center justify-start items-center lg:ml-7 ml-2 lg:w-[75vw] w-[92vw]">
      {/* Header */}
      <div className="flex flex-col justify-start items-start mb-6 border-b border-gray-300 w-full">
        <h1 className="text-lg md:text-2xl font-bold">Training Booking</h1>
        <h2 className="text-sm md:text-lg text-gray-600">
          A list of Training Booking.
        </h2>
      </div>
      {/* Filters */}
      <TrainingFilterSAndD
        initialTrainingId={params?.training_id}
        trainings={allTrainings}
        start={params?.start}
        end={params?.end}
      />
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
