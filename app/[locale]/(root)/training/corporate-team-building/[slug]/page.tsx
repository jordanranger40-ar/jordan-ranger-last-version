import { getTrainingBySlug } from "@/app/models/db/lib/services/training";
import React from "react";
import Image from "next/image";
import TrainingBookingPanel from "@/components/trainingBooking/TrainingBookingPanel";
import { getQuantityOfATraining } from "@/app/models/db/lib/services/training_booking";

interface Props {
  params: Promise<{ slug: string; locale: string }>;
}

async function page({ params }: Props) {
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

  const training = trainingData.data[0];
  const numberOfBooked = (await getQuantityOfATraining(training.id ?? ""))
    .total_booked;

  return (
    <div
      className={`flex flex-col md:flex-row items-center justify-center w-[90%] px-6 py-24 gap-14 mt-20 ${
        isArabic ? "md:flex-row" : ""
      }`}
      dir={direction}
    >
      <div className="relative w-full md:w-3/5 h-64 md:h-96 rounded-2xl overflow-hidden shadow-lg group">
        {training.post_image ? (
          <Image
            src={training.post_image}
            alt={isArabic ? training.name_ar : training.name_en}
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
          {isArabic ? training.name_ar : training.name_en}
        </h2>

        <p className="mb-6 text-gray-700 ">
          {isArabic ? training.description_ar : training.description_en}
        </p>

        {training.id && (
          <div className="flex w-full">
            <div className={isArabic ? "self-end" : "self-start"}>
              <TrainingBookingPanel
                training={training}
                numberOfBooked={Number(numberOfBooked)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default page;
