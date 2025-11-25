import { getTrainingBySlug } from "@/app/models/db/lib/services/training";
import Image from "next/image";
import TrainingBookingPanel from "@/components/trainingBooking/TrainingBookingPanel";
import { getQuantityOfATraining } from "@/app/models/db/lib/services/training_booking";
import React from "react";
import {newTraining} from "@/types/index"
interface Props {
  params: Promise<{ slug: string; locale: string }>;
}



export default async function Page({ params }: Props) {
  const slug = (await params).slug;
  const locale = (await params).locale;

  const isArabic = locale === "ar";
  const direction = isArabic ? "rtl" : "ltr";

  const trainingData = await getTrainingBySlug(slug);

  if (!trainingData || trainingData.data.length === 0) {
    return (
      <p className="text-center mt-20 text-gray-500" dir={direction}>
        {isArabic ? "التدريب غير موجود" : "Training not found"}
      </p>
    );
  }

  const training: newTraining = trainingData.data[0];
  const bookedResult = await getQuantityOfATraining(training.id ?? "");
  const numberOfBooked = Number(bookedResult?.total_booked || 0);
  const capacity = Number(training.capacity || 0);
  const remaining = Math.max(capacity - numberOfBooked, 0);
  const progress = capacity > 0 ? Math.min((numberOfBooked / capacity) * 100, 100) : 0;

  const fmtDate = (d: Date | string) => {
    const date = typeof d === "string" ? new Date(d) : d;
    return new Intl.DateTimeFormat(isArabic ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  return (
    <main className="w-[92%] mx-auto py-16 mt-16" dir={direction}>
      {/* Removed card wrapper - this section is integrated into the main page flow */}

      <section className="max-w-7xl mx-auto md:flex md:items-start md:gap-10">
        {/* Left: large header image (takes more space) */}
        <div className="md:w-2/3 relative h-72 md:h-[420px] rounded-xl overflow-hidden">
          {training.header_image || training.post_image ? (
            <div className="relative h-full w-full">
              <Image
                src={training.header_image || training.post_image}
                alt={isArabic ? training.name_ar : training.name_en}
                fill
                className="object-cover"
                priority
              />

              {/* subtle overlay for legibility */}
              <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />

              {/* top-left tag for category */}
              <div className="absolute top-4 left-4">
                <span className="inline-block bg-white/80 text-sm px-3 py-1 rounded-full font-medium text-gray-800">
                  {isArabic ? training.category_ar : training.category_en}
                </span>
              </div>

              {/* bottom-left title */}
              <div className="absolute left-6 right-6 bottom-6 text-white">
                <h1 className="text-2xl md:text-3xl font-bold leading-tight drop-shadow-md">
                  {isArabic ? training.name_ar : training.name_en}
                </h1>

                <div className="mt-2 flex items-center gap-3">
                  <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M6 2a1 1 0 00-1 1v1H3.5A1.5 1.5 0 002 5.5v9A1.5 1.5 0 003.5 16H16.5A1.5 1.5 0 0018 14.5v-9A1.5 1.5 0 0016.5 4H15V3a1 1 0 00-1-1H6zM7 6h6v2H7V6z" />
                    </svg>
                    <span className="text-sm">{fmtDate(training.start_date)}</span>
                  </div>

                  <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 3a1 1 0 011 1v1h1a1 1 0 011 1v1h1a1 1 0 011 1v5a2 2 0 01-2 2H6a2 2 0 01-2-2V8a1 1 0 011-1h1V6a1 1 0 011-1h1V4a1 1 0 011-1h2z" />
                    </svg>
                    <span className="text-sm">{capacity} {isArabic ? 'مكان' : 'seats'}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full w-full bg-gray-100 flex items-center justify-center rounded-xl">
              <span className="text-gray-500">{isArabic ? "لا توجد صورة" : "No image"}</span>
            </div>
          )}
        </div>

        {/* Right: details column (integrated, not a separate card) */}
        <aside className="md:w-1/3 flex flex-col gap-6 mt-6 md:mt-0">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{isArabic ? 'تفاصيل التدريب' : 'Training details'}</p>
                <h2 className="text-xl md:text-2xl font-extrabold text-gray-900">
                  {isArabic ? training.name_ar : training.name_en}
                </h2>
              </div>

              {/* Price badge - more prominent as requested */}
              <div className="text-right md:text-left">
                <div className="inline-flex items-baseline gap-2 ">
                  <span className="text-sm text-gray-500">{isArabic ? 'السعر' : 'Price'}</span>
                  <span className=" font-bold text-[#676e32]">{training.price} JOD</span>
                </div>
              </div>
            </div>

            <p className="mt-3 text-sm text-gray-600 leading-relaxed">
              {isArabic ? training.description_ar : training.description_en}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
            <InfoCard label={isArabic ? 'البدء' : 'Starts'} value={fmtDate(training.start_date)} />
            <InfoCard label={isArabic ? 'الانتهاء' : 'Ends'} value={fmtDate(training.end_date)} />
            <InfoCard label={isArabic ? 'الفئة' : 'Category'} value={isArabic ? training.category_ar : training.category_en} />
            <InfoCard label={isArabic ? 'القدرة' : 'Capacity'} value={`${capacity}`} />
          </div>

          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="font-medium text-gray-700">{isArabic ? 'التوافر' : 'Availability'}</span>
              <span className="text-gray-600">{remaining > 0 ? `${remaining} ${isArabic ? 'متبقي' : 'left'}` : (isArabic ? 'ممتلئ' : 'Full')}</span>
            </div>

            <ProgressBar progress={progress} />
          </div>

          {/* Booking panel placed inline (not sticky), integrated into the page flow */}
          <div className="mt-2">
            {training.id && (
              <TrainingBookingPanel training={training } numberOfBooked={numberOfBooked} />
            )}
          </div>

          <div className="pt-2 text-xs text-gray-500">
            {isArabic ? 'ملاحظة: تأكد من قراءة الشروط قبل الحجز.' : 'Note: please review terms before booking.'}
          </div>
        </aside>
      </section>
    </main>
  );
}

function InfoCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-transparent rounded-lg p-3 flex flex-col gap-1 border border-transparent">
      <span className="text-xs text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-800">{value}</span>
    </div>
  );
}

function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${progress}%`, background: 'linear-gradient(90deg,#6ee7b7,#60a5fa)' }}
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        role="progressbar"
      />
    </div>
  );
}
