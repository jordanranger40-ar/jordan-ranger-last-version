"use client";

import React from "react";
import { useLocale } from "next-intl";

export default function VideoSection() {
  const locale = useLocale();
  const isArabic = locale === "ar";

  const heading = isArabic
    ? "جاهز لمغامرة لا تُنسى؟"
    : "Ready for an Unforgettable Adventure?";
  const description = isArabic
    ? "استمتع بتجربة تخييم فريدة في قلب الطبيعة."
    : "Enjoy unique camping experiences in the heart of nature.";
  const buttonText = isArabic ? "استكشف الآن" : "Explore Now";

  return (
    <section
      dir={isArabic ? "rtl" : "ltr"}
      className="relative w-full h-[80vh] md:h-[90vh] overflow-hidden flex items-center justify-center"
    >
      {/* 🎥 الفيديو */}
      <video
        src="/vedios/home.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* 🌫️ تدرج شفاف فوق الفيديو */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/70 z-10" />

      {/* 📝 نص فوق الفيديو */}
      <div className="relative z-20 text-center px-6 md:px-20">
        <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg">
          {heading}
        </h2>
        <p className="text-lg md:text-xl text-gray-200 mb-6 drop-shadow">
          {description}
        </p>
        <button className="mt-4 px-6 py-3 bg-[#dcdca8] text-[#484d23] font-semibold rounded-full shadow-md hover:bg-white hover:scale-105 transition-all duration-300">
          {buttonText}
        </button>
      </div>

      {/* ✨ تأثير ضباب خفيف متحرك (اختياري) */}
      <div className="absolute inset-0 bg-[url('/images/fog.png')] bg-center bg-no-repeat bg-cover opacity-10 animate-pulse-slow" />
    </section>
  );
}
