'use client';

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, Scrollbar, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

type Props = {
  images: string[]; // array of image paths relative to public folder
};

export default function ImagesCarousel({ images }: Props) {
  if (!images || images.length === 0) return null;

  return (
    <section className="flex flex-col justify-center items-center w-full">
      <div className="w-full max-w-7xl cursor-pointer h-[40vh]">
        <Swiper
          modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
          spaceBetween={30}
          slidesPerView={6}
          slidesPerGroup={6}
          autoplay={{ delay: 2000 }}
          breakpoints={{
            320: { slidesPerView: 1, slidesPerGroup: 1, spaceBetween: 20 },
            640: { slidesPerView: 2, slidesPerGroup: 2, spaceBetween: 30 },
            768: { slidesPerView: 3, slidesPerGroup: 3, spaceBetween: 40 },
            1024: { slidesPerView: 5, slidesPerGroup: 5, spaceBetween: 50 },
          }}
          className="w-full h-80"
        >
          {images.map((img, i) => (
            <SwiperSlide key={i} className="flex justify-center items-center">
              <div className="flex flex-col items-center p-4 rounded-lg h-full">
                <div className="h-40 flex items-center justify-center">
                  <img
                    src={img}
                    alt={`image-${i + 1}`}
                    className="max-h-full max-w-[150px] object-contain"
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
