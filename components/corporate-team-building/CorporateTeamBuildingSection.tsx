import React from "react";
import TrainingsCard from "@/components/trainings-card";
import Link from "next/link";
import { getTrainingByType } from "@/app/models/db/lib/services/training";
interface Props {
  isArabic: boolean;
}

export default async function CorporateTeamBuildingSection({
  isArabic,
}: Props) {
  const data = await getTrainingByType("Corporate Team Building");
  return (
    <section
      dir={isArabic ? "rtl" : "ltr"}
      className="w-full min-h-screen py-24 bg-[#f4f6f8] flex flex-col items-center"
    >
      <h2 className="text-5xl font-bold mb-6 text-[#2c3e50]">
        {isArabic ? "بناء فرق الشركات" : "Corporate Team Building"}
      </h2>
      <p className="text-center text-gray-600 mb-16 max-w-5xl">
        {isArabic
          ? `تُعدّ جوردن رينجر من الروّاد في مجال أنشطة بناء فرق العمل للشركات، حيث نأخذ المشاركين خارج منطقة راحتهم ونضعهم في بيئة جديدة ومحفّزة، تمتاز بالهواء النقي والمناظر الطبيعية الخلّابة، وبأجواء من الهدوء والسكينة بعيدًا عن مكاتب العمل المغلقة.

نشجّع المشاركين على استكشاف كامل إمكاناتهم، وبناء ثقتهم بأنفسهم، وتعزيز علاقاتهم مع أعضاء الفريق الآخرين من خلال روح الزمالة والمتعة الحقيقية.

ومن خلال تحدياتنا المصمّمة خصيصًا والتي تجمع بين التحديات البدنية والذهنية، ساهمت أنشطة بناء الفرق الخارجية التي نقدّمها في مساعدة مئات الشركات في الأردن والمنطقة على تحقيق أهدافها المنشودة.`
          : `Jordan Ranger has been a pioneer in corporate team building activities, taking participants out of their comfort zone and placing them in a new, stimulating environment with fresh air, beautiful scenery and a sense of peace and quiet, away from confined office spaces.

We encourage our participants to explore their full potential and build their confidence as well as their relationships with other team members through comradery and good old fun!

Our customized challenges that include both body and mental challenges, our outdoor team building activities have helped hundreds of corporations from Jordan and the region achieve their set goals.`}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-6 w-full max-w-7xl">
        {data.data.map((data, idx) => (
          <Link
            key={idx}
            href={`/training/corporate-team-building/${data.slug ?? ""}`}
          >
            <TrainingsCard isArabic={isArabic} data={data} />
          </Link>
        ))}
      </div>
    </section>
  );
}
