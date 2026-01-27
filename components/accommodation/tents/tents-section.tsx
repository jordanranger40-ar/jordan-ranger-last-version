import Link from "next/link";
import FlippingCard from "@/components/flippingcard/flippingcard";
import type { newRoom } from "@/types/index";

interface TentsPageProps {
  rooms: newRoom[];
  isArabic: boolean;
  locale: string;
}

export default function TentsPage({ rooms, isArabic }: TentsPageProps) {
  return (
    <section className={`mt-20 mb-16 px-4 ${isArabic ? "rtl" : "ltr"}`}>
      
     
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold tracking-wide text-gray-900 dark:text-white">
          {isArabic ? "اكتشف خيمنا المميزة" : "Discover Our Premium Tents"}
        </h2>

        <p className="text-gray-600 dark:text-gray-300 mt-3 text-lg  max-w-[90%] mx-auto">
          {isArabic
            ? `للتجربة على أرض الواقع حقًا ، فإن التخييم هو الطريقة الصحيحة. بفضل الخيام التي تم إعدادها بشكل مثالي وبطانية النجوم التي تتمنى لك ليلة سعيدة ، يعد خيار التخييم الخاص بنا مثاليًا لليالي الصيف والمجموعات الكبيرة والطلاب والعائلات على حد سواء.`
            : "For a truly grounding experience, camping is the way to go. With perfectly set up tents and a blanket of stars wishing you a good night, our camping option is ideal for summer nights, bigger groups and students and families alike."}
        </p>

        <div className="mt-6 w-24 h-1 bg-[#676e32] rounded mx-auto"></div>
      </div>

   
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
            href={`/Accommodation/Tents/${room.slug}`}   
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
