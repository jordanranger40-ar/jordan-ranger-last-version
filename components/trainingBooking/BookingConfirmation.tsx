"use client";

import { User, Mail, User2 } from "lucide-react";
import { format } from "date-fns";
import { ar as arLocale, enUS } from "date-fns/locale";
import DarkButton from "@/components/ui/dark-button";
import LightButton from "@/components/ui/light-button";
import UpSellingComponent from "@/components/UpSellingComponent";

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
  locale: string;
  uniqueTypes: string[];
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
  locale,
  uniqueTypes
}: BookingConfirmationProps) {
  const isArabic = locale === "ar";

  // Duration calculation
  const startTime = start ? new Date(start) : null;
  const endTime = end ? new Date(end) : null;

  const durationMs =
    startTime &&
    endTime &&
    !isNaN(startTime.getTime()) &&
    !isNaN(endTime.getTime())
      ? Math.max(0, endTime.getTime() - startTime.getTime())
      : 0;

  const durationHoursFloat = durationMs / (1000 * 60 * 60);
  const durationHours = Math.round(durationHoursFloat * 100) / 100;

  const durationDays = Math.floor(durationHours / 24);
  const remainderHours = Math.round((durationHours % 24) * 100) / 100;

  // Arabic duration
  const humanDuration = (() => {
    if (durationMs === 0) return isArabic ? "—" : "—";

    if (isArabic) {
      if (durationDays > 0) {
        return `${durationDays} يوم${durationDays > 1 ? " " : ""}${
          remainderHours ? ` و ${remainderHours} ساعة` : ""
        }`;
      }
      return `${durationHours} ساعة`;
    }

    // English
    return durationDays > 0
      ? `${durationDays} day${durationDays > 1 ? "s" : ""}${
          remainderHours ? ` ${remainderHours}h` : ""
        }`
      : `${durationHours} hour${durationHours !== 1 ? "s" : ""}`;
  })();

  // Price calculation
  let totalPrice: string | undefined;
  if (typeof price === "number") {
    if (priceUnit === "person_per_hour" && durationHours > 0) {
      totalPrice = (price * quantity * durationHours).toFixed(2);
    } else {
      totalPrice = (price * quantity).toFixed(2);
    }
  }

  // Date formatting helper
  const formatDateSafe = (d: Date | null) =>
    d
      ? format(d, "PPpp", {
          locale: isArabic ? arLocale : enUS,
        })
      : "—";

  return (
    <div
      className={`w-full max-w-xl mx-auto bg-white shadow-lg rounded-2xl p-6 border border-gray-100 space-y-6 ${
        isArabic ? "text-right" : "text-left"
      }`}
      dir={isArabic ? "rtl" : "ltr"}
    >
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-emerald-600 mb-1">
          {isArabic ? "✅ تم إضافة الحجز إلى السلة" : "✅ Booking added to your cart"}
        </h2>
        <p className="text-sm text-gray-500">
          {isArabic
            ? "يمكنك مراجعة حجوزاتك أو إتمام الدفع من خلال السلة."
            : "You can review or checkout your bookings in the cart."}
        </p>
      </div>

      {/* User + Meta */}
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
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="truncate">{user.email}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between gap-3 bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center gap-2">
            <User2 className="w-5 h-5 text-gray-500" />
            <div className="text-xs text-gray-600">
              {isArabic ? "العدد" : "Quantity"}
            </div>
          </div>
          <div className="text-sm font-semibold text-gray-800">{quantity}</div>
        </div>
      </div>

      {/* Booking Details */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-gray-800 mb-2">
          {activityName}
        </h3>

        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
          <div>
            <div className="text-xs text-gray-500">
              {isArabic ? "تاريخ البداية" : "Starts"}
            </div>
            <div className="text-sm text-gray-800">
              {formatDateSafe(startTime)}
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-500">
              {isArabic ? "تاريخ النهاية" : "Ends"}
            </div>
            <div className="text-sm text-gray-800">
              {formatDateSafe(endTime)}
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-500">
              {isArabic ? "المدة" : "Duration"}
            </div>
            <div className="text-sm text-gray-800">{humanDuration}</div>
          </div>
        </div>

        {/* Pricing */}
        <div className="mt-4 border-t pt-3 grid grid-cols-1 gap-2 md:grid-cols-3">
          <div>
            <div className="text-xs text-gray-500">
              {isArabic ? "السعر" : "Price"}
            </div>
            <div className="text-sm text-gray-800">
              {price !== undefined ? `${price.toFixed(2)} د.أ` : "—"}{" "}
              <span className="text-xs text-gray-400">
                /{" "}
                {priceUnit === "person_per_hour"
                  ? isArabic
                    ? "للفرد / ساعة"
                    : "person / hour"
                  : isArabic
                  ? "للفرد"
                  : "person"}
              </span>
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-500">
              {isArabic ? "الإجمالي" : "Total"}
            </div>
            <div className="text-sm font-semibold text-gray-900">
              {totalPrice !== undefined ? `${totalPrice} د.أ` : "—"}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <DarkButton
                 aria-label={isArabic ? "اذهب إلى السلة" : "Go to cart"}
                 onClick={onGoToCart}
                 className="px-4 py-2 font-medium w-full sm:w-1/2 inline-flex items-center justify-center gap-2"
               >
                 {isArabic ? "اذهب إلى السلة" : "Go to Cart"}
               </DarkButton>
               <LightButton
                 aria-label={isArabic ? "استمر" : "Continue"}
                 className="px-4 py-2 font-medium w-full sm:w-1/2 bg-gray-300 inline-flex items-center justify-center gap-2"
                 onClick={continueButton}
               >
                 {" "}
                 {isArabic ? "استمر" : "Continue"}
               </LightButton>
      </div>

      <div className="text-xs text-gray-400 text-center">
        {isArabic
          ? "ملاحظة: يمكنك مراجعة حجوزاتك من خلال السلة. إذا كان السعر بالساعة، فالإجمالي يعتمد على مدة الحجز."
          : "Tip: you can review your bookings in the cart. If price is per hour, the total includes the duration."}
      </div>
       <UpSellingComponent uniqueTypes={uniqueTypes} locale={locale} />
    </div>
  );
}
