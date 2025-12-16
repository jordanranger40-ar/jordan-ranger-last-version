"use client";
import React, { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useLocale } from "next-intl";

type ChangePasswordForm = {
  oldPassword: string;
  password: string;
  confirmPassword: string;
};

function Page() {
  const router = useRouter();
  const { data: session } = useSession();
  const user_id = session?.user?.id;

  const locale = useLocale();
  const isArabic = locale === "ar";

  const [form, setForm] = useState<ChangePasswordForm>({
    oldPassword: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const t = {
    title: isArabic ? "تغيير كلمة المرور" : "Change Your Password",
    currentPassword: isArabic ? "كلمة المرور الحالية" : "Current Password",
    password: isArabic ? "كلمة المرور" : "Password",
    confirmPassword: isArabic ? "تأكيد كلمة المرور" : "Confirm Password",
    passwordsDontMatch: isArabic ? "كلمتا المرور غير متطابقتين" : "*Passwords Don't Match",
    notLoggedIn: isArabic ? "يجب تسجيل الدخول أولاً." : "You must be logged in.",
    success: isArabic ? "تم تغيير كلمة المرور بنجاح" : "Password Changed Successfully",
    changing: isArabic ? "جاري التغيير..." : "Changing...",
    changeButton: isArabic ? "تغيير" : "Change",
    backToHome: isArabic ? "العودة إلى الصفحة الرئيسية" : "Back To Home",
    serverError: isArabic ? "حصل خطأ أثناء تغيير كلمة المرور. حاول لاحقاً." : "An error occurred while changing the password. Please try again.",
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!user_id) {
      setError(t.notLoggedIn);
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError(t.passwordsDontMatch);
      return;
    }

    setLoading(true);
    try {
      const url = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/change-password/${user_id}`;
      const res = await axios.put(url, {
        oldPassword: form.oldPassword,
        newPassword: form.password,
      });

      // assume API returns { message, status } — handle common success codes
      const status = res?.status ?? res?.data?.status;
      const messageFromServer = res?.data?.message ?? "";

      if (status === 200 || status === 201) {
        setMessage(t.success);
        setTimeout(() => {
          setMessage("");
          router.push("/");
        }, 1500);
      } else {
        setError(messageFromServer || t.serverError);
      }
    } catch (err: any) {
      // safe error extraction
      const serverMessage =
        err?.response?.data?.message ?? err?.message ?? t.serverError;
      setError(serverMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main dir={isArabic ? "rtl" : "ltr"}>
      <form
        className="max-w-lg mx-auto shadow-lg shadow-slate-500/50 p-7 rounded-lg bg-white h-1/2 sm:w-11/12 md:w-1/2 lg:w-full mt-14"
        onSubmit={onSubmit}
      >
        <h1 className="text-2xl flex justify-center border-b-2 border-[#676e32] mb-4 pb-2">
          {t.title}
        </h1>

        {/* Current Password */}
        <div className="relative mb-2">
          <label htmlFor="oldPassword" className="block mb-2 text-sm font-medium text-gray-900">
            {t.currentPassword}
          </label>
          <input
            type={!showPassword ? "password" : "text"}
            id="oldPassword"
            name="oldPassword"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-[#00ADEE] focus:border-[#00ADEE] block w-full p-2.5"
            required
            value={form.oldPassword}
            onChange={handleChange}
            disabled={loading}
            placeholder={isArabic ? "أدخل كلمة المرور الحالية" : "Enter current password"}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-8/12 right-3 -translate-y-1/2 text-gray-500"
            aria-label={isArabic ? "إظهار كلمة المرور" : "toggle password visibility"}
          >
            {!showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
          </button>
        </div>

        {/* New Password */}
        <div className="relative mb-2">
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
            {t.password}
          </label>
          <input
            type={!showPassword ? "password" : "text"}
            id="password"
            name="password"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-[#00ADEE] focus:border-[#00ADEE] block w-full p-2.5"
            required
            value={form.password}
            onChange={handleChange}
            disabled={loading}
            placeholder={isArabic ? "أدخل كلمة المرور الجديدة" : "Enter new password"}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-8/12 right-3 -translate-y-1/2 text-gray-500"
            aria-hidden
          >
            {!showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
          </button>
        </div>

        {/* Confirm Password */}
        <div className="relative mb-2">
          <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-900">
            {t.confirmPassword}
          </label>
          <input
            type={!showPassword ? "password" : "text"}
            id="confirmPassword"
            name="confirmPassword"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-[#00ADEE] focus:border-[#00ADEE] block w-full p-2.5"
            required
            value={form.confirmPassword}
            onChange={handleChange}
            disabled={loading}
            placeholder={isArabic ? "أعد إدخال كلمة المرور" : "Re-enter password"}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-8/12 right-3 -translate-y-1/2 text-gray-500"
            aria-hidden
          >
            {!showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
          </button>
        </div>

        {/* Error / Success */}
        {error && (
          <div className="text-red-500 mt-1 p-2.5 bg-red-50 mb-2 rounded-lg flex justify-center">
            {error}
          </div>
        )}

        {message && (
          <div className="text-green-500 mt-1 p-2.5 bg-green-50 mb-2 rounded-lg flex justify-center">
            {message}
          </div>
        )}

        {/* Submit */}
        <button
          disabled={loading}
          type="submit"
          className="text-white bg-[#676e32] hover:bg-[#848e38] focus:ring-2 focus:outline-none focus:ring-[#00ADEE] font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center cursor-pointer"
        >
          {loading ? (isArabic ? "جاري التغيير..." : t.changing) : t.changeButton}
        </button>

        <Link href="/" className="block pt-4 text-center text-sm text-[#676e32] underline-offset-4 hover:underline m-2">
          {t.backToHome}
        </Link>
      </form>
    </main>
  );
}

export default Page;
