import React from "react";
import Link from "next/link";
import { getBookingById } from "@/app/models/db/lib/services/room_booking";
import { RoomBookingWithDetails } from "@/types";

type Props = {
  params: {
    id: string;
    locale?: string;
  };
};

export default async function Page({ params }: Props) {
  const bookingId = params.id;
  const res = await getBookingById(bookingId);
  console.log("ressdd: ", res);

  const booking = res?.data as RoomBookingWithDetails | undefined;

  if (!booking) {
    return (
      <main className="p-6">
        <Link href={`/${params.locale ?? ""}/admin/dashboard/roomsBooking`}>
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
          href={`/${params.locale ?? ""}/admin/dashboard/roomsBooking`}
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
              <dt className="text-gray-600">Duration:</dt>
              <dd>
                {Math.ceil(
                  (new Date(booking.end_time).getTime() -
                    new Date(booking.start_time).getTime()) /
                    (1000 * 60 * 60 * 24)
                )}{" "}
                {Math.ceil(
                  (new Date(booking.end_time).getTime() -
                    new Date(booking.start_time).getTime()) /
                    (1000 * 60 * 60 * 24)
                ) === 1
                  ? "day"
                  : "days"}
              </dd>
            </div>

            <div className="flex justify-between">
              <dt className="text-gray-600">Total Price:</dt>
              <dd>{booking.booking_price} JOD</dd>
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

      {/* Room Details Card (full width) */}
      <div className="border rounded-2xl shadow-sm p-6 bg-white">
        <h2 className="text-lg font-semibold mb-4 text-[#676e32]">
          Room Details
        </h2>

        <div className="flex flex-col md:flex-row items-start gap-4">
          <div className="flex-1 space-y-2 text-sm">
            <div>
              <span className="text-gray-600 font-medium">Room Name:</span>{" "}
              {booking.name_en ?? "—"}
            </div>
            <div>
              <span className="text-gray-600 font-medium">Description:</span>{" "}
              {booking.description_en ?? "No description"}
            </div>
            <div>
              <span className="text-gray-600 font-medium">Room Type:</span>{" "}
              {booking.room_type_en ?? "—"}
            </div>
            <div>
              <span className="text-gray-600 font-medium">Price:</span>{" "}
              {typeof booking.price === "number"
                ? `${booking.price} JOD/Day`
                : "—"}
            </div>
            <div>
              <span className="text-gray-600 font-medium">Slug:</span>{" "}
              {booking.slug ?? "—"}
            </div>
          </div>

          {/* Image */}
          <div className="w-full md:w-56 h-40 rounded-lg overflow-hidden bg-gray-100 shadow-sm">
            <img
              src={
                booking.cover_image ??
                (booking.room_images && booking.room_images[0]) ??
                "/placeholder-room.jpg"
              }
              alt={booking.name_en ?? "Room image"}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Gallery */}
        {booking.room_images && booking.room_images.length > 0 && (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
            {booking.room_images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`${booking.name_en ?? "Room"} ${idx + 1}`}
                className="w-full h-28 object-cover rounded-lg shadow-sm"
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
