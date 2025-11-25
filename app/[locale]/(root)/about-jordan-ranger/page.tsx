import { getAllClients } from "@/app/models/db/lib/services/clients";
import AboutSection from "@/components/about/AboutSection";

import CentersSection from "@/components/about/CentersSection";
import MissionSection from "@/components/about/MissionSection";
import FounderSection from "@/components/about/FounderSection";
import TeamSection from "@/components/about/TeamSection";
import ClientsSection from "@/components/about/ClientsSection";

type Client = {
  id?: string;
  name: string;
  logo: string;
  created_at?: Date;
};

interface PageProps {
  params: Promise <{
    locale: string;
  }>;
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  const isArabic = locale === "ar";

  const clients: Client[] = await getAllClients();

  return (
    <main className="flex flex-col items-center mt-12 w-full">
      <AboutSection isArabic={isArabic} />

      <CentersSection isArabic={isArabic} />
      <MissionSection isArabic={isArabic} />
      <FounderSection isArabic={isArabic} />
      <TeamSection isArabic={isArabic} />
      <ClientsSection clients={clients} isArabic={isArabic} />
    </main>
  );
}
