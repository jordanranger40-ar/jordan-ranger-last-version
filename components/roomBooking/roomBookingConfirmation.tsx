"use client";

import { User, Mail, Clock, HomeIcon } from "lucide-react";
import { format, setHours, setMinutes } from "date-fns";

type BookingConfirmationProps = {
  RoomName: string;
  start: string;
  end: string;
  price?: number;
  user?: { name?: string; email?: string };
  onGoToCart: () => void;
  continueButton?: () => void;
};

export default function RoomBookingConfirmation({
  RoomName,
  start,
  end,
  price,
  user,
  onGoToCart,
  continueButton,
}: BookingConfirmationProps) {
  // Force the start time to 3 PM and end time to 12 PM
  const startDate = setMinutes(setHours(new Date(start), 15), 0); // 3:00 PM
  const endDate = setMinutes(setHours(new Date(end), 12), 0); // 12:00 PM

  // Calculate duration
  const durationMs = endDate.getTime() - startDate.getTime();
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  const remHours = hours % 24;
  const duration =
    days > 0
      ? `${days} day${days > 1 ? "s" : ""}${remHours ? ` ${remHours}h` : ""}`
      : `${remHours} hour${remHours !== 1 ? "s" : ""}`;

  const totalPrice = price ? price * (days || 1) : undefined;

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-xl p-6 border border-gray-200 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-green-600 mb-2">
          ✅ Booking Added to Your Cart
        </h2>
        <p className="text-gray-500">
          You can review or checkout your bookings in the cart.
        </p>
      </div>

      {/* User Info */}
      {user && (user.name || user.email) && (
        <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
          <User className="w-6 h-6 text-gray-500" />
          <div>
            {user.name && (
              <p className="font-medium text-gray-700">{user.name}</p>
            )}
            {user.email && (
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <Mail className="w-4 h-4 text-gray-400" /> {user.email}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Booking Details */}
      <div className="bg-gray-50 p-4 rounded-lg space-y-2">
        <div className="flex items-center gap-2 text-gray-700 font-medium">
          <HomeIcon className="w-5 h-5" />
          <span>{RoomName}</span>
        </div>

        <p className="text-gray-700 flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4" />
          {format(startDate, "PPp")} — {format(endDate, "PPp")}
        </p>
        <p className="text-sm text-gray-500">Duration: {duration}</p>
        {totalPrice !== undefined && (
          <p className="text-base text-gray-600 font-medium">
            Total Price: <span className="text-[#676e32]">{totalPrice} JOD</span>
          </p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex flex-row gap-4">
        <button
          onClick={onGoToCart}
          className="bg-[#676e32] text-white px-6 py-2 rounded-lg hover:bg-[#7c863a] transition w-full"
        >
          Go to Cart
        </button>
        <button
          onClick={continueButton}
          className="bg-[#676e32] text-white px-6 py-2 rounded-lg hover:bg-[#7c863a] transition w-full"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
