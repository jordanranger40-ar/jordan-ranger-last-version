'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';

// Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Keyboard, Zoom, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/zoom';

// Image Imports
import Image1 from "@/public/images/Orienteering 1.jpg"; 
import Image2 from "@/public/images/Orienteering 2.jpg"; 
import Image3 from "@/public/images/Orienteering 3.jpg"; 
import DarkButton from '@/components/ui/dark-button';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default function OrienteeringPage({ params }: PageProps) {
  // Unwrap params using React.use() or similar if on Next 15, 
  // but for a Client Component, we handle the async nature:
  const [locale, setLocale] = useState("en");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  const galleryImages = [Image1, Image2, Image3];

  useEffect(() => {
    params.then(p => setLocale(p.locale));
  }, [params]);

  const isArabic = locale === "ar";
  const direction = isArabic ? "rtl" : "ltr";

  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => closeButtonRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [lightboxOpen]);

  const openLightbox = (index: number) => {
    setActiveIndex(index);
    setLightboxOpen(true);
  };

  return (
    <main 
      className="min-h-screen bg-[#fcfcf9] py-24 flex items-center justify-center overflow-hidden" 
      dir={direction}
    >
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* --- ASYMMETRIC MASONRY GRID --- */}
          <div className="w-full lg:w-1/2 grid grid-cols-12 grid-rows-6 gap-4 h-[500px] md:h-[650px]">
            
            {/* Main Feature Image */}
            <div 
              onClick={() => openLightbox(0)}
              className="col-span-7 row-span-6 relative rounded-tr-[5rem] rounded-bl-[5rem] overflow-hidden shadow-2xl group border-2 border-[#676e32]/10 cursor-pointer"
            >
              <Image 
                src={Image1} 
                alt="Orienteering Landscape" 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-500 flex items-center justify-center">
                 <Maximize2 className="text-white opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8" />
              </div>
            </div>

            {/* Top Secondary Image */}
            <div 
              onClick={() => openLightbox(1)}
              className="col-span-5 row-span-3 relative rounded-2xl overflow-hidden shadow-xl group border-2 border-[#676e32]/10 cursor-pointer"
            >
              <Image 
                src={Image2} 
                alt="Orienteering Detail" 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                 <Maximize2 className="text-white opacity-0 group-hover:opacity-100 w-6 h-6" />
              </div>
            </div>

            {/* Bottom Secondary Image */}
            <div 
              onClick={() => openLightbox(2)}
              className="col-span-5 row-span-3 relative rounded-full overflow-hidden shadow-xl group border-2 border-[#676e32]/10 cursor-pointer"
            >
              <Image 
                src={Image3} 
                alt="Orienteering Action" 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-[#676e32]/0 group-hover:bg-[#676e32]/20 transition-all flex items-center justify-center">
                 <Maximize2 className="text-white opacity-0 group-hover:opacity-100 w-6 h-6" />
              </div>
            </div>
          </div>

          {/* --- TEXT CONTENT --- */}
          <div className="w-full lg:w-1/2 space-y-8">
            <header>
              <div className="inline-block px-4 py-1 rounded-full border border-[#676e32] text-[#676e32] text-xs font-bold uppercase tracking-widest mb-4">
                {isArabic ? "من نحن" : "Who we are"}
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-[#2c3e50] leading-tight">
                {isArabic ? "فن التوجيه" : "The Art of"} 
                <span className="block text-[#676e32]">{isArabic ? "والملاحة" : "Orienteering"}</span>
              </h2>
            </header>

            <div className="space-y-6 text-lg text-gray-700 leading-relaxed max-w-xl">
              <p className="font-bold text-[#2c3e50] relative">
                <span className={`absolute ${isArabic ? '-right-4' : '-left-4'} top-0 bottom-0 w-1 bg-[#676e32] rounded-full`} />
                {isArabic
                  ? `جوردان رينجر هي الشركة الوحيدة في الأردن التي تقدم التدريب في رياضة التوجيه والملاحة.`
                  : `Jordan Ranger is the only company in Jordan that offers and trains in the sport of orienteering.`}
              </p>
              <p className="opacity-80">
                {isArabic
                  ? `تُعد رياضة التوجيه مغامرة خارجية مثيرة تعمل على تنشيط العقل والجسم، ومناسبة لجميع الأعمار ومستويات اللياقة البدنية.`
                  : `Orienteering is an exciting outdoor adventure sport that exercises mind and body and suitable for all ages and fitness levels.`}
              </p>
            </div>

            <Link href="/contact-us">
              <DarkButton className='w-full'>
                {isArabic ? "تواصل معنا" : "Contact Us"}
              </DarkButton>
            </Link>
          </div>
        </div>
      </div>

      {/* --- LIGHTBOX (Swiper) --- */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md" role="dialog">
          <button
            ref={closeButtonRef}
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 z-[110] p-3 rounded-full bg-white/10 hover:bg-[#676e32] text-white transition-all"
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
              {galleryImages.map((img, i) => (
                <SwiperSlide key={`full-${i}`}>
                  <div className="swiper-zoom-container h-full flex items-center justify-center">
                    <Image 
                      src={img} 
                      alt={`zoom-${i}`} 
                      className="object-contain max-h-[85vh] rounded-lg"
                      placeholder="blur"
                    />
                  </div>
                </SwiperSlide>
              ))}
              
              {/* Custom Nav Buttons (Colors adjusted to match your brand) */}
              <button className={`prev-btn absolute top-1/2 ${isArabic ? 'right-4' : 'left-4'} -translate-y-1/2 z-10 p-2 text-white/50 hover:text-[#676e32]`}>
                <ChevronLeft className={`w-12 h-12 ${isArabic ? 'rotate-180' : ''}`} />
              </button>
              <button className={`next-btn absolute top-1/2 ${isArabic ? 'left-4' : 'right-4'} -translate-y-1/2 z-10 p-2 text-white/50 hover:text-[#676e32]`}>
                <ChevronRight className={`w-12 h-12 ${isArabic ? 'rotate-180' : ''}`} />
              </button>
            </Swiper>
          </div>
        </div>
      )}
    </main>
  );
}