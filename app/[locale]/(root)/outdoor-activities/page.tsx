import React from 'react'
import OutdoorActivitiesHeader from '@/components/activities/outdoor-activities/outdoor-activities-header'
import OutdoorAvtivitiesSection from '@/components/activities/outdoor-activities/outdoor-activities-section'
interface PageProps {
    params: {
      locale: string;
    };
  }
export default async function page({ params }: PageProps) {
  const { locale } = await params;
  const isArabic = locale === "ar";



  return (
    <main className="flex flex-col items-center mt-12 w-full">
      <OutdoorActivitiesHeader isArabic={isArabic} />
      <OutdoorAvtivitiesSection isArabic={isArabic} />



    </main>
  );
}
