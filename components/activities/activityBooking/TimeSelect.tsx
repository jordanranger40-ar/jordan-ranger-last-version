"use client";
import React from "react";

interface TimeSelectProps {
  value: string;
  onChange: (val: string) => void;
  locale: string; // add locale prop
}

const TimeSelect: React.FC<TimeSelectProps> = ({ value, onChange, locale }) => {
  const isArabic = locale === "ar";

  // Generate hours from 10 to 18
  const hours = Array.from({ length: 9 }, (_, i) => i + 10);

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#676e32]"
    >
      <option value="">
        {isArabic ? "اختر الساعة" : "Select hour"}
      </option>
      {hours.map((h) => (
        <option key={h} value={h.toString().padStart(2, "0")}>
          {h.toString().padStart(2, "0")}:00
        </option>
      ))}
    </select>
  );
};

export default TimeSelect;
