import React from "react";

interface Props {
  isArabic: boolean;
}

export default function MissionSection({ isArabic }: Props) {
  return (
    <section
      className={`max-w-6xl mx-auto mt-32 px-6 ${isArabic ? "text-right" : "text-left"}`}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className="group bg-[#b3c820ff] text-white rounded-3xl shadow-xl p-12 transition duration-300 hover:scale-[1.015] hover:shadow-2xl">
        <h2 className="text-5xl font-extrabold mb-6 group-hover:text-white/90 transition-colors">
          {isArabic ? "مهمتنا" : "Our Mission"}
        </h2>
        <p className="text-lg leading-relaxed text-white/95 group-hover:text-white">
          {isArabic
            ? "مهمتنا تهدف إلى مساعدتك على تحقيق هدفك الشخصي؛ سواء كنت تبحث عن إقامة تأملية تعيد لك صفاء الروح في أكواخنا الفريدة، أو عطلة مميزة مع من تحب، أو تجربة تخييم لا مثيل لها، أو مغامرة مع زملائك مليئة بالتحدي والحماس."
            : "Our mission is to help you achieve your personal goal: whether you are seeking a soul-searching lodging retreat in our unique cabins, a getaway with your loved ones, a camping experience like no other or an adventure with your colleagues filled with challenge and excitement."}
        </p>
      </div>
    </section>
  );
}
