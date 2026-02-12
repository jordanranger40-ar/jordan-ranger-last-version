"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FiStar, FiActivity, FiCoffee, FiTarget } from "react-icons/fi"; 
import { GoTelescopeFill } from "react-icons/go";


interface CardItem {
  label: { en: string; ar: string }; 
  icon: React.ReactNode;
  color: string;
  path: string;
}

interface Props {
  locale: "ar" | "en";
}

export default function Bannercards({ locale }: Props) {
  const router = useRouter();

  const cardItems: CardItem[] = [
    {
      label: { en: "Telescope", ar: "تلسكوب" },
      icon: <GoTelescopeFill size={30} color="white" />,
      color: "#9f721fff",
      path: "/activities/outdoor-activities/Telescope",
    },
    {
      label: { en: "Yoga", ar: "يوغا" },
      icon: <FiActivity size={30} color="white" />,
      color: "#b3c820ff",
      path: "/activities/indoor-activities/yoga-and-meditation",
    },
    {
      label: { en: "Outdoor Cooking", ar: "الطبخ في الهواء الطلق" },
      icon: <FiCoffee size={30} color="white" />,
      color: "#676e32",
      path: "/activities/outdoor-activities/Outdoor%20Cooking",
    },
    {
      label: { en: "Sand Shaping", ar: "تشكيل الرمال" },
      icon: <FiStar size={30} color="white" />,
      color: "#515151",
      path: "/activities/indoor-activities/sand-shaping",
    },
    
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 px-0 md:px-4 mb-10 md:mb-16 perspective-1000">
      {cardItems.map((item, index) => (
        <div
          key={index}
          onClick={() => router.push(item.path)}
          className="cursor-pointer relative h-52 w-[45vw] md:w-[42vw] lg:w-[22vw] overflow-hidden group transition-transform duration-500 transform-gpu hover:scale-105 hover:rotate-1"
          style={{
            backgroundColor: item.color,
            borderRadius: "2rem 0.5rem 2rem 0.5rem",
            boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
          }}
        >
          {/* Card content */}
          <div className="xl:relative xl:z-10 flex flex-col items-center justify-start md:justify-center  h-full text-center p-6 gap-3 transform transition-transform duration-500 group-hover:-translate-y-2">
            <div className="text-white drop-shadow-lg">{item.icon}</div>
            <div className="text-white text-base md:text-2xl font-bold tracking-wide">
              {item.label[locale]}
            </div>
            <div className="text:text-xs md:text-sm text-white/80 italic">
              {locale === "ar"
                ? `اكتشف ${item.label[locale]} `
                : `Explore ${item.label[locale].toLowerCase()} `}
            </div>
          </div>

          {/* subtle shine on hover */}
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute top-0 left-0 w-full h-full bg-linear-to-trr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-40 transition duration-500"
              style={{ borderRadius: "2rem 0.5rem 2rem 0.5rem" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
