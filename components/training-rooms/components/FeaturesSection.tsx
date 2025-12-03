import React from "react";

interface Props {
  isArabic: boolean;
}

const allFeatures = [
  {
    englishName: "2 Training Rooms",
    arabicName: "قاعاتين تدريب",
  },
  {
    englishName: "Coffee Breaks",
    arabicName: "استراحات القهوة",
  },
  {
    englishName: "Data Show",
    arabicName: "جهاز عرض",
  },
  {
    englishName: "Up To 50 Trainer",
    arabicName: "حتى 50 مدربًا",
  },
];
function FeaturesSection({ isArabic }: Props) {
  return (
    <div className="flex justify-center items-center mt-16 mb-10"  >
        <div className="grid grid-cols-1 text-lg sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-[90%] ">
      {allFeatures.map((ele, i) => {
        return (
          <div
            key={i}
            className="border border-[#dedede] bg-[#dedede] text-[#676e32] font-bold flex justify-center items-center py-10"
          >
            {isArabic ? ele.arabicName : ele.englishName}
          </div>
        );
      })}
    </div>
    </div>
    
  );
}

export default FeaturesSection;
