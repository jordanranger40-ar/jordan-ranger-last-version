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
import { newActivity } from "@/types";

interface Props {
  isArabic: boolean;
  comingSoonActivities: string | newActivity[];
}

export default function ComingSoon({ isArabic, comingSoonActivities }: Props) {
  const autoplay = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false })
  );

  const activities = Array.isArray(comingSoonActivities)
    ? comingSoonActivities
    : [];

  if (!activities.length) return null;
  return (
    <section className="w-full mt-20 px-6 md:px-20 text-center ">
      <h3 className="text-3xl font-bold mb-6">
        {isArabic
          ? "تحضيراتنا لموسم الصيف القادم!"
          : "Preparing for Next Summer!"}
      </h3>

      <Carousel plugins={[autoplay.current]} className="relative">
        <CarouselContent>
          {activities.map((activity: newActivity) => {
            const slug = activity.slug ?? activity.id;

            return (
              <CarouselItem key={activity.id ?? slug}>
           <article className="bg-[#484d23] text-white rounded-2xl shadow-lg overflow-hidden min-h-[260px] md:min-h-[340px]">
  <div className="flex flex-col md:flex-row items-stretch">
    {/* Poster */}
    <div className="relative w-full md:w-1/2 h-56 md:h-[340px] overflow-hidden rounded-t-2xl md:rounded-l-2xl">
      <Image
        src={activity.poster_image ?? "/default-image.png"}
        alt={activity.name_en || "coming soon"}
        fill
        className="object-cover "
      />
      <div className="absolute inset-0 bg-black/20" />
    </div>

    {/* Content */}
    <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-center items-center gap-2 rounded-b-2xl md:rounded-r-2xl">
      <h4 className="text-lg md:text-2xl font-bold leading-tight text-center">
        {isArabic ? activity.name_ar : activity.name_en}
      </h4>

      <p className="text-sm md:text-base text-white/90 mb-0 max-w-3xl line-clamp-3">
        {isArabic ? activity.description_ar : activity.description_en}
      </p>

      <div className="flex items-center gap-2 mt-2">
        <Link href={`/activities/${activity.location_type_en}-activities/${slug}`}>
          <LightButton>
            {isArabic ? "اعرف أكثر" : "Learn More"}
          </LightButton>
        </Link>
      </div>
    </div>
  </div>
</article>


              </CarouselItem>
            );
          })}
        </CarouselContent>

        <CarouselPrevious
          className="mt-4 bg-white text-[#484d23] font-semibold rounded-full shadow-md hover:bg-[#dcdca8] hover:scale-105 transition-all duration-300"
          onPointerDown={() => autoplay.current.stop()}
        />
        <CarouselNext
          className="mt-4 bg-white text-[#484d23] font-semibold rounded-full shadow-md hover:bg-[#dcdca8] hover:scale-105 transition-all duration-300"
          onPointerDown={() => autoplay.current.stop()}
        />
      </Carousel>
    </section>
  );
}
