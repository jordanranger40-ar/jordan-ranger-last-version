import React from "react";
import Image from "next/image";
import thaer from "@/public/images/thaer.jpg";

interface Props {
  isArabic: boolean;
}

export default function FounderSection({ isArabic }: Props) {
  return (
    <section
      className={`grid grid-cols-1 md:grid-cols-3 gap-12 items-center max-w-6xl mx-auto mt-32 px-6 ${
        isArabic ? "text-right" : "text-left"
      }`}
      dir={isArabic ? "rtl" : "ltr"}
    >
  
      <div className="relative aspect-square w-full rounded-2xl overflow-hidden shadow-lg group order-2 md:order-1">
        <Image
          src={thaer}
          alt="Founder"
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>


      <div className="space-y-6 md:col-span-2 order-1 md:order-2">
        <h2 className="text-5xl font-extrabold text-[#9f721fff]">
          {isArabic ? "الرجل خلف القصة" : "The Man Behind the Story"}
        </h2>
        <p className="text-lg leading-relaxed">
          {isArabic
            ? "عبدالله، مغامر ومحب للطبيعة، قضى سنوات من عمره في استكشاف الصحارى والجبال والغابات، وجمع خبراته ليبني هذه المنصة."
            : "Abdullah, an explorer and nature lover, spent years discovering deserts, forests, and mountains — bringing all that knowledge into creating this platform."}
        </p>
      </div>
    </section>
  );
}
