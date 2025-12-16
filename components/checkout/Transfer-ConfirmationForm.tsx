"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DarkButton from "@/components/ui/dark-button";
import LightButton from "@/components/ui/light-button";
import { cartWithItems, newCart } from "@/types";
import { toast } from "sonner";
import { EmailData } from "@/types/index";

type Locale = "en" | "ar";

interface Props {
  locale?: Locale;
  cartData: newCart;
  email: string;
  id: string;
  expireAt:string;
  emailAction: (data: EmailData) => Promise<void>;
}

export default function TransferConfirmationForm({
  locale = "en",
  cartData,
  email,
  id,
  expireAt,
  emailAction,
}: Props) {
  const router = useRouter();
  const [accountName, setAccountName] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const t = {
    en: {
      title: "Transfer Confirmation",
      instructions:
        "Please enter the account name you transferred from. We will send this information to the admin to confirm your booking. You will receive a confirmation email within 24 hours.",
      accountLabel: "Account name (required)",
      noteLabel: "Optional note (bank reference, time...)",
      readonly: "This field is read-only",
      submit: "Send confirmation",
      back: "Back",
      amountLabel: "Amount",
      emailLabel: "Email",
      userIdLabel: "User ID",
      success: "Confirmation sent. You will receive an email within 24 hours.",
      error: "Failed to send. Please try again later.",
      required: "Account name is required",
    },
    ar: {
      title: "تأكيد التحويل",
      instructions:
        "يرجى إدخال اسم الحساب الذي قمت بالتحويل منه. سيتم إرسال هذه المعلومات إلى المسؤول لتأكيد حجزك. ستتلقى رسالة تأكيد خلال 24 ساعة.",
      accountLabel: "اسم الحساب (مطلوب)",
      noteLabel: "ملاحظة اختيارية (مرجع البنك، الوقت...)",
      readonly: "هذا الحقل للعرض فقط",
      submit: "إرسال التأكيد",
      back: "العودة",
      amountLabel: "المبلغ",
      emailLabel: "البريد الإلكتروني",
      userIdLabel: "معرّف المستخدم",
      success: "تم إرسال التأكيد. ستتلقى رسالة خلال 24 ساعة.",
      error: "فشل الإرسال. حاول مرة أخرى لاحقًا.",
      required: "اسم الحساب مطلوب",
    },
  }[locale];

  // always show english digits — keeps number in English digits
  const formatAmount = (val: number) => {
    const en = Number(val).toFixed(2);
    const currencyLabel = locale === "ar" ? "دينار" : "JOD";
    return `${en} ${currencyLabel}`;
  };

  async function onSubmit(e: React.FormEvent) {
  e.preventDefault();
  if (!accountName.trim()) {
    toast.error(t.required);
    return;
  }

  setLoading(true);

  try {
    await emailAction({
      accountName,
      note,
      email,
      userId: id,
      amount: cartData.total_amount,
      expireAt:expireAt
    });

    toast.success(t.success);
    router.push("/checkout/thank-you");
  } catch (error) {
    toast.error(t.error);
  }

  setLoading(false);
}

  return (
    <section
      dir={locale === "ar" ? "rtl" : "ltr"}
      className="w-[90%] max-w-2xl mx-auto mt-24 mb-20"
    >
      <h2 className="text-2xl font-semibold mb-2">{t.title}</h2>
      <p className="text-sm text-gray-600 mb-4">{t.instructions}</p>

      <Card className="shadow-sm border border-gray-100">
        <CardHeader>
          <CardTitle>{t.title}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* read-only data */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm text-gray-700">
              <span className="font-medium">{t.amountLabel}:</span>
              <span className="font-semibold text-[#676e32]">
                {formatAmount(cartData.total_amount)}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>{t.emailLabel}:</span>
              <span className="font-medium">{email}</span>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>{t.userIdLabel}:</span>
              <span className="font-medium">{id}</span>
            </div>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-2">
                {t.accountLabel}
              </label>
              <input
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                placeholder={
                  locale === "ar" ? "مثال: محمد أحمد" : "e.g. Mohamed Ahmed"
                }
                className="w-full rounded-md border border-gray-200 px-3 py-2"
                aria-required
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-2">
                {t.noteLabel}
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={
                  locale === "ar"
                    ? "رقم المرجع أو ملاحظات إضافية"
                    : "Bank reference or extra notes"
                }
                className="w-full rounded-md border border-gray-200 px-3 py-2 min-h-[90px]"
              />
            </div>

            <div className="flex gap-3">
              <DarkButton
                type="submit"
                disabled={loading}
                className="flex-1 py-3"
                style={{ backgroundColor: "#676e32" }}
              >
                {loading
                  ? locale === "ar"
                    ? "جاري الإرسال..."
                    : "Sending..."
                  : t.submit}
              </DarkButton>

              <LightButton
                type="button"
                onClick={() => router.back()}
                className="flex-1 py-3"
              >
                {t.back}
              </LightButton>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
