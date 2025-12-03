"use client";

import React, { useState } from "react";
import type { cartWithItems, newCart } from "@/types/index";
import Link from "next/link";
import { Trash2 } from "lucide-react";

interface CartProps {
  cartData: newCart | undefined;
  cartDetails: cartWithItems[] | undefined;
  action: (id: string) => void;
  locale: string;
}

export default function Cart({ cartData, action, cartDetails, locale }: CartProps) {
  const [cartItems, setCartItems] = useState<cartWithItems[]>(cartDetails || []);
  const tax = 0;
  const isArabic = locale === "ar";

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
    if (type === "activity") return isArabic ? "نشاط" : "Activity";
    if (type === "training") return isArabic ? "تدريب" : "Training";
    if (type === "room") return isArabic ? "الإقامة" : "Accommodation";
    return type;
  };

  const currency = isArabic ? "أ.د" : "JOD";

  return (
    <div className={`max-w-6xl mx-auto px-4 lg:px-6 mt-20 ${isArabic ? "text-right" : ""}`} dir={isArabic ? "rtl" : "ltr"}>
      <div className="grid lg:grid-cols-3 gap-8">
        {/* 🛍 Cart Items */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-xl font-semibold text-[#484d23]">{isArabic ? "سلة المشتريات" : "Your Cart"}</h3>
          <p className="text-sm text-slate-500 mt-1">
            {isArabic
              ? "راجع حجوزاتك المختارة — بما في ذلك الأنشطة والإقامة والدورات قبل إتمام الدفع."
              : "Review your selected bookings — including Activities, Accommodations, and Trainings before checkout."}
          </p>

          <hr className="border-gray-200 mt-4 mb-8" />

          {cartItems.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-slate-500 text-lg">{isArabic ? "سلة المشتريات فارغة 🛍️" : "Your cart is empty 🛍️"}</p>
              <Link href={`/${locale}`}>
                <span className="inline-block mt-6 px-5 py-2.5 bg-[#484d23] text-white rounded-md text-sm hover:bg-[#5b6230] transition">
                  {isArabic ? "العودة للتسوق" : "Return to Shop"}
                </span>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border">
                  <div>
                    <h4 className="text-[15px] font-semibold text-[#484d23]">
                      {isArabic ? "حجز" : "Booking"}: {getTypeTranslation(item.booking_type)}
                    </h4>
                    <p className="text-sm text-slate-600 mt-1">
                      {isArabic ? "المجموع" : "Total"}: {Number(item.price || 0).toFixed(2)} {currency}
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
          <h3 className="text-xl font-semibold text-[#484d23]">{isArabic ? "ملخص الطلب" : "Order Summary"}</h3>
          <hr className="border-gray-200 mt-4 mb-8" />

          <ul className="text-slate-600 font-medium space-y-4">
            <li className="flex justify-between text-sm">
              {isArabic ? "الخصم" : "Discount"}
              <span className="text-[#484d23] font-semibold">0.00 {currency}</span>
            </li>
            <li className="flex justify-between text-sm">
              {isArabic ? "الضريبة" : "Tax"}
              <span className="text-[#484d23] font-semibold">{tax.toFixed(2)} {currency}</span>
            </li>
            <li className="flex justify-between text-sm text-[#484d23] mt-4 pt-4 border-t">
              {isArabic ? "المجموع" : "Total"}
              <span className="font-bold text-lg">{Number(cartData?.total_amount).toFixed(2)} {currency}</span>
            </li>
          </ul>

          <div className="mt-8 space-y-3">
            <button className="text-sm px-4 py-2.5 w-full font-medium tracking-wide bg-[#484d23] hover:bg-[#5b6230] text-white rounded-md transition">
              {isArabic ? "إتمام الشراء" : "Checkout"}
            </button>

            <Link href={`/${locale}`}>
              <button className="text-sm px-4 py-2.5 w-full font-medium tracking-wide bg-white border border-gray-300 text-[#484d23] rounded-md hover:bg-gray-100 transition">
                {isArabic ? "متابعة التسوق" : "Continue Shopping"}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
