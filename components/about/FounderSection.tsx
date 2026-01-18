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
            ? "الكابتن ثائر عياش، الشخص اللذي نجحت رؤيته باطلاق هذا المشروع وخبرته الواسعة من خلال استضافته للمسافرين والعائلات والشركات والمدارس من جميع أنحاء العالم. تخرج الكابتن ثائر من الولايات المتحدة الأمريكية بتخصص أنشطة بناء الأفرقة ؟. حيث أنه من أهدافه تشجيع الأشخاص على استكشاف إمكاناتهم وتواصلهم مع أنفسهم اللذي بدوره يساعد على تطوير الذات.يضم فريق جوردان رينجر أكثر من 60 محترفًاً معظمهم من المجتمعات المحلية المحيطة بالمنطقة، ويشمل فريقنا أيضًا مدربين معتمدين ذوي خبرة قادرين على تقديم أنشطة بناء الأفرقة بشكل ممتع ومفيد للغاية."
            : "Captain Thair Ayyash. Captain Thair is experienced in creating life beyond the ordinary, with decades of hosting travellers, families, companies and schools from all across the world at Jordan Ranger. Captain Thair graduated from United States specializing in team building activities and outdoor challenges. Captain Thair’s lifelong aim is to encourage people to explore their full potential and reconnect with their roots.The Jordan Ranger’s family consists of 60 professionals (mostly from the surrounding local communities) will make sure you will enjoy a wonderful experience during your stay. Our team also includes experienced and certified trainers capable of developing and delivering highly enjoyable team building and corporate retreat activities."}
        </p>
      </div>
    </section>
  );
}
