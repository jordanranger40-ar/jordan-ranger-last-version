'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';

// Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Keyboard, Zoom, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/zoom';

interface Props {
  images: string[]; 
  isArabic?: boolean;
}

export default function RestaurantGallery({ images, isArabic = false }: Props) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => closeButtonRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [lightboxOpen]);

  if (!images || images.length === 0) return null;

  const openLightbox = (index: number) => {
    setActiveIndex(index);
    setLightboxOpen(true);
  };

  // Helper to determine grid span classes for 5 images
  const getGridClass = (index: number) => {
    if (images.length === 5) {
      switch (index) {
        case 0: return "md:col-span-2 md:row-span-2 h-[400px] md:h-full"; // Large Featured
        case 1: return "md:col-span-1 md:row-span-1 h-[200px] md:h-[240px]";
        case 2: return "md:col-span-1 md:row-span-1 h-[200px] md:h-[240px]";
        case 3: return "md:col-span-1 md:row-span-1 h-[200px] md:h-[240px]";
        case 4: return "md:col-span-1 md:row-span-1 h-[200px] md:h-[240px]";
        default: return "";
      }
    }
    return "h-[250px]"; // Fallback for other counts
  };

  return (
    <section className="max-w-7xl mx-auto mt-12 px-4 md:px-8 mb-20">
      {/* HEADER */}
      

      {/* DYNAMIC BENTO GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-3 md:gap-4 h-auto md:h-125">
        {images.slice(0, 5).map((img, i) => (
          <div 
            key={i}
            onClick={() => openLightbox(i)}
            className={`group relative overflow-hidden rounded-xl cursor-pointer bg-gray-100 shadow-sm transition-all hover:shadow-2xl ${getGridClass(i)}`}
          >
            <Image 
              src={img} 
              alt={`meal-${i + 1}`} 
              fill 
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            
            {/* Elegant Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
               <div className="bg-white/20 backdrop-blur-md p-2 rounded-full mb-2">
                  <Maximize2 className="w-5 h-5 text-white" />
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* LIGHTBOX (Swiper) */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md" role="dialog">
          <button
            ref={closeButtonRef}
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 z-[110] p-3 rounded-full bg-white/10 hover:bg-amber-500 text-white transition-all"
            type="button"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="w-full h-full flex items-center justify-center p-4">
            <Swiper
              initialSlide={activeIndex}
              modules={[Navigation, Keyboard, Zoom, Pagination, A11y]}
              navigation={{ prevEl: '.prev-btn', nextEl: '.next-btn' }}
              keyboard zoom={{ maxRatio: 2.5 }}
              pagination={{ clickable: true, type: 'bullets' }}
              className="w-full h-full max-w-5xl"
            >
              {images.map((img, i) => (
                <SwiperSlide key={`full-${i}`}>
                  <div className="swiper-zoom-container h-full flex items-center justify-center">
                    <Image 
                      src={img} 
                      alt={`meal-zoom-${i}`} 
                      width={1200} 
                      height={800} 
                      className="object-contain max-h-[80vh] rounded-lg"
                    />
                  </div>
                </SwiperSlide>
              ))}
              
              {/* Custom Nav */}
              <button className={`prev-btn absolute top-1/2 ${isArabic ? 'right-4' : 'left-4'} -translate-y-1/2 z-10 p-2 text-white/50 hover:text-amber-500`}>
                <ChevronLeft className={`w-12 h-12 ${isArabic ? 'rotate-180' : ''}`} />
              </button>
              <button className={`next-btn absolute top-1/2 ${isArabic ? 'left-4' : 'right-4'} -translate-y-1/2 z-10 p-2 text-white/50 hover:text-amber-500`}>
                <ChevronRight className={`w-12 h-12 ${isArabic ? 'rotate-180' : ''}`} />
              </button>
            </Swiper>
          </div>
        </div>
      )}
    </section>
  );
}