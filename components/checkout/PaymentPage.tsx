"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import LightButton from "@/components/ui/light-button";
import DarkButton from "@/components/ui/dark-button";
import { newCart } from "@/types";

type LocaleType = "en" | "ar";

interface Props {
  cartDetails: newCart;
  Locale: LocaleType;
}

/** HyperPay widget options (partial, only what we use) */
type WpwlLabels = {
  cardHolder?: string;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  pay?: string;
};

type WpwlOptions = {
  locale?: string;
  style?: string;
  labels?: WpwlLabels;
};

/** Extend global Window type to include wpwlOptions (safe, typed) */
declare global {
  interface Window {
    wpwlOptions?: WpwlOptions;
  }
}

export default function PaymentPage({ cartDetails, Locale }: Props) {
  const search = useSearchParams();
  const router = useRouter();
  const checkoutId = search.get("checkoutId");
  const amount = Number(cartDetails?.total_amount ?? 0);
  const currency = search.get("currency") ?? "JOD";

  const [widgetLoaded, setWidgetLoaded] = useState(false);
  const [widgetError, setWidgetError] = useState<string | null>(null);

  const isAr = Locale === "ar";
  const dir = isAr ? "rtl" : "ltr";
  const textAlignClass = isAr ? "text-right" : "text-left";

  const t = {
    title: isAr ? "إتمام عملية الدفع" : "Complete your payment",
    subtitle: isAr
      ? "الدفع آمن ومشفر عبر HyperPay"
      : "Secure payment powered by HyperPay",
    amountLabel: isAr ? "المبلغ المطلوب" : "Amount to pay",
    loadingTitle: isAr ? "جاري تحميل نموذج الدفع…" : "Loading payment form…",
    loadingDesc: isAr
      ? "يرجى عدم تحديث الصفحة"
      : "This should take a second. Do not refresh the page.",
    orderSummary: isAr ? "ملخص الطلب" : "Order summary",
    orderHint: isAr
      ? "راجع تفاصيل طلبك قبل الدفع"
      : "Check your booking details before paying.",
    total: isAr ? "الإجمالي" : "Total",
    payNow: isAr ? "ادفع الآن" : "Pay Now",
    backToCart: isAr ? "العودة إلى السلة" : "Go To Cart",
    retry: isAr ? "إعادة المحاولة" : "Retry",
    widgetError: isAr ? "فشل تحميل نموذج الدفع" : "Failed to load payment form",
    missingTitle: isAr ? "الدفع غير متاح" : "Payment Not Ready",
    missingDesc: isAr
      ? "لم يتم العثور على جلسة دفع صالحة"
      : "We couldn't find a checkout session for this page.",
    backToCheckout: isAr ? "العودة للدفع" : "Back to Checkout",
  };

  useEffect(() => {
    if (!checkoutId) return;

    // define typed wpwl options BEFORE loading the widget script
    const labels: WpwlLabels =
      Locale === "ar"
        ? {
            cardHolder: "اسم حامل البطاقة",
            cardNumber: "رقم البطاقة",
            expiryDate: "تاريخ الانتهاء",
            cvv: "رمز الأمان",
            pay: "ادفع الآن",
          }
        : {
            cardHolder: "Card holder name",
            cardNumber: "Card number",
            expiryDate: "Expiry date",
            cvv: "CVV",
            pay: "Pay now",
          };

    window.wpwlOptions = {
      locale: Locale === "ar" ? "ar" : "en",
      style: "card",
      labels,
    };

    const host = process.env.NEXT_PUBLIC_HYPERPAY_HOST ?? "eu-test.oppwa.com";
    const src = `https://${host}/v1/paymentWidgets.js?checkoutId=${checkoutId}`;

    // avoid loading twice
    if (document.querySelector(`script[data-hyperpay="${checkoutId}"]`)) {
      setWidgetLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.setAttribute("data-hyperpay", checkoutId);

    script.onload = () => setTimeout(() => setWidgetLoaded(true), 250);
    script.onerror = () => setWidgetError(t.widgetError);

    document.body.appendChild(script);

    return () => {
      try {
        document.body.removeChild(script);
      } catch {
        /* ignore */
      }
      // cleanup the wpwlOptions to avoid leaking locale between navigations
      try {
        delete window.wpwlOptions;
      } catch {}
    };
  }, [checkoutId, Locale, t.widgetError]);

  if (!checkoutId) {
    return (
      <div
        dir={dir}
        className="min-h-screen flex items-center justify-center bg-linear-to-b from-gray-50 to-white p-6"
      >
        <div
          className={`max-w-xl w-full bg-white rounded-2xl shadow-xl p-8 ${textAlignClass}`}
        >
          <h1 className="text-2xl font-bold mb-2">{t.missingTitle}</h1>
          <p className="text-gray-600 mb-6">{t.missingDesc}</p>

          <div className="flex justify-center gap-3">
            {" "}
            <DarkButton onClick={() => router.push("/checkout")}>
              {" "}
              {t.backToCheckout}
            </DarkButton>{" "}
            <LightButton onClick={() => router.push("/my-cart")}>
              {t.backToCart}
            </LightButton>{" "}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      dir={dir}
      className="min-h-screen bg-linear-to-b from-gray-50 to-white p-6"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payment */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl p-8">
          <div className={textAlignClass}>
            <h2 className="text-3xl font-bold mb-1">{t.title}</h2>
            <p className="text-gray-500 mb-6">{t.subtitle}</p>
          </div>

          <div
            className={`flex justify-between bg-gray-50 p-4 rounded-xl mb-6 ${
              isAr ? "flex-row-reverse" : ""
            }`}
          >
            <div className={textAlignClass}>
              <p className="text-xs text-gray-500">{t.amountLabel}</p>
              <p className="text-xl font-semibold">
                {formatCurrency(amount, currency, Locale)}
              </p>
            </div>
            <span className="text-sm text-gray-400">
              🔒 {isAr ? "آمن" : "Secure"}
            </span>
          </div>

          <div className="min-h-80 border-dashed border rounded-xl p-6">
            {!widgetLoaded && !widgetError && (
              <div className={`text-center ${textAlignClass}`}>
                <p className="font-medium">{t.loadingTitle}</p>
                <p className="text-sm text-gray-500 mt-1">{t.loadingDesc}</p>
              </div>
            )}

            {widgetError && (
              <div className={`text-center text-red-600 ${textAlignClass}`}>
                <p className="font-semibold">{t.widgetError}</p>
                <DarkButton onClick={() => window.location.reload()}>
 {t.retry}
                </DarkButton>
              </div>
            )}

            <div className={widgetLoaded ? "" : "hidden"}>
              <form
                action="/payment-result"
                className="paymentWidgets"
                data-brands="VISA MASTER MADA"
              />
            </div>
          </div>
        </div>

        {/* Summary */}
        <aside
          className={`bg-white rounded-3xl shadow-lg p-6 ${textAlignClass}`}
        >
          <h3 className="text-lg font-semibold">{t.orderSummary}</h3>
          <p className="text-sm text-gray-500 mb-4">{t.orderHint}</p>

          <div className="border-t pt-4">
            <div className="flex justify-between mb-3">
              <span>{t.total}</span>
              <span className="font-bold">
                {formatCurrency(amount, currency, Locale)}
              </span>
            </div>

            <DarkButton
              className="w-full"
              onClick={() =>
                document
                  .querySelector<HTMLFormElement>(".paymentWidgets")
                  ?.submit()
              }
            >
              {t.payNow}
            </DarkButton>

            <LightButton
              className="w-full mt-3"
              onClick={() => router.push("/my-cart")}
            >
              {t.backToCart}
            </LightButton>
          </div>
        </aside>
      </div>
    </div>
  );
}

function formatCurrency(value: number, currency: string, locale: LocaleType) {
  try {
    return new Intl.NumberFormat(locale === "ar" ? "ar-JO" : "en-US", {
      style: "currency",
      currency,
    }).format(value);
  } catch {
    return `${value.toFixed(2)} ${currency}`;
  }
}
