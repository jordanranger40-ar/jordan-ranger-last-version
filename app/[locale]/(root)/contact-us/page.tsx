import React from 'react'
import ContactUsHeader from '@/components/contact-us/contact-us-header'
import ContactUsSection from '@/components/contact-us/contact-us-section';


interface PageProps {
    params: {
      locale: string;
    };
  }
export default async function ContactUsPage({ params }: PageProps) {
  const { locale } = await params;
  const isArabic = locale === "ar";



  return (
    <main className="flex flex-col items-center mt-12 w-full">
      <ContactUsHeader isArabic={isArabic} />
      <ContactUsSection  isArabic={isArabic}/>

   
    </main>
  );
}

