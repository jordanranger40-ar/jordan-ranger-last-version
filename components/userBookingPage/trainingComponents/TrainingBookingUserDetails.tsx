"use client";

import React from "react";
import { TrainingBookingWithDetails } from "@/types";

interface Props {
  data: TrainingBookingWithDetails;
  locale?: string;
}

export default function TrainingUserDetails({ data, locale }: Props) {
  const booking = data;
  const isArabic = locale === "ar";

  return (
    <div className="bg-white border rounded-2xl shadow p-4 sm:p-6" dir={isArabic ? "rtl" : "ltr"}>
      <h2 className="text-lg font-semibold mb-4 text-[#676e32]">
        {isArabic ? "معلومات المستخدم" : "User Information"}
      </h2>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-gray-600">{isArabic ? "الاسم:" : "Name:"}</dt>
          <dd className="ml-2">{booking.first_name ?? "—"} {booking.last_name ?? ""}</dd>
        </div>

        <div className="flex justify-between">
          <dt className="text-gray-600">{isArabic ? "البريد الإلكتروني:" : "Email:"}</dt>
          <dd className="ml-2">
            {booking.email ? (
              <a
                href={`mailto:${booking.email}`}
                className="underline text-[#676e32] hover:text-[#7d8d07]"
              >
                {booking.email}
              </a>
            ) : "—"}
          </dd>
        </div>

        <div className="flex justify-between">
          <dt className="text-gray-600">{isArabic ? "معرف المستخدم:" : "User ID:"}</dt>
          <dd className="ml-2">{booking.user_id ?? "—"}</dd>
        </div>
      </dl>
    </div>
  );
}
