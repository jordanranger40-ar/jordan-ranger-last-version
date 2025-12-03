import React from 'react'
import TrainginRoomsHeader from '@/components/training-rooms/TrainingRoomsHeader';
import TrainginRoomsSection from "@/components/training-rooms/TrainingRoomsSection"
interface Props {
    params: Promise <{locale:string}>
}

async function Page({params}:Props) {
  const { locale } = await params;
     const isArabic = locale === "ar";
   return (
     <div>
         <TrainginRoomsHeader   isArabic={isArabic}/>
         <TrainginRoomsSection  isArabic={isArabic} />
     </div>
   )
}

export default Page