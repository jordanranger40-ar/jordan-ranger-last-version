
import BannerSection from "@/components/banner/BannerSection";
import Mapbox3D from "@/components/map/map"
import VideoSection from "@/components/vvideo-section/video-section"
import SectionDivider from "@/components/ui/devider"






import { getAllcategories } from "@/app/models/db/lib/services/Accommodation";
import { getAllTraining } from "@/app/models/db/lib/services/training";
import RoomsAndTents from "@/components/roomsAndTents/roomsAndTents"

import Poster from "@/components/poster/poster";
import { getBannerData } from "@/app/models/db/lib/services/banners";
import { newBanner, newCategory, newTraining } from "@/types";

interface PageProps {
  params: {
    locale: string;
  };
}

export default async function Home({ params }: PageProps) {
  const { locale } = await params;
  const isArabic = locale === "ar";

  const banners: newBanner[] = await getBannerData();
  const categories: newCategory[] = await getAllcategories();
  const trainingData: newTraining[] = await getAllTraining();




  return (
    <main className="relative">
   
        <div className="mt-14">
          <BannerSection
            banners={banners}
            locale={locale}
            categories={categories}
            trainingData={trainingData}
          />
        </div>
    

 

      <section className="relative z-10 w-full mt-40 ">
        <Poster />
      </section>
      <section className="relative z-10 w-full  ">
        <RoomsAndTents isArabic={isArabic} />
      </section>
      <SectionDivider color="bg-[#484d23]" height="h-16" />
      <section className="relative z-10 w-full   mt-40 ">
        <VideoSection />
      </section>
    
    

    
    

   
    </main>
  );
}



