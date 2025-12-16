"use client";

import React, { useMemo, useState } from "react";
import type { cartWithItems, newCart } from "@/types/index";
import DarkButton from "../ui/dark-button";
import LightButton from "../ui/light-button";
import { useRouter } from "next/navigation";
import PaymentBox from "./PaymentBox";
type Locale = "en" | "ar";

interface Props {
  safeCartData: newCart | undefined;
  safeCartDetails: cartWithItems[] | undefined;
  locale?: Locale;
  initial?: "card" | "cod";
  onConfirm?: (method: "card" | "cod") => void;
}

type Translation = {
  title: string;
  card: string;
  cod: string;
  proceed: string;
  selected: string;
  choose: string;
  description: string;
  note: string;
};

const translations: Record<Locale, Translation> = {
  en: {
    title: "Payment method",
    card: "Credit Card",
    cod: "Cash on Delivery",
    proceed: "Proceed to Payment",
    selected: "Selected",
    choose: "Choose",
    description:
      "Choose one of the payment options below to complete your order.",
    note: "You can review your order from the summary before proceeding.",
  },
  ar: {
    title: "طريقة الدفع",
    card: "بطاقة ائتمان",
    cod: "الدفع عند الاستلام",
    proceed: "إتمام الدفع",
    selected: "محدد",
    choose: "اختيار",
    description: "اختر واحدة من طرق الدفع أدناه لإتمام طلبك.",
    note: "يمكنك مراجعة الطلب من الملخص قبل المتابعة.",
  },
};

const bookingTypeTranslations: Record<Locale, Record<string, string>> = {
  en: {
    activity: "Activity",
    training: "Training",
    room: "Room",
  },
  ar: {
    activity: "نشاط",
    training: "تدريب",
    room: "غرفة",
  },
};


// Inline Checkout component (no popup) — renders order summary and two payment boxes.
export default function MainCheckoutPage({
  locale = "en",
  initial = "card",
  safeCartData,
  safeCartDetails,
  onConfirm,
}: Props) {
  const [selected, setSelected] = useState<"card" | "cod">(initial);
  const t = translations[locale];
  const router = useRouter();
  // Treat the typed items as generic records so we can safely access common fields
  const items = safeCartDetails ?? [];

  const {   total } = useMemo(() => {
    const recCart = safeCartData as unknown as
      | Record<string, unknown>
      | undefined;

    const calcSubtotal = items.reduce((sum, item) => {
      const rec = item as unknown as Record<string, unknown>;
      const qtyRaw = rec["quantity"] ?? rec["qty"] ?? 1;
      const priceRaw = rec["price"] ?? rec["unitPrice"] ?? 0;
      const qty = Number(qtyRaw ?? 1);
      const price = Number(priceRaw ?? 0);
      return sum + price * qty;
    }, 0);

    const calcShipping = Number(recCart?.["shipping"] ?? 0);
    const calcDiscount = Number(recCart?.["discount"] ?? 0);
    const calcTotal = Number(
      recCart?.["total"] ?? calcSubtotal + calcShipping - calcDiscount
    );
    const curr = (recCart?.["currency"] as string) ?? "USD";

    return {
      subtotal: calcSubtotal,
      total: calcTotal,
      currency: curr,
    };
  }, [items, safeCartData]);

 const formatCurrency = (value: number) => {
  try {
    return new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US", {
      style: "currency",
      currency: "JOD", // hardcoded to Jordanian Dinar
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${value.toFixed(2)} JOD`;
  }
};

  return (
    <section
      dir={locale === "ar" ? "rtl" : "ltr"}
      className="w-[90%] mx-auto p-6 my-20"
    >
      <h2 className="text-2xl font-semibold mb-2">{t.title}</h2>
      <p className="text-sm text-gray-600 mb-6">{t.description}</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Payment options (take two columns on large screens) */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PaymentBox
              title={t.card}
              description={
                locale === "ar"
                  ? "ادفع بأمان عبر بطاقتك"
                  : "Pay securely with your card"
              }
              selected={selected === "card"}
              onClick={() => setSelected("card")}
              accentColor="#676e32"
              locale={locale}
              placementLabel={t.selected}
              icon={
                <svg
                  width="44"
                  height="44"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="2"
                    y="5"
                    width="20"
                    height="14"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <rect
                    x="2"
                    y="9"
                    width="20"
                    height="2"
                    rx="1"
                    fill="currentColor"
                  />
                </svg>
              }
            />

            <PaymentBox
              title={t.cod}
              description={
                locale === "ar"
                  ? "ادفع عند استلام الطلب"
                  : "Pay when your order arrives"
              }
              selected={selected === "cod"}
              onClick={() => setSelected("cod")}
              accentColor="#676e32"
              locale={locale}
              placementLabel={t.selected}
              icon={
                <svg
                  width="44"
                  height="44"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 7h18v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path d="M8 3v4" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              }
            />
          </div>

          <p className="mt-4 text-sm text-gray-500">{t.note}</p>
        </div>

        {/* Right: Order summary */}
        <aside
          className="bg-white rounded-2xl p-6 shadow-md border"
          style={{ borderColor: "#e6e6e6" }}
        >
          <h3 className="text-lg font-semibold mb-4">
            {locale === "ar" ? "ملخص الطلب" : "Order summary"}
          </h3>

      <div className={`space-y-3 ${items.length > 3 ? "max-h-72 overflow-auto" : ""}`}>
  {items.length === 0 ? (
    <div className="text-sm text-gray-500">
      {locale === "ar" ? "السلة فارغة" : "Your cart is empty"}
    </div>
  ) : (
   items.map((item, idx) => {
  const typeLabel = bookingTypeTranslations[locale][item.booking_type] ?? item.booking_type;
  const name = `${typeLabel} `;
  const price = item.price ?? 0;
  const qty = 1;

  return (
    <div key={idx} className="flex justify-between items-center">
      <div className="flex flex-col">
        <span className="text-sm font-medium">{name}</span>
        <span className="text-xs text-gray-500">
          {qty} × {formatCurrency(price)}
        </span>
      </div>
      <span className="text-sm font-medium">{formatCurrency(price * qty)}</span>
    </div>
  );
})

  )}
</div>


          <div className="border-t mt-4 pt-4 space-y-2 text-sm text-gray-700">
            <div className="flex justify-between text-lg font-semibold mt-2">
              <span>{locale === "ar" ? "الاجمالي" : "Total"}</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>

          {/* Proceed button placed inside the summary for easy reach */}
          <div className="mt-6">
            <DarkButton
              onClick={() => onConfirm?.(selected)}
              className="w-full py-3  font-semibold "
            >
              {t.proceed}{" "}
            </DarkButton>
            <LightButton
              onClick={() => router.push("/my-cart")}
              className="w-full py-3  font-semibold "
            >
              {locale === "ar" ? "الإنتقال إلى السلة" : "Go To Cart"}
            </LightButton>
          </div>
        </aside>
      </div>
    </section>
  );
}
