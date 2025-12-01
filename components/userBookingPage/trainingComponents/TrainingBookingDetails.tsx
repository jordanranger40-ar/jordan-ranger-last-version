"use client";

import React from "react";
import { TrainingBookingWithDetails } from "@/types";
import { CalendarDays, Clock, Users, Tag, Clock3 } from "lucide-react";

interface Props {
  data: TrainingBookingWithDetails;
  locale?: string;
}

export default function TrainingBookingDetails({ data, locale }: Props) {
  const booking = data;
  const isArabic = locale === "ar";

  // Translations
  const t = {
    start: isArabic ? "البداية" : "Start",
    end: isArabic ? "النهاية" : "End",
    quantity: isArabic ? "العدد" : "Quantity",
    unitPrice: isArabic ? "سعر الوحدة" : "Unit Price",
    total: isArabic ? "الإجمالي" : "Total",
    duration: isArabic ? "المدة" : "Duration",
    confirmed: isArabic ? "مؤكد" : "Confirmed",
    pending: isArabic ? "قيد الانتظار" : "Pending",
  };

  const formatDateTime = (value?: string | Date) => {
    if (!value) return "—";
    const d = typeof value === "string" ? new Date(value) : value;
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleString(isArabic ? "ar-EG" : undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const durationText = (() => {
    if (!booking.start_date || !booking.end_date) return "—";
    const start = new Date(booking.start_date).getTime();
    const end = new Date(booking.end_date).getTime();
    const diffMs = Math.max(0, end - start);
    const hours = Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100;
    if (hours >= 24) {
      const days = Math.floor(hours / 24);
      const rem = Math.round((hours % 24) * 100) / 100;
      return rem ? `${days}d ${rem}h` : `${days}d`;
    }
    return `${hours}${isArabic ? "ساعة" : "h"}`;
  })();

  const unitPrice = Number(booking.training_price ?? 0);
  const total = Number(booking.price ?? unitPrice * (booking.quantity ?? 1));

  return (
    <div className="bg-white border rounded-2xl shadow p-4 sm:p-6" dir={isArabic ? "rtl" : "ltr"}>
      <div className="flex flex-col md:flex-row gap-4">
        {/* IMAGE */}
        <div className="w-full md:w-32 h-32 md:h-24 rounded-lg overflow-hidden bg-gray-100 shrink-0">
          <img
            src={booking.card_image ?? "/placeholder-training.jpg"}
            alt={isArabic ? booking.name_ar ?? "صورة التدريب" : booking.name_en ?? "Training image"}
            className="w-full h-full object-cover"
          />
        </div>

        {/* CONTENT */}
        <div className="flex-1 min-w-0">
          {/* HEADER */}
          <div className="flex flex-col sm:flex-row justify-between gap-2">
            <div className="min-w-0">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 wrap-break-word">
                {isArabic ? booking.name_ar ?? booking.name_en ?? "تدريب" : booking.name_en ?? "Training"}
              </h2>
              <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                {isArabic ? booking.description_ar ?? booking.description_en ?? "—" : booking.description_en ?? "—"}
              </p>
            </div>

            {/* STATUS */}
            <div className="sm:text-right">
              <span
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium w-fit self-start
                ${booking.is_confirmed ? "bg-green-50 text-green-800" : "bg-yellow-50 text-yellow-800"}`}
              >
                {booking.is_confirmed ? t.confirmed : t.pending}
              </span>
            </div>
          </div>

          {/* META DATA */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-[#676e32]" />
              <div>
                <div className="text-xs text-gray-500">{t.start}</div>
                <div className="font-medium">{formatDateTime(booking.start_date)}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#676e32]" />
              <div>
                <div className="text-xs text-gray-500">{t.end}</div>
                <div className="font-medium">{formatDateTime(booking.end_date)}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#676e32]" />
              <div>
                <div className="text-xs text-gray-500">{t.quantity}</div>
                <div className="font-medium wrap-break-word">{booking.quantity ?? 1}</div>
              </div>
            </div>
          </div>

          {/* PRICE ROW */}
          <div className="mt-4 border-t pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
            <div className="flex items-center gap-3">
              <Tag className="w-4 h-4 text-[#676e32]" />
              <div>
                <div className="text-xs text-gray-500">{t.unitPrice}</div>
                <div className="font-semibold">{unitPrice.toFixed(2)} {isArabic ? "أ.د" : "JOD"}</div>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <div className="text-xs text-gray-500">{t.total}</div>
              <div className="text-2xl font-bold text-gray-900 wrap-break-word">{total.toFixed(2)} {isArabic ? "أ.د" : "JOD"}</div>
            </div>
          </div>

          {/* DURATION */}
          <div className="mt-3 text-sm text-gray-600 flex flex-row items-center gap-1.5">
            <Clock3 className="w-4 h-4 text-[#676e32]" />
            {t.duration}: <span className="font-medium text-gray-800">{durationText}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
