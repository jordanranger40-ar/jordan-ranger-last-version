import { authOptions } from "@/app/models/db/authOptions";
import { getActivityBySlug } from "@/app/models/db/lib/services/activities";
import { getCartItemsByUserId } from "@/app/models/db/lib/services/cart";
import ActivityBookingPanel from "@/components/activities/activityBooking/ActivityBookingPanel";
import TestImage from "@/public/images/IMG_7829.jpg";
import { getServerSession } from "next-auth";
import Image from "next/image";
import DarkButton from "@/components/ui/dark-button";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function Page({ params }: PageProps) {
  const par = await params;
  const isArabic = par.locale === "ar";
  const direction = isArabic ? "rtl" : "ltr";
  const userInfo = await getServerSession(authOptions);
  const userId = userInfo?.user.id;
  const uniqueTypes: string[] = [];

  return (
    <div
      className={`flex flex-col md:flex-row items-center justify-center w-[90%] px-6 py-24 gap-14 mt-20 ${
        isArabic ? "md:flex-row" : ""
      }`}
      dir={direction}
    >
      <div className="relative w-full md:w-3/5 h-64 md:h-96 rounded-2xl overflow-hidden shadow-lg group">
        <Image
          src={TestImage}
          alt={"test"}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110 rounded-2xl"
        />
      </div>

      <div className="w-full md:w-1/3 flex flex-col gap-6">
        <h2
          className={`text-5xl font-bold mb-4 text-[#676e32] ${
            isArabic ? "text-right" : "text-left"
          }`}
        >
          {isArabic ? "التوجيه" : "Orienteering"}
        </h2>

        <p className="mb-6 text-gray-700 ">
          {isArabic
            ? `جوردان رينجر هي الشركة الوحيدة في الأردن التي تقدم التدريب في رياضة التوجيه والملاحة (أورينتيرينغ). تُعد رياضة التوجيه مغامرة خارجية مثيرة تعمل على تنشيط العقل والجسم، ومناسبة لجميع الأعمار ومستويات اللياقة البدنية. الهدف هو التنقل بين نقاط التفتيش أو الضوابط المحددة على خريطة توجيه خاصة. لا يوجد مسار محدد، لذا تأتي المهارة والمتعة من محاولة إيجاد أفضل طريق للوصول.`
            : `Jordan Ranger is the only company in Jordan that offers and trains in the sport of orienteering. Orienteering is an exciting outdoor adventure sport that exercises mind and body and suitable for all ages and fitness levels. The aim is to navigate between checkpoints or controls marked on a special orienteering map. There is no set route so the skill and fun come from trying to find the best way to go. `}
        </p>
      </div>
    </div>
  );
}
