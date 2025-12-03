import { authOptions } from "@/app/models/db/authOptions";
import { getActivityBySlug } from "@/app/models/db/lib/services/activities";
import { getCartItemsByUserId } from "@/app/models/db/lib/services/cart";
import ActivityBookingPanel from "@/components/activities/activityBooking/ActivityBookingPanel";
import DarkButton from "@/components/ui/dark-button";
import { getServerSession } from "next-auth";
import Image from "next/image";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function Page({ params }: PageProps) {
  const par = await params;
  const slug = Array.isArray(par.slug) ? par.slug[0] : par.slug;
  const isArabic = par.locale === "ar";
  const direction = isArabic ? "rtl" : "ltr";
  const userInfo = await getServerSession(authOptions);
  const userId = userInfo?.user.id;
  const uniqueTypes: string[] = [];
  const activityData = await getActivityBySlug(slug);
  const isComingSoon = activityData[0].coming_soon;
  if (userId) {
    const cartItems = await getCartItemsByUserId(userId ?? "");
    if (cartItems.data !== null) {
      const bookingsTypes = cartItems.data.map((ele, i) => {
        if (!uniqueTypes.includes(ele.booking_type)) {
          uniqueTypes.push(ele.booking_type);
        }
        return uniqueTypes;
      });
    } else {
      console.log("User has no cart");
    }
  }

  if (!activityData || activityData.length === 0) {
    return (
      <p className="text-center mt-20 text-gray-500" dir={direction}>
        {isArabic ? "النشاط غير موجود" : "Activity not found"}
      </p>
    );
  }

  const activity = activityData[0];

  return (
    <div
      className={`flex flex-col md:flex-row items-center justify-center w-[90%] px-6 py-24 gap-14 mt-20 ${
        isArabic ? "md:flex-row" : ""
      }`}
      dir={direction}
    >
      <div className="relative w-full md:w-3/5 h-64 md:h-96 rounded-2xl overflow-hidden shadow-lg group">
        {activity.poster_image ? (
          <Image
            src={activity.poster_image}
            alt={isArabic ? activity.name_ar : activity.name_en}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110 rounded-2xl"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-2xl">
            <span className="text-gray-500">
              {isArabic ? "لا توجد صورة" : "No image available"}
            </span>
          </div>
        )}
      </div>

      <div className="w-full md:w-1/3 flex flex-col gap-6">
        <h2
          className={`text-5xl font-bold mb-4 text-[#676e32] ${
            isArabic ? "text-right" : "text-left"
          }`}
        >
          {isArabic ? activity.name_ar : activity.name_en}
        </h2>

        <p className="mb-6 text-gray-700 ">
          {isArabic ? activity.description_ar : activity.description_en}
        </p>

        {isComingSoon ? (
          <div className="flex w-full">
            <div className={isArabic ? "self-end" : "self-start"}>
              <DarkButton>{isArabic ? "قريباً" : "Coming Soon"}</DarkButton>
            </div>
          </div>
        ) : (
          <div className="flex w-full">
            <div className={isArabic ? "self-end" : "self-start"}>
              <ActivityBookingPanel
                uniqueTypes={uniqueTypes}
                activity={activity}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
