'use client';

import table from "@/public/images/table.jpg";
import restaurantlogo from "@/public/images/restaurantlogo.png";


import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Plus, X } from "lucide-react";

interface Props {
  isArabic?: boolean;
}

const menuImages = [
  "/images/menu1.jpg",
  "/images/menu2.jpg",
  "/images/menu3.jpg",
  "/images/menu4.jpg",
];

export default function MenuGallery({ isArabic = false }: Props) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    document.body.style.overflow = lightboxOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight" && activeIndex !== null) {
        setActiveIndex((i) => Math.min(menuImages.length - 1, (i as number) + 1));
      }
      if (e.key === "ArrowLeft" && activeIndex !== null) {
        setActiveIndex((i) => Math.max(0, (i as number) - 1));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIndex]);

  const openLightbox = (index: number) => {
    setActiveIndex(index);
    setLightboxOpen(true);
    // wait a tick so the button exists in the DOM then focus
    setTimeout(() => closeButtonRef.current?.focus(), 50);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setActiveIndex(null);
  };

  return (
    <div className="flex flex-col items-center justify-center py-32" style={{backgroundImage:`url(${table.src})`}}>
      <h2 className="text-2xl sm:text-3xl md:text-5xl text-white font-semibold text-center mb-8">
        {isArabic ? "قائمة الطعام" : "Menu"}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-[95%]">
        {menuImages.map((src, i) => (
          <div key={i} className="relative overflow-hidden rounded-xl group transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div className="relative w-full aspect-4/3 rounded-xl h-[450px] overflow-hidden">
              <Image
                src={src}
                alt={`menu-${i + 1}`}
                fill
                className="object-cover transition-transform  duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 48vw, 32vw"
                priority={i === 0}
              />
            </div>

            <button
              onClick={() => openLightbox(i)}
              className="absolute inset-0 flex items-center justify-center bg-transparent group-hover:bg-black/30 transition-colors duration-200"
              aria-label={isArabic ? "عرض الصورة" : "View image"}
            >
              <span className="opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-200 inline-flex items-center justify-center rounded-full bg-white/90 p-3">
                <Plus className="w-6 h-6 text-black" />
              </span>
            </button>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxOpen && activeIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeLightbox} />

          <div
            className="relative z-10 max-w-[95vw] max-h-[95vh] w-full mx-6 md:mx-12 rounded-lg flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              ref={closeButtonRef}
              onClick={closeLightbox}
              aria-label={isArabic ? "إغلاق" : "Close"}
              className="absolute top-3 right-3 md:top-4 md:right-6 z-20 p-2 rounded-full bg-white/90 hover:bg-white shadow-lg"
            >
              <X className="w-5 h-5 text-gray-800" />
            </button>

            {activeIndex! > 0 && (
              <button
                onClick={() => setActiveIndex((i) => (i as number) - 1)}
                className="absolute left-3 z-20 p-3 rounded-full bg-white/90 shadow-lg hidden md:flex"
                aria-label={isArabic ? "السابق" : "Previous"}
              >
                &#8249;
              </button>
            )}

            {activeIndex! < menuImages.length - 1 && (
              <button
                onClick={() => setActiveIndex((i) => (i as number) + 1)}
                className="absolute right-3 z-20 p-3 rounded-full bg-white/90 shadow-lg hidden md:flex"
                aria-label={isArabic ? "التالي" : "Next"}
              >
                &#8250;
              </button>
            )}

            <div className="rounded-md overflow-hidden w-full h-full flex items-center justify-center">
              <Image
                src={menuImages[activeIndex!]}
                alt={`menu-full-${activeIndex! + 1}`}
                width={1200}
                height={900}
                className="object-contain max-w-full max-h-[88vh] rounded-md"
                priority
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
