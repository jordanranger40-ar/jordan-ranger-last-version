import React from "react";
import TrainingsCard from "@/components/trainings-card";
import Link from "next/link";
import { getTrainingByType } from "@/app/models/db/lib/services/training";
import { Sparkles } from "lucide-react";

interface Props {
  isArabic: boolean;
}

export default async function TrainingForWorkSection({
  isArabic,
}: Props) {
  const data = await getTrainingByType("Training For Work");

  const hasData = data?.data && data.data.length > 0;

  return (
    <section
      dir={isArabic ? "rtl" : "ltr"}
      className="w-full min-h-screen py-24 bg-[#f4f6f8] flex flex-col items-center"
    >
      <h2 className="text-2xl md:text-5xl font-bold mb-6 text-[#2c3e50]">
        {isArabic ? "التدريب من أجل العمل" : "Training for Work"}
      </h2>

      <p className="text-center text-gray-600 mb-16 max-w-5xl px-4">
        {isArabic
          ? `يهدف برنامج التدريب من أجل العمل إلى تزويد المتدربين بالمهارات العملية والقدرات المهنية الأساسية التي تؤهلهم لدخول سوق العمل بثقة وكفاءة. يشمل البرنامج تطوير مهارات التواصل، العمل الجماعي، حل المشكلات، والانضباط المهني من خلال أنشطة تطبيقية وتجارب واقعية.

نحن نركز على إعداد المشاركين ليكونوا جاهزين للتوظيف عبر تعزيز قدراتهم الشخصية والمهنية بما يتناسب مع متطلبات سوق العمل الحديث.`
          : `The Training for Work program is designed to equip trainees with essential practical skills and professional abilities needed to enter the job market with confidence and competence. The program focuses on communication, teamwork, problem-solving, and professional discipline through hands-on activities and real-world experiences.

We aim to prepare participants for employment by strengthening both their personal and professional skills in line with modern workforce demands.`}
      </p>

      {hasData ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-6 w-full max-w-7xl">
          {data.data.map((item, idx) => (
            <Link
              key={idx}
              href={`/training/training-for-work/${item.slug ?? ""}`}
              className="block transition-transform duration-300 hover:-translate-y-2"
            >
              <TrainingsCard isArabic={isArabic} data={item} />
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-16 bg-white/60 backdrop-blur-sm rounded-3xl border-2 border-dashed border-[#676e32]/30 max-w-2xl mx-4 group transition-all duration-500 hover:border-[#676e32] hover:bg-white hover:shadow-2xl hover:shadow-[#676e32]/10">
          <div className="relative mb-6">
            <Sparkles className="w-12 h-12 text-gray-400 group-hover:text-[#676e32] group-hover:rotate-12 transition-all duration-500" />
          </div>

          <h3 className="text-2xl md:text-3xl font-bold text-[#2c3e50] mb-3 text-center">
            {isArabic
              ? "برامج جديدة قادمة قريباً"
              : "New Programs Coming Soon"}
          </h3>

          <div className="h-1 w-12 bg-[#676e32] rounded-full mb-6 group-hover:w-32 transition-all duration-700 ease-in-out"></div>

          <p className="text-center text-gray-500 max-w-md leading-relaxed">
            {isArabic
              ? "نعمل حالياً على إعداد برامج تدريبية جديدة تهدف إلى تأهيل المتدربين لسوق العمل. ترقبوا المزيد قريباً."
              : "We are currently developing new training programs designed to prepare participants for the job market. Stay tuned for updates."}
          </p>
        </div>
      )}
    </section>
  );
}