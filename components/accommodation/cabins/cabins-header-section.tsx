import Image from "next/image";
import React from "react";

interface Props {
  isArabic: boolean;
}

export default function CabinsHeaderSection({ isArabic }: Props) {
  return (
    <section className="w-full h-[60vh] relative overflow-hidden">
      <Image
        src="/images/banner4.jpg"
        alt="Cabins Banner"
        fill
        priority
        quality={75}
        sizes="100vw"
        className="object-cover"
      />

      <div className="absolute inset-0 bg-black/50 flex justify-center items-center">
        <h2 className="text-white text-center text-4xl font-bold">
          {isArabic ? "غرفنا" : "Cabins"}
        </h2>
      </div>
    </section>
  );
}
