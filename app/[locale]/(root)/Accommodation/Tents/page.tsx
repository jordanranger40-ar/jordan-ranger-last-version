import { getRoomsByRoomType } from "@/app/models/db/lib/services/rooms";
import TentsSection from "@/components/accommodation/tents/tents-section";
import TentsHeaderSection from "@/components/accommodation/tents/tents-header-section";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function Page({ params }: PageProps) {
  const isArabic = (await params).locale === "ar";

  const par= await params
  const rooms = await getRoomsByRoomType("tents");

  return (
    <section className="mt-12">
    <TentsHeaderSection  isArabic={isArabic } />
    <TentsSection 
      rooms={rooms} 
      isArabic={isArabic} 
      locale={par.locale} 
    />
    </section>
  );
}
