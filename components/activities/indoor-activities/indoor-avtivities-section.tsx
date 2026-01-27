import React from "react";
import ActivitiesCard from "@/components/activities-card"
import Link from "next/link";
import {getActivityByType} from "@/app/models/db/lib/services/activities"

interface Props {
  isArabic: boolean;
}


export default async function IndoorAvtivitiesSection({ isArabic }:Props){

  const data=await getActivityByType("indoor")
  return (
    <section
      dir={isArabic ? "rtl" : "ltr"}
      className="w-full min-h-screen py-24 bg-[#f4f6f8] flex flex-col items-center"
    >
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-[#2c3e50]">
        {isArabic ? "الفعاليات الداخلية" : "Indoor Activities"}
      </h2>
     <p className="text-center text-gray-600 mb-16 w-[90%] text-lg">
  {isArabic
    ? `توفر هذه الأنشطة الداخلية تجربة ترفيهية متكاملة تجمع بين المتعة والراحة. تشمل التجربة مجموعة متنوعة من الألعاب والأنشطة المصممة بعناية لتناسب مختلف الأعمار، مع أجواء مريحة وآمنة تتيح للزوار الاستمتاع بوقتهم بعيدًا عن الظروف الجوية. كل نشاط يقدم تجربة مميزة تهدف إلى تعزيز التفاعل والمرح وقضاء وقت ممتع داخل المكان.`
    : `These indoor activities offer a complete entertainment experience that combines fun and comfort. The experience includes a variety of games and activities carefully designed to suit different age groups, within a safe and comfortable environment away from outdoor conditions. Each activity provides a unique experience that encourages interaction, enjoyment, and quality time indoors.`}
</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8  px-6 w-full max-w-7xl">
        {data.map((data, idx) => (
               <Link  key={idx} href={`/activities/indoor-activities/${data.slug ?? ""}`}>
     <ActivitiesCard      isArabic={isArabic} data={data} />
     </Link>
        ))}
      </div>

    
    </section>
  );
};


