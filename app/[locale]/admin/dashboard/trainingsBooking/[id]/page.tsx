import React from "react";
import Link from "next/link";
import {  TrainingBookingWithDetails } from "@/types";
import { getTrainingBookingById } from "@/app/models/db/lib/services/training_booking";
import UserDetailsCard from "@/components/trainingBookingDashboard/UserDetailsCard";
import BookingDetailsCard from "@/components/trainingBookingDashboard/BookingDetailsCard";
import TrainingDetailsCard from "@/components/trainingBookingDashboard/TrainingDetailsCard";

type Props = {
  params: Promise<{
    id: string;
    locale?: string;
  }>;
};

export default async function Page({ params }: Props) {
  const par= await params
  const bookingId = par.id;
  const res = await getTrainingBookingById(bookingId);
  const booking = res?.data as TrainingBookingWithDetails | undefined;

  if (!booking) {
    return (
      <main className="p-6">
        <Link href={`/${par.locale ?? ""}/admin/dashboard/trainingsBooking`}>
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
          href={`/${par.locale ?? ""}/admin/dashboard/trainingsBooking`}
          className="text-sm font-medium text-[#676e32] hover:text-[#7d8d07] underline"
        >
          ← Back to bookings
        </Link>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Booking Details Card */}
        <BookingDetailsCard data={booking}/>

        {/* User Details Card */}
        <UserDetailsCard data={res.data}/>
      </div>

      {/* Training Details Card */}
      <TrainingDetailsCard data={booking}/>
    </main>
  );
}
