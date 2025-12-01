import { authOptions } from "@/app/models/db/authOptions";
import { getUserUpcomingActivityBookings } from "@/app/models/db/lib/services/activity_booking";
import { getUserUpcomingRoomBookings } from "@/app/models/db/lib/services/room_booking";
import { getUserUpcomingTrainingBookings } from "@/app/models/db/lib/services/training_booking";
import { getServerSession } from "next-auth";
import Link from "next/link";
import React from "react";
import ActivitiesList from "@/components/userBookingPage/ActivitiesList";
import AccommodationList from "@/components/userBookingPage/AccommodationList";
import TrainingsList from "@/components/userBookingPage/TrainingsList";

interface PageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  const isArabic = locale === "ar";
  console.log(isArabic, "locale: ",locale);
  
  const session = await getServerSession(authOptions);
  const user_id = session?.user?.id;

  // Translation strings
  const t = {
    title: isArabic ? "حجوزاتي القادمة" : "My Upcoming Bookings",
    description: isArabic
      ? "هذه هي أنشطتك وإقاماتك وتدريباتك القادمة. يمكنك إدارة كل حجز أو عرض التفاصيل."
      : "Here are your upcoming Activities, Accommodation, and Trainings. You can manage each booking or view details.",
    signInTitle: isArabic ? "الرجاء تسجيل الدخول" : "Please sign in",
    signInMsg: isArabic
      ? "يجب عليك تسجيل الدخول لعرض حجوزاتك."
      : "You need to be signed in to view your bookings.",
    signInBtn: isArabic ? "تسجيل الدخول" : "Sign in",
  };

  if (!user_id) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50 mt-14"  dir={isArabic ? "rtl" : "ltr"}>
        <div className="max-w-xl text-center bg-white border rounded-lg p-8 shadow">
          <h2 className="text-xl font-semibold mb-2">{t.signInTitle}</h2>
          <p className="text-sm text-gray-600 mb-6">{t.signInMsg}</p>
          <div className="flex justify-center gap-3">
            <Link href="/login" className="px-4 py-2 bg-[#676e32] text-white rounded">
              {t.signInBtn}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Fetch bookings
  const roomBookings = (await getUserUpcomingRoomBookings(user_id))?.data ?? [];
  const activityBookings = (await getUserUpcomingActivityBookings(user_id))?.data ?? [];
  const trainingBookings = (await getUserUpcomingTrainingBookings(user_id))?.data ?? [];

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 mt-14"  dir={isArabic ? "rtl" : "ltr"}>
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <header className="flex flex-col items-center justify-center gap-4 mb-8 text-center">
          <h1 className="text-xl md:text-3xl font-bold text-[#676e32]">{t.title}</h1>
          <p className="text-xs md:text-sm text-gray-600 max-w-2xl">{t.description}</p>
        </header>

        {/* ACTIVITIES */}
        <section className="mb-10">
          <ActivitiesList bookings={activityBookings} locale={locale} />
        </section>

        {/* ACCOMMODATION */}
        <section className="mb-10">
          <AccommodationList bookings={roomBookings} locale={locale} />
        </section>

        {/* TRAININGS */}
        <section className="mb-10">
          <TrainingsList bookings={trainingBookings} locale={locale} />
        </section>
      </div>
    </div>
  );
}
