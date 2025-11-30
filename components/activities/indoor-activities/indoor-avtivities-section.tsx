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
      <h2 className="text-5xl font-bold mb-6 text-[#2c3e50]">
        {isArabic ? "الفعاليات الداخلية" : "Indoor Activities"}
      </h2>
      <p className="text-center text-gray-600 mb-16 max-w-3xl">
        {isArabic
          ? "استمتع بمجموعة متنوعة من الأنشطة الداخلية، كل نشاط مصمم ليمنحك تجربة ممتعة ومميزة."
          : "Enjoy a variety of indoor activities, each designed to give you a fun and unique experience."}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-6 w-full max-w-7xl">
        {data.map((data, idx) => (
               <Link  key={idx} href={`/activities/indoor-activities/${data.slug ?? ""}`}>
     <ActivitiesCard      isArabic={isArabic} data={data} />
     </Link>
        ))}
      </div>

    
    </section>
  );
};


