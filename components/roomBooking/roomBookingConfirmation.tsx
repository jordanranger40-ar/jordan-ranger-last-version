"use client";

import { User, Mail, HomeIcon } from "lucide-react";
import { format, setHours, setMinutes } from "date-fns";

type RoomBookingConfirmationProps = {
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
}: RoomBookingConfirmationProps) {
  // Force start/end times
  const startDate = setMinutes(setHours(new Date(start), 15), 0); // 3:00 PM
  const endDate = setMinutes(setHours(new Date(end), 12), 0); // 12:00 PM

  // Duration calculation
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
    <div className="w-full max-w-xl mx-auto bg-white shadow-lg rounded-2xl p-6 border border-gray-100 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-emerald-600 mb-1">
          ✅ Booking added to your cart
        </h2>
        <p className="text-sm text-gray-500">
          You can review or checkout your bookings in the cart.
        </p>
      </div>

      {/* User Info */}
      {user && (
        <div className="flex flex-col gap-3 bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-3">
            <User className="w-6 h-6 text-gray-500 shrink-0" />
            <div>
              {user.name && (
                <div className="font-medium text-gray-800">{user.name}</div>
              )}
              {user.email && (
                <div className="flex items-center gap-2 text-gray-500">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>{user.email}</span>
                </div>
              )}
            </div>
          </div>

          {/* Room name now below user */}
          <div className="flex items-start gap-3 border-t border-gray-200 pt-3">
            <HomeIcon className="w-5 h-5 text-gray-500 mt-0.5" />
            <div>
              <div className="text-xs text-gray-500">Room</div>
              <div className="text-sm font-semibold text-gray-800">{RoomName}</div>
            </div>
          </div>
        </div>
      )}

      {/* Booking Details */}
      <div className="bg-gray-50 p-4 rounded-lg space-y-3">
        <h3 className="text-lg font-medium text-gray-800">Stay Details</h3>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div>
            <div className="text-xs text-gray-500">Check-in</div>
            <div className="text-sm text-gray-800">
              {format(startDate, "PPp")}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Check-out</div>
            <div className="text-sm text-gray-800">{format(endDate, "PPp")}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Duration</div>
            <div className="text-sm text-gray-800">{duration}</div>
          </div>
        </div>

        <div className="mt-4 border-t pt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
          <div>
            <div className="text-xs text-gray-500">Price per night</div>
            <div className="text-sm text-gray-800">
              {price !== undefined ? `${price.toFixed(2)} JOD` : "—"}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Total</div>
            <div className="text-sm font-semibold text-gray-900">
              {totalPrice !== undefined ? `${totalPrice} JOD` : "—"}
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          onClick={onGoToCart}
          aria-label="Go to cart"
          className="w-full sm:w-1/2 inline-flex items-center justify-center gap-2 rounded-xl bg-[#676e32] hover:bg-[#7c863a] text-white px-5 py-3 font-medium transition-shadow shadow-sm"
        >
          Go to Cart
        </button>

        <button
          onClick={continueButton}
          aria-label="Continue"
          className="w-full sm:w-1/2 inline-flex items-center justify-center gap-2 rounded-xl border border-[#676e32] text-[#676e32] px-5 py-3 font-medium hover:bg-[#eaebe4] transition"
        >
          Continue
        </button>
      </div>

      {/* Note */}
      <div className="text-xs text-gray-400 text-center">
        Tip: Room stays are automatically set from 3:00 PM check-in to 12:00 PM check-out.
      </div>
    </div>
  );
}
