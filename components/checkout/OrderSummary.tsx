"use client";

import LightButton from "@/components/ui/light-button";
import { newCartItem } from "@/types";

type LocaleType = "en" | "ar";

interface Props {
  amount: number;
  currency: string;
  locale: LocaleType;
  cartDetailsData: newCartItem[];
  onBack: () => void;
}

export default function OrderSummary({
  amount,
  currency,
  locale,
  cartDetailsData,
  onBack,
}: Props) {
  const isAr = locale === "ar";

  const texts = {
    summary: isAr ? "ملخص الطلب" : "Summary",
    total: isAr ? "الإجمالي" : "Total",
    payNow: isAr ? "ادفع الآن" : "Pay now",
    back: isAr ? "العودة إلى السلة" : "Back to cart",
    items: isAr ? "العناصر" : "Items",
    subtotal: isAr ? "المجموع" : "Subtotal",
    createdAt: isAr ? "تاريخ الحجز" : "Booked at",
    bookingType: isAr ? "نوع الحجز" : "Booking type",
    bookingId: isAr ? "معرف الحجز" : "Booking id",
    cartId: isAr ? "معرف السلة" : "Cart id",
    mismatchNote: isAr
      ? "ملاحظة: المجموع المحتسب يختلف عن الإجمالي الممرّر."
      : "Note: calculated subtotal differs from passed total.",
  };

  // Currency display
  const displayCurrency = isAr && currency === "JOD" ? "أ.د" : currency;

  // helper: format price per locale
  const formatPrice = (value: number) =>
    isAr
      ? `${value.toLocaleString("ar-EG", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })} ${displayCurrency}`
      : `${value.toFixed(2)} ${displayCurrency}`;

  // helper: format date safely (handles Date object or date string)
  const formatDate = (d:Date) => {
    try {
      const date = d instanceof Date ? d : new Date(d);
      if (Number.isNaN(date.getTime())) return "-";
      return isAr
        ? date.toLocaleString("ar-EG", {
            dateStyle: "medium",
            timeStyle: "short",
          })
        : date.toLocaleString("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
          });
    } catch {
      return "-";
    }
  };

  // compute subtotal from cartDetailsData (price may be string)
  const calculatedSubtotal = cartDetailsData.reduce((acc, item:newCartItem) => {
    const p = parseFloat((item)?.price.toString() ?? "0");
    return acc + (Number.isFinite(p) ? p : 0);
  }, 0);

  // booking type friendly label
  const bookingTypeLabel = (type?: string) => {
    if (!type) return "-";
    const t = type.toLowerCase();
    if (t === "room") return isAr ? "حجز إقامة" : "Accommodation";
    if (t === "activity") return isAr ? "نشاط" : "Activity";
    if (t === "training") return isAr ? "تدريب" : "Training";
    return isAr ? type : type.charAt(0).toUpperCase() + type.slice(1);
  };

  const formattedAmount = formatPrice(amount);

  return (
    <aside
      className={`bg-white rounded-2xl shadow p-6 ${isAr ? "text-right rtl" : "text-left ltr"}`}
      dir={isAr ? "rtl" : "ltr"}
    >
      <h3 className="text-lg font-semibold mb-4">{texts.summary}</h3>

      {/* Items list */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">{texts.items}</div>
          <div className="text-sm font-medium text-gray-700">{cartDetailsData.length}</div>
        </div>

        <ul className="divide-y divide-gray-100 max-h-56 overflow-auto">
          {cartDetailsData.map((item) => {
            // safe access - the item shape is assumed similar to the example
            const bookingId = (item )?.booking_id ?? (item )?.id ?? "-";
            const booking_type = (item )?.booking_type ?? "-";
            const createdAt = (item )?.created_at  ;
            const priceRaw = (item )?.price ?? "0";
            const priceNum = parseFloat(priceRaw.toString()) || 0;

            return (
              <li key={(item )?.id ?? bookingId} className="py-3 flex justify-between items-start">
                <div className="min-w-0">
                  <div className="flex items-start gap-2 flex-col">
                    <span className="text-sm font-medium text-gray-900">
                      {bookingTypeLabel(booking_type)}
                    </span>
                    <span className="text-xs text-gray-500">{texts.createdAt}: {formatDate(createdAt!)}</span>
                  </div>
                </div>

                <div className="ml-3 text-right">
                  <div className="text-sm font-semibold">{formatPrice(priceNum)}</div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* subtotal & totals */}
      <div className="border-t pt-4 space-y-3">
        <div className={`flex justify-between ${isAr ? "flex-row-reverse" : ""}`}>
          <span className="text-sm text-gray-600">{texts.subtotal}</span>
          <span className="font-medium">{formatPrice(calculatedSubtotal)}</span>
        </div>

        <div className={`flex justify-between ${isAr ? "flex-row-reverse" : ""}`}>
          <span className="text-sm text-gray-600">{texts.total}</span>
          <span className="font-bold">{formattedAmount}</span>
        </div>

        {/* show mismatch note if calculated subtotal differs from passed amount */}
        {Math.abs(calculatedSubtotal - amount) > 0.005 && (
          <div className="text-xs text-yellow-700">
            {texts.mismatchNote}
          </div>
        )}
      </div>

      <div className="mt-4">
        <LightButton className="w-full mt-3" onClick={onBack}>
          {texts.back}
        </LightButton>
      </div>
    </aside>
  );
}
