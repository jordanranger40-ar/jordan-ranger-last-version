"use client";

import React from "react";
import { TrainingBookingWithDetails } from "@/types";
import { MapPin,  Calendar } from "lucide-react";

interface Props {
  data: TrainingBookingWithDetails;
  locale?: string;
}

export default function TrainingDetails({ data, locale }: Props) {
  const booking = data;
  const isArabic = locale === "ar";

  // Translation strings
  const t = {
    title: isArabic ? "تفاصيل التدريب" : "Training Details",
    name: isArabic ? "اسم التدريب" : "Training Name",
    description: isArabic ? "الوصف" : "Description",
    category: isArabic ? "نوع التدريب" : "Training Type",
    price: isArabic ? "السعر" : "Price",
  };

  return (
    <div
      className="bg-white border rounded-2xl shadow p-6"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <h3 className="text-lg font-semibold mb-4 text-[#676e32]">{t.title}</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Training Info */}
        <div className="md:col-span-2 text-sm space-y-3">
          {/* Training Name */}
          <div>
            <div className="text-xs text-gray-500">{t.name}</div>
            <div className="font-medium text-gray-900">
              {isArabic
                ? booking.name_ar ?? booking.name_en ?? "—"
                : booking.name_en ?? "—"}
            </div>
          </div>

          {/* Description */}
          <div>
            <div className="text-xs text-gray-500">{t.description}</div>
            <div className="text-sm text-gray-700">
              {isArabic
                ? booking.description_ar ?? booking.description_en ?? "—"
                : booking.description_en ?? "—"}
            </div>
          </div>

          {/* Meta info */}
          <div className="flex items-center gap-6 text-sm text-gray-700 mt-2">
            {/* Training Type / Category */}
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#676e32]" />
              <div>
                <div className="text-xs text-gray-500">{t.category}</div>
                <div className="text-sm md:text-base">
                  {isArabic
                    ? booking.category_ar ?? booking.category_en ?? "—"
                    : booking.category_en ?? "—"}
                </div>
              </div>
            </div>
            {/* Price */}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#676e32]" />
              <div>
                <div className="text-xs text-gray-500">{t.price}</div>
                <div className="text-sm md:text-base">
                  {Number(booking.training_price ?? 0).toFixed(2)}{" "}
                  {isArabic ? "أ.د" : "JOD"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Training Image */}
        <div className="shrink-0">
          <div className="w-full h-36 bg-gray-100 rounded-md overflow-hidden">
            <img
              src={
                booking.header_image ??
                booking.card_image ??
                booking.post_image ??
                "/images/placeholder-training.jpg"
              }
              alt={
                isArabic
                  ? booking.name_ar ?? booking.name_en ?? "صورة التدريب"
                  : booking.name_en ?? "training image"
              }
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
