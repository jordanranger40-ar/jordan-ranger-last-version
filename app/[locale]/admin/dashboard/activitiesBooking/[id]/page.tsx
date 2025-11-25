import React from "react";
import Link from "next/link";
import { ActivityBookingWithDetails } from "@/types";
import { getActivityBookingById } from "@/app/models/db/lib/services/activity_booking";
import BookingDetailsCard from "@/components/activityBookingDashboard/ActivityDetailsCard";
import UserDetailsCard from "@/components/activityBookingDashboard/UserDetailsCard";
import ActivityDetailsCard from "@/components/activityBookingDashboard/BookingDetailsCard";
type Props = {
  params: Promise<{
    id: string;
    locale?: string;
  }>;
};

export default async function Page({ params }: Props) {
  const par= await params
  const bookingId = par.id;
  const res = await getActivityBookingById(bookingId);
  const booking = res?.data as ActivityBookingWithDetails | undefined;

  console.log("befnjkml: ", res);

  if (!booking) {
    return (
      <main className="p-6">
        <Link
          href={`/${par.locale ?? ""}/admin/dashboard/activitiesBooking`}
        >
          ← Back
        </Link>
        <h1 className="text-2xl font-semibold mt-4">Booking not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          No booking was found for id <code>{bookingId}</code>.
        </p>
      </main>
    );
  }

  return (
    <main className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#676e32]">Booking Details</h1>
          <p className="text-sm text-gray-500">
            Booking ID: {booking.id ?? "—"}
          </p>
        </div>
        <Link
          href={`/${par.locale ?? ""}/admin/dashboard/activitiesBooking`}
          className="text-sm font-medium text-[#676e32] hover:text-[#7d8d07] underline"
        >
          ← Back to bookings
        </Link>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Booking Details Card */}
        <BookingDetailsCard data={booking} />

        {/* User Details Card */}
        <UserDetailsCard data={booking} />
      </div>

      {/* Activity Details Card (full width) */}
      <ActivityDetailsCard data={booking} />
    </main>
  );
}
