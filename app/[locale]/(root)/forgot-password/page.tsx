"use client";
import React, { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useLocale } from "next-intl";

function Page() {
  const locale = useLocale();
  const isArabic = locale === "ar";

  const [form, setForm] = useState<{ email: string }>({
    email: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setSuccess(false);

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/forgot-password`,
        { email: form.email }
      );
      setSuccess(true);
    } catch (error) {
      setMessage(
        isArabic
          ? "حدث خطأ أثناء إرسال الرابط. حاول مرة أخرى."
          : "An error occurred while sending the link. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="flex flex-row gap-5 justify-center items-center mt-28 mb-20"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <form
        className="w-full max-w-md bg-white dark:bg-gray-300 p-8 rounded-2xl shadow-sm shadow-gray-200/50 space-y-6"
        onSubmit={onSubmit}
      >
        {/* Header */}
        {!success && (
          <h1 className="text-2xl font-bold text-center text-gray-800 border-b-2 border-[#676e32] pb-3 mb-6">
            {isArabic ? "أدخل بريدك الإلكتروني" : "Enter Your Email"}
          </h1>
        )}

        {success && (
          <div className="text-center space-y-2">
            <h2 className="text-xl font-semibold text-gray-700">
              {isArabic ? "تحقق من بريدك الإلكتروني" : "Check Your Email"}
            </h2>
            <p className="text-sm text-gray-500">
              {isArabic
                ? "إذا كان هناك حساب مرتبط بهذا البريد الإلكتروني، سيتم إرسال رابط لإعادة تعيين كلمة المرور."
                : "If an account exists with that email, a password reset link has been sent."}
            </p>
          </div>
        )}

        {/* Email input */}
        {!success && (
          <div className="flex flex-col space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              {isArabic ? "البريد الإلكتروني" : "Email"}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="p-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#00ADEE] focus:border-[#00ADEE] transition"
              placeholder={isArabic ? "you@example.com" : "you@example.com"}
            />
          </div>
        )}

        {/* Message */}
        {message !== "" && (
          <div className="text-red-600 text-center p-2.5 bg-red-50 rounded-lg">
            {message}
          </div>
        )}

        {/* Submit button */}
        {!success && (
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#676e32] text-white font-medium cursor-pointer rounded-lg hover:bg-[#848e38] focus:outline-none focus:ring-2 focus:ring-[#00ADEE] transition"
          >
            {loading
              ? isArabic
                ? "جارٍ الإرسال..."
                : "Sending..."
              : isArabic
              ? "إرسال رابط إعادة التعيين"
              : "Send Reset Link"}
          </button>
        )}

        {/* Back to login */}
        <div className="text-center pt-4">
          <Link
            href="/login"
            className="text-sm text-[#676e32] hover:underline font-medium cursor-pointer"
          >
            {isArabic ? "العودة إلى تسجيل الدخول" : "Back To Login"}
          </Link>
        </div>
      </form>
    </main>
  );
}

export default Page;
