import React from "react";
import ActivitiesCard from "@/components/activities-card"
import Link from "next/link";

interface Props {
  isArabic: boolean;
}

interface Activity {
  nameEn: string;
  nameAr: string;
  iconUrl: string;
}

const activities: Activity[] = [
  { nameEn: "Zipline", nameAr: "الانزلاق بالحبل", iconUrl: "https://cdn-icons-png.flaticon.com/512/3163/3163786.png" },
  { nameEn: "Climbing Tour", nameAr: "جولة التسلق", iconUrl: "https://cdn-icons-png.flaticon.com/512/18693/18693191.png" },
  { nameEn: "Trail (Hiking)", nameAr: "المسار (الهايكينغ)", iconUrl: "https://cdn-icons-png.flaticon.com/512/2826/2826742.png" },
  { nameEn: "Big Swing", nameAr: "الأرجوحة الكبيرة", iconUrl: "https://cdn-icons-png.flaticon.com/512/7433/7433100.png" },
  { nameEn: "Camping", nameAr: "التخييم", iconUrl: "https://cdn-icons-png.flaticon.com/512/1020/1020535.png" },
  { nameEn: "Telescope", nameAr: "التلسكوب", iconUrl: "https://cdn-icons-png.flaticon.com/512/4270/4270639.png" },
  { nameEn: "Countryside Experience", nameAr: "تجربة الريف", iconUrl: "https://cdn-icons-png.flaticon.com/512/8046/8046891.png" },
  { nameEn: "Treasure Hunt", nameAr: "البحث عن الكنز", iconUrl: "https://cdn-icons-png.flaticon.com/512/19022/19022179.png" },
  { nameEn: "High Rope & Low Courses", nameAr: "مسارات الحبال العالية والمنخفضة", iconUrl: "https://cdn-icons-png.flaticon.com/512/10062/10062618.png" },
];

const IndoorAvtivitiesSection: React.FC<Props> = ({ isArabic }) => {
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
        {activities.map((act, idx) => (
               <Link  key={idx} href={`/indoor-activities/${act.nameEn ?? ""}`}>
     <ActivitiesCard      isArabic={isArabic} act={act} />
     </Link>
        ))}
      </div>

    
    </section>
  );
};

export default IndoorAvtivitiesSection;
