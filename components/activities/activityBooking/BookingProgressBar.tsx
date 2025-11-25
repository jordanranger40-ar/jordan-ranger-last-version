"use client";
import React from "react";

interface BookingProgressBarProps {
  currentStep: number;
  locale: string; 
}

export default function BookingProgressBar({
  currentStep,
  locale,
}: BookingProgressBarProps) {
  const isArabic = locale === "ar";

  const steps = [
    { number: 1, label: isArabic ? "التحقق" : "Checking" },
    { number: 2, label: isArabic ? "الحجز" : "Booking" },
    { number: 3, label: isArabic ? "الملخص" : "Summary" },
  ];

  return (
    <div
      className="w-full flex justify-center mb-6"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className="relative flex items-center justify-between w-full max-w-2xl">
        {steps.map((step, index) => {
          const isActive = currentStep === step.number;
          const isCompleted = currentStep > step.number;

          return (
            <div
              key={step.number}
              className="relative flex flex-col items-center flex-1"
            >
              {/* Connector line between circles */}
              {index < steps.length - 1 && (
                <div
                  className={`absolute top-5 ${
                    isArabic ? "left-[-50%]" : "right-[-50%]"
                  } w-full flex justify-center -translate-y-1/2 z-0`}
                >
                  <div
                    className={`h-0.5 transition-all duration-300 w-full ${
                      isCompleted ? "bg-[#676e32]" : "bg-gray-300"
                    }`}
                  ></div>
                </div>
              )}

              {/* Circle */}
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full border-2 text-base font-semibold z-10 transition-all duration-300
                  ${
                    isActive
                      ? "bg-white border-[#676e32] text-[#676e32]"
                      : isCompleted
                      ? "bg-[#676e32] border-[#676e32] text-white"
                      : "border-gray-300 text-gray-400 bg-white"
                  }`}
              >
                {step.number}
              </div>

              {/* Label */}
              <span className="text-sm mt-2 text-gray-700 font-medium">
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
