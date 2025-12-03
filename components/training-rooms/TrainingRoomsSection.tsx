import React from 'react'
import HeaderSection from './components/HeaderSection';
import FeaturesSection from './components/FeaturesSection';
import UpperRoomSection from './components/UpperRoomSection';
import LowerRoomSection from './components/LowerRoomSection';

interface Props {
  isArabic: boolean;
}

export default function TrainingRoomsSection({ isArabic }: Props) {
  return (
    <main>
<HeaderSection isArabic={isArabic} />
<FeaturesSection isArabic={isArabic}/>
<UpperRoomSection isArabic={isArabic}/>
<LowerRoomSection isArabic={isArabic}/>
    </main>
  );
}
