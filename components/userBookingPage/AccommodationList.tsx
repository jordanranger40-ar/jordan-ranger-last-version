"use client";

import React from "react";
import { format } from "date-fns";
import Link from "next/link";
import { ar, enUS } from "date-fns/locale";
import { RoomBookingWithDetails } from "@/types";

type Props = {
  bookings: RoomBookingWithDetails[];
  locale?: string;
};

export default function AccommodationList({ bookings, locale = "en" }: Props) {
  const isArabic = locale === "ar";
  const msPerDay = 1000 * 60 * 60 * 24;
  console.log("bookings room: ",bookings);
  
  const formatDate = (d?: string | Date) => {
    if (!d) return "—";
    const date = typeof d === "string" ? new Date(d) : d;
    try {
      return format(date, "PPP p", { locale: isArabic ? ar : enUS });
    } catch {
      return date.toLocaleString();
    }
  };

  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">
          {isArabic ? "الإقامة" : "Accommodation"}
        </h2>
        <Link
          href="/accommodation"
          className="text-sm text-[#676e32] hover:underline"
        >
          {isArabic ? "تصفح الغرف" : "Browse Accommodation"}
        </Link>
      </div>

      {/* EMPTY STATE */}
      {bookings.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500 bg-white">
          {isArabic
            ? "لا توجد حجوزات غرف قادمة."
            : "No upcoming room bookings."}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bookings.map((rb) => {
            const title = isArabic
              ? rb.name_ar ?? rb.name_en ?? `Room ${rb.room_id ?? rb.id}`
              : rb.name_en ?? rb.name_ar ?? `Room ${rb.room_id ?? rb.id}`;

            const start = rb.start_time ? new Date(rb.start_time) : null;
            const end = rb.end_time ? new Date(rb.end_time) : null;

            let nights = 1;
            if (start && end) {
              const diff = Math.max(0, end.getTime() - start.getTime());
              nights = Math.max(1, Math.ceil(diff / msPerDay));
            }

            const total = Number(rb.price ?? 0);
            const perNight =
              total && nights > 0
                ? Number((total / nights).toFixed(2))
                : Number(rb.booking_price ?? 0);

            return (
              <article
                key={rb.id}
                className="bg-white rounded-xl border shadow-sm p-4 hover:shadow-md transition transform hover:-translate-y-1"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={rb.cover_image ?? "/images/placeholder-room.jpg"}
                    alt={title}
                    className="w-20 h-16 object-cover rounded-md shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-800 truncate">
                      {title}
                    </h3>
                    <div className="text-sm text-gray-500 mt-1">
                      {formatDate(start!)} — {formatDate(end!)}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-gray-500">
                      {isArabic ? "ليالي" : "Nights"}
                    </div>
                    <div className="font-medium">{nights}</div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <div>
                    <div className="text-xs">{isArabic ? "لكل ليلة" : "Per night"}</div>
                    <div className="font-semibold">{perNight.toFixed(2)} {isArabic ?"أ.د" :"JOD"}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs">{isArabic ? "المجموع" : "Total"}</div>
                    <div className="font-semibold text-gray-900">{total.toFixed(2)} {isArabic ?"أ.د" :"JOD"}</div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <Link
                    href={`/Accommodation/${rb.room_type_en.charAt(0).toUpperCase() + rb.room_type_en.slice(1)}/${rb.slug ?? ""}`}
                    className="text-sm text-[#676e32] hover:underline"
                  >
                    {isArabic ? "عرض الغرفة" : "View room"}
                  </Link>
                  <Link
                    href={`/my-bookings/accommodationBookings/${rb.id}`}
                    className="text-sm bg-[#676e32] text-white px-3 py-1.5 rounded-md"
                  >
                    {isArabic ? "تفاصيل الحجز" : "Booking Details"}
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
