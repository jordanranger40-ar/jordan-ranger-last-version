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
    <section className={`mt-20 mb-16 px-4 `} dir={isArabic ? "rtl" : "ltr"}>
      {/* العنوان */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold tracking-wide text-gray-900 dark:text-white">
          {isArabic ? "اكتشف غرفنا المميزة" : "Discover Our Premium Cabins"}
        </h2>

        <p className="text-gray-600 dark:text-gray-300 mt-3 text-lg mx-auto w-[90%] " >
          {isArabic
            ? `تمثل المنامات الحجرية طراز معماري تقليدي ، حيث يتجاوز سمك الجدران 80 سم ، مما يمنحك شعور بالدفء في الشتاء وشعورا بالبرودة خلال فصل الصيف. تم تصميم هذه المنامات الحجرية لتمكين الزائر من عيش تجربة في الحياة البرية والقاسية. إذا كنت تخطط لإقامتك خلال فصل الشتاء ، فإن هذا أيضا خيار مثالي لأن المنامات الحجرية المزودة بالمواقد لمنحك شعور بالدفء بينما تستمتع بالمناظر الطبيعية الشتوية المحيطة.`
            : `The stone lodges represent a traditional architectural style, with wall thicknesses exceeding 80 cm, giving you a sense of warmth in winter and coolness during the summer. These stone lodges are designed to allow visitors to experience life in the wild and rugged environment. If you are planning your stay during the winter season, this is also an ideal option, as the stone lodges are equipped with fireplaces that provide warmth while you enjoy the surrounding winter landscapes.`}
        </p>

        <div className="mt-6 w-24 h-1 bg-[#676e32] rounded mx-auto"></div>
      </div>

      {/* قائمة الغرف */}
      <div
        className="
        grid 
        grid-cols-1 
        sm:grid-cols-2 
        lg:grid-cols-3 
        gap-10 
        w-full 
        max-w-7xl 
        mx-auto
      "
      >
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
