import React from "react";
import TrainingsCard from "@/components/trainings-card";
import Link from "next/link";
import { getTrainingByType } from "@/app/models/db/lib/services/training";
interface Props {
  isArabic: boolean;
}

export default async function TrainingSection({ isArabic }: Props) {
  const data = await getTrainingByType("Schools Training");
  return (
    <section
      dir={isArabic ? "rtl" : "ltr"}
      className="w-full min-h-screen py-24 bg-[#f4f6f8] flex flex-col items-center"
    >
      <h2 className="text-2xl md:text-5xl font-bold mb-6 text-[#2c3e50]">
        {isArabic ? "التدريب المدرسي" : "School Training"}
      </h2>
      <p className="text-center text-gray-600 mb-16 max-w-5xl">
        {isArabic
          ? `يقدّم جوردن رينجر تدريبًا مدرسيًا تفاعليًا صُمّم لتعزيز الأهداف التعليمية للمدارس، مثل العمل الجماعي، والقيادة، وتنمية مهارات حلّ المشكلات، والطهي في الهواء الطلق لدى الطلاب. يتضمن برنامجنا مجموعة متنوعة من العوائق والتحديات العسكرية المصمّمة بعناية لتعزيز روح التعاون وبناء القدرة على التحمّل.

يُركّز تدريبنا على تطوير اللياقة البدنية، والمرونة الذهنية، والتفكير الاستراتيجي، بما يهيّئ المشاركين لمواجهة مواقف الحياة الواقعية المختلفة. انضموا إلينا لننطلق معًا في رحلة شيّقة من النمو والتعلّم والمغامرة!`
          : `The school training offered by Jordan Ranger is an engaging program designed to enhance the educational objectives of the school, like teamwork, leadership, problem-solving skills, and outdoor cooking, among students. Our course features a variety of obstacles and Army challenges carefully crafted to promote cooperation and resilience.
Our training is tailored to enhance physical fitness, mental agility, and strategic thinking, preparing individuals for various real-world situations. Join us as we embark on an exciting journey of growth, learning, and adventure together!`}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-6 w-full max-w-7xl">
        {data.data.map((data, idx) => (
          <Link
            key={idx}
            href={`/training/schools-training/${data.slug ?? ""}`}
          >
            <TrainingsCard isArabic={isArabic} data={data} />
          </Link>
        ))}
      </div>
    </section>
  );
}
