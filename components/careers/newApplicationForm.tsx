"use client";

import { newCareer } from "@/types";
import React, { useState, useTransition } from "react";
import FileUploader from "@/components/fileUploadForApplication";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
interface prop {
  action: (data: newCareer) => Promise<void>;
  locale: string;
}

function NewApplicationForm({ action, locale }: prop) {
  const isArabic = locale === "ar";
  const [form, setForm] = useState<newCareer>({
    first_name: "",
    last_name: "",
    email: "",
    city: "",
    phone_number: "",
    cv: "",
  });

  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUploadComplete = (url: string) => {
    setForm({ ...form, cv: url });
  };

  const handleUploadError = (error: Error) => {
    console.error(error);
    setToast({ message: `Upload failed: ${error.message}`, type: "error" });
    setTimeout(() => setToast(null), 3000);
  };

  const handleImageDelete = () => {
    setForm({ ...form, cv: "" });
  };

  const handleFormSubmit = () => {
    console.log("form: ",form);
    
    startTransition(async () => {
      try {
        await action({ ...form });
        setToast({
          message: "Application Submitted Successfully!",
          type: "success",
        });

        setTimeout(() => {
          setToast(null);
          router.replace("/");
        }, 500);
      } catch (error) {
        console.error(error);
        setToast({
          message: "Failed to Submit The Application.",
          type: "error",
        });
        setTimeout(() => setToast(null), 3000);
      }
    });
  };

  return (
    <main
      className="min-h-screen bg-gradient-to-b  flex flex-col items-center py-16 px-5 lg:px-10 mt-10 h-[full]"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className="text-center mb-10">
        {isArabic ? (
          <h1 className="text-4xl lg:text-5xl font-bold text-[#125892]">
            إنضم إلى فريقنا
          </h1>
        ) : (
          <h1 className="text-4xl lg:text-6xl font-bold text-[#125892]">
            Join Think <span className="text-[#00ADEE]">Impact</span> Team
          </h1>
        )}
        <p className="text-gray-600 mt-3 text-base lg:text-lg max-w-2xl mx-auto">
          {isArabic
            ? "قدّم طلبك للانضمام إلى فريقنا وكن جزءًا من إحداث تأثير معنا."
            : "Submit your application to join our passionate team and make an impact with us."}
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleFormSubmit();
        }}
        className="w-full max-w-3xl"
      >
        <Card className="shadow-xl  rounded-2xl py-0">
          <CardHeader className="bg-[#125892] text-white rounded-t-2xl py-2">
            <CardTitle className="text-2xl">
              {isArabic ? "المعلومات الشخصية" : "Personal Details"}
            </CardTitle>
            <CardDescription className="text-white/80">
              {isArabic
                ? "املأ الحقول المطلوبة أدناه لتقديم طلبك"
                : "Fill out the required fields below to submit your application."}
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 lg:p-10 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-1">
                  <span className="text-red-500">*</span>{" "}
                  {isArabic ? "الإسم الأول" : "First Name"}
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={form.first_name}
                  onChange={handleInputChange}
                  className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00ADEE] bg-white"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-1">
                  <span className="text-red-500">*</span>{" "}
                  {isArabic ? "الإسم الثاني" : "Last Name"}
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={form.last_name}
                  onChange={handleInputChange}
                  className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00ADEE] bg-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-1">
                  <span className="text-red-500">*</span>{" "}
                  {isArabic ? "البريد الإلكتروني" : "Email"}
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleInputChange}
                  className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00ADEE] bg-white"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-1">
                  <span className="text-red-500">*</span>{" "}
                  {isArabic ? " الدولة" : "Country"}
                </label>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleInputChange}
                  className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00ADEE] bg-white"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label
                  className={`text-sm font-semibold text-gray-700 mb-1 ${
                    isArabic ? "text-right" : "text-left"
                  }`}
                >
                  <span className="text-red-500">*</span>{" "}
                  {isArabic ? "رقم الهاتف" : "Phone Number"}
                </label>
                <div className="relative w-full">
                  <PhoneInput
                    country={"jo"}
                    value={form.phone_number}
                    onChange={(value: string) =>
                      setForm({ ...form, phone_number: value })
                    }
                    inputStyle={{
                      width: "100%",
                      padding: "0.5rem 0.75rem 0.5rem 3rem", 
                      borderRadius: "0.375rem",
                      border: "1px solid #D1D5DB",
                      outline: "none",
                      textAlign: "left",
                      height: "2.5rem", 
                    }}
                    buttonStyle={{
                      position: "absolute",
                      top: 0, 
                      left: 0, 
                      height: "100%", 
                      borderRadius: "0.375rem 0 0 0.375rem",
                      border: "1px solid #D1D5DB",
                    }}
                    containerStyle={{
                      width: "100%",
                      direction: "ltr", 
                    }}
                    enableSearch
                    disableCountryCode={false}
                    disableDropdown={false}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col w-full max-w-md">
              <label className="text-sm font-semibold text-gray-700 mb-1 ">
                <span className="text-red-500">*</span>
                {isArabic ? " تحميل السيرة الذاتية" : "Upload Your CV (PDF)"}
              </label>
              <FileUploader
  endpoint="cvUpload"
  initialFileUrl={form.cv}
  onUploadComplete={(url) => setForm({ ...form, cv: url })}
  onUploadError={(err) => console.error(err)}
  onDelete={() => setForm({ ...form, cv: "" })}
  locale={locale} // ← pass locale here
/>

            </div>

            <div className="flex justify-center gap-4 mt-8">
              <button
                type="button"
                onClick={() => router.replace("/")}
                className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-all"
              >
                {isArabic ? "  إلغاء " : "Cancel"}
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#125892] hover:bg-[#0f4473] text-white rounded-lg font-semibold transition-all shadow-md"
                disabled={isPending}
              >
                {isPending
                  ? isArabic
                    ? "جاري الإرسال..."
                    : "Submitting..."
                  : isArabic
                  ? "إرسال"
                  : "Submit"}
              </button>
            </div>
          </CardContent>
        </Card>
      </form>

      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-50 px-5 py-3 rounded-lg shadow-lg text-white font-medium transition-all duration-300 ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.message}
        </div>
      )}
    </main>
  );
}

export default NewApplicationForm;
