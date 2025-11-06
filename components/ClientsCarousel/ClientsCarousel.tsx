"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, Scrollbar, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

type Client = {
  id?: string;
  name: string;
  logo: string;
  created_at?: Date;
};

type Props = {
  clients: Client[];
};

export default function ClientsCarousel({ clients }: Props) {
  return (
    <section className="flex flex-col justify-center items-center  w-full">
  

      <div className="w-full max-w-7xl cursor-pointer h-[40vh] ">
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
  className="w-full h-80 "
>

          {clients.map((client, i) => (
            <SwiperSlide key={i} className="flex justify-center items-center">
              <div className="flex flex-col items-center p-4 rounded-lg h-full">
                <div className="h-40 flex items-center justify-center">
                  <img
                    src={client.logo}
                    alt={client.name}
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
