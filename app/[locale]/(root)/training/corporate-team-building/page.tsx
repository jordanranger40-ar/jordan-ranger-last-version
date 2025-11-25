import React from "react";
import CorporateTeamBuildingHeader from "@/components/corporate-team-building/CorporateTeamBuildingHeader";
import CorporateTeamBuildingSection from "@/components/corporate-team-building/CorporateTeamBuildingSection";

interface PageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function page({ params }: PageProps) {
  const { locale } = await params;

  const isArabic = locale === "ar";
  return (
    <>

      <div>
        <CorporateTeamBuildingHeader isArabic={isArabic} />
        <CorporateTeamBuildingSection isArabic={isArabic} />
      </div>


    </>
  );
}
