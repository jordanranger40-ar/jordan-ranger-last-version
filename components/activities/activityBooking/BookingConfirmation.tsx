"use client";

import { User, Mail, Clock, Users } from "lucide-react";
import { format } from "date-fns";

type BookingConfirmationProps = {
  activityName: string;
  start: string;
  end: string;
  quantity: number;
  price?: number;
  user?: { name?: string; email?: string };
  onGoToCart: () => void;
  continueButton?: () => void;
};

export default function BookingConfirmation({
  activityName,
  start,
  end,
  quantity,
  price,
  user,
  onGoToCart,
  continueButton,
}: BookingConfirmationProps) {
  // Calculate duration
  const durationMs = new Date(end).getTime() - new Date(start).getTime();
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  const remHours = hours % 24;
  const duration =
    days > 0
      ? `${days} day${days > 1 ? "s" : ""}${remHours ? ` ${remHours}h` : ""}`
      : `${remHours} hour${remHours !== 1 ? "s" : ""}`;
console.log(duration)
  // Calculate total
  const totalPrice = price ? price * quantity * Number(duration[0]) : undefined;

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
      {user && (user.name || user.email) && (
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

          {/* Activity name now below user */}
          <div className="flex items-start gap-3 border-t border-gray-200 pt-3">
            <Clock className="w-5 h-5 text-gray-500 mt-0.5" />
            <div>
              <div className="text-xs text-gray-500">Activity</div>
              <div className="text-sm font-semibold text-gray-800">{activityName}</div>
            </div>
          </div>
        </div>
      )}

      {/* Booking Details */}
      <div className="bg-gray-50 p-4 rounded-lg space-y-3">
        <h3 className="text-lg font-medium text-gray-800">Booking Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <div className="text-xs text-gray-500">Start</div>
            <div className="text-sm text-gray-800">
              {format(new Date(start), "PPp")}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">End</div>
            <div className="text-sm text-gray-800">
              {format(new Date(end), "PPp")}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Duration</div>
            <div className="text-sm text-gray-800">{duration}</div>
          </div>
        </div>

        <div className="mt-4 border-t pt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-500" />
            <div>
              <div className="text-xs text-gray-500">Persons</div>
              <div className="text-sm text-gray-800">{quantity}</div>
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Price</div>
            <div className="text-sm text-gray-800">
              {price !== undefined ? `${Number(price).toFixed(2)} JOD` : "—"}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Total</div>
            <div className="text-sm font-semibold text-gray-900">
              {totalPrice !== undefined ? `${totalPrice.toFixed(2)} JOD` : "—"}
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
    </div>
  );
}
