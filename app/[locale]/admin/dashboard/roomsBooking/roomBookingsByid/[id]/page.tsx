
import React from "react";
import Link from "next/link";
import { getBookingById } from "@/app/models/db/lib/services/room_booking";
import { RoomBookingWithDetails } from "@/types";
import UserDetailsCard from "@/components/roomBookingDashboard/UserDetailsCard";
import RoomDetailsCard from "@/components/roomBookingDashboard/RoomDetailsCard";
import BookingDetailsCard from "@/components/roomBookingDashboard/BookingDetailsCard";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const bookingId = (await params).id;
  const res = await getBookingById(bookingId);

  const booking = res?.data as RoomBookingWithDetails | undefined;

  if (!booking) {
    return (
      <main className="p-6">
        <Link href={`/admin/dashboard/roomsBooking/${res.data.room_id}`}>← Back To {res.data.name_en} Bookings</Link>
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
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#676e32]">Booking Details</h1>
          <p className="text-sm text-gray-500">
            Booking ID: {booking.id ?? "—"}
          </p>
        </div>
        <Link
          href={`/admin/dashboard/roomsBooking/${res.data.room_id}`}
          className="text-xs font-medium text-[#676e32] hover:text-[#7d8d07] underline xl:text-sm mt-3 xl:mt-0"
        >
          ← Back To {res.data.name_en} Bookings
        </Link>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Booking Details Card */}
        <BookingDetailsCard data={res.data} />
        {/* User Details Card */}
        <UserDetailsCard data={res.data} />
      </div>
      {/* Room Details Card */}
      <RoomDetailsCard data={res.data} />
    </main>
  );
}

