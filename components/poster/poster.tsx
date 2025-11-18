"use client";

import React from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import LightButton from "../ui/light-button";

export default function PosterSection() {
  const locale = useLocale();
  const isArabic = locale === "ar";

  const heading = isArabic ? "جاهز للمغامرة؟" : "Ready for the Adventure?";
  const description = isArabic
    ? "استمتع بتجربة تخييم فريدة في قلب الطبيعة."
    : "Enjoy a unique camping experience in the heart of nature.";

  return (
    <section
      dir={isArabic ? "rtl" : "ltr"}
      className="w-full flex justify-center px-4 py-16"
    >
      <div
        className="relative w-full max-w-7xl bg-[#484d23] text-white
        shadow-[0_15px_40px_-10px_rgba(0,0,0,0.4)] overflow-hidden 
        min-h-[400px] md:min-h-[460px] flex flex-col md:flex-row"
        style={{ borderRadius: "2rem 0.5rem 2rem 0.5rem" }}
      >
        {/* 🏞️ الصورة */}
        <div
          className={`relative w-full md:w-1/2 h-[300px] md:h-auto ${
            isArabic ? "order-2" : "order-1"
          }`}
          style={{ borderRadius: isArabic ? "0.5rem 2rem 0.5rem 2rem" : "2rem 0.5rem 2rem 0.5rem", overflow: "hidden" }}
        >
          <Image
            src="/images/poster.jpg"
            alt="Camping"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{ objectFit: "cover" }}
          />

          {/* Overlay خفيف */}
          <div className="absolute inset-0 bg-[#00000040]" />
        </div>

        {/* ✨ النص */}
        <div
          className={`w-full md:w-1/2 flex flex-col justify-center px-8 py-12 ${
            isArabic ? "order-1 text-right" : "order-2 text-left"
          }`}
        >
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4">
            {heading}
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-6">{description}</p>

      <LightButton>
            {isArabic ? "استكشف الآن" : "Explore Now"}
          </LightButton>
        </div>
      </div>
    </section>
  );
}
