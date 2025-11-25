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
    <div className="w-full flex justify-between items-center px-8 relative mb-8" dir={isArabic ? "rtl" : "ltr"}>
      {steps.map((step, index) => {
        const isActive = currentStep === step.number;
        const isCompleted = currentStep > step.number;

        return (
          <div key={step.number} className="flex flex-col items-center z-10 relative flex-1">
            {/* Circle */}
            <div
              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors duration-300 ${
                isActive || isCompleted
                  ? "bg-[#676e32] text-white border-[#676e32]"
                  : "bg-white text-gray-500 border-gray-300"
              }`}
            >
              {step.number}
            </div>

            {/* Label */}
            <span className="mt-2 text-sm text-gray-700">{step.label}</span>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div
                className={`absolute top-5 ${isArabic ? "left-[-50%]" : "right-[-50%]"} w-full flex justify-center -translate-y-1/2 z-0`}
              >
                <div className="bg-gray-300 h-1 flex-1 mx-5 relative">
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
