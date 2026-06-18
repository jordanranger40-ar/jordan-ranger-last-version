"use client";
import React from "react";

type Props = {
  currentStep: 1 | 2;
  locale: string; // "ar" or "en"
};

export default function BookingProgressBar({ currentStep, locale }: Props) {
  const isArabic = locale === "ar";

  const steps = [
    { number: 1, label: isArabic ? "اختر التواريخ" : "Select Dates" },
    { number: 2, label: isArabic ? "تم تأكيد الحجز" : "Booking Confirmed" },
  ];

  return (
    <div 
      className="w-full flex justify-between items-start relative mb-8 px-4 sm:px-8" 
      dir={isArabic ? "rtl" : "ltr"}
    >
      {steps.map((step, index) => {
        const isActive = currentStep === step.number;
        const isCompleted = currentStep > step.number;

        return (
          <div key={step.number} className="flex flex-col items-center relative flex-1">
            {/* Circle */}
            <div
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 flex items-center justify-center transition-colors duration-300 text-sm sm:text-base font-semibold z-10 ${
                isActive || isCompleted
                  ? "bg-[#676e32] text-white border-[#676e32]"
                  : "bg-white text-gray-500 border-gray-300"
              }`}
            >
              {step.number}
            </div>

            {/* Label */}
            <span className="mt-2 text-xs sm:text-sm text-gray-700 text-center max-w-[100px] sm:max-w-none px-1 font-medium shared-label">
              {step.label}
            </span>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div
                className={`absolute top-5 sm:top-6 w-full z-0 -translate-y-1/2 ${
                  isArabic ? "right-1/2" : "left-1/2"
                }`}
              >
                {/* Outer progress track */}
                <div className="bg-gray-300 h-1 w-full raw-line">
                  {/* Inner active progress indicator */}
                  <div
                    className="h-1 bg-[#676e32] transition-all duration-300"
                    style={{ width: currentStep > step.number ? "100%" : "0%" }}
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}