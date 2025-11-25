"use client";

import { User, Mail,  User2 } from "lucide-react";
import { format } from "date-fns";

type BookingConfirmationProps = {
  activityName: string;
  start: string;
  end: string;
  quantity: number;
  price?: number;

  priceUnit?: "person" | "person_per_hour";
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
  priceUnit = "person",
  user,
  onGoToCart,
  continueButton,
}: BookingConfirmationProps) {
  // safe duration calculation
  const startTime = start ? new Date(start) : null;
  const endTime = end ? new Date(end) : null;
  const durationMs =
    startTime &&
    endTime &&
    !isNaN(startTime.getTime()) &&
    !isNaN(endTime.getTime())
      ? Math.max(0, endTime.getTime() - startTime.getTime())
      : 0;

  const durationHoursFloat = durationMs / (1000 * 60 * 60); // may be fractional
  const durationHours = Math.round(durationHoursFloat * 100) / 100; // keep 2 decimals
  const durationDays = Math.floor(durationHours / 24);
  const remainderHours = Math.round((durationHours % 24) * 100) / 100;

  const humanDuration =
    durationMs === 0
      ? "—"
      : durationDays > 0
      ? `${durationDays} day${durationDays > 1 ? "s" : ""}${
          remainderHours ? ` ${remainderHours}h` : ""
        }`
      : `${
          durationHours % 24 === 0 ? Math.round(durationHours) : durationHours
        } hour${durationHours !== 1 ? "s" : ""}`;

  // total price calculation depends on priceUnit
  let totalPrice: string | undefined;
  if (typeof price === "number") {
    if (priceUnit === "person_per_hour" && durationHours > 0) {
      totalPrice = (price * quantity * durationHours).toFixed(2);
    } else {
      // default: price per person (not per-hour)
      totalPrice = (price * quantity).toFixed(2);
    }
  }

  // format helper
  const formatDateSafe = (d: Date | null) => (d ? format(d, "PPpp") : "—");

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

      {/* User + meta */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {user && (
          <div className="col-span-1 sm:col-span-2 flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
            <User className="w-6 h-6 text-gray-500 shrink-0" />
            <div className="text-sm">
              {user.name && (
                <div className="font-medium text-gray-800">{user.name}</div>
              )}
              {user.email && (
                <div className="flex items-center gap-2 text-gray-500">
                  <Mail className="w-4 h-4 text-gray-400" />{" "}
                  <span className="truncate">{user.email}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 justify-between bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center gap-2">
            <User2 className="w-5 h-5 text-gray-500" />
            <div className="text-xs text-gray-600">Quantity</div>
          </div>
          <div className="text-sm font-semibold text-gray-800">{quantity}</div>
        </div>
      </div>

      {/* Booking details */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-gray-800 mb-2">
          {activityName}
        </h3>

        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
          <div className="col-span-1">
            <div className="text-xs text-gray-500">Starts</div>
            <div className="text-sm text-gray-800">
              {formatDateSafe(startTime)}
            </div>
          </div>

          <div className="col-span-1">
            <div className="text-xs text-gray-500">Ends</div>
            <div className="text-sm text-gray-800">
              {formatDateSafe(endTime)}
            </div>
          </div>

          <div className="col-span-1">
            <div className="text-xs text-gray-500">Duration</div>
            <div className="text-sm text-gray-800">{humanDuration}</div>
          </div>
        </div>

        <div className="mt-4 border-t pt-3 grid grid-cols-1 gap-2 md:grid-cols-3">
          <div>
            <div className="text-xs text-gray-500">Price</div>
            <div className="text-sm text-gray-800">
              {price !== undefined ? `${price.toFixed(2)} JOD` : "—"}{" "}
              <span className="text-xs text-gray-400">
                / {priceUnit === "person_per_hour" ? "person / hour" : "person"}
              </span>
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

      {/* Actions */}
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

      {/* small footnote */}
      <div className="text-xs text-gray-400 text-center">
        Tip: you can review your bookings in the cart. If price is per hour, the
        total includes the duration.
      </div>
    </div>
  );
}
