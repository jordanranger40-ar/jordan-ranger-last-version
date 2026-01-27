import React from "react";
import TrainingsCard from "@/components/trainings-card";
import Link from "next/link";
import { getTrainingByType } from "@/app/models/db/lib/services/training";
import { Sparkles } from "lucide-react";

interface Props {
  isArabic: boolean;
}

export default async function CorporateTeamBuildingSection({
  isArabic,
}: Props) {
  const data = await getTrainingByType("Corporate Team Building");
  const hasData = data?.data && data.data.length > 0;

  return (
    <section
      dir={isArabic ? "rtl" : "ltr"}
      className="w-full min-h-screen py-24 bg-[#f4f6f8] flex flex-col items-center"
    >
      {/* النصوص الأصلية كما هي */}
      <h2 className="text-2xl md:text-5xl font-bold mb-6 text-[#2c3e50]">
        {isArabic ? "بناء فرق الشركات" : "Corporate Team Building"}
      </h2>
      <p className="text-center text-gray-600 mb-16 max-w-5xl px-4">
        {isArabic
          ? `تُعدّ جوردن رينجر من الروّاد في مجال أنشطة بناء فرق العمل للشركات، حيث نأخذ المشاركين خارج منطقة راحتهم ونضعهم في بيئة جديدة ومحفّزة، تمتاز بالهواء النقي والمناظر الطبيعية الخلّابة، وبأجواء من الهدوء والسكينة بعيدًا عن مكاتب العمل المغلقة.

نشجّع المشاركين على استكشاف كامل إمكاناتهم، وبناء ثقتهم بأنفسهم، وتعزيز علاقاتهم مع أعضاء الفريق الآخرين من خلال روح الزمالة والمتعة الحقيقية.

ومن خلال تحدياتنا المصمّمة خصيصًا والتي تجمع بين التحديات البدنية والذهنية، ساهمت أنشطة بناء الفرق الخارجية التي نقدّمها في مساعدة مئات الشركات في الأردن والمنطقة على تحقيق أهدافها المنشودة.`
          : `Jordan Ranger has been a pioneer in corporate team building activities, taking participants out of their comfort zone and placing them in a new, stimulating environment with fresh air, beautiful scenery and a sense of peace and quiet, away from confined office spaces.

We encourage our participants to explore their full potential and build their confidence as well as their relationships with other team members through comradery and good old fun!

Our customized challenges that include both body and mental challenges, our outdoor team building activities have helped hundreds of corporations from Jordan and the region achieve their set goals.`}
      </p>

      {hasData ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-6 w-full max-w-7xl">
          {data.data.map((item, idx) => (
            <Link
              key={idx}
              href={`/training/corporate-team-building/${item.slug ?? ""}`}
              className="block transition-transform duration-300 hover:-translate-y-2"
            >
              <TrainingsCard isArabic={isArabic} data={item} />
            </Link>
          ))}
        </div>
      ) : (
        /* --- قسم "قريباً" التفاعلي باللون المطلوب #676e32 --- */
        <div className="flex flex-col items-center justify-center p-16 bg-white/60 backdrop-blur-sm rounded-3xl border-2 border-dashed border-[#676e32]/30 max-w-2xl mx-4 group transition-all duration-500 hover:border-[#676e32] hover:bg-white hover:shadow-2xl hover:shadow-[#676e32]/10">
          <div className="relative mb-6">
            <Sparkles className="w-12 h-12 text-gray-400 group-hover:text-[#676e32] group-hover:rotate-12 transition-all duration-500" />
          </div>
          
          <h3 className="text-2xl md:text-3xl font-bold text-[#2c3e50] mb-3 text-center">
            {isArabic ? "برامج جديدة قادمة قريباً" : "New Programs Coming Soon"}
          </h3>
          
          {/* الخط الزخرفي باللون المطلوب */}
          <div className="h-1 w-12 bg-[#676e32] rounded-full mb-6 group-hover:w-32 transition-all duration-700 ease-in-out"></div>
          
          <p className="text-center text-gray-500 max-w-md leading-relaxed">
            {isArabic 
              ? "نعمل حالياً على تصميم تجارب فريدة لبناء الفرق وتطوير مهارات القيادة لشركتكم. ابقوا على اطلاع!"
              : "We are currently designing unique experiences for team building and leadership development for your company. Stay tuned!"}
          </p>
        </div>
      )}
    </section>
  );
}