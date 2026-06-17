"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import LightButton from "../ui/light-button";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { newActivity, comingSoonTraining } from "@/types";

interface Props {
  isArabic: boolean;
  comingSoonActivities: string | newActivity[];
  comingSoonTrainings: comingSoonTraining[];
}

type SlideItem =
  | {
      type: "activity";
      id: string;
      title_en: string;
      title_ar: string;
      description_en: string;
      description_ar: string;
      image: string;
      href: string;
    }
  | {
      type: "training";
      id: string;
      title_en: string;
      title_ar: string;
      description_en: string;
      description_ar: string;
      image: string;
      href: string;
    };

export default function ComingSoon({
  isArabic,
  comingSoonActivities,
  comingSoonTrainings,
}: Props) {
  const autoplay = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false }),
  );

  const activities = Array.isArray(comingSoonActivities)
    ? comingSoonActivities
    : [];

  const slides: SlideItem[] = [
    ...activities.map((activity) => {
      const slug = activity.slug ?? activity.id ?? "";

      return {
        type: "activity" as const,
        id: activity.id ?? slug,
        title_en: activity.name_en ?? "",
        title_ar: activity.name_ar ?? "",
        description_en: activity.description_en ?? "",
        description_ar: activity.description_ar ?? "",
        image: activity.header_image ?? "/default-image.png",
        href: `/activities/${activity.location_type_en}-activities/${slug}`,
      };
    }),

    ...comingSoonTrainings.map((training, index) => {
      const categoryName = training.category_en
        .toLowerCase()
        .split(" ")
        .join("-");

      return {
        type: "training" as const,
        id: training.id,
        title_en: training.name_en ?? "",
        title_ar: training.name_ar ?? "",
        description_en: training.description_en ?? "",
        description_ar: training.description_ar ?? "",
        image: training.header_image ?? "/default-image.png",
        href: `/training/${categoryName}/${training.slug}`,
      };
    }),
  ];

  if (!slides.length) return null;

  return (
    <section className="w-full mt-20 px-6 md:px-20 text-center">
      <h3 className="text-3xl font-bold mb-6">
        {isArabic ? "تحضيراتنا القادمة!" : "Preparing for Next Summer!"}
      </h3>

      <Carousel plugins={[autoplay.current]} className="relative">
        <CarouselContent>
          {slides.map((item) => (
            <CarouselItem key={`${item.type}-${item.id}`}>
              <article className="bg-[#484d23] text-white rounded-2xl shadow-lg overflow-hidden min-h-65 md:min-h-85">
                <div className="flex flex-col md:flex-row items-stretch">
                  <div className="relative w-full md:w-1/2 h-56 md:h-85 overflow-hidden rounded-t-2xl md:rounded-l-2xl">
                    <Image
                      src={item.image}
                      alt={
                        isArabic
                          ? item.title_ar || "coming soon"
                          : item.title_en || "coming soon"
                      }
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20" />
                  </div>

                  <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-center items-center gap-2 rounded-b-2xl md:rounded-r-2xl">
                    <h4 className="text-lg md:text-2xl font-bold leading-tight text-center">
                      {isArabic ? item.title_ar : item.title_en}
                    </h4>

                    <p className="text-sm md:text-base text-white/90 mb-0 max-w-3xl line-clamp-3">
                      {isArabic ? item.description_ar : item.description_en}
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      <Link href={item.href}>
                        <LightButton>
                          {isArabic ? "اعرف أكثر" : "Learn More"}
                        </LightButton>
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            </CarouselItem>
          ))}
        </CarouselContent>

        {slides.length > 1 && (
          <CarouselPrevious
            className="mt-4 bg-white text-[#484d23] font-semibold rounded-full shadow-md hover:bg-[#dcdca8] hover:scale-105 transition-all duration-300"
            onPointerDown={() => autoplay.current.stop()}
          />
        )}
        {slides.length > 1 && (
          <CarouselNext
            className="mt-4 bg-white text-[#484d23] font-semibold rounded-full shadow-md hover:bg-[#dcdca8] hover:scale-105 transition-all duration-300"
            onPointerDown={() => autoplay.current.stop()}
          />
        )}
      </Carousel>
    </section>
  );
}
