"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import DarkButton from "@/components/ui/dark-button";
import LightButton from "@/components/ui/light-button";

type PaymentStatus = "PAID" | "FAILED" | "PENDING" | string;

type StatusResponse = {
  ok?: boolean;
  status?: PaymentStatus;
  raw?: unknown;
  error?: string;
};

const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "support@example.com";

export default function PaymentResultPage() {
  const search = useSearchParams();
  const router = useRouter();
  const params = useParams();

  const locale =
    params?.locale === "ar" || params?.locale === "en"
      ? (params.locale as "ar" | "en")
      : "en";

  const isAr = locale === "ar";
  const dir = isAr ? "rtl" : "ltr";

  // required params from URL
  const resourcePath = search.get("resourcePath") ?? "";
  const checkoutId =
    resourcePath.match(/\/checkouts\/([^/]+)\/payment/)?.[1] ?? "";

  const t = {
    titleSuccess: isAr ? "تم الدفع بنجاح" : "Payment successful",
    titleFailed: isAr ? "فشل الدفع" : "Payment failed",
    titlePending: isAr ? "حالة الدفع" : "Payment status",

    descSuccess: isAr ? "تم تأكيد الحجز بنجاح." : "Your booking is confirmed.",
    descFailed: isAr
      ? "حدثت مشكلة أثناء الدفع. يمكنك إعادة المحاولة أو التواصل مع الدعم."
      : "There was a problem with the payment. You can retry or contact support.",
    descPending: isAr
      ? "جاري التحقق من حالة الدفع. قد يستغرق ذلك ثوانٍ."
      : "We're checking the payment status. This may take a few seconds.",

    checking: isAr ? "جاري التحقق…" : "Checking…",
    wait: isAr ? "قد يستغرق الأمر لحظات." : "This may take a moment.",

    retry: isAr ? "إعادة المحاولة" : "Retry",
    backToCart: isAr ? "العودة إلى السلة" : "Back to cart",
    viewBookings: isAr ? "عرض حجوزاتي" : "View my bookings",
    backHome: isAr ? "العودة للرئيسية" : "Back to home",
    backToCheckout: isAr ? "الرجوع للدفع" : "Back to checkout",

    details: isAr ? "تفاصيل الدفع" : "Payment details",
    toggleDetails: isAr ? "إظهار/إخفاء التفاصيل" : "Show/hide details",
    attemptsLeft: isAr ? "محاولات متبقية" : "Attempts left",
    noDataTitle: isAr ? "لا توجد بيانات دفع" : "No payment data",
    noDataDesc: isAr
      ? "لم يتم توفير معلومات الدفع. يرجى العودة لإتمام الطلب."
      : "No payment information was provided. Please return to checkout.",
  };

  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(false);

  const pollTimeoutRef = useRef<number | null>(null);
  const attemptsRef = useRef(0);
  const MAX_ATTEMPTS = 10;

  useEffect(() => {
    if (!resourcePath || !checkoutId) return;
    fetchStatus();
    return () => {
      if (pollTimeoutRef.current) window.clearTimeout(pollTimeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resourcePath, checkoutId]);

  const fetchStatus = async () => {
    if (!resourcePath || !checkoutId) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/payments/status?checkoutId=${encodeURIComponent(
          checkoutId
        )}&resourcePath=${encodeURIComponent(resourcePath)}`,
        { cache: "no-store" }
      );
      const json: StatusResponse = await res.json();
      setStatus(json);

      // begin polling if pending
      if (json.status === "PENDING" && !polling) {
        startPolling();
      }

      // stop polling if final
      if (json.status === "PAID" || json.status === "FAILED") {
        stopPolling();
      }
    } catch (err) {
      setStatus({ error: String(err) });
    } finally {
      setLoading(false);
    }
  };

  const startPolling = () => {
    if (polling) return;
    setPolling(true);
    attemptsRef.current = 0;

    const poll = async () => {
      attemptsRef.current += 1;
      await fetchStatus();

      if (attemptsRef.current >= MAX_ATTEMPTS) {
        stopPolling();
        return;
      }
      pollTimeoutRef.current = window.setTimeout(poll, 5000);
    };

    pollTimeoutRef.current = window.setTimeout(poll, 5000);
  };

  const stopPolling = () => {
    setPolling(false);
    if (pollTimeoutRef.current) {
      window.clearTimeout(pollTimeoutRef.current);
      pollTimeoutRef.current = null;
    }
  };

  const manualRetry = async () => {
    await fetchStatus();
  };

  const paid = status?.status === "PAID";
  const failed = status?.status === "FAILED";

  // Missing data
  if (!resourcePath || !checkoutId) {
    return (
      <div dir={dir} className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-xl bg-white rounded-2xl shadow p-8 text-center">
          <h2 className="text-2xl font-semibold mb-2">{t.noDataTitle}</h2>
          <p className="text-sm text-gray-600 mb-6">{t.noDataDesc}</p>
          <div className="flex gap-3 justify-center">
            <DarkButton onClick={() => router.push(`/${locale}/checkout`)}>
              {t.backToCheckout}
            </DarkButton>
            <LightButton onClick={() => router.push(`/${locale}`)}>
              {t.backHome}
            </LightButton>
          </div>
        </div>
      </div>
    );
  }

  // Initial loading (no status yet)
  if (loading && !status) {
    return (
      <div dir={dir} className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <div className="animate-spin w-14 h-14 border-4 border-emerald-200 border-t-emerald-600 rounded-full mx-auto mb-4" />
          <h3 className="font-semibold text-lg">{t.checking}</h3>
          <p className="text-sm text-gray-500">{t.wait}</p>
        </div>
      </div>
    );
  }

  return (
    <main dir={dir} className="min-h-screen flex items-center justify-center py-12 px-4 mt-4">
      <div className="w-full max-w-4xl mx-auto">
        <div className="relative">
          <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
            <div className="p-8 md:p-12 lg:p-16 flex flex-col md:flex-row gap-8 md:gap-6 items-start">
              {/* Status column */}
              <div className="shrink-0 flex items-center">
                <div
                  className={`rounded-2xl p-4 md:p-6 flex items-center justify-center shadow-inner transform transition-transform ${
                    paid
                      ? "bg-linear-to-tr from-emerald-50 to-emerald-100 ring-1 ring-emerald-200"
                      : failed
                      ? "bg-linear-to-tr from-red-50 to-red-100 ring-1 ring-red-200"
                      : "bg-linear-to-tr from-yellow-50 to-yellow-100 ring-1 ring-yellow-200"
                  }`}
                >
                  <div
                    className={`w-20 h-20 md:w-24 md:h-24 rounded-lg flex items-center justify-center ${
                      paid
                        ? "bg-linear-to-br from-emerald-600/10 to-emerald-200/10"
                        : failed
                        ? "bg-linear-to-br from-red-600/10 to-red-200/10"
                        : "bg-linear-to-br from-yellow-600/10 to-yellow-200/10"
                    }`}
                  >
                    {paid ? (
                      <CheckCircle className="w-12 h-12 md:w-14 md:h-14 text-emerald-600 drop-shadow-sm" />
                    ) : failed ? (
                      <XCircle className="w-12 h-12 md:w-14 md:h-14 text-red-600 drop-shadow-sm" />
                    ) : (
                      <Clock className="w-12 h-12 md:w-14 md:h-14 text-yellow-600 drop-shadow-sm" />
                    )}
                  </div>
                </div>
              </div>

              {/* Main content */}
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 leading-tight">
                      {paid
                        ? t.titleSuccess
                        : failed
                        ? t.titleFailed
                        : t.titlePending}
                    </h1>
                    <p className="text-sm md:text-base text-slate-600 mt-2 max-w-xl">
                      {paid ? t.descSuccess : failed ? t.descFailed : t.descPending}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    {polling && (
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
                        <div className="text-xs text-slate-500">{isAr ? "جاري التحقق" : "Checking"}</div>
                        <div className="text-xs text-slate-400 ml-1">· {Math.max(0, MAX_ATTEMPTS - attemptsRef.current)} {t.attemptsLeft}</div>
                      </div>
                    )}

                    {/* small status badge */}
                    <div
                      className={`text-xs px-3 py-1 rounded-full font-semibold ${
                        paid
                          ? "bg-emerald-50 text-emerald-700"
                          : failed
                          ? "bg-red-50 text-red-700"
                          : "bg-yellow-50 text-yellow-700"
                      }`}
                    >
                      {status?.status ?? (loading ? t.checking : "—")}
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div
                  className={`mt-6 grid gap-3 ${
                    paid ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-3"
                  }`}
                >
                  {paid && (
                    <>
                      <DarkButton
                        onClick={() => router.push(`/${locale}/my-bookings`)}
                        className="w-full"
                      >
                        {t.viewBookings}
                      </DarkButton>
                      <LightButton onClick={() => router.push(`/${locale}`)} className="w-full">
                        {t.backHome}
                      </LightButton>
                    </>
                  )}

                  {failed && (
                    <>
                      <DarkButton onClick={() => router.push(`/${locale}/my-cart`)} className="w-full">
                        {t.backToCart}
                      </DarkButton>

                      <LightButton
                        onClick={() =>
                          router.push(
                            `/${locale}/checkout?resourcePath=${encodeURIComponent(resourcePath)}`
                          )
                        }
                        className="w-full"
                      >
                        <span className="ml-1">{t.backToCheckout}</span>
                      </LightButton>

                      <LightButton onClick={manualRetry} className="w-full">
                        {t.retry}
                      </LightButton>
                    </>
                  )}

                  {!paid && !failed && (
                    <>
                      <DarkButton onClick={manualRetry} disabled={loading} className="w-full">
                        {t.retry}
                      </DarkButton>
                      <LightButton onClick={() => router.push(`/${locale}/my-cart`)} className="w-full">
                        {t.backToCart}
                      </LightButton>
                      <LightButton onClick={() => router.push(`/${locale}`)} className="w-full">
                        {t.backHome}
                      </LightButton>
                    </>
                  )}
                </div>

                {/* small helper + details collapsed area */}
                <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="text-sm text-slate-500">
                    {isAr ? "للمساعدة:" : "Need help:"} {" "}
                    <a href={`mailto:${CONTACT_EMAIL}`} className="text-indigo-600 underline">
                      {CONTACT_EMAIL}
                    </a>
                  </div>

                </div>
              </div>
            </div>

            {/* Optional: show raw response (collapsed by default on small screens) */}
            <div className="border-t border-gray-100 px-6 py-4 bg-gray-50/60">
              <div className="max-w-full text-sm text-slate-600">
                <strong className="text-slate-700 mr-2">{t.details}:</strong>
                <span className="inline-block mt-1 md:mt-0 wrap-break-word">
                  {status?.error ? (
                    <span className="text-red-600">{status.error}</span>
                  ) : status?.status ? (
                    <span>{status.status}</span>
                  ) : (
                    <span className="text-slate-400">{t.checking}</span>
                  )}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
