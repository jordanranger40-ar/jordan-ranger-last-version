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
            ? "مهمتنا هي إلهام وتمكين الناس لاستكشاف العالم من حولهم، وتقديم محتوى ومعدات وتجارب مميزة تساعدهم في بناء لحظات لا تُنسى. نحن نؤمن أن كل مغامرة تبدأ بخطوة، ونحن هنا لنجعل تلك الخطوة الأولى أكثر ثقة، وأكثر حماساً."
            : "Our mission is to inspire and empower people to explore the world around them by offering curated content, premium gear, and unforgettable experiences. We believe every adventure begins with a step, and we're here to make that first step confident and exciting."}
        </p>
      </div>
    </section>
  );
}
