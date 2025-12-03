import BannerSection from "@/components/banner/BannerSection";
import Mapbox3D from "@/components/map/map";
import VideoSection from "@/components/vvideo-section/video-section";
import SectionDivider from "@/components/ui/devider";
import RoomsAndTents from "@/components/roomsAndTents/roomsAndTents";
import Poster from "@/components/poster/poster";
import ComingSoon from "@/components/coming-soon/coming-soon";
import { getBannerData } from "@/app/models/db/lib/services/banners";
import { newBanner } from "@/types";
import ServicesSection from "@/components/services-section/services-section";
import TestimonialsSection from "@/components/testimonials-section/testimonials-section";
import { getComingSoonActivities } from "@/app/models/db/lib/services/activities";

interface PageProps {
  params: Promise<{
    locale: string;
  }>;
}
export default async function Home({ params }: PageProps) {
  const { locale } = await params;
  const isArabic = locale === "ar";

  let banners: newBanner[] = [];
  const comingSoonActivities = await getComingSoonActivities();
  const isThereComingSoon = comingSoonActivities.length !== 0;
  console.log(isThereComingSoon, "gfhdjsioeir: ", comingSoonActivities.length);

  try {
    banners = await getBannerData();
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }

  return (
    <main className="relative bg-[#f8f8f4]">
      {/* Banner */}
      <div className="mt-14">
        <BannerSection banners={banners} locale={locale} isThereComingSoon={isThereComingSoon} />
      </div>

      {/* Poster */}
      <section className="relative z-10 w-full mt-0 lg:mt-40 ">
        <Poster />
      </section>

      <SectionDivider text={isArabic ? "اكتشف غرفنا" : "Discover Our Rooms"} />
      <section className="relative z-10 w-full">
        <RoomsAndTents isArabic={isArabic} />
      </section>

      <section className="relative z-10 w-full mt-40">
        <VideoSection />
      </section>

      <SectionDivider text={isArabic ? "خدماتنا" : "Our Services"} />

      <ServicesSection isArabic={isArabic} />

      <TestimonialsSection isArabic={isArabic} />

      {isThereComingSoon && (
        <div id="coming-soon">
          <SectionDivider text={isArabic ? "قريباً" : "Coming Soon"} />
          <ComingSoon
            isArabic={isArabic}
            comingSoonActivities={comingSoonActivities}
          />
        </div>
      )}

      <Mapbox3D isArabic={isArabic} />
    </main>
  );
}
