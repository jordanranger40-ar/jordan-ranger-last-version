import BannerSection from "@/components/banner/BannerSection";
import Mapbox3D from "@/components/map/map";
import VideoSection from "@/components/vvideo-section/video-section";
import SectionDivider from "@/components/ui/devider";
import { getAllcategories } from "@/app/models/db/lib/services/Accommodation";
import { getAllTraining } from "@/app/models/db/lib/services/training";
import RoomsAndTents from "@/components/roomsAndTents/roomsAndTents";
import Poster from "@/components/poster/poster";
import ComingSoon from "@/components/coming-soon/coming-soon";
import { getBannerData } from "@/app/models/db/lib/services/banners";
import { newBanner, newCategory, newTraining } from "@/types";
import ServicesSection from "@/components/services-section/services-section";
import TestimonialsSection from "@/components/testimonials-section/testimonials-section";
interface PageProps {
  params: {
    locale: string;
  };
}
export default async function Home({ params }: PageProps) {
  const { locale } = params;
  const isArabic = locale === "ar";

  let banners: newBanner[] = [];
  let categories: newCategory[] = [];
  let trainingData: newTraining[] = [];

  try {
    banners = await getBannerData();
    categories = await getAllcategories();
    const trainingResponse = await getAllTraining();
    trainingData = trainingResponse.data;
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }

  return (
    <main className="relative bg-[#f8f8f4]">
      {/* Banner */}
      <div className="mt-14">
        <BannerSection
          banners={banners}
          locale={locale}
          categories={categories}
          trainingData={trainingData}
        />
      </div>

      {/* Poster */}
      <section className="relative z-10 w-full mt-40">
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

      <SectionDivider text={isArabic ? "قريباً" : "Coming Soon"} />
      <ComingSoon isArabic={isArabic} />

      <Mapbox3D isArabic={isArabic} />
      
    </main>
  );
}
