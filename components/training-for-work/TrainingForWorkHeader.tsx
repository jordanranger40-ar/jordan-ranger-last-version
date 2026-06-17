import React from "react";

interface Props {
  isArabic: boolean;
}

export default function TrainingForWorkHeader({ isArabic }: Props) {
  return (
    <section
      className="w-full h-[60vh] relative bg-fixed bg-center bg-cover bg-no-repeat mt-14"
      style={{ backgroundImage: `url('/images/about.jpg')` }}
    >
      <div className="bg-black/50 w-full h-full absolute top-0 flex justify-center items-center">
        <h2 className="text-white text-center text-4xl md:text-5xl font-bold">
          {isArabic
            ? "التدريب من أجل العمل"
            : "Training for Work"}
        </h2>

        <p className="absolute bottom-10 text-white/80 text-center max-w-2xl px-4 text-sm md:text-base">
          {isArabic
            ? "برنامج يهدف إلى تزويد المتدربين بالمهارات العملية والقدرات المهنية التي تؤهلهم لدخول سوق العمل بثقة وكفاءة"
            : "A practical program that equips trainees with essential workplace skills and professional abilities to succeed in the job market."}
        </p>
      </div>
    </section>
  );
}