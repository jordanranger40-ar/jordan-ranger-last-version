import { getRoomsByRoomType } from "@/app/models/db/lib/services/rooms";
import CabinsSection from "@/components/accommodation/cabins/cabins-section";
import CabinsHeaderSection from "@/components/accommodation/cabins/cabins-header-section";

interface PageProps {
  params: { locale: string };
}

export default async function Page({ params }: PageProps) {
  const isArabic = params.locale === "ar";

  
  const rooms = await getRoomsByRoomType("cabins");

  return (
    <section className="mt-12">
      <CabinsHeaderSection isArabic={isArabic} />
    <CabinsSection 
      rooms={rooms} 
      isArabic={isArabic} 
      locale={params.locale} 
    />
    </section>
  );
}
