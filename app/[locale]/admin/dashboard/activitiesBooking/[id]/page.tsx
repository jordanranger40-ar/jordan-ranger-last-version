import React from "react";
import Link from "next/link";
import { ActivityBookingWithDetails } from "@/types";
import { getActivityBookingById } from "@/app/models/db/lib/services/activity_booking";
import Image from "next/image";
type Props = {
  params: {
    id: string;
    locale?: string;
  };
};

export default async function Page({ params }: Props) {
  const bookingId = params.id;
  const res = await getActivityBookingById(bookingId);
  const booking = res?.data as ActivityBookingWithDetails | undefined;

  console.log("befnjkml: ",res);
  
  if (!booking) {
    return (
      <main className="p-6">
        <Link href={`/${params.locale ?? ""}/admin/dashboard/activitiesBooking`}>
          ← Back
        </Link>
        <h1 className="text-2xl font-semibold mt-4">Booking not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          No booking was found for id <code>{bookingId}</code>.
        </p>
      </main>
    );
  }

  const formatDateTime = (value?: string | Date) => {
    if (!value) return "—";
    const d = typeof value === "string" ? new Date(value) : value;
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleString("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

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
          href={`/${params.locale ?? ""}/admin/dashboard/activitiesBooking`}
          className="text-sm font-medium text-[#676e32] hover:text-[#7d8d07] underline"
        >
          ← Back to bookings
        </Link>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Booking Details Card */}
        <div className="border rounded-2xl shadow-sm p-5 bg-white">
          <h2 className="text-lg font-semibold mb-4 text-[#676e32]">
            Booking Information
          </h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-600">Created At:</dt>
              <dd>{formatDateTime(booking.created_at)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Start Time:</dt>
              <dd>{formatDateTime(booking.start_time)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">End Time:</dt>
              <dd>{formatDateTime(booking.end_time)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Quantity:</dt>
              <dd>{(booking.quantity)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Total Price:</dt>
              <dd>{(booking.booking_price).toString()}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Confirmed:</dt>
              <dd>
                <span
                  className={`px-2 py-0.5 rounded text-xs font-medium ${
                    booking.is_confirmed
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {booking.is_confirmed ? "Yes" : "No"}
                </span>
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Deleted:</dt>
              <dd>{booking.is_deleted ? "Yes" : "No"}</dd>
            </div>
          </dl>
        </div>

        {/* User Details Card */}
        <div className="border rounded-2xl shadow-sm p-5 bg-white">
          <h2 className="text-lg font-semibold mb-4 text-[#676e32]">
            User Information
          </h2>
          <dl className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-gray-600">Name:</dt>
              <dd className="ml-2">
                {booking.first_name ?? "—"} {booking.last_name ?? ""}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-gray-600">Email:</dt>
              <dd className="ml-2">
                {booking.email ? (
                  <a
                    href={`mailto:${booking.email}`}
                    className="underline text-[#676e32] hover:text-[#7d8d07]"
                  >
                    {booking.email}
                  </a>
                ) : (
                  "—"
                )}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-gray-600">User ID:</dt>
              <dd className="ml-2">{booking.user_id ?? "—"}</dd>
            </div>
          </dl>
        </div>
      </div>

{/* Activity Details Card (full width) */}
<div className="border rounded-2xl shadow-sm p-6 bg-white w-full">
  <h2 className="text-lg font-semibold mb-6 text-[#676e32]">
    Activity Details
  </h2>

  <div className="flex flex-col md:flex-row items-start gap-6">
    {/* Activity info */}
    <div className="flex-1 space-y-3 text-sm">
      <div>
        <span className="text-gray-600 font-medium">Activity Name:</span>{" "}
        {booking.name_en ?? "—"}
      </div>
      <div>
        <span className="text-gray-600 font-medium">Description:</span>{" "}
        {booking.description_en ?? "No description"}
      </div>
      <div>
        <span className="text-gray-600 font-medium">Activity Type:</span>{" "}
        {booking.location_type_en ?? "—"}
      </div>
      <div>
        <span className="text-gray-600 font-medium">Price:</span>{" "}
        {booking.activity_price ?? "—"}
      </div>
      <div>
        <span className="text-gray-600 font-medium">Slug:</span>{" "}
        {booking.slug ?? "—"}
      </div>
    </div>

    {/* Images */}
    <div className="flex flex-col md:flex-row gap-4 flex-wrap">
      {/* Card Image */}
      <div className="flex flex-col items-center">
        <span className="text-sm font-medium mb-1">Card Image</span>
        <div className="relative w-56 h-40 rounded-lg overflow-hidden bg-gray-100 shadow-sm">
          <Image
            src={booking.card_image ?? "/placeholder-activity.jpg"}
            alt={booking.name_en ?? "Card image"}
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Header Image */}
      <div className="flex flex-col items-center">
        <span className="text-sm font-medium mb-1">Header Image</span>
        <div className="relative w-56 h-40 rounded-lg overflow-hidden bg-gray-100 shadow-sm">
          <Image
            src={booking.header_image ?? "/placeholder-activity.jpg"}
            alt={booking.name_en ?? "Header image"}
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Poster Image */}
      <div className="flex flex-col items-center">
        <span className="text-sm font-medium mb-1">Poster Image</span>
        <div className="relative w-56 h-40 rounded-lg overflow-hidden bg-gray-100 shadow-sm">
          <Image
            src={booking.poster_image ?? "/placeholder-activity.jpg"}
            alt={booking.name_en ?? "Poster image"}
            fill
            className="object-cover"
          />
        </div>
      </div>
    </div>
  </div>
</div>

    </main>
  );
}
