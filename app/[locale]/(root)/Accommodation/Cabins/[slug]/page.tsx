import { getRoomBySlug } from "@/app/models/db/lib/services/rooms";
import { roomFeatures } from "@/types";
import Link from "next/link";
import Image from "next/image";
import RoomGallery from "@/components/roomsAndTents/GallaryComponent";
import type { Metadata } from "next";
import { generateDynamicMetadata } from "@/lib/constants/metadata";
interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  return generateDynamicMetadata.page({
    type: "accommodation",
    name: (await params).slug.replace(/-/g, " "),
    slug: `accommodation/${(await params).slug}`,
  });
}

export default async function Page({ params }: PageProps) {
  const { slug, locale } = await params;
  const data = await getRoomBySlug(slug);
  const isArabic = locale === "ar";
  const direction = isArabic ? "rtl" : "ltr";

  if (!data) {
    return (
      <div
        dir={direction}
        className={`text-center py-20 text-xl text-gray-700 ${
          isArabic ? "text-right" : "text-left"
        }`}
      >
        {isArabic ? "الغرفة غير موجودة" : "Room not found"}
      </div>
    );
  }

  // Normalise gallery images to strings (handles case where room_images are objects)
  type RoomImage = 
  | string
  | { url?: string; src?: string; path?: string; image?: string };

const galleryImages: string[] = (data.room_images || [])
  .slice(0, 5)
  .map((img: RoomImage) =>
    typeof img === 'string' ? img : img.url || img.src || img.path || img.image || ''
  )
  .filter(Boolean);


  return (
    <div
      dir={direction}
      className={`min-h-screen bg-[#f5f5f5] text-[#333333] ${
        isArabic ? "text-right" : "text-left"
      }`}
    >
      {/* ========== Hero Section ========== */}
      <div className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden">
        <Image
          src={data.cover_image || "/default-room.jpg"}
          alt={isArabic ? data.name_ar : data.name_en}
          fill
          className="object-cover brightness-90"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/40 to-transparent" />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white max-w-3xl mx-auto px-6">
          <h1 className="text-5xl md:text-6xl font-bold drop-shadow-lg mb-4">
            {isArabic ? data.name_ar : data.name_en}
          </h1>
         
        </div>
      </div>

      {/* ========== Room Info Section ========== */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-12 md:mt-16 flex flex-col md:flex-row gap-12">
        <div className="flex-1 space-y-6">
          <p className="text-gray-600 leading-relaxed text-lg">
            {isArabic ? data.description_ar : data.description_en}
          </p>
          <div className="flex items-center gap-4">
            <span className="text-4xl font-extrabold text-[#676e32]">{data.price}</span>
            <span className="text-gray-500 text-lg">
              {isArabic ? "د.ا / الليلة" : "JOD / night"}
            </span>
          </div>
        

          <Link href={`/accommodationBooking/${data.id}`} className="w-full h-full">
            <button className="mt-6 px-12 py-4 bg-[#676e32] text-white text-lg font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-[1.03] transition-all duration-300">
              {isArabic ? "احجز هذه الغرفة" : "Reserve This Room"}
            </button>
          </Link>
        </div>

       {data.room_features[0].feature_title_en!==null && <div className="flex-1">
          <h3 className="text-2xl font-semibold text-[#333333] mb-6">
            {isArabic ? "مرافق الغرفة" : "Room Amenities"}
          </h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-2 gap-6">
            {data.room_features.map((feature: roomFeatures, index: number) => (
              <div
                key={index}
                className="flex flex-col justify-center bg-linear-to-br from-[#f0f8d0] to-white border border-[#d0d9a0] rounded-2xl p-6 hover:shadow-md transition"
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
            <p className="mt-2 text-sm text-gray-500">
  {isArabic
    ? "* يُعتبر الطفل من كان عمره أقل من 7 سنوات. "
    : "* We consider a child to be anyone under 7 years old."}
</p>
        </div>}
        
      </div>

      {/* ========== Gallery Section: server renders thumbnails, client handles lightbox */}
      <div className="max-w-7xl mx-auto mt-24 px-6 md:px-12 mb-20">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-[#333333] inline-block relative">
            {isArabic ? "استكشف الغرفة" : "Explore the Room"}
            <span className="absolute -bottom-2 left-0 w-full h-1 bg-[#676e32] opacity-30"></span>
          </h3>
        </div>

        {/* render gallery thumbnails container but actual lightbox logic/handlers live in client component */}
        <RoomGallery images={galleryImages} isArabic={isArabic} />
      </div>

      <div className="h-37.5 bg-linear-to-t from-[#f5f5f5] to-transparent mt-20" />
    </div>
  );
}
