
import BannerSection from "@/components/banner/BannerSection";

import { getAllcategories } from "@/app/models/db/lib/services/Accommodation";
import { getAllTraining } from "@/app/models/db/lib/services/training";
import { getAllClients } from "@/app/models/db/lib/services/clients";
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
  const { locale } = params;

  const banners: newBanner[] = await getBannerData();
  const categories: newCategory[] = await getAllcategories();
  const trainingData: newTraining[] = await getAllTraining();

  type Client = {
    id?: string;
    name: string;
    logo: string;
    created_at?: Date;
  };
    const clients: Client[] = await getAllClients();
  const isArabic = locale === "ar";

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
        <RoomsAndTents />
      </section>
    

   
    </main>
  );
}
