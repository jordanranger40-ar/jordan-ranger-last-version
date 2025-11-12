"use client";

import { User, Mail, Clock } from "lucide-react";
import { format } from "date-fns";

type BookingConfirmationProps = {
  activityName: string;
  start: string;
  end: string;
  quantity: number;
  price?: number; 
  user?: { name?: string; email?: string }; 
  onGoToCart: () => void;
  continueButton?:()=> void
};

export default function BookingConfirmation({
  activityName,
  start,
  end,
  quantity,
  price,
  user,
  onGoToCart,
  continueButton
}: BookingConfirmationProps) {
  // calculate duration
  console.log("pricew: ",price);
  const durationMs = new Date(end).getTime() - new Date(start).getTime();
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  const remHours = hours % 24;
  const duration =
    days > 0
      ? `${days} day${days > 1 ? "s" : ""}${remHours ? ` ${remHours}h` : ""}`
      : `${remHours} hour${remHours !== 1 ? "s" : ""}`;

      
      console.log("price: ",price);
            console.log("quantity: ",quantity);

      

  const totalPrice = price ? price * quantity * Number(duration[0])  : undefined;
  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-xl p-6 border border-gray-200 space-y-6 animate-fadeIn">
      {/* Success header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-green-600 mb-2">✅ Booking Added to Your Cart</h2>
        <p className="text-gray-500">You can review or checkout your bookings in the cart.</p>
      </div>

      {/* User info */}
      {user && (user.name || user.email) && (
        <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
          <User className="w-6 h-6 text-gray-500" />
          <div>
            {user.name && <p className="font-medium text-gray-700">{user.name}</p>}
            {user.email && (
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <Mail className="w-4 h-4 text-gray-400" /> {user.email}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Booking details */}
      <div className="bg-gray-50 p-4 rounded-lg space-y-2">
        <h3 className="text-lg font-semibold">{activityName}</h3>
        <p className="text-gray-700 flex items-center gap-1 text-sm">
          <Clock className="w-4 h-4" /> {format(new Date(start), "PPpp")} — {format(new Date(end), "PPpp")}
        </p>
        <p className="text-sm text-gray-500">Duration: {duration}</p>
        <p className="text-sm text-gray-500">Quantity: {quantity}</p>
        {totalPrice !== undefined && <p className="text-base  text-gray-500">Total: {totalPrice} JOD</p>}
      </div>

      {/* Go to cart button */}
      <div className="text-center flex flex-row gap-4">
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
