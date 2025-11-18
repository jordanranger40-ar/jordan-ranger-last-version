import { getRoomBySlug } from "@/app/models/db/lib/services/rooms";
import { roomFeatures } from "@/types";
import Link from "next/link";

interface PageProps {
  params: { locale: string; slug: string | string[] };
}

export default async function Page({ params }: PageProps) {
  const data = await getRoomBySlug(`${params.slug}`);
  const isArabic = params.locale === "ar"; // تحديد اللغة
  const direction = isArabic ? "rtl" : "ltr"; // تحديد الاتجاه

  if (!data) {
    return (
      <div
        dir={direction}
        className={`text-center py-20 text-xl text-gray-700 ${isArabic ? "text-right" : "text-left"}`}
      >
        {isArabic ? "الغرفة غير موجودة" : "Room not found"}
      </div>
    );
  }

  const MAX_VISIBLE_TOP = 3;
  const MAX_VISIBLE_BOTTOM = 3;
  const topImages = data.room_images.slice(0, MAX_VISIBLE_TOP);
  const bottomImages = data.room_images.slice(MAX_VISIBLE_TOP, MAX_VISIBLE_TOP + MAX_VISIBLE_BOTTOM);
  const hiddenImagesCount = data.room_images.length - (MAX_VISIBLE_TOP + MAX_VISIBLE_BOTTOM);

  return (
    <div dir={direction} className={`min-h-screen bg-[#f5f5f5] text-[#333333] ${isArabic ? "text-right" : "text-left"}`}>
      {/* ================= Hero Section ================= */}
      <div className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden">
        <img
          src={data.room_images[0] || "/default-room.jpg"}
          alt={isArabic ? data.name_ar : data.name_en}
          className="w-full h-full object-cover brightness-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white max-w-3xl mx-auto px-6">
          <h1 className="text-5xl md:text-6xl font-bold drop-shadow-lg mb-4">
            {isArabic ? data.name_ar : data.name_en}
          </h1>
          <p className="text-lg md:text-xl text-gray-200">
            {isArabic ? data.description_ar : data.description_en}
          </p>
        </div>
      </div>

      {/* ================= Room Info Section ================= */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-12 md:mt-16 flex flex-col md:flex-row gap-12">
        <div className="flex-1 space-y-6">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#333333]">
            {isArabic ? data.description_ar : data.description_en}
          </h2>
          <p className="text-gray-600 leading-relaxed text-lg">
            {isArabic ? data.description_ar : data.description_en}
          </p>
          <div className="flex items-center gap-4">
            <span className="text-4xl font-extrabold text-[#676e32]">{data.price}</span>
            <span className="text-gray-500 text-lg">{isArabic ? "د.ا / الليلة" : "JOD / night"}</span>
          </div>
         
          
            <Link href={`/accommodationBooking/${data.id}`} className="w-full h-full"><button  className="mt-6 px-12 py-4 bg-[#676e32] text-white text-lg font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-[1.03] transition-all duration-300"> {isArabic ? "احجز هذه الغرفة" : "Reserve This Room" }</button></Link>
          
         
        </div>

        <div className="flex-1">
          <h3 className="text-2xl font-semibold text-[#333333] mb-6">
            {isArabic ? "مرافق الغرفة" : "Room Amenities"}
          </h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-2 gap-6">
            {data.features.map((feature: roomFeatures, index: number) => (
              <div
                key={index}
                className="flex flex-col justify-center bg-gradient-to-br from-[#f0f8d0] to-white border border-[#d0d9a0] rounded-2xl p-6 hover:shadow-md transition"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 flex items-center justify-center bg-[#e1f0b3] rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-[#676e32]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-[#333333]">
                    {isArabic ? feature.feature_title_ar : feature.feature_title_en}
                  </h4>
                </div>
                <p className="text-gray-600 text-sm leading-snug">
                  {isArabic ? feature.feature_description_ar : feature.feature_description_en}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= Gallery Section ================= */}
      <div className="max-w-7xl mx-auto mt-16 px-6 md:px-12">
        <h3 className="text-2xl font-bold text-[#333333] mb-6">
          {isArabic ? "معرض الصور" : "Gallery"}
        </h3>

        {/* Top Section */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative overflow-hidden rounded-lg h-64 md:h-80 group">
            <img
              src={topImages[0] || "/default-room.jpg"}
              alt="gallery-top-left"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/20 transition group-hover:bg-black/30"></div>
          </div>

          <div className="grid grid-rows-2 gap-4">
            {topImages.slice(1, 3).map((img, i) => (
              <div key={i} className="relative overflow-hidden rounded-lg h-32 md:h-40 group">
                <img
                  src={img || "/default-room.jpg"}
                  alt={`gallery-top-right-${i}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 transition group-hover:bg-black/30"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {bottomImages.map((img, i) => (
            <div key={i} className="relative w-full h-40 md:h-48 overflow-hidden rounded-lg group">
              <img
                src={img || "/default-room.jpg"}
                alt={`gallery-bottom-${i}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 transition group-hover:bg-black/30"></div>
            </div>
          ))}

          {hiddenImagesCount > 0 && (
            <div className="relative w-full h-40 md:h-48 overflow-hidden rounded-lg cursor-pointer group">
              <img
                src={data.room_images[MAX_VISIBLE_TOP + MAX_VISIBLE_BOTTOM] || "/default-room.jpg"}
                alt="see-more"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xl font-bold transition group-hover:bg-black/60">
                {isArabic ? `المزيد +${hiddenImagesCount}` : `See More +${hiddenImagesCount}`}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="h-[150px] bg-gradient-to-t from-[#f5f5f5] to-transparent mt-20" />
    </div>
  );
}
