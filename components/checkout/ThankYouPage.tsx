"use client";

import React from "react";
import { CheckCircle } from "lucide-react";
import DarkButton from "../ui/dark-button";
import LightButton from "../ui/light-button";
import { useRouter } from "next/navigation";

type Locale = "en" | "ar";

interface Props {
  paramsData: {
    userEmail: string;
    total_amount: number;
    locale: Locale;
  };
}

export default function ThankYouPage({ paramsData }: Props) {
  const { userEmail, total_amount, locale } = paramsData;
  const router = useRouter();

  const t = {
    en: {
      headline: "Thank you — transfer received",
      subtitle:
        "We’ve received your transfer confirmation. Our team will verify your payment and confirm your booking via email.",
      nextStepsTitle: "What happens next",
      nextSteps: [
        "We verify payments manually — this may take up to 24 hours.",
        "You will receive a confirmation email once your booking is verified.",
        "If we need more information we will contact you by email.",
      ],
      viewOrders: "Go to Cart",
      backHome: "Back to Home",
      amountLabel: "Amount",
      emailLabel: "Email",
      orderRefLabel: "Order reference",
      supportNote:
        `For urgent issues call or message us at ${process.env.NEXT_PUBLIC_PHONE_NUMBER} (WhatsApp).`,
    },
    ar: {
      headline: "شكراً — استلمنا تأكيد التحويل",
      subtitle:
        "لقد استلمنا معلومات تأكيد التحويل. سيقوم فريقنا بالتحقق من الدفع وتأكيد الحجز عبر البريد الإلكتروني.",
      nextStepsTitle: "ما الذي سيحدث بعد ذلك",
      nextSteps: [
        "نقوم بالتحقق يدوياً من المدفوعات — قد يستغرق ذلك حتى 24 ساعة.",
        "ستتلقى رسالة تأكيد بالبريد الإلكتروني عند التحقق من الحجز.",
        "إذا احتجنا إلى معلومات إضافية سنتواصل معك عبر البريد.",
      ],
      viewOrders: "الإنتقال إلى السلة",
      backHome: "العودة للرئيسية",
      amountLabel: "المبلغ",
      emailLabel: "البريد الإلكتروني",
      orderRefLabel: "مرجع الطلب",
      supportNote:
        `لحالات الطوارئ اتصل أو راسلنا على ${process.env.NEXT_PUBLIC_PHONE_NUMBER} (واتساب).`,
    },
  }[locale];

  const formatAmount = (val: number) => {
    const en = Number(val).toFixed(2);
    const currencyLabel = locale === "ar" ? "دينار" : "JOD";
    return `${en} ${currencyLabel}`;
  };

  return (
    <div
      dir={locale === "ar" ? "rtl" : "ltr"}
      className="min-h-screen flex items-center justify-center bg-gray-50 p-6 mt-14"
    >
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-xl w-full">
        <div className="flex flex-col items-center text-center gap-4">
          <div
            className="rounded-full p-3"
            style={{ background: "rgba(103,110,50,0.08)" }}
          >
            <CheckCircle className="text-[#2f7a3a]" size={56} />
          </div>
          <h1 className="text-2xl font-semibold text-gray-800">{t.headline}</h1>
          <p className="text-gray-600">{t.subtitle}</p>
        </div>

        {/* Details */}
        <div className="mt-6 grid grid-cols-1 gap-3">
            <div className="flex justify-between items-center bg-gray-50 rounded-md p-3">
            <div className="text-sm text-gray-600">{t.amountLabel}:</div>
            <div className="font-medium text-gray-800">{ formatAmount(total_amount)}</div>
          </div>
          <div className="flex justify-between items-center bg-gray-50 rounded-md p-3">
            <div className="text-sm text-gray-600">{t.emailLabel}</div>
            <div className="font-medium text-gray-800">{userEmail}</div>
          </div>
        </div>

        {/* Next steps / important info */}
        <div className="mt-6 space-y-3">
          <h3 className="text-sm font-semibold text-gray-700">{t.nextStepsTitle}</h3>
          <ul className="list-inside list-disc text-gray-600 space-y-1 text-sm">
            {t.nextSteps.map((s, idx) => (
              <li key={idx}>{s}</li>
            ))}
          </ul>
          <div className="mt-3 p-3 rounded-md bg-white border border-gray-100">
            <p className="text-sm text-gray-700">{t.supportNote}</p>
            <p className="text-sm text-gray-600 mt-1">
              <strong>{locale === "ar" ? "البريد:" : "Email:"}</strong>{" "}
              <a className="text-[#676e32] underline" href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`}>
                {process.env.NEXT_PUBLIC_CONTACT_EMAIL}
              </a>
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <DarkButton
            onClick={() => router.push("/my-cart")}
            className="flex-1 py-3"
            style={{ backgroundColor: "#676e32" }}
          >
            {t.viewOrders}
          </DarkButton>

          <LightButton
            onClick={() => router.push("/")}
            className="flex-1 py-3"
          >
            {t.backHome}
          </LightButton>
        </div>
      </div>
    </div>
  );
}
