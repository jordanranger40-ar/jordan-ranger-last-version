import React from "react";
import Image from "next/image";
import team from "@/public/images/team.jpg";

interface Props {
  isArabic: boolean;
}

export default function TeamSection({ isArabic }: Props) {
  return (
    <section
      className={`grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto mt-32 px-6 ${
        isArabic ? "text-right" : "text-left"
      }`}
      dir={isArabic ? "rtl" : "ltr"}
    >

      <div className="space-y-6 order-2 md:order-1">
        <h2 className="text-5xl font-extrabold text-[#676e32]">
          {isArabic ? "فريقنا" : "Our Team"}
        </h2>
        <p className="text-lg leading-relaxed">
          {isArabic
            ? "يضم فريقنا نخبة من المحترفين في مجالات التخييم، الطهي، التصميم، ورصد النجوم. نعمل كفريق واحد بشغف لتقديم تجربة فريدة من نوعها لعشاق المغامرات."
            : "Our team is made up of talented professionals in camping, cooking, design, and astronomy. We work with passion and unity to deliver an exceptional experience for every adventurer."}
        </p>
      </div>


      <div className="relative w-full h-80 md:h-[400px] rounded-2xl overflow-hidden shadow-lg group order-1 md:order-2">
        <Image
          src={team}
          alt="Our Team"
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
    </section>
  );
}
