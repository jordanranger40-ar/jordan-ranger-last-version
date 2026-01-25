"use client";

import React from "react";
import VideoHeroSection from "@/components/video-section";
import Bookmenu from "@/components/bookmenu";
import Manakesh from "@/public/images/manakesh.webp";
import restaurant from "@/public/images/restaurant.jpg";
import restaurantlogo from "@/public/images/restaurantlogo.png";
import Image from "next/image";
import ContactHours from "../restaurant/ContactSection";
import ImagesCarousel from "@/components/roomsAndTents/GallaryComponent" 
interface Props {
  locale: "en" | "ar";
}

const galleryImages: string[] = [
  "/images/omlete.jpg",
  "/images/image1.jpg",
  "/images/image2.jpg",
  "/images/image3.jpg",
  "/images/image4.jpg",
];
export default function ParalexSection({ locale }: Props) {
  const isAr = locale === "ar";
  const direction = isAr ? "rtl" : "ltr";
  const textAlign = isAr ? "text-right" : "text-left";

  return (
    <div className="relative" dir={direction}>
      {/* Hero Video */}
      <section
        id="section-1"
        className="relative min-h-screen flex flex-col justify-center items-center text-center bg-white z-10"
        style={{ backgroundColor: "#fff" }}
      >
        <VideoHeroSection locale={locale} />
      </section>

      {/* Restaurant Intro */}
      <div className={`h-screen bg-white flex flex-col justify-center items-center px-6`}>
        <Image
          src={restaurantlogo}
          alt={isAr ? "شعار المطعم" : "Restaurant Logo"}
          className="mb-6 w-60 h-60 object-contain"
        />
        <h2 className={`text-3xl font-semibold mb-4 ${textAlign}`}>
          {isAr ? "مطعم الكروم" : "AL KUROOM RESTAURANT"}
        </h2>
        <p className={`max-w-3xl text-gray-700 text-lg leading-relaxed ${textAlign}`}>
          {isAr
            ? `يقع مطعم الكروم  وسط غابة جوردان رينجر  التي تشرف على مناظر جرش الجميلة ، ويقدم تجربة طعام لا مثيل لها. يمكن للضيوف الاستمتاع بمجموعة متنوعة من الأطباق والنكهات من بوفيهات الإفطار والغداء والعشاء اليومية ، والتي تم إعدادها بعناية من قبل مجتمعنا المحلي باستخدام المكونات الطازجة المُختارة يدويًا من الأراضي الزراعية القريبة.`
            : "Set amidst the Jordan Ranger forest overseeing Jerash’s beautiful views, Al Kuroom Restaurant offers a dining experience like no other. Guests can enjoy a varied selection of local dishes and flavors from our daily breakfast, lunch and dinner buffets, craftily prepared by our chef using the freshest handpicked ingredients from nearby farms."}
        </p>
      </div>

      {/* Parallax Section 1 */}
      <section
        id="section-2"
        className="relative h-screen flex flex-col justify-center items-center text-center text-white z-10 px-6"
        style={{
          backgroundImage: `url(${restaurant.src})`,
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-40 z-0"></div>
        <div className="relative z-10 max-w-3xl">
          <h1 className={`text-4xl centert  font-bold mb-4 ${textAlign}`}>
            {isAr ? "اكتشف أجواءنا الفريدة" : "Discover Our Unique Atmosphere"}
          </h1>
          <p className={`max-w-xl text-lg ${textAlign}`}>
            {isAr
              ? "استمتع بأجواء دافئة مثالية لعشاء العائلة والمناسبات الخاصة."
              : "Enjoy a warm, inviting ambiance perfect for family dinners and special occasions."}
          </p>
        </div>
      </section>

      {/* Book Menu Component */}
      <Bookmenu isArabic={isAr} />

      {/* Parallax Section 2 */}
      <section
        id="section-3"
        className="relative h-screen flex flex-col justify-center items-center text-center text-white z-10 px-6"
        style={{
          backgroundImage: `url(${Manakesh.src})`,
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-40 z-0"></div>
        <div className="relative z-10 max-w-3xl">
          <h1 className={`text-4xl centert font-bold mb-4 ${textAlign}`}>
            {isAr ? "تذوق النكهات الأصيلة" : "Taste Authentic Flavors"}
          </h1>
          <p className={`max-w-xl text-lg ${textAlign}`}>
            {isAr
              ? "يتم تحضير وصفاتنا التقليدية يومياً لضمان تجربة لا تُنسى."
              : "Our traditional recipes are prepared fresh daily, ensuring an unforgettable experience."}
          </p>
        </div>
      </section>

      <ImagesCarousel images={galleryImages}  isArabic={isAr}/>


      {/* Contact & Opening Hours */}
      <ContactHours locale={locale}/>
    </div>
  );
}
