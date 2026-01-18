'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface CardItem {
  label: { en: string; ar: string }; // bilingual labels
  icon: string;
  color: string;
  path: string; // path to navigate when clicked
}

interface Props {
  locale: 'ar' | 'en';
}

export default function Bannercards({ locale }: Props) {
  const router = useRouter();

  const cardItems: CardItem[] = [
    { label: { en: 'Tent', ar: 'خيمة' }, icon: '🏕️', color: '#515151', path: '/Accommodation/Tents' },
    { label: { en: 'Hiking', ar: 'تسلق' }, icon: '🥾', color: '#b3c820ff', path: '/activities/outdoor-activities' },
    { label: { en: 'Cooking', ar: 'طبخ' }, icon: '🍳', color: '#676e32', path: '/activities/outdoor-activities' },
    { label: { en: 'Telescope', ar: 'تلسكوب' }, icon: '🔭', color: '#9f721fff', path: '/activities/outdoor-activities' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4 mb-16 perspective-1000">
      {cardItems.map((item, index) => (
        <div
          key={index}
          onClick={() => router.push(item.path)}
          className="cursor-pointer relative h-64 w-[90vw] md:w-[42vw] lg:w-[22vw] overflow-hidden group transition-transform duration-500 transform-gpu hover:scale-105 hover:rotate-1"
          style={{
            backgroundColor: item.color,
            borderRadius: '2rem 0.5rem 2rem 0.5rem',
            boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
          }}
        >
          {/* محتوى البطاقة */}
          <div className="xl:relative xl:z-10 flex flex-col items-center justify-center h-full text-center p-6 gap-3 transform transition-transform duration-500 group-hover:-translate-y-2">
            <div className="text-6xl text-white drop-shadow-lg">{item.icon}</div>
            <div className="text-white text-2xl font-bold tracking-wide">
              {item.label[locale]}
            </div>
            <div className="text-sm text-white/80 italic">
              {locale === 'ar'
                ? `اكتشف ${item.label[locale]} `
                : `Explore ${item.label[locale].toLowerCase()} `}
            </div>
          </div>

          {/* shine subtle عند hover */}
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute top-0 left-0 w-full h-full bg-linear-to-trr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-40 transition duration-500"
              style={{ borderRadius: '2rem 0.5rem 2rem 0.5rem' }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
