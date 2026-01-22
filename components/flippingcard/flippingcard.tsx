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
      <div className="flex flex-col gap-4" > 
        {/* صورة الغرفة */}
        <div className="relative overflow-hidden rounded-[2rem_0.5rem_2rem_0.5rem]">
          <img
            src={data.room_images[0]}
            alt={isArabic ? data.name_ar : data.name_en}
            width={500}
            height={375}
            className="aspect-4/3 w-full bg-zinc-600 object-cover"
          />

         
        </div>

        {/* تفاصيل الغرفة */}
        <div>
          {/* الاسم والتقييم */}
          <div
            className={`flex items-center justify-between `}
          >
            <h3 className="font-semibold text-zinc-900">
              {isArabic ? data.name_ar : data.name_en}
            </h3>
           
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

          
          </div>
        </div>
      </div>

      {/* shine subtle عند hover */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-0 w-full h-full bg-linear-to-tr from-white/0 via-white/10 to-white/0 opacity-0 transition duration-500 rounded-[2rem_0.5rem_2rem_0.5rem] hover:opacity-40"
        />
      </div>
    </div>
  );
};

export default FlippingCard;
