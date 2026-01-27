"use client";

import React from "react";
import { useLocale } from "next-intl";
import LightButton from "../ui/light-button";
import { useRouter } from "next/navigation";

export default function PosterSection() {
  const locale = useLocale();
  const isArabic = locale === "ar";
  const router = useRouter();

  const heading = isArabic ? "جاهز للمغامرة؟" : "Ready for the Adventure?";
  const description = isArabic
    ? "استمتع بتجربة تخييم فريدة في قلب الطبيعة."
    : "Enjoy a unique camping experience in the heart of nature.";

  return (
    <section
      dir={isArabic ? "rtl" : "ltr"}
      className="w-full px-4 py-20 flex justify-center bg-[#fafafa]"
    >
      <div
        className={`
          relative w-full max-w-7xl overflow-hidden
          bg-[#484d23] text-white
          /* Subtle asymmetric rounding */
          rounded-[3rem_0.75rem_3rem_0.75rem]
          shadow-[0_20px_50px_rgba(72,77,35,0.25)]
        `}
      >
        {/* Background Texture: Subtle Grain */}
        <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />

        <div className="relative z-10 flex flex-col items-center px-6 py-20 md:py-32">
          
          {/* Subtle line above heading */}
          <div className="w-16 h-px bg-white/30 mb-8" />

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-center mb-6 tracking-tight">
            {heading}
          </h1>

          <p className="text-lg md:text-xl lg:text-2xl text-white/80 text-center max-w-2xl mb-12 font-light leading-relaxed">
            {description}
          </p>

          <div className="flex flex-col items-center gap-6">
            <div className="transition-all duration-300 hover:scale-105">
              <LightButton 
                onClick={() => {
                  router.push("/Accommodation/Tents");
                }}
              >
                <span className="px-12 py-1 text-lg">
                  {isArabic ? "استكشف الآن" : "Explore Now"}
                </span>
              </LightButton>
            </div>
            
            {/* Minimalist Scroll Indicator or Footer Detail */}
            <div className="flex items-center gap-4 text-white/40">
               <span className="w-2 h-2 rounded-full bg-current" />
               <span className="w-2 h-2 rounded-full bg-current" />
            </div>
          </div>
        </div>

        {/* Floating corner accents */}
        <div className={`absolute top-0 ${isArabic ? 'left-0' : 'right-0'} w-32 h-32 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2`} />
        <div className={`absolute bottom-0 ${isArabic ? 'right-0' : 'left-0'} w-48 h-48 bg-black/10 rounded-full translate-x-1/4 translate-y-1/4`} />
      </div>
    </section>
  );
}