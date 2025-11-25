import React from "react";
import TrainingsCard from "@/components/trainings-card";
import Link from "next/link";
import { getTrainingByType } from "@/app/models/db/lib/services/training";
interface Props {
  isArabic: boolean;
}

export default async function TrainingSection({ isArabic }: Props) {
  const data = await getTrainingByType("Schools Training");

  console.log(data.data);
  return (
    <section
      dir={isArabic ? "rtl" : "ltr"}
      className="w-full min-h-screen py-24 bg-[#f4f6f8] flex flex-col items-center"
    >
      <h2 className="text-5xl font-bold mb-6 text-[#2c3e50]">
        {isArabic ? "التدريب المدرسي" : "School Training"}
      </h2>
      <p className="text-center text-gray-600 mb-16 max-w-3xl">
        {isArabic
          ? "استمتع بمجموعة متنوعة من التدريبات المدرسية."
          : "Enjoy a variety of School Activities."}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-6 w-full max-w-7xl">
        {data.data.map((data, idx) => (
          <Link key={idx} href={`/training/school-training/${data.slug ?? ""}`}>
            <TrainingsCard isArabic={isArabic} data={data} />
          </Link>
        ))}
      </div>
    </section>
  );
}
