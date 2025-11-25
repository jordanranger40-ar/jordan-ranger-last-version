"use client";

import { useState, useEffect } from "react";
import { checkActivityAvailability } from "./(fetch)/checkAvailability";
import TimeSelect from "./TimeSelect";

export default function CheckAvailabilityForm({
  activityId,
  onAvailable,
  locale,
}: {
  locale: string;
  activityId: string;
  onAvailable: (
    remaining: number,
    range: { start: string }
  ) => void;
}) {
  const isArabic = locale === "ar";

  const [startDate, setStartDate] = useState<string>(""); // YYYY-MM-DD
  const [startHour, setStartHour] = useState<string>(""); // HH
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [userTimeZone, setUserTimeZone] = useState<string>("");

  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setUserTimeZone(tz);
  }, []);

  const handleCheck = async () => {
    if (!startDate || !startHour) {
      setMessage(isArabic ? "يرجى اختيار تاريخ ووقت الحجز." : "Please select booking date/time.");
      return;
    }

    const start = new Date(`${startDate}T${startHour}:00:00`).toISOString();

    setLoading(true);
    const result = await checkActivityAvailability(activityId, start);
    setLoading(false);
    setMessage(null);

    if (result.success && result.available) {
      onAvailable(result.available, { start });
    } else {
      setMessage(result.message || (isArabic ? "غير متاح في الوقت المحدد" : "Unavailable for selected time"));
    }
  };

  return (
    <div className="space-y-4" dir={isArabic ? "rtl" : "ltr"}>
      {/* Start */}
      <div className="flex flex-col gap-2">
        <div className="text-sm text-gray-600">
          <span className="text-red-700">*</span>{" "}
          {isArabic ? "اختر تاريخ ووقت الحجز" : "Select Booking Date And Time"}
        </div>
        <div className="flex gap-2" dir={isArabic ? "rtl" : "ltr"}>
          <input
  type="date"
  value={startDate}
  onChange={(e) => setStartDate(e.target.value)}
  dir={isArabic ? "rtl" : "ltr"}  // ensures text direction matches language
  className="border rounded px-3 py-2 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#676e32] placeholder-gray-400"
  placeholder={isArabic ? "اختر التاريخ" : "Select date"}
/>

          <TimeSelect value={startHour} onChange={setStartHour} locale={locale} />
        </div>
      </div>

      <div className="text-xs text-gray-400 mt-1">
        {isArabic ? "جميع الأنشطة تحدث بتوقيت الأردن (GMT+3)." : "All activities occur in Jordan time (GMT+3)."}
        <br />
        {isArabic ? "منطقتك الزمنية المحلية:" : "Your local time zone:"} <strong>{userTimeZone}</strong>
      </div>

      {/* Button */}
      <div className="flex justify-center">
        <button
          onClick={handleCheck}
          disabled={loading}
          className="bg-[#676e32] text-white px-5 py-2 rounded hover:bg-[#7c863a] disabled:opacity-60 transition"
        >
          {loading
            ? isArabic
              ? "جارٍ التحقق..."
              : "Checking..."
            : isArabic
            ? "تحقق من التوافر"
            : "Check Availability"}
        </button>
      </div>

      {/* Message */}
      {message && (
        <p className="text-sm text-red-600 text-center font-medium">{message}</p>
      )}

      <p className="text-xs text-gray-500 text-center">
        {isArabic
          ? "سيتم حساب مدة النشاط تلقائيًا بعد التحقق."
          : "Duration will be calculated automatically after check."}
      </p>
    </div>
  );
}
