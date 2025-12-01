"use client";

import { User, Mail } from "lucide-react";
import UpSellingComponent from "@/components/UpSellingComponent";
import DarkButton from "@/components/ui/dark-button";
import LightButton from "@/components/ui/light-button";
type BookingConfirmationProps = {
  locale: string;
  activityName: string;
  start: string;
  quantity: number;
  price?: number;
  user?: { name?: string; email?: string };
  onGoToCart: () => void;
  continueButton?: () => void;
  uniqueTypes: string[];
};

export default function BookingConfirmation({
  activityName,
  start,
  quantity,
  price,
  user,
  onGoToCart,
  continueButton,
  locale,
  uniqueTypes,
}: BookingConfirmationProps) {
  const isArabic = locale === "ar";
  const totalPrice = price ? price * quantity : undefined;

  return (
    <div
      className="w-full  max-w-xl mx-auto bg-white shadow-lg rounded-2xl  p-4 border border-gray-100 space-y-1"
      dir={isArabic ? "rtl" : "ltr"}
    >
      {/* Header */}
      <div className="text-center">
        <h2 className=" text-sm md:text-2xl font-semibold text-emerald-600 mb-1">
          ✅{" "}
          {isArabic
            ? "تمت إضافة الحجز إلى سلة التسوق"
            : "Booking added to your cart"}
        </h2>
        <p className="text-xs md:text-sm text-gray-500">
          {isArabic
            ? "يمكنك مراجعة أو دفع حجوزاتك في السلة."
            : "You can review or checkout your bookings in the cart."}
        </p>
      </div>

      {/* User Info */}
      {user && (user.name || user.email) && (
        <div className="flex flex-col gap-3 bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center gap-3 text-xs md:text-base">
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

        
          
        </div>
      )}

      {/* Booking Details */}
      <div className="bg-gray-50 p-3 rounded-lg space-y-1">
        <div className="mt-1 border-t pt-1.5 grid grid-cols-2 md:grid-cols-3 gap-3">
          <div>
            <div className="text-xs text-gray-500">
              {isArabic ? "السعر لكل شخص" : "Price per Person"}
            </div>
            <div className="text-sm text-gray-800">
              {price !== undefined ? `${Number(price).toFixed(2)} JOD` : "—"}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">
              {isArabic ? "الإجمالي" : "Total"}
            </div>
            <div className="text-sm font-semibold text-gray-900">
              {totalPrice !== undefined ? `${totalPrice.toFixed(2)} JOD` : "—"}
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-2 sm:flex-row mb-1">
        <DarkButton
          aria-label={isArabic ? "اذهب إلى السلة" : "Go to cart"}
          onClick={onGoToCart}
          className="px-4 py-1 font-medium w-full sm:w-1/2 inline-flex items-center justify-center "
        >
          {isArabic ? "اذهب إلى السلة" : "Go to Cart"}
        </DarkButton>
        <LightButton
          aria-label={isArabic ?"حجوزاتي" : "By Bookings"}
          className="px-4 py-1 font-medium w-full sm:w-1/2 bg-gray-300 inline-flex items-center justify-center "
          onClick={continueButton}
        >
          {" "}
          {isArabic ?"حجوزاتي" : "By Bookings"}
        </LightButton>
      </div>
      <UpSellingComponent uniqueTypes={uniqueTypes} locale={locale} currentType="activity" />
    </div>
  );
}
