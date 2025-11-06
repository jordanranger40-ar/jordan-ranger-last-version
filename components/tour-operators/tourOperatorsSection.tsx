import React from 'react'
import TourOperator from "@/public/images/touroperator.jpg";
import Image from 'next/image';
import { Button } from "@/components/ui/button";

interface Props {
  isArabic: boolean;
}

export default function TourOperatorsSection({ isArabic }: Props) {
  return (
    <div
      className={`flex flex-col md:flex-row items-center justify-center w-[90%]  px-6 py-24  justify-self-center gap-14
        ${isArabic ? 'md:flex-row-reverse text-right' : 'text-left'}`}
    >
      {/* الصورة */}
      <div className="relative w-full md:w-3/5 h-64 md:h-96 rounded-2xl overflow-hidden shadow-lg group">
        <Image
          src={TourOperator}
          alt={isArabic ? "صورة مشغل سياحي" : "Tour Operator Image"}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* النص */}
      <div className={`w-full md:w-1/3 flex flex-col ${isArabic ? 'items-end' : 'items-start'}`}>
        <h2 className="text-5xl font-bold mb-4 text-[#676e32]">
          {isArabic ? "مشغلي الرحلات السياحية" : "Tour Operators"}
        </h2>
        <p className={`mb-6 text-gray-700 ${isArabic ? 'text-right' : 'text-left'} break-words`}>
          {isArabic
            ? "هنا يمكنك العثور على أفضل مشغلي الرحلات السياحية لدينا لتجربة لا تُنسى."
            : "Here you can find the best tour operators for an unforgettable experience. Our operators ensure high-quality tours with exceptional service and unique experiences tailored to your needs."}
        </p>
        <Button
  className="bg-[#676e32] hover:bg-[#5a5f27] text-white px-6 py-3 rounded transition"
>
  {isArabic ? "استكشف الآن" : "Explore Now"}
</Button>
      </div>
    </div>
  );
}
