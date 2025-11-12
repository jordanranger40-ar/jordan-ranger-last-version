
import React from 'react'
interface Props {
    isArabic: boolean;
  }


export default function ComingSoon({isArabic}:Props) {


  return (
        <section className="w-full mt-20 px-6 md:px-20 text-center">
          <div className="mt-12 bg-[#484d23] text-white rounded-2xl p-16 shadow-lg">
    <h3 className="text-3xl font-bold mb-4">
      {isArabic ? "تحضيراتنا لموسم الصيف القادم!" : "Preparing for Next Summer!"}
    </h3>
    <p className="text-lg opacity-90 mb-8">
      {isArabic
        ? "أنشطة جديدة وتجارب تخييم استثنائية بانتظاركم."
        : "New activities and unique camping experiences are on the way!"}
    </p>
    <button className="bg-white text-[#484d23] font-semibold px-6 py-3 rounded-md hover:bg-[#dcdca8] transition-all duration-300">
      {isArabic ? "اعرف أكثر" : "Learn More"}
    </button>
  </div>
  </section>

  )
}
