"use client";
import React, { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import {
  getRegisterSchema,
  type RegisterFormType,
} from "@/app/models/db/lib/schemas/registerSchema";
import { useLocale } from "next-intl";
import { FcGoogle } from "react-icons/fc";
const RegisterPage = () => {
  const locale = useLocale();
  const isArabic = locale === "ar";
  const router = useRouter();
  const registerSchema = getRegisterSchema(isArabic);

  const [form, setForm] = useState<RegisterFormType>({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // clear field error on change
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const result = registerSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      const newErrors: Record<string, string> = {};
      (Object.keys(fieldErrors) as Array<keyof typeof fieldErrors>).forEach(
        (key) => {
          const messages = fieldErrors[key];
          if (messages && messages[0]) {
            newErrors[key as string] = messages[0];
          }
        }
      );
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    setErrors({});
    setError("");

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/users/register`,
        {
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          password: form.password,
        }
      );
      const loginResult = await signIn("credentials", {
        redirect: false,
        email: form.email,
        password: form.password,
      });
      if (loginResult?.ok) {
        router.push("/");
      } else {
        setError(
          isArabic
            ? "فشل تسجيل الدخول بعد التسجيل."
            : "Failed to login after registration."
        );
        setLoading(false);
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(
          err.response?.data?.message ||
            (isArabic ? "فشل التسجيل." : "Registration failed.")
        );
      } else {
        setError(
          isArabic ? "حدث خطأ غير متوقع." : "An unexpected error occurred."
        );
      }
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const result = await signIn("google", { callbackUrl: "/" });
    if (result?.ok) router.replace("/");
  };

  return (
    <main
      className="flex justify-center items-center mt-24 mb-14"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <form
        className="max-w-lg w-full p-7 rounded-lg bg-white border border-gray-300 shadow-sm shadow-slate-500/50 m-7"
        onSubmit={onSubmit}
      >
        <h1 className="text-2xl flex justify-center border-b-2 border-[#676e32] mb-4 pb-2">
          {isArabic ? "إنشاء حساب" : "Register"}
        </h1>

        {/* First Name */}
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-900">
            {isArabic ? "الاسم الأول" : "First Name"}
          </label>
          <input
            type="text"
            name="first_name"
            value={form.first_name}
            disabled={loading}
            onChange={handleChange}
            placeholder={isArabic ? "الاسم الأول" : "First Name"}
            className="block w-full p-2.5 text-sm text-gray-900 bg-white border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.first_name && (
            <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>
          )}
        </div>

        {/* Last Name */}
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-900">
            {isArabic ? "اسم العائلة" : "Last Name"}
          </label>
          <input
            type="text"
            name="last_name"
            value={form.last_name}
            disabled={loading}
            placeholder={isArabic ? "اسم العائلة" : "Last Name"}
            onChange={handleChange}
            className="block w-full p-2.5 text-sm text-gray-900 bg-white border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.last_name && (
            <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>
          )}
        </div>

        {/* Email */}
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-900">
            {isArabic ? "البريد الإلكتروني" : "Email"}
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            disabled={loading}
            placeholder="you@example.com"
            onChange={handleChange}
            className="block w-full p-2.5 text-sm text-gray-900 bg-white border border-gray-600 rounded-lg focus:ring-gray-500 "
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        {/* Password */}
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-900">
            {isArabic ? "كلمة المرور" : "Password"}
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              disabled={loading}
              placeholder={isArabic ? "كلمة المرور" : "Password"}
              onChange={handleChange}
              className="block w-full p-2.5 text-sm text-gray-900 bg-white border border-gray-600 rounded-lg "
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 end-3 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? (
                <EyeIcon className="h-5 w-5 cursor-pointer" />
              ) : (
                <EyeSlashIcon className="h-5 w-5 cursor-pointer" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-900">
            {isArabic ? "تأكيد كلمة المرور" : "Confirm Password"}
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              value={form.confirmPassword}
              disabled={loading}
              placeholder={isArabic ? "تأكيد كلمة المرور" : "Confirm Password"}
              onChange={handleChange}
              className="block w-full p-2.5 text-sm text-gray-900 bg-white border border-gray-600 rounded-lg focus:black focus:border-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 end-3 -translate-y-1/2 text-gray-500 cursor-pointer"
            >
              {showPassword ? (
                <EyeIcon className="h-5 w-5 cursor-pointer" />
              ) : (
                <EyeSlashIcon className="h-5 w-5 cursor-pointer" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* Global Error */}
        {error && (
          <div className="text-red-500 mt-1 p-2.5 bg-red-50 mb-2 rounded-lg">
            {error}
          </div>
        )}

        <button
          disabled={loading}
          type="submit"
          className="w-full px-5 py-2.5 cursor-pointer text-sm font-medium text-white bg-[#676e32] rounded-lg hover:bg-[#848e38] focus:ring-4 focus:outline-none focus:ring-blue-300"
        >
          {loading
            ? isArabic
              ? "جارٍ إنشاء الحساب..."
              : "Creating account..."
            : isArabic
            ? "إنشاء حساب"
            : "Create Account"}
        </button>
        <div className="my-2 flex w-auto items-center">
          <div
            data-orientation="horizontal"
            role="none"
            data-slot="separator"
            className="bg-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px flex-1"
          ></div>
          <span className="mx-2 font-black text-[#676e32]">OR</span>
          <div
            data-orientation="horizontal"
            role="none"
            data-slot="separator"
            className="bg-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px flex-1"
          ></div>
        </div>
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full mt-3 flex justify-center cursor-pointer items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200"
        >
          <FcGoogle className="w-5 h-5" />
          {isArabic ? "التسجيل باستخدام Google" : "Sign Up with Google"}
        </button>
        <Link
          href="/login"
          className="block pt-4 text-center text-sm text-[#676e32] cursor-pointer underline-offset-4 hover:underline m-2"
        >
          {isArabic ? "هل لديك حساب بالفعل؟" : "Already have an account?"}
        </Link>
      </form>
    </main>
  );
};

export default RegisterPage;
