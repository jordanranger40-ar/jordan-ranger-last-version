import React from 'react'
import TourOperatorsHeader from "@/components/tour-operators/tourOperatorsHeader"
import TourOperatorsSection from "@/components/tour-operators/tourOperatorsSection"


interface PageProps {
    params: {
      locale: string;
    };
  }
  

export default async function page({ params }: PageProps) {

    const { locale } = await params;
    const isArabic = locale === "ar";
  return (
    <div>
        <TourOperatorsHeader   isArabic={isArabic}/>
        <TourOperatorsSection  isArabic={isArabic} />
    </div>
  )
}
