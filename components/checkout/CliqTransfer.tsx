"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DarkButton from "@/components/ui/dark-button";
import LightButton from "@/components/ui/light-button";
type Locale = "en" | "ar";

const BANK_INFO = {
  accountName: "My Store Account",
  bankName: "Example Bank",
  IBAN: "JO12EXAM1234567890",
  phoneNumber: "+962 79 123 4567",
};

interface Props {
  locale?: Locale;
  totalAmount: number;
}
export default function BankTransferPage({
  locale = "en",
  totalAmount,
}: Props) {
  const router = useRouter();
  const [copied, setCopied] = useState<{ [k: string]: boolean }>({});

  const t = {
    en: {
      title: "Payment Method",
      instructions: "Transfer via CLIQ",
      amountLabel: "Amount to transfer",
      accountName: "Account Name",
      bankName: "Bank Name",
      IBAN: "IBAN",
      phoneNumber: "Phone Number",
      note1: "Include your booking number in the reference.",
      note2: "Payment confirmation may take up to 24 hours.",
      transferNotice:
        "After you transfer, please fill the confirmation form on the next page so we can match your payment.",
      emailNotice:
        "You will receive a confirmation email within 24 hours once payment is verified.",
      copied: "Copied",
      copy: "Copy",
      iTransferred: "I have transferred the amount",
      back: "Back",
    },
    ar: {
      title: "طريقة الدفع",
      instructions: "التحويل من خلال كليك",
      amountLabel: "المبلغ المراد تحويله",
      accountName: "اسم الحساب",
      bankName: "اسم البنك",
      IBAN: "رقم الايبان",
      phoneNumber: "رقم الهاتف",
      note1: "يرجى تضمين رقم الحجز في المرجع.",
      note2: "قد يستغرق تأكيد الدفع ما يصل إلى 24 ساعة.",
      transferNotice:
        "بعد التحويل، يرجى تعبئة نموذج تأكيد الدفع في الصفحة التالية حتى نتمكن من مطابقة الدفع.",
      emailNotice: "ستتلقى رسالة إلكترونية لتأكيد الحجز خلال 24 ساعة.",
      copied: "تم النسخ",
      copy: "نسخ",
      iTransferred: "لقد قمت بتحويل المبلغ",
      back: "العودة",
    },
  }[locale];

  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\s+/g, "").replace(/^\+/, "");
    return `00${cleaned}`;
  };

  const formatCurrency = (value: number) => {
    try {
      const numberInEnglish = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);

      const currencyLabel = locale === "ar" ? "أ.د" : "JOD";

      return `${numberInEnglish} ${currencyLabel}`;
    } catch {
      return `${value.toFixed(2)} ${locale === "ar" ? "أ.د" : "JOD"}`;
    }
  };

  async function copyToClipboard(key: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied((s) => ({ ...s, [key]: true }));
      setTimeout(() => setCopied((s) => ({ ...s, [key]: false })), 1500);
    } catch {
      // ignore
    }
  }

  return (
    <section
      dir={locale === "ar" ? "rtl" : "ltr"}
      className="w-[90%] max-w-4xl mx-auto my-20"
    >
      {/* Header */}
      <div
        className="rounded-xl p-4 mb-6"
        style={{
          background:
            "linear-gradient(90deg, rgba(103,110,50,0.08), rgba(103,110,50,0.02))",
          borderLeft: "4px solid #676e32",
        }}
      >
        <h1 className="text-2xl font-semibold" style={{ color: "#24312a" }}>
          {t.title}
        </h1>
        <p className="text-sm text-gray-600 mt-1">{t.instructions}</p>

        {/* Amount block */}
      </div>

      {/* Card */}
      <Card className="shadow-sm border border-gray-100">
        <CardHeader className="border-b py-0 [.border-b]:pb-2 ">
          <CardTitle>
            <div>
              <h1 className="text-lg font-semibold">
                {locale === "ar"
                  ? "أكمل دفع كليك الخاص بك"
                  : "Complete Your CLIQ Payment"}
              </h1>
              <p className="text-gray-400 text-sm mt-2">
                {locale === "ar"
                  ? "قم بتحويل مبلغ الطلب المحدد إلى حساب كليك الخاص بنا:"
                  : "Transfer the exact order amount to our CLIQ account:"}
              </p>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Details grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Phone */}
            <div className="bg-white border rounded-lg p-3 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">{t.phoneNumber}</p>
                <p className="font-medium mt-1">
                  {formatPhoneNumber(BANK_INFO.phoneNumber)}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <button
                  onClick={() =>
                    copyToClipboard(
                      "phone",
                      formatPhoneNumber(BANK_INFO.phoneNumber)
                    )
                  }
                  className="text-sm px-3 py-1 rounded-md border border-gray-200 hover:bg-gray-50"
                >
                  {copied["phone"] ? t.copied : t.copy}
                </button>
              </div>
            </div>

            {/* IBAN */}
            <div className="bg-white border rounded-lg p-3 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">{t.IBAN}</p>
                <p className="font-medium mt-1">{BANK_INFO.IBAN}</p>
              </div>
              <div>
                <button
                  onClick={() => copyToClipboard("iban", BANK_INFO.IBAN)}
                  className="text-sm px-3 py-1 rounded-md border border-gray-200 hover:bg-gray-50"
                >
                  {copied["iban"] ? t.copied : t.copy}
                </button>
              </div>
            </div>

            {/* Account name */}
            <div className="bg-white border rounded-lg p-3">
              <p className="text-xs text-gray-500">{t.accountName}</p>
              <p className="font-medium mt-1">{BANK_INFO.accountName}</p>
            </div>

            {/* Bank name */}
            <div className="bg-white border rounded-lg p-3">
              <p className="text-xs text-gray-500">{t.bankName}</p>
              <p className="font-medium mt-1">{BANK_INFO.bankName}</p>
            </div>
          </div>

          {/* Summary row inside card */}
          <div className="flex items-center justify-between rounded-md p-3 bg-gray-50 border border-gray-100">
            <div className="text-sm text-gray-600">
              {locale === "ar" ? "المبلغ المراد تحويله" : "Amount to transfer"}
            </div>
            <div className="text-lg font-semibold text-[#676e32]">
              {formatCurrency(totalAmount)}
            </div>
          </div>

          {/* Notes */}
          <div className="text-sm text-gray-700 space-y-2">
            <p>• {t.note2}</p>
            <p className="mt-2 text-sm text-gray-600">• {t.transferNotice}</p>
            <p className="text-sm text-gray-600">• {t.emailNotice}</p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <DarkButton
              onClick={() => router.push("cashOnDelivery/transfer-confirmation")}
              className="flex-1 py-3"
              style={{ backgroundColor: "#676e32" }}
            >
              {t.iTransferred}
            </DarkButton>

            <LightButton onClick={() => router.back()} className="flex-1 py-3">
              {t.back}
            </LightButton>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
