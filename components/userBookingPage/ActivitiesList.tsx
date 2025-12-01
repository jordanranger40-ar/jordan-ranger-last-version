"use client";

import React from "react";
import { format } from "date-fns";
import Link from "next/link";
import { ActivityBookingWithDetails } from "@/types";
import { ar, enUS } from "date-fns/locale";
type Props = {
  bookings: ActivityBookingWithDetails[];
  locale?: string;
};

export default function ActivitiesList({ bookings, locale = "en" }: Props) {
  const isArabic = locale === "ar";

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
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{isArabic ? "الأنشطة" : "Activities"}</h2>
        <Link
          href="/activities/indoor-activities"
          className="text-sm text-[#676e32] hover:underline"
        >
          {isArabic ? "تصفح الأنشطة" : "Browse Activities"}
        </Link>
      </div>

      {bookings.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500 bg-white">
          {isArabic
            ? "لا توجد حجوزات أنشطة قادمة."
            : "No upcoming activity bookings."}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bookings.map((b) => {
            const title =
              isArabic
                ? b.name_ar ?? b.name_en ?? `Activity ${b.activity_id ?? b.id}`
                : b.name_en ?? b.name_ar ?? `Activity ${b.activity_id ?? b.id}`;

            const start = b.start_time ? new Date(b.start_time) : null;
            const qty = Number(b.quantity ?? 1);
            const unitPrice = Number(b.activity_price ?? b.booking_price ?? 0);
            const total = Number(b.booking_price ?? unitPrice * qty);

            return (
              <article
                key={b.id}
                className="bg-white rounded-xl border shadow-sm p-4 hover:shadow-md transition transform hover:-translate-y-1"
                role="article"
                aria-label={title}
                style={{ borderColor: "#e6e9d8" }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-md bg-[#f2f4e6] flex items-center justify-center text-[#676e32] font-bold text-lg">
                    {title.charAt(0) || "A"}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-800 truncate">
                      {title}
                    </h3>
                    <div className="text-sm text-gray-500 mt-1">
                      {formatDate(start!)}
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <div>
                    <div className="text-xs">{isArabic ? "السعر" : "Price"}</div>
                    <div className="font-semibold">{unitPrice.toFixed(2)}  {isArabic ? "أ.د" : "JOD"}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs">{isArabic ? "المجموع" : "Total"}</div>
                    <div className="font-semibold text-gray-900">
                      {total.toFixed(2)} {isArabic ? "أ.د" : "JOD"}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <Link
                    href={`/activities/${b.location_type_en}-activities/${b.slug}`}
                    className="text-sm text-[#676e32] font-medium hover:underline"
                  >
                    {isArabic ? "عرض النشاط" : "View activity"}
                  </Link>
                  <Link
                    href={`/my-bookings/activitiesBookings/${b.id}`}
                    className="text-sm bg-[#676e32] text-white px-3 py-1.5 rounded-md shadow-sm hover:opacity-90"
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
