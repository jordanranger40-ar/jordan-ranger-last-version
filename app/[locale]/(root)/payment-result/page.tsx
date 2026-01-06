"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import DarkButton from "@/components/ui/dark-button";
import LightButton from "@/components/ui/light-button";

type PaymentStatus = "PAID" | "FAILED" | "PENDING" | string;

type StatusResponse = {
  ok?: boolean;
  status?: PaymentStatus;
  raw?: unknown;
  error?: string;
};

export default function PaymentResultPage() {
  const search = useSearchParams();
  const router = useRouter();
  const params = useParams();

  // ✅ locale from route params (App Router way)
  const locale =
    params?.locale === "ar" || params?.locale === "en"
      ? (params.locale as "ar" | "en")
      : "en";

  const isAr = locale === "ar";
  const dir = isAr ? "rtl" : "ltr";

  const resourcePath = search.get("resourcePath") ?? "";

  const t = {
    titleSuccess: isAr ? "تم الدفع بنجاح" : "Payment successful",
    titleFailed: isAr ? "فشل الدفع" : "Payment failed",
    titlePending: isAr ? "حالة الدفع" : "Payment status",

    descSuccess: isAr ? "تم تأكيد الحجز بنجاح." : "Your booking is confirmed.",
    descFailed: isAr
      ? "حدثت مشكلة أثناء الدفع."
      : "There was a problem with the payment.",
    descPending: isAr
      ? "جاري التحقق من حالة الدفع."
      : "We are checking the payment status.",

    checking: isAr ? "جاري التحقق من حالة الدفع…" : "Checking payment status…",
    wait: isAr ? "قد يستغرق الأمر لحظات." : "This may take a moment.",

    retry: isAr ? "إعادة المحاولة" : "Retry now",
    showDetails: isAr ? "عرض التفاصيل" : "Show details",
    hideDetails: isAr ? "إخفاء التفاصيل" : "Hide details",

    nextCheck: isAr ? "المحاولة التالية بعد" : "Next check in",
    seconds: isAr ? "ثوانٍ" : "s",

    backToCart: isAr ? "العودة إلى السلة" : "Back to cart",
    viewBookings: isAr ? "عرض حجوزاتي" : "View my bookings",
    backHome: isAr ? "العودة للرئيسية" : "Back to home",
    contactSupport: isAr ? "التواصل مع الدعم" : "Contact support",
    checkout: isAr ? "العودة للدفع" : "Back to checkout",

    noDataTitle: isAr ? "لا توجد بيانات دفع" : "No payment data",
    noDataDesc: isAr
      ? "لم يتم توفير معلومات الدفع. يرجى العودة لإتمام الطلب."
      : "No payment information was provided. Please return to checkout.",
  };

  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(false);
  const [nextPollIn, setNextPollIn] = useState<number | null>(null);
  const [showRaw, setShowRaw] = useState(false);

  const pollRef = useRef<number | null>(null);
  const countdownRef = useRef<number | null>(null);
  const attemptsRef = useRef(0);
  const MAX_ATTEMPTS = 12;

  useEffect(() => {
    if (!resourcePath) return;
    fetchStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resourcePath]);

  useEffect(() => {
    return () => {
      if (pollRef.current) window.clearTimeout(pollRef.current);
      if (countdownRef.current) window.clearInterval(countdownRef.current);
    };
  }, []);

  const fetchStatus = async () => {
    if (!resourcePath) return;
    setLoading(true);

    try {
      const res = await fetch(
        `/api/payments/status?resourcePath=${encodeURIComponent(resourcePath)}`,
        { cache: "no-store" }
      );
      const json: StatusResponse = await res.json();
      setStatus(json);

      if (json.status === "PENDING") startPolling();
      else stopPolling();
    } catch (err) {
      setStatus({ error: String(err) });
    } finally {
      setLoading(false);
    }
  };

  const startPolling = (intervalSeconds = 5) => {
    if (polling) return;
    setPolling(true);
    attemptsRef.current = 0;
    setNextPollIn(intervalSeconds);

    countdownRef.current = window.setInterval(() => {
      setNextPollIn((prev) => (prev && prev > 0 ? prev - 1 : intervalSeconds));
    }, 1000);

    const tick = async () => {
      attemptsRef.current += 1;
      await fetchStatus();
      if (attemptsRef.current >= MAX_ATTEMPTS) stopPolling();
      else pollRef.current = window.setTimeout(tick, intervalSeconds * 1000);
    };

    pollRef.current = window.setTimeout(tick, intervalSeconds * 1000);
  };

  const stopPolling = () => {
    setPolling(false);
    setNextPollIn(null);
    if (pollRef.current) window.clearTimeout(pollRef.current);
    if (countdownRef.current) window.clearInterval(countdownRef.current);
  };

  const paid = status?.ok === true || status?.status === "PAID";
  const failed = status?.status === "FAILED" || status?.ok === false;

  if (!resourcePath) {
    return (
      <div dir={dir} className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-xl bg-white rounded-xl shadow p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">{t.noDataTitle}</h2>
          <p className="text-sm text-gray-600 mb-6">{t.noDataDesc}</p>
          <DarkButton onClick={() => router.push(`/${locale}/checkout`)}>
            {t.checkout}
          </DarkButton>
        </div>
      </div>
    );
  }

  if (loading && !status) {
    return (
      <div dir={dir} className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full mx-auto mb-4" />
          <h3 className="font-semibold">{t.checking}</h3>
          <p className="text-sm text-gray-500">{t.wait}</p>
        </div>
      </div>
    );
  }

  return (
    <div dir={dir} className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow p-6">
        <h2 className="text-2xl font-semibold mb-2">
          {paid ? t.titleSuccess : failed ? t.titleFailed : t.titlePending}
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          {paid ? t.descSuccess : failed ? t.descFailed : t.descPending}
        </p>

        <div className="flex gap-3 flex-wrap">
          {paid && (
            <>
              <DarkButton onClick={() => router.push(`/${locale}/my-bookings`)}>
                {t.viewBookings}
              </DarkButton>
              <LightButton onClick={() => router.push(`/${locale}`)}>
                {t.backHome}
              </LightButton>
            </>
          )}

          {failed && (
            <>
              <DarkButton onClick={() => router.push(`/${locale}/my-cart`)}>
                {t.backToCart}
              </DarkButton>
              <LightButton>
                <a href="mailto:support@example.com">{t.contactSupport}</a>
              </LightButton>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
