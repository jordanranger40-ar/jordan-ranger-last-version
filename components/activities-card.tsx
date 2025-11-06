import React from 'react';
import Image from 'next/image';

interface Activity {
  nameEn: string;
  nameAr: string;
  iconUrl: string;
}

interface Props {
  act: Activity;
  isArabic: boolean;
}

export default function ActivitiesCard({ act, isArabic }: Props) {
  return (
    <div className="bg-white rounded-3xl shadow-md p-8 flex flex-col items-center text-center transition-transform transform hover:scale-105 hover:shadow-xl">
      <div className="bg-[#676e32] rounded-full w-20 h-20 flex items-center justify-center mb-5 transition-transform transform hover:scale-110">
        <img
          src={act.iconUrl}
          alt={isArabic ? act.nameAr : act.nameEn}
          className="w-12 h-12 object-contain"
       
        />
      </div>
      <h3 className="text-[#2c3e50] text-2xl font-semibold mb-2">
        {isArabic ? act.nameAr : act.nameEn}
      </h3>
      <span className="w-12 h-1 bg-[#f39c12] rounded-full"></span>
    </div>
  );
}
