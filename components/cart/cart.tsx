"use client";

import React, { useState } from "react";
import type { cartWithItems, newCart } from "@/types/index";
import Link from "next/link";
import { Trash2 } from "lucide-react";

type CartProps = {
  cartData: newCart | undefined;
  cartDetails: cartWithItems[] | undefined;
  action: (id: string) => void;
  locale: string;
};


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

  // 🌐 Translation Dictionary
  const t = (key: string) => {
    const translations: Record<string, any> = {
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
    };
    return translations[key];
  };

  const handleRemoveItem = async (id?: string) => {
    if (!id) return;
    try {
      action(id);
      setCartItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  const getTypeTranslation = (type: string) => {
    const types = t("types");
    return types[type]?.[locale === "ar" ? "ar" : "en"] || type;
  };
  const currency = t("currency")[locale === "ar" ? "ar" : "en"];
  return (
    <div
      className={`max-w-6xl mx-auto px-4 lg:px-6 mt-20 ${
        locale === "ar" ? "text-right" : ""
      }`}
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <div className="grid lg:grid-cols-3 gap-8">
        {/* 🛍 Cart Items */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-xl font-semibold text-[#484d23]">
            {t("your_cart")[locale === "ar" ? "ar" : "en"]}
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            {t("subtitle")[locale === "ar" ? "ar" : "en"]}
          </p>

          <hr className="border-gray-200 mt-4 mb-8" />

          {cartItems.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-slate-500 text-lg">
                {t("empty_cart")[locale === "ar" ? "ar" : "en"]}
              </p>
              <Link href={`/${locale}`}>
                <span className="inline-block mt-6 px-5 py-2.5 bg-[#484d23] text-white rounded-md text-sm hover:bg-[#5b6230] transition">
                  {t("return_shop")[locale === "ar" ? "ar" : "en"]}
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
                      {t("booking")[locale === "ar" ? "ar" : "en"]}:{" "}
                      {getTypeTranslation(item.booking_type)}
                    </h4>
                    <p className="text-sm text-slate-600 mt-1">
                      {t("total")[locale === "ar" ? "ar" : "en"]}:{" "}
                      {Number(item.price || 0).toFixed(2)} {currency}
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

        {/* 🧾 Order Summary */}
        <div className="bg-white p-6 rounded-xl shadow-sm border h-max sticky top-6">
          <h3 className="text-xl font-semibold text-[#484d23]">
            {t("order_summary")[locale === "ar" ? "ar" : "en"]}
          </h3>
          <hr className="border-gray-200 mt-4 mb-8" />

          <ul className="text-slate-600 font-medium space-y-4">
            <li className="flex justify-between text-sm">
              {t("discount")[locale === "ar" ? "ar" : "en"]}
              <span className="text-[#484d23] font-semibold">
                0.00 {currency}
              </span>
            </li>
            <li className="flex justify-between text-sm">
              {t("tax")[locale === "ar" ? "ar" : "en"]}
              <span className="text-[#484d23] font-semibold">
                {tax.toFixed(2)} {currency}
              </span>
            </li>
            <li className="flex justify-between text-sm text-[#484d23] mt-4 pt-4 border-t">
              {t("total")[locale === "ar" ? "ar" : "en"]}
              <span className="font-bold text-lg">
                {Number(cartData?.total_amount).toFixed(2)} {currency}
              </span>
            </li>
          </ul>

          <div className="mt-8 space-y-3">
            <button className="text-sm px-4 py-2.5 w-full font-medium tracking-wide bg-[#484d23] hover:bg-[#5b6230] text-white rounded-md transition">
              {t("checkout")[locale === "ar" ? "ar" : "en"]}
            </button>

            <Link href={`/${locale}`}>
              <button className="text-sm px-4 py-2.5 w-full font-medium tracking-wide bg-white border border-gray-300 text-[#484d23] rounded-md hover:bg-gray-100 transition">
                {t("continue_shopping")[locale === "ar" ? "ar" : "en"]}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
