import React from 'react'
import SchoolsTraining from "@/public/images/Schools-Training.jpg";
import Image from 'next/image';
import { Button } from "@/components/ui/button";

interface Props {
  isArabic: boolean;
}

export default function SchoolTrainingSection({ isArabic }: Props) {
  return (
    <div
      className={`flex flex-col md:flex-row items-center justify-center w-[90%]  px-6 py-24  justify-self-center gap-14
        ${isArabic ? 'md:flex-row-reverse text-right' : 'text-left'}`}
    >
      {/* الصورة */}
      <div className="relative w-full md:w-3/5 h-64 md:h-96 rounded-2xl overflow-hidden shadow-lg group">
        <Image
          src={SchoolsTraining}
          alt={isArabic ? "صورة تدريب مدرسي" : "School Training Image"}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* النص */}
      <div className={`w-full md:w-1/3 flex flex-col ${isArabic ? 'items-end' : 'items-start'}`}>
        <h2 className="text-5xl font-bold mb-4 text-[#676e32]">
          {isArabic ? " التدريب المدرسي" : "Schools Training"}
        </h2>
        <p className={`mb-6 text-gray-700 ${isArabic ? 'text-right' : 'text-left'} break-words`}>
          {isArabic
            ? "التدريب المدرسي الذي تقدمه جوردان رينجر هو برنامج تفاعلي مصمم لتعزيز الأهداف التعليمية للمدرسة، مثل العمل الجماعي والقيادة ومهارات حل المشكلات والطهي في الهواء الطلق، لدى الطلاب. تتضمن دورتنا مجموعة متنوعة من العقبات وتحديات الجيش المصممة بعناية لتعزيز التعاون والمرونة. صُمم تدريبنا لتعزيز اللياقة البدنية والمرونة الذهنية والتفكير الاستراتيجي، مما يُهيئ الأفراد لمختلف المواقف الواقعية. انضموا إلينا لننطلق معًا في رحلة شيقة من النمو والتعلم والمغامرة!"
            : "The school training offered by Jordan Ranger is an engaging program designed to enhance the educational objectives of the school, like teamwork, leadership, problem-solving skills, and outdoor cooking, among students. Our course features a variety of obstacles and Army challenges carefully crafted to promote cooperation and resilience.Our training is tailored to enhance physical fitness, mental agility, and strategic thinking, preparing individuals for various real-world situations. Join us as we embark on an exciting journey of growth, learning, and adventure together"}
        </p>
        <Button
  className="bg-[#676e32] hover:bg-[#5a5f27] text-white px-6 py-3 rounded transition"
>
  {isArabic ? "احجز الآن" : "Book Now"}
</Button>
      </div>
    </div>
  );
}
