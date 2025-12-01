"use client";

import React from "react";
import {  RoomBookingWithDetails } from "@/types";
import {  Mail } from "lucide-react";

interface Props {
  data: RoomBookingWithDetails;
  locale?: string;
}

export default function RoomBookingUserDetails({ data, locale }: Props) {
  const booking = data;
  const isArabic = locale === "ar";

  // Translation strings
  const t = {
    bookingHolder: isArabic ? "حامل الحجز" : "Booking holder",
    email: isArabic ? "البريد الإلكتروني" : "Email",
    phone: isArabic ? "الهاتف" : "Phone",
    bookingId: isArabic ? "رقم الحجز" : "Booking ID",
  };

  const initials = `${booking.first_name?.[0] ?? ""}${booking.last_name?.[0] ?? ""}`.toUpperCase();

  return (
    <div className="bg-white border rounded-2xl shadow p-5" dir={isArabic ? "rtl" : "ltr"} >
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-lg bg-[#f2f4e6] flex items-center justify-center text-[#676e32] font-bold text-xl">
          {initials || "U"}
        </div>
        <div>
          <div className="text-lg font-semibold text-gray-900">
            {booking.first_name ?? "—"} {booking.last_name ?? ""}
          </div>
          <div className="text-sm text-gray-500 mt-1">{t.bookingHolder}</div>
        </div>
      </div>

      <div className="mt-4 space-y-3 text-sm">
        {/* Email */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-600">
            <Mail className="w-4 h-4 text-gray-400" />
            <span>{t.email}</span>
          </div>
          <div>
            {booking.email ? (
              <a href={`mailto:${booking.email}`} className="text-[#676e32] font-medium underline">
                {booking.email}
              </a>
            ) : (
              <span className="text-gray-500">—</span>
            )}
          </div>
        </div>

        {/* Booking ID */}
        <div className="pt-2 border-t text-sm text-gray-600">
          <div className="font-medium text-gray-800">{t.bookingId}</div>
          <div className="text-xs text-gray-500">{booking.id}</div>
        </div>
      </div>
    </div>
  );
}
