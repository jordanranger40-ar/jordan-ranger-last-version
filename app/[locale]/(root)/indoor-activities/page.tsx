import React from 'react'
import IndoorActivitiesHeader from '@/components/activities/indoor-activities/indoor-activities-header'
import IndoorAvtivitiesSection from '@/components/activities/indoor-activities/indoor-avtivities-section';
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
      <IndoorActivitiesHeader isArabic={isArabic} />
      <IndoorAvtivitiesSection isArabic={isArabic} />




    </main>
  );
}
