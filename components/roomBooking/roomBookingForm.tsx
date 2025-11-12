"use client";
import { useState } from "react";
import { DateRange, RangeKeyDict, Range } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { CalendarDays, CheckCircle } from "lucide-react";
import { bookRoom } from "./(fetch)/bookARoom";
import { newRoom } from "@/types";

type Props = {
  room: newRoom;
  bookedDates: { start: string; end: string }[];
  onBooked: (range: { start: string; end: string }) => void;
};

export default function RoomBookingPage({
  room,
  bookedDates,
  onBooked,
}: Props) {
  const [range, setRange] = useState<Range[]>([
    { startDate: new Date(), endDate: new Date(), key: "selection" },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isBooked, setIsBooked] = useState(false);

  // Generate all disabled dates
  const disabledDates = bookedDates.flatMap((d) => {
    const start = new Date(d.start);
    const end = new Date(d.end);
    const days = [];
    for (let day = new Date(start); day < end; day.setDate(day.getDate() + 1)) {
      days.push(new Date(day));
    }
    return days;
  });

  // Update range when user selects dates
  const handleSelect = (ranges: RangeKeyDict) => {
    const selection = ranges.selection;
    setRange([selection]);
  };

  // Helper: calculate nights (end date exclusive)
  const calculateNights = (start: Date, end: Date) => {
    const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    return Math.max(Math.ceil(diff), 1); // always at least 1 night
  };

  const handleConfirm = async () => {
    let { startDate, endDate } = range[0];
    if (!startDate || !endDate)
      return alert("Please select a valid date range.");

    // ✅ Ensure at least one night
    if (startDate.getTime() === endDate.getTime()) {
      endDate = new Date(endDate);
      endDate.setDate(endDate.getDate() + 1);
    }

    const nights = calculateNights(startDate, endDate);

    setIsLoading(true);
    try {
      await bookRoom({
        room_id: room.id ?? "",
        start_time: startDate,
        end_time: endDate,
      });
      setIsBooked(true);
      onBooked({
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      });
    } catch (error) {
      console.error("Booking failed:", error);
      alert("Something went wrong while booking. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left Column - Room Details */}
        <div className="flex flex-col gap-6">
          <img
            src={room.cover_image}
            alt={room.name_en}
            className="w-full h-80 object-cover rounded-xl shadow-lg"
          />
          <div>
            <h2 className="text-3xl font-bold text-gray-800">{room.name_en}</h2>
            <p className="mt-3 text-gray-600">{room.description_en}</p>
            <div className="mt-4 text-xl font-semibold text-[#676e32]">
              {room.price} JOD / night
            </div>
          </div>
        </div>

        {/* Right Column - Booking Section */}
        <div className="bg-white shadow-lg rounded-2xl p-8 flex flex-col items-center gap-6 border border-gray-100">
          <div className="flex items-center justify-center gap-3 text-[#676e32] mt-6">
            <CalendarDays size={28} />
            <h2 className="text-2xl font-semibold">Select Your Stay Dates</h2>
          </div>

          <p className="text-gray-500 text-center">
            Choose your preferred check-in and check-out dates for{" "}
            <span className="font-medium text-[#676e32]">{room.name_en}</span>.
          </p>

          <div className="shadow-inner flex justify-center p-4 rounded-lg bg-gray-50 w-full">
            <DateRange
              ranges={range}
              onChange={handleSelect}
              minDate={new Date()}
              disabledDates={disabledDates}
              rangeColors={["#676e32"]}
              moveRangeOnFirstSelection={false}
              retainEndDateOnFirstSelection={false}
            />
          </div>

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
              ? "Booking..."
              : isBooked
              ? "Booked!"
              : "Confirm Booking"}
          </button>

          {isBooked && (
            <div className="flex items-center gap-2 text-green-600 mt-3 animate-fade-in">
              <CheckCircle size={20} />
              <p>Booking confirmed successfully!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
