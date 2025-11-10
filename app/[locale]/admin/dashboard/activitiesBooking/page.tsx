import { activitiesBookingsColumns } from "@/components/columns/activitiesBooking-columns";
import { DataTable } from "@/components/data-table";
import { deleteActivityBooking } from "./(fetch)/deleteActivityBooking";
import { getAllActivitiesbookings } from "@/app/models/db/lib/services/activity_booking";

export default async function ActivitiesBookingTable() {
  const response = await getAllActivitiesbookings();
  const allActivitiesBookings = response?.data || [];

  // Optional debug logs
  console.log("allActivitiesBookings:", allActivitiesBookings);

  return (
    <main className="flex flex-col justify-center items-center ml-7 w-[75vw]">
      {/* Header */}
      <div className="flex flex-col justify-start items-start mb-6 border-b border-gray-300 w-full">
        <h1 className="text-lg md:text-2xl font-bold">Activities Booking</h1>
        <h2 className="text-sm md:text-lg text-gray-600">
          A list of Activities Booking.
        </h2>
      </div>

      {/* No bookings message */}
      {allActivitiesBookings.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">
          No bookings found.
        </p>
      ) : (
        <DataTable
          columns={activitiesBookingsColumns}
          data={allActivitiesBookings}
          routeName="activitiesBooking"
          deleteAction={deleteActivityBooking}
        />
      )}
    </main>
  );
}
