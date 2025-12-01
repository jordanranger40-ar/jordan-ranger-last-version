"use client";

import React from "react";
import { ActivityBookingWithDetails } from "@/types";
import { MapPin, Users, Calendar } from "lucide-react";

interface Props {
  data: ActivityBookingWithDetails;
  locale?: string;
}

export default function ActivityDetails({ data, locale }: Props) {
  const booking = data;
  const isArabic = locale === "ar";

  // Translation strings
  const t = {
    title: isArabic ? "تفاصيل النشاط" : "Activity Details",
    name: isArabic ? "اسم النشاط" : "Activity Name",
    description: isArabic ? "الوصف" : "Description",
    locationType: isArabic ? "نوع الموقع" : "Location type",
    capacity: isArabic ? "السعة" : "Capacity",
    price: isArabic ? "السعر" : "Price",
  };

  return (
    <div className="bg-white border rounded-2xl shadow p-6" dir={isArabic ? "rtl" : "ltr"}>
      <h3 className="text-lg font-semibold mb-4 text-[#676e32]">{t.title}</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 text-sm space-y-3">
          {/* Activity Name */}
          <div>
            <div className="text-xs text-gray-500">{t.name}</div>
            <div className="font-medium text-gray-900">
              {isArabic ? booking.name_ar ?? booking.name_en ?? "—" : booking.name_en ?? "—"}
            </div>
          </div>

          {/* Description */}
          <div>
            <div className="text-xs text-gray-500">{t.description}</div>
            <div className="text-sm text-gray-700">
              {isArabic ? booking.description_ar ?? booking.description_en ?? "—" : booking.description_en ?? "—"}
            </div>
          </div>

          {/* Meta info */}
          <div className="flex items-center gap-6 text-sm text-gray-700 mt-2">
            {/* Location Type */}
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#676e32]" />
              <div>
                <div className="text-xs text-gray-500">{t.locationType}</div>
                <div className="text-sm md:text-base">
                  {isArabic ? booking.location_type_ar ?? booking.location_type_en ?? "—" : booking.location_type_en ?? "—"}
                </div>
              </div>
            </div>

            {/* Capacity */}
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#676e32]" />
              <div>
                <div className="text-xs text-gray-500">{t.capacity}</div>
                <div className="text-sm md:text-base">{booking.capacity ?? "—"}</div>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#676e32]" />
              <div>
                <div className="text-xs text-gray-500">{t.price}</div>
                <div className="text-sm md:text-base">
                  {Number(booking.activity_price ?? 0).toFixed(2)} JOD
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="shrink-0">
          <div className="w-full h-36 bg-gray-100 rounded-md overflow-hidden">
            <img
              src={booking.header_image ?? booking.card_image ?? booking.poster_image ?? "/images/placeholder.jpg"}
              alt={isArabic ? booking.name_ar ?? booking.name_en ?? "صورة النشاط" : booking.name_en ?? "activity image"}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
