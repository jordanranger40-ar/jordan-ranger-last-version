import React from "react";
import SchoolTrainingHeader from "@/components/school-training/trainingHeader";
import SchoolTrainingSection from "@/components/school-training/trainingSection";

interface PageProps {
  params: Promise<{
    locale: string,
  }>;
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;

  const isArabic = locale === "ar";
  return (
    <>
      <div>
        <SchoolTrainingHeader isArabic={isArabic} />
        <SchoolTrainingSection isArabic={isArabic} />
      </div>
     
    </>
  );
}
