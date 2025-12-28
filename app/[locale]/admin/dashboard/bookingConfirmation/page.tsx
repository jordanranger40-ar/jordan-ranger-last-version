import { getUserUpcomingActivityBookings } from "@/app/models/db/lib/services/activity_booking";
import { getUserUpcomingRoomBookings } from "@/app/models/db/lib/services/room_booking";
import { getUserUpcomingTrainingBookings } from "@/app/models/db/lib/services/training_booking";
import UserIdFilter from "@/components/UserIdFelter";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FolderOpen } from "lucide-react";
import { type UnifiedBooking } from "@/types/index";
import { AllBookingTable } from "@/components/AllBookingsTable";
import { bookingsColumns } from "@/components/columns/allBooking-columns";

interface Props {
  searchParams?: Promise<{ user_id: string }>;
}

async function Page({ searchParams }: Props) {
  const user_id = (await searchParams)?.user_id;
  if (!user_id) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-6 bg-white border-gray-300 rounded-lg shadow-md w-[95vw] lg:w-[50vw] mx-auto ml-1 lg:ml-5 mt-10">
        <h2 className="text-lg font-semibold text-gray-800">
          Please Enter the User ID
        </h2>
        <p className="text-sm text-gray-500 text-center">
          To view bookings, you need to provide a valid User ID below.
        </p>
        <UserIdFilter user_id={user_id} />
      </div>
    );
  }

  const upCommingActivitiesBookings = (
    await getUserUpcomingActivityBookings(user_id)
  ).data;
  const upCommingAccomodationBookings = (
    await getUserUpcomingRoomBookings(user_id)
  ).data;
  const upCommingTrainingBookings = (
    await getUserUpcomingTrainingBookings(user_id)
  ).data;

  const unifiedBookings: UnifiedBooking[] = [
    // Upcoming Activity Bookings
    ...upCommingActivitiesBookings.map((b) => ({
      id: b.id,
      type: "activity" as const,
      user_id: b.user_id,
      first_name: b.first_name,
      last_name: b.last_name,
      start: b.start_time,
      end: b.end_time,
      created_at: b.created_at,
      price: b.booking_price,
      name_en: b.name_en,
      slug: b.slug,
      is_confirmed: b.is_confirmed,
    })),

    // Upcoming Room Bookings
    ...upCommingAccomodationBookings.map((b) => ({
      id: b.id!,
      type: "room" as const,
      user_id: b.user_id,
      first_name: b.first_name,
      last_name: b.last_name,
      start: b.start_time,
      end: b.end_time,
      created_at: b.created_at,
      price: b.price,
      name_en: b.name_en,
      slug: b.slug,
      is_confirmed: b.is_confirmed,
    })),

    // Upcoming Training Bookings
    ...upCommingTrainingBookings.map((b) => ({
      id: b.id,
      type: "training" as const,
      user_id: b.user_id,
      first_name: b.first_name,
      last_name: b.last_name,
      start: b.start_date,
      end: b.end_date,
      created_at: b.created_at,
      price: b.training_price,
      name_en: b.name_en,
      slug: b.slug,
      is_confirmed: b.is_confirmed,
    })),
  ];

  // Calculate total bookings amount
  const totalBookingsAmount = unifiedBookings.reduce(
    (sum, b) => sum + (Number(b.price) || 0 || Number(b.training_price) || Number(b.training_price)),
    0
  );

  return (
    <main className="flex flex-col lg:justify-center justify-start items-center lg:ml-7 ml-2 lg:w-[75vw] w-[88vw] md:w-[60vw] xl:w-[80vw]">
      {/* Header */}
      <div className="flex flex-col justify-start items-start mb-6 border-b border-gray-300 w-full">
        <h1 className="text-lg md:text-2xl font-bold">All Bookings</h1>
        {unifiedBookings.length > 0 && (
          <h2 className="text-sm md:text-lg text-gray-600">
            A list of {unifiedBookings[0].first_name} Bookings.
          </h2>
        )}
      </div>

      {/* Filter */}
      <UserIdFilter user_id={user_id} />

      {/* No bookings message */}
      {unifiedBookings.length === 0 ? (
        <Card className="w-full h-64 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 bg-gray-50">
          <CardContent className="flex flex-col items-center text-center">
            <FolderOpen className="w-10 h-10 text-gray-400 mb-3" />
            <h3 className="text-gray-600 text-lg font-medium">
              No upcoming bookings found
            </h3>
            <p className="text-gray-500 text-sm">
              There are no Bookings for this user.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <AllBookingTable
            columns={bookingsColumns}
            data={unifiedBookings}
            routeName="bookingConfirmation"
          />
          {/* Total bookings amount */}
          <div className=" w-full flex justify-end">
            <span className="text-lg font-semibold text-[#484d23]">
              Total Amount: {totalBookingsAmount.toFixed(2)} JOD
            </span>
          </div>
        </>
      )}
    </main>
  );
}

export default Page;
