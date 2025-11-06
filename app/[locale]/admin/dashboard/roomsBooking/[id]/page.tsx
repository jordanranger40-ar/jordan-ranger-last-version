// app/[locale]/admin/dashboard/roomsBooking/[id]/page.tsx
import React from "react";
import Link from "next/link";
import { getBookingById } from "@/app/models/db/lib/services/room_booking"; // adjust the path to where your function lives
import { RoomBookingWithDetails } from "@/types"; // adjust if your types path is different

type Props = {
  params: {
    id: string;
    locale?: string;
  };
};

export default async function Page({ params }: Props) {
  const bookingId = params.id;

  // call the server-side helper - this is an async server component
  const res = await getBookingById(bookingId);

  // assuming getBookingById returns { data, message, status }
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

  const formatDate = (value?: string | Date) => {
    if (!value) return "—";
    const d = typeof value === "string" ? new Date(value) : value;
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("en-GB", { dateStyle: "medium" });
  };

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Booking Details</h1>
          <p className="text-sm text-gray-500">ID: {booking.booking_id ?? "—"}</p>
        </div>
        <div className="space-x-2">
          <Link
            href={`/${params.locale ?? ""}/admin/dashboard/roomsBooking`}
            className="text-sm underline"
          >
            ← Back to bookings
          </Link>
        </div>
      </div>

      {/* Booking meta */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="p-4 border rounded-lg">
          <h3 className="text-sm font-semibold mb-2">Booking</h3>
          <dl className="text-sm">
            <div className="flex justify-between py-1">
              <dt className="text-gray-600">Created At</dt>
              <dd>{formatDateTime(booking.created_at)}</dd>
            </div>
            <div className="flex justify-between py-1">
              <dt className="text-gray-600">Start</dt>
              <dd>{formatDateTime(booking.start_time)}</dd>
            </div>
            <div className="flex justify-between py-1">
              <dt className="text-gray-600">End</dt>
              <dd>{formatDateTime(booking.end_time)}</dd>
            </div>
            <div className="flex justify-between py-1">
              <dt className="text-gray-600">Confirmed</dt>
              <dd>
                <span
                  className={`px-2 py-0.5 rounded text-xs font-medium ${
                    booking.is_confirmed ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100"
                  }`}
                >
                  {booking.is_confirmed ? "Yes" : "No"}
                </span>
              </dd>
            </div>
            <div className="flex justify-between py-1">
              <dt className="text-gray-600">Deleted</dt>
              <dd>{booking.is_deleted ? "Yes" : "No"}</dd>
            </div>
          </dl>
        </div>

        {/* User */}
        <div className="p-4 border rounded-lg">
          <h3 className="text-sm font-semibold mb-2">User</h3>
          <dl className="text-sm">
            <div className="flex justify-between py-1">
              <dt className="text-gray-600">Name</dt>
              <dd>
                {booking.first_name ?? "—"} {booking.last_name ?? ""}
              </dd>
            </div>
            <div className="flex justify-between py-1">
              <dt className="text-gray-600">Email</dt>
              <dd>
                {booking.email ? (
                  <a
                    href={`mailto:${booking.email}`}
                    className="underline text-[#676e32] hover:text-[#a2b41d]"
                  >
                    {booking.email}
                  </a>
                ) : (
                  "—"
                )}
              </dd>
            </div>
            <div className="flex justify-between py-1">
              <dt className="text-gray-600">User ID</dt>
              <dd>{booking.booking_id ?? "—"}</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Room */}
      <section className="p-4 border rounded-lg mb-6">
        <div className="flex items-start gap-4">
          <div className="w-36 h-24 bg-gray-100 rounded overflow-hidden ">
            {/* show cover image or first room image */}
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

          <div className="flex-1">
            <h2 className="text-lg font-semibold">
              {booking.name_en ?? "—"}
            </h2>
            <p className="text-sm text-gray-600 mb-2">
              {booking.description_en ?? "No description"}
            </p>

            <div className="flex flex-wrap gap-4 text-sm">
              <div>
                <span className="text-gray-600">Room ID</span>
                <div>{booking.booking_id ?? "—"}</div>
              </div>

              <div>
                <span className="text-gray-600">Type</span>
                <div>{booking.room_type_en ?? "—"}</div>
              </div>

              <div>
                <span className="text-gray-600">Price</span>
                <div>
                  {typeof booking.price === "number"
                    ? `${booking.price}`
                    : "—"}
                </div>
              </div>

              <div>
                <span className="text-gray-600">Slug</span>
                <div>{booking.slug ?? "—"}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Optional: gallery of room images */}
        {booking.room_images && booking.room_images.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-2">
            {booking.room_images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`${booking.name_en ?? "room"} - ${idx + 1}`}
                className="w-full h-28 object-cover rounded"
              />
            ))}
          </div>
        )}
      </section>

      <section className="text-sm text-gray-600">
        <h3 className="font-semibold mb-2">Raw / advanced info</h3>
        <pre className="bg-gray-50 p-3 rounded text-xs overflow-auto">
          {JSON.stringify(booking, null, 2)}
        </pre>
      </section>
    </main>
  );
}
