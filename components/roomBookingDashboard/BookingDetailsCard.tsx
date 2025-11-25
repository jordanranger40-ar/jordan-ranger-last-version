"use client";

import React, { useTransition } from "react";
import { RoomBookingWithDetails } from "@/types";
import { updateBookingStatus } from "./(fetch)/updateBookingStatus";
import { toast } from "sonner"; 

interface Props {
  data: RoomBookingWithDetails;
}

export default function BookingDetailsCard({ data }: Props) {
  const booking = data;
  const [isPending, startTransition] = useTransition();

  const formatDateTime = (value?: string | Date) => {
    if (!value) return "—";
    const d = typeof value === "string" ? new Date(value) : value;
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleString("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const handleStatusChange = () => {
    startTransition(async () => {
      try {
        await updateBookingStatus(!booking.is_confirmed, booking.id ?? "");

        toast.success(
          `Booking marked as ${
            !booking.is_confirmed ? "confirmed" : "unconfirmed"
          }.`
        );
      } catch (_error) {
        toast.error("Could not update booking status. Please try again later.");
      }
    });
  };

  return (
    <div className="border rounded-2xl shadow-sm p-5 bg-white">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-[#676e32]">
          Booking Information
        </h2>

        {/* Status Toggle Button */}
        <button
          onClick={handleStatusChange}
          disabled={isPending}
          className={`px-4 py-1 text-sm rounded transition ${
            booking.is_confirmed
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-green-600 hover:bg-green-700 text-white"
          } ${isPending ? "opacity-60 cursor-not-allowed" : ""}`}
        >
          {isPending
            ? "Updating..."
            : booking.is_confirmed
            ? "Unconfirm Booking"
            : "Confirm Booking"}
        </button>
      </div>

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
            days
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
  );
}
