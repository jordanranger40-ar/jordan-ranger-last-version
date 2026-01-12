"use client";
import React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";


interface TimeSelectProps {
  value: string;
  onChange: (val: string) => void;
  locale?: string;
}

const TimeSelect: React.FC<TimeSelectProps> = ({
  value,
  onChange,
  locale,
}) => {
  const isArabic = locale === "ar";

  // Generate hours from 10 to 18
  const hours = Array.from({ length: 9 }, (_, i) => i + 10);

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-10 w-full border focus:ring-2 focus:ring-[#676e32]">
        <SelectValue
          placeholder={isArabic ? "اختر الساعة" : "Select hour"}
        />
      </SelectTrigger>

      <SelectContent dir={isArabic ? "rtl" : "ltr"}>
        {hours.map((h) => {
          const hour = h.toString().padStart(2, "0");
          return (
            <SelectItem key={hour} value={hour}>
              {hour}:00
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};

export default TimeSelect;
