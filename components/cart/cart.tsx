"use client";

import React, { useEffect, useMemo, useState } from "react";
import type { cartWithItems, newCart } from "@/types/index";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import DarkButton from "../ui/dark-button";
import { useRouter } from "next/navigation";
import LightButton from "../ui/light-button";

type CartProps = {
  cartData: newCart | undefined;
  cartDetails: cartWithItems[] | undefined;
  action: (id: string) => void;
  locale: "en" | "ar";
};

/* ----------------------  TYPED TRANSLATION DICTIONARY  ---------------------- */

type Locale = "en" | "ar";

type TranslationValue = {
  en: string;
  ar: string;
};

type BookingTypes = "activity" | "training" | "room";

type Translations = {
  your_cart: TranslationValue;
  subtitle: TranslationValue;
  empty_cart: TranslationValue;
  return_shop: TranslationValue;
  booking: TranslationValue;
  total: TranslationValue;
  order_summary: TranslationValue;
  discount: TranslationValue;
  tax: TranslationValue;
  checkout: TranslationValue;
  continue_shopping: TranslationValue;
  currency: TranslationValue;
  types: Record<BookingTypes, TranslationValue>;
  expires_in: TranslationValue;
  expires_at: TranslationValue;
  expired: TranslationValue;
};

const translations: Translations = {
  your_cart: { en: "Your Cart", ar: "سلة المشتريات" },
  subtitle: {
    en: "Review your selected bookings — including Activities, Accommodations, and Trainings before checkout.",
    ar: "راجع حجوزاتك المختارة — بما في ذلك الأنشطة والإقامة والدورات قبل إتمام الدفع.",
  },
  empty_cart: { en: "Your cart is empty 🛍️", ar: "سلة المشتريات فارغة 🛍️" },
  return_shop: { en: "Return to Shop", ar: "العودة للتسوق" },
  booking: { en: "Booking", ar: "حجز" },
  total: { en: "Total", ar: "المجموع" },
  order_summary: { en: "Order Summary", ar: "ملخص الطلب" },
  discount: { en: "Discount", ar: "الخصم" },
  tax: { en: "Tax", ar: "الضريبة" },
  checkout: { en: "Checkout", ar: "إتمام الشراء" },
  continue_shopping: { en: "Continue Shopping", ar: "متابعة التسوق" },
  currency: { en: "JOD", ar: "أ.د" },
  types: {
    activity: { en: "Activity", ar: "نشاط" },
    training: { en: "Training", ar: "تدريب" },
    room: { en: "Accommodation", ar: "الإقامة" },
  },
  expires_in: { en: "Expires in", ar: "تنتهي بعد" },
  expires_at: { en: "Expires at", ar: "تنتهي في" },
  expired: { en: "Expired", ar: "منتهي" },
};

/* -------------------------------- Component -------------------------------- */

const Cart: React.FC<CartProps> = ({
  cartData,
  action,
  cartDetails,
  locale,
}) => {
  const [cartItems, setCartItems] = useState<cartWithItems[]>(
    cartDetails || []
  );
  const tax = 0;

  const t = <K extends keyof Translations>(key: K): Translations[K] => {
    return translations[key];
  };

  const router = useRouter();
  const getTypeTranslation = (type: BookingTypes): string => {
    return translations.types[type][locale];
  };

  const currency = t("currency")[locale];

  const handleRemoveItem = async (id?: string) => {
    if (!id) return;
    try {
      action(id);
      setCartItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  /* ---------------------------- Expiry / Countdown --------------------------- */

  // Parse expiry time safely and convert to Jordan time (UTC+3)
  const expiryDate: Date | null = useMemo(() => {
    if (!cartData?.expires_at) return null;
    const d = new Date(cartData.expires_at as Date);
    if (Number.isNaN(d.getTime())) return null;

    // Convert to Jordan timezone (UTC+3)
    const jordanOffsetMs = 3 * 60 * 60 * 1000; // 3 hours
    return new Date(d.getTime() + jordanOffsetMs);
  }, [cartData?.expires_at]);

  // remaining ms
  const [remainingMs, setRemainingMs] = useState<number | null>(() =>
    expiryDate ? Math.max(expiryDate.getTime() - Date.now(), 0) : null
  );

  // Update remaining every second
  useEffect(() => {
    if (!expiryDate) {
      setRemainingMs(null);
      return;
    }
    setRemainingMs(Math.max(expiryDate.getTime() - Date.now(), 0));

    const interval = setInterval(() => {
      const diff = expiryDate.getTime() - Date.now();
      setRemainingMs((prev) => {
        if (diff <= 0) {
          clearInterval(interval);
          return 0;
        }
        return Math.max(diff, 0);
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [expiryDate]);

  // Format remaining ms to human string: "1d 02:03:04" or "02:03:04"
  function formatRemaining(ms: number | null) {
    if (ms === null) return null;
    if (ms <= 0) return t("expired")[locale];

    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / (24 * 3600));
    const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const hh = String(hours).padStart(2, "0");
    const mm = String(minutes).padStart(2, "0");
    const ss = String(seconds).padStart(2, "0");

    if (days > 0) {
      return `${days}d ${hh}:${mm}:${ss}`;
    }
    return `${hh}:${mm}:${ss}`;
  }

  // Format expiry timestamp for display in Jordan timezone
  function formatExpiryTimestamp(date: Date | null) {
    if (!date) return "—";
    try {
      const options: Intl.DateTimeFormatOptions = {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Amman", // Jordan timezone
      };
      return date.toLocaleString(locale === "ar" ? "ar-EG" : "en-US", options);
    } catch {
      return date.toString();
    }
  }

  const remainingText = formatRemaining(remainingMs);

  /* ---------------------------- JSX --------------------------- */

  return (
    <div
      className={`max-w-6xl mx-auto px-4 lg:px-6 mt-20 ${
        locale === "ar" ? "text-right" : ""
      }`}
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-[#484d23]">
                {t("your_cart")[locale]}
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                {t("subtitle")[locale]}
              </p>
            </div>

            {/* Expiry badge */}
            <div className="text-right">
              {expiryDate && (
                <div className="inline-flex flex-col items-end text-sm">
                  <div
                    className={`mt-1 px-3 py-1 rounded-md font-medium ${
                      remainingMs !== null && remainingMs > 0
                        ? "bg-green-50 text-green-700 border border-green-100"
                        : "bg-red-50 text-red-600 border border-red-100"
                    }`}
                    aria-live="polite"
                  >
                    {remainingMs !== null && remainingMs > 0
                      ? "Active"
                      : "Expired"}
                  </div>
                </div>
              )}
            </div>
          </div>

          <hr className="border-gray-200 mt-4 mb-8" />

          {cartItems.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-slate-500 text-lg">
                {t("empty_cart")[locale]}
              </p>
              <Link href={`/${locale}`}>
                <span className="inline-block mt-6 px-5 py-2.5 bg-[#484d23] text-white rounded-md text-sm hover:bg-[#5b6230] transition">
                  {t("return_shop")[locale]}
                </span>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border"
                >
                  <div>
                    <h4 className="text-[15px] font-semibold text-[#484d23]">
                      {t("booking")[locale]}:{" "}
                      {getTypeTranslation(item.booking_type as BookingTypes)}
                    </h4>
                    <p className="text-sm text-slate-600 mt-1">
                      {t("total")[locale]}: {Number(item.price || 0).toFixed(2)}{" "}
                      {currency}
                    </p>
                  </div>

                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-red-500 text-sm hover:underline hover:text-red-600 transition"
                  >
                    <Trash2 />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="bg-white p-6 rounded-xl shadow-sm border h-max sticky top-6">
          <h3 className="text-xl font-semibold text-[#484d23]">
            {t("order_summary")[locale]}
          </h3>
          <hr className="border-gray-200 mt-4 mb-4" />

          {/* Expiry in summary */}
          {expiryDate && (
            <div className="mb-4 text-sm">
              <div className="text-slate-500">{t("expires_at")[locale]}:</div>
              <div className="mt-1 font-medium">
                {remainingMs !== null && remainingMs > 0 ? (
                  <span className="text-[#7a4b00]">
                    {t("expires_in")[locale]}: {remainingText}
                  </span>
                ) : (
                  <span className="text-red-600">{t("expired")[locale]}</span>
                )}
              </div>
              <div className="text-xs text-slate-400">
                {formatExpiryTimestamp(expiryDate)}
              </div>
            </div>
          )}

          <ul className="text-slate-600 font-medium space-y-4">
            <li className="flex justify-between text-sm">
              {t("discount")[locale]}
              <span className="text-[#484d23] font-semibold">
                0.00 {currency}
              </span>
            </li>
            <li className="flex justify-between text-sm">
              {t("tax")[locale]}
              <span className="text-[#484d23] font-semibold">
                {tax.toFixed(2)} {currency}
              </span>
            </li>
            <li className="flex justify-between text-sm text-[#484d23] mt-4 pt-4 border-t">
              {t("total")[locale]}
              <span className="font-bold text-lg">
                {Number(cartData?.total_amount ?? 0).toFixed(2)} {currency}
              </span>
            </li>
          </ul>

          <div className="mt-8 space-y-3">
            <DarkButton
              onClick={() => {
                router.push(`/${locale}/checkout`);
              }}
              className="w-full"
            >
              {t("checkout")[locale]}
            </DarkButton>
            <LightButton
              onClick={() => {
                router.push(`/${locale}`);
              }}
              className="w-full"
            >
              {" "}
              {t("continue_shopping")[locale]}
            </LightButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
