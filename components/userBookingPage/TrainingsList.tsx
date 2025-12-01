"use client";

import React from "react";
import { format } from "date-fns";
import Link from "next/link";
import { ar, enUS } from "date-fns/locale";
import { TrainingBookingWithDetails } from "@/types";

type Props = {
  bookings: TrainingBookingWithDetails[];
  locale?: string;
};

export default function TrainingsList({ bookings, locale = "en" }: Props) {
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
 console.log("training bookings: ",bookings);
 

  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{isArabic ? "التدريبات" : "Trainings"}</h2>
        <Link href="/training/schools-training" className="text-sm text-[#676e32] hover:underline">
          {isArabic ? "تصفح التدريبات" : "Browse Trainings"}
        </Link>
      </div>

      {/* EMPTY STATE */}
      {bookings.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500 bg-white">
          {isArabic
            ? "لا توجد حجوزات تدريب قادمة."
            : "No upcoming training bookings."}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bookings.map((tb) => {
            const title = isArabic
              ? tb.name_ar ?? tb.name_en ?? `Training ${tb.training_id ?? tb.id}`
              : tb.name_en ?? tb.name_ar ?? `Training ${tb.training_id ?? tb.id}`;

            const start = tb.start_date
              ? new Date(tb.start_date)
              : tb.created_at
              ? new Date(tb.created_at)
              : null;
            const end = tb.end_date ? new Date(tb.end_date) : null;
            const qty = Number(tb.quantity ?? 1);
            const unitPrice = Number(tb.price ?? tb.training_price ?? 0);
            const total = Number(tb.price ?? unitPrice * qty);

            return (
              <article
                key={tb.id}
                className="bg-white rounded-xl border shadow-sm p-4 hover:shadow-md transition transform hover:-translate-y-1"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-md bg-[#f2f4e6] flex items-center justify-center text-[#676e32] font-bold text-lg">
                    {title.charAt(0) || "T"}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-800 truncate">{title}</h3>
                    <div className="text-sm text-gray-500 mt-1">
                      {formatDate(start!)}
                      {end ? ` — ${formatDate(end)}` : ""}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-gray-500">{isArabic ? "الكمية" : "Quantity"}</div>
                    <div className="font-medium">{qty}</div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <div>
                    <div className="text-xs">{isArabic ? "السعر" : "Price"}</div>
                    <div className="font-semibold">{unitPrice.toFixed(2)}  {isArabic ? "أ.د" : "JOD"}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs">{isArabic ? "المجموع" : "Total"}</div>
                    <div className="font-semibold text-gray-900">{total.toFixed(2)}  {isArabic ? "أ.د" : "JOD"}</div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <Link
                    href={`/training/${tb.category_en.toLowerCase().replace(" ","-")}/${tb.slug ?? ""}`}
                    className="text-sm text-[#676e32] hover:underline"
                  >
                    {isArabic ? "عرض التدريب" : "View training"}
                  </Link>
                  <Link
                    href={`/my-bookings/trainingBookings/${tb.id}`}
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
