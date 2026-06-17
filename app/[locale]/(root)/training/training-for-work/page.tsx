import React from "react";
import {PAGE_METADATA} from "@/lib/constants/metadata"
import TrainingForWorkHeader from "@/components/training-for-work/TrainingForWorkHeader";
import TrainingForWorkSection from "@/components/training-for-work/TrainingForWorkSection";

export const metadata= PAGE_METADATA["training/training-for-work"]

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
        <TrainingForWorkHeader isArabic={isArabic} />
        <TrainingForWorkSection isArabic={isArabic} />
      </div>


    </>
  );
}
