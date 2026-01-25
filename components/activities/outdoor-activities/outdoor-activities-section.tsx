import React from "react";
import ActivitiesCard from "@/components/activities-card";
import Link from "next/link";
import { getActivityByType } from "@/app/models/db/lib/services/activities";

interface Props {
  isArabic: boolean;
}

export default async function outdoorAvtivitiesSection({ isArabic }: Props) {
  const data = await getActivityByType("outdoor");
  return (
    <section
      dir={isArabic ? "rtl" : "ltr"}
      className="w-full min-h-screen py-24 bg-[#f4f6f8] flex flex-col items-center"
    >
      <h2 className="text-3xl sm:text-4xl lg:text-5xl  font-bold mb-6 text-[#2c3e50]">
        {isArabic ? "الفعاليات الخارجية" : "Outdoor Activities"}
      </h2>
      <p className="text-center text-gray-600 mb-16 w-[90%] text-lg">
        {isArabic
          ? `توفر هذه الأنشطة تجربة مغامرة متكاملة تجمع بين التحدي والطبيعة. تشمل التجربة دورات الحبال العالية والمنخفضة، وتسلق الأبراج، والتأرجح فوق الأشجار، مع إمكانية تخصيص مستوى التحدي بما يتناسب مع قدرات الزوار وراحتهم. استمتع بالهواء النقي والمناظر الخلابة لغابات جرش، إلى جانب تجربة الطهي في الهواء الطلق والتعلم من السكان المحليين باستخدام مكونات طازجة وعضوية.`
          : "These activities offer a complete adventure experience that combines challenge and nature. The experience includes high and low rope courses, tower climbing, and exhilarating swings above the treetops, with customizable difficulty levels to suit individual abilities and comfort. Visitors can enjoy fresh air and breathtaking views of the Jerash forests, along with authentic outdoor cooking experiences guided by locals using fresh and organic ingredients."}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-6 w-full max-w-7xl ">
        {data.map((data, idx) => (
          <Link
            key={idx}
            href={`/activities/outdoor-activities/${data.name_en ?? ""}`}
          >
            <ActivitiesCard isArabic={isArabic} data={data} />
          </Link>
        ))}
      </div>
    </section>
  );
}
