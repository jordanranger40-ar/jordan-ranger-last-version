"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Plus, X } from "lucide-react";

interface Props {
  isArabic: boolean;
}

const AllImages = [
  {
    imageUrl:
      "https://img.freepik.com/free-vector/cartoon-house-hallway-living-room-interior_107791-19063.jpg?semt=ais_hybrid&w=740&q=80",
    imageAlt: "Image1",
  },
  {
    imageUrl:
      "https://img.freepik.com/free-vector/cartoon-house-hallway-living-room-interior_107791-19063.jpg?semt=ais_hybrid&w=740&q=80",
    imageAlt: "Image2",
  },
  {
    imageUrl:
      "https://img.freepik.com/free-vector/cartoon-house-hallway-living-room-interior_107791-19063.jpg?semt=ais_hybrid&w=740&q=80",
    imageAlt: "Image3",
  },
];

export default function UpperRoomSection({ isArabic }: Props) {
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
        setActiveIndex((i) => Math.min(AllImages.length - 1, (i as number) + 1));
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
    setTimeout(() => closeButtonRef.current?.focus(), 50);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setActiveIndex(null);
  };

  return (
    <div className="flex flex-col justify-center items-center mt-28 mb-32">
      <h1 className="text-lg sm:text-xl md:text-3xl text-gray-600 font-semibold text-center mb-10">
        {isArabic ? "غرفة التدريب العليا (30-50 مشاركًا)" : "Upper Training Room (30-50 Participants)"}
      </h1>

      {/* GRID IMAGES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-6 gap-6 w-[90%]">
        {AllImages.map((image, i) => {
          const isThird = i === 2;
          return (
            <div
              key={i}
              className={`relative overflow-hidden rounded-xl group   transition-all duration-300 hover:shadow-xl hover:-translate-y-1
                ${isThird ? "md:col-span-2 md:flex md:justify-center lg:col-span-1 " : ""}`}
            >
              {/* Inner wrapper: keeps consistent visual size (no image becomes smaller/larger) */}
              <div className={`w-full ${isThird ? "md:max-w-[520px] lg:max-w-full " : ""}`} style={isThird ? { margin: "0 auto" } : undefined}>
                <div className="relative w-full aspect-4/3 rounded-xl overflow-hidden">
                  {/* use fill here because aspect box gives stable height */}
                  <Image
                    src={image.imageUrl}
                    alt={image.imageAlt}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 48vw, 32vw"
                    priority={i === 0}
                  />
                </div>

                {/* Hover Overlay */}
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
            </div>
          );
        })}
      </div>

      {/* LIGHTBOX */}
      {lightboxOpen && activeIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeLightbox} />

          <div className="relative z-10 max-w-[90vw] max-h-[90vh] w-full mx-6 md:mx-12 rounded-lg flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            {/* Close */}
            <button
              ref={closeButtonRef}
              onClick={closeLightbox}
              aria-label={isArabic ? "إغلاق" : "Close"}
              className="absolute top-3 right-3 md:top-4 md:right-6 z-20 p-2 rounded-full bg-white/90 hover:bg-white shadow-lg"
            >
              <X className="w-5 h-5 text-gray-800" />
            </button>

            {/* Prev */}
            {activeIndex > 0 && (
              <button onClick={() => setActiveIndex((i) => (i as number) - 1)} className="absolute left-3 z-20 p-3 rounded-full bg-white/90 shadow-lg hidden md:flex">
                &#8249;
              </button>
            )}

            {/* Next */}
            {activeIndex < AllImages.length - 1 && (
              <button onClick={() => setActiveIndex((i) => (i as number) + 1)} className="absolute right-3 z-20 p-3 rounded-full bg-white/90 shadow-lg hidden md:flex">
                &#8250;
              </button>
            )}

            {/* Large image: use explicit width/height and constrain with max-w / max-h */}
            <div className="rounded-md overflow-hidden w-full h-full flex items-center justify-center">
              <Image
                src={AllImages[activeIndex].imageUrl}
                alt={AllImages[activeIndex].imageAlt}
                width={1200}
                height={800}
                className="object-contain max-w-full max-h-[85vh] rounded-md"
                priority
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
