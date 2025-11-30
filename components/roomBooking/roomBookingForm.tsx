"use client";

import { useState } from "react";
import { DateRange, RangeKeyDict, Range } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { CalendarDays, CheckCircle } from "lucide-react";
import { bookRoom } from "./(fetch)/bookARoom";
import { newRoom } from "@/types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { format } from "date-fns";

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
  const router = useRouter();

  // Generate all disabled dates
  const disabledDates = bookedDates.flatMap((d) => {
    const start = new Date(d.start);
    const end = new Date(d.end);
    const days: Date[] = [];
    for (let day = new Date(start); day < end; day.setDate(day.getDate() + 1)) {
      days.push(new Date(day));
    }
    return days;
  });

  // No default selection
  const [range, setRange] = useState<Range[]>([
    { startDate: new Date(), endDate: new Date(), key: "selection" },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const handleSelect = (ranges: RangeKeyDict) => {
    setRange([ranges.selection]);
  };

  const toDateOnly = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate());

  const computeNights = (start: Date, end: Date) => {
    const startOnly = toDateOnly(start).getTime();
    const endOnly = toDateOnly(end).getTime();
    return Math.max(
      1,
      Math.round((endOnly - startOnly) / (1000 * 60 * 60 * 24))
    );
  };

  const openConfirmation = () => {
    const { startDate, endDate } = range[0];
    if (!startDate || !endDate) {
      toast.error(
        isArabic
          ? "يرجى اختيار تواريخ الوصول والمغادرة أولاً."
          : "Please select check-in and check-out dates first."
      );
      return;
    }
    setConfirmDialogOpen(true);
  };

  const closeConfirmation = () => setConfirmDialogOpen(false);

  const handleConfirmBooking = async () => {
    closeConfirmation();

    let { startDate, endDate } = range[0];
    if (!startDate || !endDate) return;

    if (toDateOnly(startDate).getTime() === toDateOnly(endDate).getTime()) {
      endDate = new Date(endDate);
      endDate.setDate(endDate.getDate() + 1);
    }

    // Check for overlapping booked dates
    const selectionDates: string[] = [];
    for (let d = new Date(startDate); d < endDate; d.setDate(d.getDate() + 1)) {
      selectionDates.push(new Date(d).toDateString());
    }
    const overlapping = selectionDates.some((d) =>
      disabledDates.some((bd) => bd.toDateString() === d)
    );
    if (overlapping) {
      toast.error(
        isArabic
          ? "التواريخ المختارة غير متاحة."
          : "Selected dates are unavailable."
      );
      return;
    }

    setIsLoading(true);
    try {
      const result = await bookRoom({
        room_id: room.id ?? "",
        start_time: startDate,
        end_time: endDate,
      });

      if (result.message === "Please login to book the Room") {
        toast.error(
          isArabic
            ? "يرجى تسجيل الدخول لحجز الغرفة"
            : "Please login to book the Room"
        );
        setTimeout(() => router.push("/login"), 1000);
      } else {
       
         console.log("error in room booking jreiow");
        console.log("result: d;lkfjkdldffg: ",result);
        if (result.status === 201) {
          
          setIsBooked(true);
          onBooked({
            start: startDate.toISOString(),
            end: endDate.toISOString(),
          });
          toast.success(isArabic ? "تم تأكيد الحجز!" : "Booking confirmed!");
        } else {
          setIsBooked(false);
          toast.error(isArabic ? "حدث خطأ" : result.message);
        }
      }
    } catch (error) {
      console.error("Booking failed:", error);
      toast.error(
        isArabic
          ? "فشل الحجز. حاول مرة أخرى لاحقًا."
          : "Booking failed. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const formatForDisplay = (d?: Date) => {
    if (!d) return "—";
    if (isArabic) return d.toLocaleDateString("ar-EG");
    try {
      return format(d, "PPP");
    } catch {
      return d.toLocaleDateString();
    }
  };

  const rangeColorsProp = range[0].startDate ? ["#676e32"] : undefined;

  return (
    <div
      className="min-h-screen bg-gray-50 py-12 px-6"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <style jsx global>{`
        .rtl-calendar .rdrMonths {
          display: flex;
          flex-direction: row-reverse;
        }
        .rtl-calendar .rdrMonth {
          direction: ltr;
        }
        .rtl-calendar .rdrNextPrevButton {
          transform: scaleX(-1);
        }
        .rtl-calendar .rdrMonth .rdrMonthAndYearWrapper {
          justify-content: center;
        }
      `}</style>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left: Room */}
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

        {/* Right: Booking */}
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
              ? `اختر تواريخ الوصول والمغادرة لـ ${room.name_ar}`
              : `Choose your check-in and check-out dates for ${room.name_en}.`}
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
              rangeColors={rangeColorsProp}
              moveRangeOnFirstSelection={false}
              retainEndDateOnFirstSelection={false}
              months={1}
            />
          </div>

          <div className="flex flex-row gap-2 w-full">
            <button
              onClick={openConfirmation}
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

            <button
              onClick={() => router.back()}
              className="mt-4 px-6 py-3 rounded-lg font-medium w-full border border-gray-400 text-gray-700 hover:bg-gray-100 transition"
            >
              {isArabic ? "إلغاء" : "Cancel"}
            </button>
          </div>

          {isBooked && (
            <div className="flex items-center gap-2 text-green-600 mt-3">
              <CheckCircle size={20} />
              <p>{isArabic ? "تم تأكيد الحجز!" : "Booking confirmed!"}</p>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      {confirmDialogOpen && (
        <div className="fixed inset-0 bg-black/70 bg-opacity-40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg w-full">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              {isArabic ? "تأكيد الحجز" : "Confirm Booking"}
            </h3>

            <div className="text-gray-700 mb-4 space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">
                  {isArabic ? "تاريخ الوصول" : "Check-in"}
                </span>
                <span>
                  {range[0].startDate
                    ? formatForDisplay(range[0].startDate)
                    : "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">
                  {isArabic ? "تاريخ المغادرة" : "Check-out"}
                </span>
                <span>
                  {range[0].endDate ? formatForDisplay(range[0].endDate) : "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">
                  {isArabic ? "المجموع التقريبي" : "Estimated total"}
                </span>
                <span>
                  {range[0].startDate && range[0].endDate
                    ? `${(
                        room.price *
                        computeNights(range[0].startDate, range[0].endDate)
                      ).toFixed(2)} JOD`
                    : "—"}
                </span>
              </div>
            </div>

            <div className="flex gap-4 justify-end">
              <button
                onClick={closeConfirmation}
                className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
              >
                {isArabic ? "إلغاء" : "Cancel"}
              </button>
              <button
                onClick={handleConfirmBooking}
                className="px-5 py-2 bg-[#676e32] text-white rounded-lg hover:bg-[#5b5f2b] transition"
              >
                {isArabic ? "نعم، قم بالحجز" : "Yes, book now"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
