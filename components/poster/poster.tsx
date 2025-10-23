"use client";

import React from "react";
import Image from "next/image";
import { useLocale } from "next-intl";

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
      className="w-full flex justify-center px-4 py-16 bg-[#f8f8f8]"
    >
      <div className="relative w-full max-w-7xl bg-[#484d23] text-white rounded-3xl shadow-[0_15px_40px_-10px_rgba(0,0,0,0.4)] overflow-hidden min-h-[400px] md:min-h-[460px] flex">
        

        <div
          className={`relative w-1/2 h-full ${isArabic ? "order-2" : "order-1"}`}
          style={{ minHeight: "400px" }}
        >
          <Image
            src="/images/poster.jpg"
            alt="Camping"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{ objectFit: "cover" }}
          />

          <div className="absolute inset-0 bg-black/20" />
        </div>


        <div
          className={`w-1/2 flex flex-col justify-center px-8 py-12 ${
            isArabic ? "order-1 text-right" : "order-2 text-left"
          }`}
        >
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4">
            {heading}
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-6">{description}</p>
          <button className="mt-4 px-6 py-3 bg-white text-[#484d23] font-semibold rounded-full shadow hover:scale-105 transition w-auto inline-block">
  {isArabic ? "استكشف الآن" : "Explore Now"}
</button>

        </div>
      </div>
    </section>
  );
}
