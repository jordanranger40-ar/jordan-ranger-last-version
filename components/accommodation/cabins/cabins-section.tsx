import Link from "next/link";
import FlippingCard from "@/components/flippingcard/flippingcard";
import type { newRoom } from "@/types/index";

interface CabinsPageProps {
  rooms: newRoom[];
  isArabic: boolean;
  locale: string;
}

export default function CabinsPage({ rooms, isArabic }: CabinsPageProps) {
  return (
    <section className={`mt-20 mb-16 px-4 ${isArabic ? "rtl" : "ltr"}`}>
      {/* العنوان */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold tracking-wide text-gray-900 dark:text-white">
          {isArabic ? "اكتشف غرفنا المميزة" : "Discover Our Premium Cabins"}
        </h2>

        <p className="text-gray-600 dark:text-gray-300 mt-3 text-lg">
          {isArabic
            ? "مجموعة مختارة من الكبائن الفاخرة لإقامة لا تُنسى"
            : "A curated selection of premium cabins for an unforgettable stay"}
        </p>

        <div className="mt-6 w-24 h-1 bg-blue-600 rounded mx-auto"></div>
      </div>

      {/* قائمة الغرف */}
      <div className="
        grid 
        grid-cols-1 
        sm:grid-cols-2 
        lg:grid-cols-3 
        gap-10 
        w-full 
        max-w-7xl 
        mx-auto
      ">
        {rooms.map((room: newRoom) => (
          <Link
            key={room.id}
            href={`/Accommodation/Cabins/${room.slug}`}
            className="
              transform 
              transition 
              duration-300 
              hover:-translate-y-2
              hover:scale-[1.02]
            "
          >
            <FlippingCard data={room} isArabic={isArabic} />
          </Link>
        ))}
      </div>
    </section>
  );
}
