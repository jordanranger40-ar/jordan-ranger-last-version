"use client";
import React from "react";

type Props = {
  currentStep: 1 | 2;
  locale: string;
};

export default function BookingProgressBar({ currentStep, locale }: Props) {
  const isArabic = locale === "ar";

  return (
    <div
      className="w-full flex justify-between items-center px-8 relative mb-8"
      dir={isArabic ? "rtl" : "ltr"}
    >
      {/* Step 1 */}
      <div className="flex flex-col items-center z-10">
        <div
          className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors duration-300 ${
            currentStep >= 1
              ? "bg-[#676e32] text-white border-[#676e32]"
              : "bg-white text-gray-500 border-gray-300"
          }`}
        >
          1
        </div>
        <span className="mt-2 text-sm text-gray-700">
          {isArabic ? "اختيار التاريخ" : "Select Dates"}
        </span>
      </div>

      {/* Step 2 */}
      <div className="flex flex-col items-center z-10">
        <div
          className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors duration-300 ${
            currentStep === 2
              ? "bg-[#676e32] text-white border-[#676e32]"
              : "bg-white text-gray-500 border-gray-300"
          }`}
        >
          2
        </div>
        <span className="mt-2 text-sm text-gray-700">
          {isArabic ? "تم التأكيد" : "Booking Confirmed"}
        </span>
      </div>

      {/* Connector line */}
      <div className="absolute top-5 left-1/2 transform -translate-x-1/2 w-[63%] sm:w-[75%] md:w-[83%] lg:w-[83%] xl:w-[82%] flex justify-between z-0">
        <div className="bg-gray-300 h-1 flex-1 mx-5 relative">
          <div
            className={`h-1 bg-[#676e32] transition-all duration-300`}
            style={{ width: currentStep === 1 ? "0%" : "100%" }}
          />
        </div>
      </div>
    </div>
  );
}
