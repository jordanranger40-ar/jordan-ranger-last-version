// components/userBookingPage/roomComponents/RoomDetails.tsx
"use client";

import React from "react";
import { RoomBookingWithDetails } from "@/types/index";

interface Props {
  data: RoomBookingWithDetails;
  locale?: string;
}

export default function RoomDetails({ data, locale }: Props) {
  const booking = data;
  const isArabic = locale === "ar";

  // Translations
  const t = {
    roomDetails: isArabic ? "تفاصيل الغرفة" : "Room Details",
    roomName: isArabic ? "اسم الغرفة:" : "Room Name:",
    description: isArabic ? "الوصف:" : "Description:",
    roomType: isArabic ? "نوع الغرفة:" : "Room Type:",
    price: isArabic ? "السعر:" : "Price:",
    perDay: isArabic ? "دينار/يوم" : "JOD/Day",
    noDescription: isArabic ? "لا يوجد وصف" : "No description",
  };

  return (
    <div className="border rounded-2xl shadow-sm p-6 bg-white" dir={isArabic ? "rtl" : "ltr"}>
      <h2 className="text-lg font-semibold mb-4 text-[#676e32]">{t.roomDetails}</h2>

      <div className="flex flex-col md:flex-row items-start gap-4">
        {/* Details */}
        <div className="flex-1 space-y-2 text-sm">
          <div>
            <span className="text-gray-600 font-medium">{t.roomName}</span>{" "}
            {isArabic ? booking.name_ar ?? booking.name_en ?? "—" : booking.name_en ?? "—"}
          </div>
          <div>
            <span className="text-gray-600 font-medium">{t.description}</span>{" "}
            {isArabic
              ? booking.description_ar ?? booking.description_en ?? t.noDescription
              : booking.description_en ?? t.noDescription}
          </div>
          <div>
            <span className="text-gray-600 font-medium">{t.roomType}</span>{" "}
            {isArabic ? booking.room_type_ar ?? booking.room_type_en ?? "—" : booking.room_type_en ?? "—"}
          </div>
          <div>
            <span className="text-gray-600 font-medium">{t.price}</span>{" "}
            {typeof booking.price === "number"
              ? `${booking.price} ${t.perDay}`
              : "—"}
          </div>
        </div>

        {/* Image */}
        <div className="w-full md:w-56 h-40 rounded-lg overflow-hidden bg-gray-100 shadow-sm">
          <img
            src={
              booking.cover_image ??
              (booking.room_images && booking.room_images[0]) ??
              "/images/placeholder-room.jpg"
            }
            alt={isArabic ? booking.name_ar ?? booking.name_en : booking.name_en ?? "Room image"}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Gallery */}
      {booking.room_images && booking.room_images.length > 0 && (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          {booking.room_images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`${isArabic ? booking.name_ar ?? booking.name_en : booking.name_en ?? "Room"} ${idx + 1}`}
              className="w-full h-28 object-cover rounded-lg shadow-sm"
            />
          ))}
        </div>
      )}
    </div>
  );
}
