"use client";

import CardsWrapper from "../wrappers/card-wrapper";
import Link from "next/link";
import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import type { newCategory } from "@/types";
import { useLocale } from "next-intl";
import { FiTrendingUp, FiBarChart2, FiDatabase } from "react-icons/fi";

interface ConsultingCardsProps {
  categories: newCategory[];
}

const allowedTitlesEn = ["Monitoring", "Evaluation", "Data Collection"];
const allowedTitlesAr = ["المتابعة", "التقييم", "جمع البيانات"];

const iconMap = {
  Monitoring: <FiTrendingUp className="text-3xl text-[#125892]" />,
  Evaluation: <FiBarChart2 className="text-3xl text-[#125892]" />,
  "Data Collection": <FiDatabase className="text-3xl text-[#125892]" />,
  "المتابعة": <FiTrendingUp className="text-3xl text-[#125892]" />,
  "التقييم": <FiBarChart2 className="text-3xl text-[#125892]" />,
  "جمع البيانات": <FiDatabase className="text-3xl text-[#125892]" />,
};

export default function ConsultingCards({ categories }: ConsultingCardsProps) {
  const locale = useLocale();
  const isArabic = locale === "ar";

  const filteredCategories = categories
    .filter((cat) => {
      const title = isArabic
        ? cat.category_name_ar
        : cat.category_name_en;
      return isArabic
        ? allowedTitlesAr.includes(title)
        : allowedTitlesEn.includes(title);
    })
    .slice(0, 3);

  return (
    <CardsWrapper>
      {filteredCategories.map((cat) => {
        const title = isArabic ? cat.category_name_ar : cat.category_name_en;
        const description = isArabic
          ? cat.description_ar || ""
          : cat.description_en || "";
        const href = `/Consulting/${cat.slug || cat.id}`;
        const truncatedDesc =
          description.length > 150
            ? description.slice(0, 150) + "..."
            : description;

        return (
          <Card
            key={cat.id}
            className={`shadow-xl bg-white border border-gray-200 rounded-xl p-6 hover:shadow-2xl transition-shadow min-h-[360px] flex flex-col relative overflow-hidden group ${
              isArabic ? "text-right" : "text-left"
            }`}
            dir={isArabic ? "rtl" : "ltr"}
          >
            {/* Background Gradient Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#125892]/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-500 z-0" />

            {/* Icon */}
            <div className="mb-4 z-10">
              {iconMap[title as keyof typeof iconMap]}
            </div>

            <CardHeader className="z-10">
              <CardTitle className="text-2xl font-bold text-[#125892]">
                {title}
              </CardTitle>
            </CardHeader>

            <CardContent className="z-10">
              <p className="text-gray-700 leading-relaxed text-sm">
                {truncatedDesc}
              </p>
            </CardContent>

            <div className="mt-auto z-10">
              <Link
                href={href}
                className="block text-center w-full mt-6 bg-[#125892] text-white py-2 rounded-md hover:bg-[#0e4a78] transition"
              >
                {isArabic ? "اعرف المزيد" : "Learn More"}
              </Link>
            </div>
          </Card>
        );
      })}
    </CardsWrapper>
  );
}
