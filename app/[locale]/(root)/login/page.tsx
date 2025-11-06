"use client";
import { signIn } from "next-auth/react";
import React, { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getLoginSchema } from "@/app/models/db/lib/schemas/loginSchema";
import { useLocale } from "next-intl";
import { FcGoogle } from "react-icons/fc";

type loginForm = {
  email: string;
  password: string;
};

const Login = () => {
  const locale = useLocale();
  const isArabic = locale === "ar";
  const router = useRouter();
  const [form, setForm] = useState<loginForm>({ password: "", email: "" });
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const loginSchema = getLoginSchema(isArabic);
    const result = loginSchema.safeParse(form);

    if (!result.success) {
      setError(result.error.issues[0].message);
      setLoading(false);
      setTimeout(() => setError(""), 3000);
      return;
    }

    const valid = await signIn("credentials", {
      password: form.password,
      email: form.email,
      redirect: false,
    });

    if (valid?.ok === true) {
      router.push("/");
    } else {
      setError(
        isArabic
          ? "البريد الإلكتروني أو كلمة المرور غير صحيحة."
          : "Invalid email or password. Please try again."
      );
      setLoading(false);
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleGoogleSignIn = async () => {
     await signIn("google", { callbackUrl: "/" });
  };

  return (
    <>
      <main>
        <form
          className="max-w-lg mx-auto shadow-lg shadow-slate-500/50 p-7 rounded-lg bg-white dark:bg-gray-300 h-1/2  mt-28 mb-20"
          onSubmit={onSubmit}
          dir={isArabic ? "rtl" : "ltr"}
        >
          <h1 className="text-2xl flex justify-center border-b-2 border-[#676e32] mb-4 pb-2 dark:text-black">
            {isArabic ? "تسجيل الدخول" : "Login"}
          </h1>

          <div className="mb-5">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              {isArabic ? "البريد الإلكتروني" : "Email"}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="bg-gray-50 border border-gray-300  text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="relative mb-5">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              {isArabic ? "كلمة المرور" : "Password"}
            </label>
            <input
              type={!showPassword ? "password" : "text"}
              id="password"
              name="password"
              className="bg-gray-50 border border-gray-300  text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              value={form.password}
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-8/12 end-3 -translate-y-1/2 text-gray-500"
            >
              {!showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>

          {error && (
            <div className="text-red-500 mt-1 p-2.5 bg-red-50 mb-2 rounded-lg flex justify-center">
              {error}
            </div>
          )}

          <button
            disabled={loading}
            type="submit"
            className="text-white bg-[#676e32] hover:bg-[#848e38] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center cursor-pointer"
          >
            {loading
              ? isArabic
                ? "جاري تسجيل الدخول..."
                : "Logging in..."
              : isArabic
              ? "تسجيل الدخول"
              : "Login"}
          </button>

          <Link
            href="/forgot-password"
            className="block pt-4 text-center text-sm text-[#676e32] underline-offset-4 hover:underline m-2 "
          >
            {isArabic ? "نسيت كلمة المرور؟" : "Forgot your password?"}
          </Link>

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
            {isArabic ? "التسجيل باستخدام Google" : "Login with Google"}
          </button>

          <Link
            href="/"
            className="block pt-4 text-center text-sm underline-offset-4 text-[#676e32] hover:underline m-2 "
          >
            {isArabic ? "العودة إلى الصفحة الرئيسية" : "Back To Home Page"}
          </Link>
        </form>
      </main>
    </>
  );
};

export default Login;
