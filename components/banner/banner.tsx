"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import Logo from "@/components/Logo/Logo";
import { newBanner } from "@/types";
import Snavbar from "@/components/header/snavbar";
import { Button } from "@/components/ui/button";
import { newTraining, newCategory } from "@/types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type Props = {
  banners: newBanner[];
  locale: string;
  categories: newCategory[];
  trainingData: newTraining[];
};

export function Banner({ banners, locale, categories, trainingData }: Props) {
  const isArabic = locale.startsWith("ar");
  const autoplay = useRef(Autoplay({ delay: 3000, stopOnInteraction: false }));

  return (
    <section className="w-full bg-[#f1f1f1] relative">
      <header className="absolute top-0 left-0 w-full z-30 p-4">
        <nav className="flex justify-between items-center text-white">
          <Logo />
          <Snavbar categories={categories} trainingData={trainingData} />
        </nav>
      </header>

      <Carousel
        plugins={[autoplay.current]}
        className="carousel-container relative"
      >
        <CarouselContent>
          {banners.map((banner) => {
            const title = banner.alt ?? "";
            const description = isArabic
              ? banner.description_ar ?? banner.description_en
              : banner.description_en;

            return (
              <CarouselItem key={banner.id}>
                <article className="relative aspect-20/9 overflow-hidden rounded-b-[100px]">
                  <Image
                    src={banner.image ?? "/default-image.png"}
                    alt={title}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-black/50 z-10" />
                  <div className="absolute inset-0 z-20 flex items-center justify-center text-center text-white px-6">
                    <div>
                      <h2 className="text-5xl font-bold">{title}</h2>
                      <p className="text-xl mt-6 max-w-3xl mx-auto">{description}</p>
                      <Button variant="outline" className="text-black mt-6">
                        enroll now
                      </Button>
                    </div>
                  </div>
                </article>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        <CarouselPrevious
          className="carousel-button left-4"
          onPointerDown={() => autoplay.current.stop()}
        />
        <CarouselNext
          className="carousel-button right-4"
          onPointerDown={() => autoplay.current.stop()}
        />
      </Carousel>

      <style jsx>{`
        .carousel-container .carousel-button {
          opacity: 0;
          transition: opacity 0.3s;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 30;
        }

        .carousel-container:hover .carousel-button {
          opacity: 1;
        }
      `}</style>
    </section>
  );
}
