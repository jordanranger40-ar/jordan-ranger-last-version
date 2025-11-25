import React from 'react';
import type { newTraining } from '@/types';

interface Props {
  data: newTraining;
  isArabic: boolean;
}

export default function TrainingsCard({ data, isArabic }: Props) {
  return (
    <div
      className="bg-white shadow-md p-8 flex flex-col items-center text-center
                 transition-transform transform  hover:-translate-y-2 hover:shadow-xl overflow-hidden group"
      style={{
        borderRadius: "2rem 0.5rem 2rem 0.5rem",
        boxShadow: "0 6px 15px rgba(0,0,0,0.15)",
      }}
    >
      <div className="bg-[#676e32] rounded-full w-20 h-20 flex items-center justify-center mb-5 transition-transform transform">
        <img
          src={data.card_image}
          alt={isArabic ? data.name_ar : data.name_en}
          className="w-12 h-12 object-contain"
        />
      </div>
      <h3 className="text-[#2c3e50] text-2xl font-semibold mb-2">
        {isArabic ? data.name_ar : data.name_en}
      </h3>
      <span className="w-12 h-1 bg-[#f39c12] rounded-full"></span>
    </div>
  );
}
