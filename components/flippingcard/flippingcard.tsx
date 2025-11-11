"use client";

import React from "react";
import type { newRoom } from "@/types/index";

interface CardProps {
  data: newRoom;
  isArabic: boolean;
}

const FlippingCard: React.FC<CardProps> = ({ data, isArabic }: CardProps) => {
  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      className="relative mx-auto w-full max-w-sm rounded-[2rem_0.5rem_2rem_0.5rem] border border-zinc-200 bg-white p-4 ring-4 ring-zinc-300/25 sm:p-6 overflow-hidden transform-gpu transition-transform duration-500 hover:scale-105 hover:rotate-1"
      style={{
        boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
      }}
    >
      <div className="flex flex-col gap-4">
        {/* صورة الغرفة */}
        <div className="relative overflow-hidden rounded-[2rem_0.5rem_2rem_0.5rem]">
          <img
            src={data.room_images[0]}
            alt={isArabic ? data.name_ar : data.name_en}
            width={500}
            height={375}
            className="aspect-[4/3] w-full bg-zinc-600 object-cover"
          />

          {/* شارة المميز */}
          <div className={`absolute bottom-4 ${isArabic ? "right-4" : "left-4"}`}>
            <span className="inline-flex items-center rounded-full bg-[#676e32] px-3 py-1 text-xs font-medium text-white">
              {isArabic ? "المميز" : "Superhost"}
            </span>
          </div>
        </div>

        {/* تفاصيل الغرفة */}
        <div>
          {/* الاسم والتقييم */}
          <div
            className={`flex items-center justify-between ${
              isArabic ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <h3 className="font-semibold text-zinc-900">
              {isArabic ? data.name_ar : data.name_en}
            </h3>
            <div className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="inline-block w-4 h-4 text-[#676e32]"
              >
                <path
                  fillRule="evenodd"
                  d="M8 1.75a.75.75 0 0 1 .692.462l1.41 3.393 3.664.293a.75.75 0 0 1 .428 1.317l-2.791 2.39.853 3.575a.75.75 0 0 1-1.12.814L7.998 12.08l-3.135 1.915a.75.75 0 0 1-1.12-.814l.852-3.574-2.79-2.39a.75.75 0 0 1 .427-1.318l3.663-.293 1.41-3.393A.75.75 0 0 1 8 1.75Z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm font-semibold text-zinc-700">4.9</span>
            </div>
          </div>

          {/* الوصف */}
          <p className="text-sm font-medium text-zinc-600">
            {isArabic ? data.description_ar : data.description_en}
          </p>

          {/* السعر والتواريخ */}
          <div
            className={`mt-5 flex items-center justify-between gap-4 ${
              isArabic ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div
              className={`flex items-baseline ${
                isArabic ? "space-x-reverse space-x-1" : "space-x-1"
              }`}
            >
              <span className="text-lg font-semibold text-zinc-900">
                {data.price} {isArabic ? "د.ا" : "JD"}
              </span>
              <span className="text-sm text-zinc-600">
                / {isArabic ? "الليلة" : "night"}
              </span>
            </div>

            <p className="text-sm text-zinc-600">
              {isArabic ? "15 – 20 ديسمبر" : "Dec 15 – 20"}
            </p>
          </div>
        </div>
      </div>

      {/* shine subtle عند hover */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 transition duration-500 rounded-[2rem_0.5rem_2rem_0.5rem] hover:opacity-40"
        />
      </div>
    </div>
  );
};

export default FlippingCard;
