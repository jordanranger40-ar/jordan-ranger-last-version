"use client";

import { Lock } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type LocaleType = "en" | "ar";

interface WpwlOptions {
  locale?: string;
  style?: string;
  paymentTarget?: string;
}

declare global {
  interface Window {
    wpwlOptions?: WpwlOptions;
  }
}

interface Props {
  checkoutId: string;
  locale: LocaleType;
  className?: string;
}

const ACCENT = "#484d23"; 
export default function HyperPayWidget({
  checkoutId,
  locale,
  className = "",
}: Props) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const scriptId = useRef<string>(`hyperpay-widget-${checkoutId}`);

  const isAr = locale === "ar";

  const texts = {
    title: isAr ? "وسيلة الدفع الآمنة" : "Secure payment",
    subtitle: isAr
      ? "أدخِل تفاصيل بطاقتك. لن يتم حفظ بيانات البطاقة على موقعنا."
      : "Enter your card details. Card data is never stored on our site.",
    loading: isAr ? "جارٍ تحميل نموذج الدفع…" : "Loading payment form…",
    failed: isAr ? "تعذّر تحميل نموذج الدفع" : "Failed to load payment form",
    tryAgain: isAr ? "حاول مرة أخرى" : "Try again",
    contact: isAr ? "تواصل مع الدعم" : "Contact support",
    poweredBy: isAr ? "مدعوم بواسطة HyperPay" : "Powered by HyperPay",
    errorHint: isAr
      ? "الرجاء التأكد من اتصال الإنترنت أو المحاولة لاحقًا."
      : "Please check your connection or try again later.",
  };

  useEffect(() => {
    setLoaded(false);
    setError(false);

    window.wpwlOptions = {
      locale: isAr ? "ar" : "en",
      style: "card",
      paymentTarget: "_top",
    };

    const host = process.env.NEXT_PUBLIC_HYPERPAY_HOST ?? "eu-test.oppwa.com";
    const src = `https://${host}/v1/paymentWidgets.js?checkoutId=${checkoutId}`;

    const existing = document.getElementById(scriptId.current);
    if (existing) existing.remove();

    const script = document.createElement("script");
    script.id = scriptId.current;
    script.src = src;
    script.async = true;
    script.onload = () => setTimeout(() => setLoaded(true), 300);
    script.onerror = () => {
      setError(true);
      setLoaded(false);
    };

    document.body.appendChild(script);

    return () => {
      const el = document.getElementById(scriptId.current);
      if (el) el.remove();
      delete window.wpwlOptions;
    };
  }, [checkoutId, isAr]);

  const handleRetry = () => {
    setError(false);
    setLoaded(false);

    const el = document.getElementById(scriptId.current);
    if (el) el.remove();

    scriptId.current = `hyperpay-widget-${checkoutId}-${Date.now()}`;

    const host = process.env.NEXT_PUBLIC_HYPERPAY_HOST ?? "eu-test.oppwa.com";
    const src = `https://${host}/v1/paymentWidgets.js?checkoutId=${checkoutId}`;
    const script = document.createElement("script");
    script.id = scriptId.current;
    script.src = src;
    script.async = true;
    script.onload = () => setTimeout(() => setLoaded(true), 300);
    script.onerror = () => setError(true);

    document.body.appendChild(script);
  };

  return (
    <section
      aria-live="polite"
      dir={isAr ? "rtl" : "ltr"}
      className={`max-w-xl mx-auto ${className}`}
      style={{
        // subtle drop shadow using accent tone
        boxShadow: `0 8px 30px rgba(72,77,35,0.09)`,
      }}
    >
      {/* Outer shell with left accent stripe (RTL-aware) */}
      <div
        className={`relative rounded-xl overflow-hidden bg-white`}
        style={{
          border: "1px solid rgba(15,23,42,0.06)",
        }}
      >
        {/* Accent stripe */}
        <div
          aria-hidden
          style={{
            background: ACCENT,
            width: 10,
            position: "absolute",
            top: 0,
            bottom: 0,
            left: isAr ? undefined : 0,
            right: isAr ? 0 : undefined,
            opacity: 0.95,
          }}
        />

        {/* content padding (leave space for stripe with padding-left/right) */}
        <div
          className="p-5 sm:p-6 w-full"
          style={{ paddingLeft: isAr ? 22 : 20, paddingRight: isAr ? 20 : 22 }}
        >
          {/* Header */}
          <header
            className={`flex items-start gap-4 ${isAr ? "flex-row-reverse" : ""}`}
          >
            <div
              className="shrink-0 w-14 h-14 rounded-lg flex items-center justify-center"
              style={{
                background: `linear-gradient(180deg, ${ACCENT}20, ${ACCENT}10)`,
                border: `1px solid ${ACCENT}20`,
              }}
            >
              <Lock className="text-[16px]" style={{ color: ACCENT }} />
            </div>

            <div className="flex-1 min-w-0">
              <h3
                className="text-base font-semibold leading-tight"
                style={{ color: "#0f172a" }}
              >
                {texts.title}
              </h3>
              <p className="text-sm mt-1 text-gray-600" style={{ color: "#52606a" }}>
                {texts.subtitle}
              </p>
            </div>
          </header>

          {/* Card body */}
          <div
            className="mt-4 rounded-md "
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.85), rgba(250,250,250,0.9))",
              border: "1px solid rgba(15,23,42,0.04)",
              minHeight: 300,
              paddingTop:5
            }}
          >
            {/* Loading */}
            {!loaded && !error && (
              <div className="flex flex-col items-center justify-center py-6">
                <div className="w-full max-w-xs space-y-3">
                  <div className="h-8 rounded-md" style={{ background: "linear-gradient(90deg,#f7f7f7,#f2f2f2)" }} />
                  <div className="h-12 rounded-md" style={{ background: "linear-gradient(90deg,#f7f7f7,#f2f2f2)" }} />
                  <div className="h-12 rounded-md" style={{ background: "linear-gradient(90deg,#f7f7f7,#f2f2f2)" }} />
                </div>

                <div className="flex items-center gap-3 mt-6" role="status" aria-live="polite">
                  <svg
                    className="animate-spin"
                    width="36"
                    height="36"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    style={{ color: ACCENT }}
                  >
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.15" fill="none" />
                    <path fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  <p className="text-sm" style={{ color: "#4b5563" }}>{texts.loading}</p>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <p className="font-semibold mb-2" style={{ color: "#b91c1c" }}>{texts.failed}</p>
                <p className="text-sm text-gray-600 mb-4">{texts.errorHint}</p>

                <div className={`flex gap-3 ${isAr ? "flex-row-reverse" : ""}`}>
                  <button
                    onClick={handleRetry}
                    type="button"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-white text-sm font-medium"
                    style={{
                      background: ACCENT,
                      boxShadow: `0 6px 20px ${ACCENT}30`,
                    }}
                  >
                    {texts.tryAgain}
                  </button>

                  <a
                    className="inline-flex items-center px-4 py-2 rounded-md border text-sm"
                    href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`}
                    style={{
                      borderColor: "#e6e9eb",
                      color: "#374151",
                      background: "white",
                    }}
                  >
                    {texts.contact}
                  </a>
                </div>
              </div>
            )}

            {/* Widget */}
            {!error && (
              <div className={`${loaded ? "" : "hidden"}`} dir={isAr ? "rtl" : "ltr"}>
                <form className="paymentWidgets" data-brands="VISA MASTER" />
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-xs" style={{ color: "#6b7280" }}>{texts.poweredBy}</p>
                  <small style={{ color: ACCENT, fontWeight: 600 }}>Secure</small>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
