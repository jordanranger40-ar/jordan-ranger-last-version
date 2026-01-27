import Image from "next/image";
import React from "react";

interface Props {
  isArabic: boolean;
}

export default function TentsHeaderSection({ isArabic }: Props) {
  return (
    <section className="w-full h-[60vh] relative overflow-hidden">
      {/* Hero Image */}
      <Image
        src="/images/banner1.jpg" 
        alt="Tents Banner"
        fill
        priority          
        quality={75}      
        sizes="100vw"     
        className="object-cover"
      />

      {/* Overlay with title */}
      <div className="absolute inset-0 bg-black/50 flex justify-center items-center">
        <h2 className="text-white text-center text-4xl font-bold">
          {isArabic ? "خيمنا" : "Tents"}
        </h2>
      </div>
    </section>
  );
}
