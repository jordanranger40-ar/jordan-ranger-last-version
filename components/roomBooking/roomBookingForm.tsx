"use client";

import { useState } from "react";
import { DateRange, RangeKeyDict, Range } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { CalendarDays, CheckCircle } from "lucide-react";
import { bookRoom } from "./(fetch)/bookARoom";
import { newRoom } from "@/types";
import { useRouter } from "next/navigation";

type Props = {
  room: newRoom;
  bookedDates: { start: string; end: string }[];
  onBooked: (range: { start: string; end: string }) => void;
  locale: string; // "en" or "ar"
};

export default function RoomBookingPage({
  room,
  bookedDates,
  onBooked,
  locale,
}: Props) {
  const isArabic = locale === "ar";

  const [range, setRange] = useState<Range[]>([
    { startDate: new Date(), endDate: new Date(), key: "selection" },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const router = useRouter();
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Generate all disabled dates (each day between start (inclusive) and end (exclusive))
  const disabledDates = bookedDates.flatMap((d) => {
    const start = new Date(d.start);
    const end = new Date(d.end);
    const days: Date[] = [];
    for (let day = new Date(start); day < end; day.setDate(day.getDate() + 1)) {
      days.push(new Date(day));
    }
    return days;
  });

  const handleSelect = (ranges: RangeKeyDict) => {
    const selection = ranges.selection;
    setRange([selection]);
  };

  // Use date-only difference so partial-day hours don't produce fractional days
  const toDateOnly = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate());

  const handleConfirm = async () => {
    const { startDate } = range[0];
    let {endDate}= range[0]
    if (!startDate || !endDate) {
      return alert(
        isArabic
          ? "يرجى اختيار نطاق تاريخ صالح."
          : "Please select a valid date range."
      );
    }

    // If user picked same day, treat as 1 night by moving endDate to next day
    if (toDateOnly(startDate).getTime() === toDateOnly(endDate).getTime()) {
      endDate = new Date(endDate);
      endDate.setDate(endDate.getDate() + 1);
    }
    setIsLoading(true);
    try {
      const result = await bookRoom({
        room_id: room.id ?? "",
        start_time: startDate,
        end_time: endDate,
      });

      if (result.message === "Please login to book the Room") {
        setToast({
          message: isArabic
            ? "يرجى تسجيل الدخول لحجز الغرفة"
            : "Please login to book the Room",
          type: "error",
        });
        setTimeout(() => router.push("/login"), 1000);
      } else {
        setIsBooked(true);
        onBooked({
          start: startDate.toISOString(),
          end: endDate.toISOString(),
        });
      }
    } catch (error) {
      console.error("Booking failed:", error);
      alert(
        isArabic
          ? "حدث خطأ أثناء الحجز، يرجى المحاولة مرة أخرى."
          : "Something went wrong while booking. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-50 py-12 px-6"
      dir={isArabic ? "rtl" : "ltr"}
    >
      {/* Small global CSS fixes for react-date-range RTL */}
      <style jsx global>{`
        /* Apply only when wrapper has .rtl-calendar */
        .rtl-calendar .rdrMonths {
          display: flex;
          flex-direction: row-reverse;
        }
        /* Keep each month content readable left-to-right */
        .rtl-calendar .rdrMonth {
          direction: ltr;
        }
        /* Flip prev/next icons so arrows keep meaning in RTL */
        .rtl-calendar .rdrNextPrevButton {
          transform: scaleX(-1);
        }
        /* Ensure month header alignment looks natural */
        .rtl-calendar .rdrMonth .rdrMonthAndYearWrapper {
          justify-content: center;
        }
      `}</style>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left Column - Room Details */}
        <div className="flex flex-col gap-6">
          <img
            src={room.cover_image}
            alt={isArabic ? room.name_ar : room.name_en}
            className="w-full h-80 object-cover rounded-xl shadow-lg"
          />
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              {isArabic ? room.name_ar : room.name_en}
            </h2>
            <p className="mt-3 text-gray-600">
              {isArabic ? room.description_ar : room.description_en}
            </p>
            <div className="mt-4 text-xl font-semibold text-[#676e32]">
              {room.price} JOD / {isArabic ? "ليلة" : "night"}
            </div>
          </div>
        </div>

        {/* Right Column - Booking Section */}
        <div className="bg-white shadow-lg rounded-2xl p-8 flex flex-col items-center gap-6 border border-gray-100">
          <div
            className="flex items-center justify-center gap-3 text-[#676e32] mt-6"
            dir="ltr"
          >
            <CalendarDays size={28} />
            <h2 className="text-2xl font-semibold">
              {isArabic ? "اختر تواريخ الإقامة" : "Select Your Stay Dates"}
            </h2>
          </div>

          <p className="text-gray-500 text-center">
            {isArabic
              ? `اختر تواريخ الوصول والمغادرة المفضلة لديك لـ ${room.name_ar}`
              : `Choose your preferred check-in and check-out dates for ${room.name_en}.`}
          </p>

          <div
            className={`shadow-inner flex justify-center p-4 rounded-lg bg-gray-50 w-full ${
              isArabic ? "rtl-calendar" : ""
            }`}
          >
            <DateRange
              ranges={range}
              onChange={handleSelect}
              minDate={new Date()}
              disabledDates={disabledDates}
              rangeColors={["#676e32"]}
              moveRangeOnFirstSelection={false}
              retainEndDateOnFirstSelection={false}
              months={1}
            />
          </div>

          {/* Confirm Button */}
         <div className="flex flex-row gap-2 w-full">
           <button
            onClick={handleConfirm}
            disabled={isLoading || isBooked}
            className={`mt-4 px-6 py-3 rounded-lg font-medium text-white w-full transition-all duration-300 ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : isBooked
                ? "bg-green-600 cursor-not-allowed"
                : "bg-[#676e32] hover:bg-[#7c863a] shadow-md hover:shadow-lg"
            }`}
          >
            {isLoading
              ? isArabic
                ? "جارٍ الحجز..."
                : "Booking..."
              : isBooked
              ? isArabic
                ? "تم الحجز!"
                : "Booked!"
              : isArabic
              ? "تأكيد الحجز"
              : "Confirm Booking"}
          </button>

          {/* Cancel Button */}
          <button
            onClick={() => router.back()}
            className="mt-4 px-6 py-3 rounded-lg font-medium w-full border border-gray-400 text-gray-700 hover:bg-gray-100 transition"
          >
            {isArabic ? "إلغاء" : "Cancel"}
          </button>
         </div>

          {isBooked && (
            <div className="flex items-center gap-2 text-green-600 mt-3 animate-fade-in">
              <CheckCircle size={20} />
              <p>
                {isArabic
                  ? "تم تأكيد الحجز بنجاح!"
                  : "Booking confirmed successfully!"}
              </p>
            </div>
          )}
        </div>
      </div>

      {toast && (
        <div
          className={`fixed bottom-5 ${
            isArabic ? "left-5" : "right-5"
          } z-50 px-5 py-3 rounded-lg shadow-lg text-white font-medium transition-all duration-300 ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
