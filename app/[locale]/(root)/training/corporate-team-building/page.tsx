import React from "react";
import CorporateTeamBuildingHeader from "@/components/corporate-team-building/CorporateTeamBuildingHeader";
import CorporateTeamBuildingSection from "@/components/corporate-team-building/CorporateTeamBuildingSection";
import {PAGE_METADATA} from "@/lib/constants/metadata"

export const metadata= PAGE_METADATA["training/corporate-team-building"]

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
