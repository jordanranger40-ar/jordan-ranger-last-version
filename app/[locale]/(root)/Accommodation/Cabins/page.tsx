import { getRoomsByRoomType } from "@/app/models/db/lib/services/rooms";
import CabinsSection from "@/components/accommodation/cabins/cabins-section";
import CabinsHeaderSection from "@/components/accommodation/cabins/cabins-header-section";
import {PAGE_METADATA} from "@/lib/constants/metadata"

export const metadata= PAGE_METADATA["accommodation/cabins"]
interface PageProps {
  params: Promise <{ locale: string }>
}



export default async function Page({ params }: PageProps) {
  const isArabic = (await params).locale === "ar";
  const par= await params
  
  const rooms = await getRoomsByRoomType("cabins");

  return (
    <section className="mt-12">
      <CabinsHeaderSection isArabic={isArabic} />
    <CabinsSection 
      rooms={rooms} 
      isArabic={isArabic} 
      locale={par.locale} 
    />
    </section>
  );
}
