// app/.../room/[id]/page.tsx
import React from "react";
import Link from "next/link";
import { RoomBookingWithDetails } from "@/types";
import { getBookingById } from "@/app/models/db/lib/services/room_booking";
import RoomBookingDetailsUser from "@/components/userBookingPage/accommodationComponents/RoomBookingDetails";
import RoomBookingUserDetails from "@/components/userBookingPage/accommodationComponents/RoomBookingUserDetails";
import RoomDetails from "@/components/userBookingPage/accommodationComponents/RoomDetails";
import LightButton from "@/components/ui/light-button";

type Props = {
  params: Promise<{
    id: string;
    locale?: string;
  }>;
};

export default async function Page({ params }: Props) {
  const par = await params;
  const locale = par.locale ?? "en";
  const isArabic = locale === "ar";

  const bookingId = par.id;
  const res = await getBookingById(bookingId);
  const booking = res?.data as RoomBookingWithDetails | undefined;
  const contactEmail = process.env.CONTACT_EMAIL;

  // Translations
  const t = {
    back: isArabic ? "← العودة" : "← Back",
    bookingNotFound: isArabic ? "الحجز غير موجود" : "Booking not found",
    bookingNotFoundMsg: isArabic
      ? `لم يتم العثور على أي حجز بالمعرف `
      : `No booking was found for id `,
    bookingDetails: isArabic ? "تفاصيل الحجز" : "Booking Details",
    bookingInfo: isArabic
      ? "راجع معلومات الحجز، تفاصيل الغرفة، ومعلومات التواصل. إذا كان هناك خطأ يرجى الاتصال بالدعم."
      : "Review your booking information, room details, and contact info. If anything looks wrong please contact support.",
    needHelp: isArabic ? "هل تحتاج مساعدة؟" : "Need help?",
    contactUs: isArabic
      ? "إذا كانت لديك أسئلة حول هذا الحجز اتصل بنا على"
      : "If you have questions about this booking contact us at",
    backToBookings: isArabic ? "العودة للحجوزات" : "Back to bookings",
  };

  if (!booking) {
    return (
      <main className="p-6 mt-14" dir={isArabic ? "rtl" : "ltr"}>
        <Link
          href={`/${locale}/my-bookings`}
          className="text-sm text-[#676e32] underline"
        >
          {t.back}
        </Link>

        <div className="mt-6 max-w-2xl">
          <h1 className="text-2xl font-semibold">{t.bookingNotFound}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {t.bookingNotFoundMsg}
            <code className="bg-gray-100 px-1 rounded">{bookingId}</code>.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="p-6 space-y-8 mt-14 bg-gray-50 min-h-screen" dir={isArabic ? "rtl" : "ltr"}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#676e32]">{t.bookingDetails}</h1>
            <p className="mt-1 text-sm text-gray-600 max-w-xl">{t.bookingInfo}</p>
          </div>
          <div></div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <RoomBookingDetailsUser data={booking} locale={locale} />
            <RoomDetails data={booking} locale={locale} />
          </div>

          <div className="space-y-6">
            <RoomBookingUserDetails data={booking} locale={locale} />
            <div className="bg-white border rounded-2xl p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-[#676e32]">{t.needHelp}</h3>
              <p className="text-sm text-gray-600 mt-2">
                {t.contactUs}{" "}
                <a
                  href={`mailto:${contactEmail}`}
                  className="text-[#676e32] underline"
                >
                  {contactEmail}
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>

      <Link
        href={`/${locale}/my-bookings`}
        className="rounded-none flex justify-center"
      >
        <LightButton className="bg-gray-300 w-fit">{t.backToBookings}</LightButton>
      </Link>
    </main>
  );
}
