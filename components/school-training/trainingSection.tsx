import React from "react";
import TrainingsCard from "@/components/trainings-card";
import Link from "next/link";
import { getTrainingByType } from "@/app/models/db/lib/services/training";
import { Sparkles } from "lucide-react";

interface Props {
  isArabic: boolean;
}

export default async function TrainingSection({ isArabic }: Props) {
  const data = await getTrainingByType("Schools Training");
  const hasData = data?.data && data.data.length > 0;

  return (
    <section
      dir={isArabic ? "rtl" : "ltr"}
      className="w-full min-h-screen py-24 bg-[#f4f6f8] flex flex-col items-center"
    >
      <h2 className="text-2xl md:text-5xl font-bold mb-6 text-[#2c3e50]">
        {isArabic ? "التدريب المدرسي" : "School Training"}
      </h2>
      <p className="text-center text-gray-600 mb-16 max-w-5xl px-4">
        {isArabic
          ? `يقدّم جوردن رينجر تدريبًا مدرسيًا تفاعليًا صُمّم لتعزيز الأهداف التعليمية للمدارس، مثل العمل الجماعي، والقيادة، وتنمية مهارات حلّ المشكلات، والطهي في الهواء الطلق لدى الطلاب. يتضمن برنامجنا مجموعة متنوعة من العوائق والتحديات العسكرية المصمّمة بعناية لتعزيز روح التعاون وبناء القدرة على التحمّل.

يُركّز تدريبنا على تطوير اللياقة البدنية، والمرونة الذهنية، والتفكير الاستراتيجي، بما يهيّئ المشاركين لمواجهة مواقف الحياة الواقعية المختلفة. انضموا إلينا لننطلق معًا في رحلة شيّقة من النمو والتعلّم والمغامرة!`
          : `The school training offered by Jordan Ranger is an engaging program designed to enhance the educational objectives of the school, like teamwork, leadership, problem-solving skills, and outdoor cooking, among students. Our course features a variety of obstacles and Army challenges carefully crafted to promote cooperation and resilience.
Our training is tailored to enhance physical fitness, mental agility, and strategic thinking, preparing individuals for various real-world situations. Join us as we embark on an exciting journey of growth, learning, and adventure together!`}
      </p>

      {hasData ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-6 w-full max-w-7xl">
          {data.data.map((item, idx) => (
            <Link
              key={idx}
              href={`/training/schools-training/${item.slug ?? ""}`}
              className="block transition-transform duration-300 hover:-translate-y-2"
            >
              <TrainingsCard isArabic={isArabic} data={item} />
            </Link>
          ))}
        </div>
      ) : (
        /* --- Interactive "Coming Soon" State with Brand Color --- */
        <div className="flex flex-col items-center justify-center p-16 bg-white/60 backdrop-blur-sm rounded-3xl border-2 border-dashed border-[#676e32]/30 max-w-2xl mx-4 group transition-all duration-500 hover:border-[#676e32] hover:bg-white hover:shadow-2xl hover:shadow-[#676e32]/10">
          <div className="relative mb-6">
            <Sparkles className="w-12 h-12 text-gray-400 group-hover:text-[#676e32] group-hover:rotate-12 transition-all duration-500" />
          </div>
          
          <h3 className="text-2xl md:text-3xl font-bold text-[#2c3e50] mb-3 text-center">
            {isArabic ? "برامج جديدة قادمة قريباً" : "New Programs Coming Soon"}
          </h3>
          
          {/* Brand Colored Decorative Line */}
          <div className="h-1 w-12 bg-[#676e32] rounded-full mb-6 group-hover:w-32 transition-all duration-700 ease-in-out"></div>
          
          <p className="text-center text-gray-500 max-w-md leading-relaxed">
            {isArabic 
              ? "نحن نجهز حالياً برامج تدريبية استثنائية ستغير مفهوم المغامرة لديكم. كونوا على استعداد للتحدي القادم!"
              : "We are currently crafting extraordinary training programs that will redefine your adventure. Get ready for the next challenge!"}
          </p>
        </div>
      )}
    </section>
  );
}