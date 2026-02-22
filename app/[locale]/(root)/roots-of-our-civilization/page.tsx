import React from "react";
import Image from "next/image";
import { getSettingsData } from "@/app/models/db/lib/services/settings";
import DarkButton from "@/components/ui/dark-button"; // Adjust path as needed
import { FileDown, MapPin, Sparkles, Calendar } from "lucide-react";

interface PageProps {
  params: Promise<{ locale: "en" | "ar" }>;
}

async function Page({ params }: PageProps) {
  const { locale } = await params;
  const isArabic = locale === "ar";
  const direction = isArabic ? "rtl" : "ltr";

  // Data Fetching
  const settingData = await getSettingsData();
  const pdfLinkEn = settingData.find((s) => s.key_name_en === "link_of_pdf_root")?.value_en;
  const pdfLinkAr = settingData.find((s) => s.key_name_en === "link_of_pdf_root")?.value_ar
  const rootImage = settingData.find((s) => s.key_name_en === "image_root_page")?.value_en;

  // Fallback Content
  const content = {
    title: isArabic ? "جذور حضارتنا" : "Roots Of Our Civilization",
    description: isArabic 
      ? `انضموا إلينا هذا الصيف من 5 آب حتى 14 آب في رحلة استثنائية مع جذور حضارتنا ✨، مغامرة لا تُنسى صُممت خصيصًا للشباب من أصول أردنية أو للراغبين في عيش التجربة الأردنية بكل جوانبها. سنأخذكم في رحلة عبر حضارات مملكة الزمن، المملكة الأردنية الهاشمية 🇯🇴، خلال 9 أيام غامرة بالتجارب.
      
اختبروا دفء الضيافة الأردنية من خلال العيش مع المزارعين والعائلات المحلية والبدو، واكتشاف كنوز الحضارات القديمة والحديثة. سنزور تسع مدن أردنية، بدءًا من آثار جرش العريقة وروائع الشمال، ثم نتجه نحو قلب الأردن لاستكشاف شوارع عمّان النابضة بالحياة، مع التوقف عند شاطئ البحر الميت الهادئ. ونواصل مغامرتنا جنوبًا حيث سننبهر بجمال وادي رم الساحر، وروعة البترا الخلابة، لنختتم الرحلة بيوم مميز في العقبة.`
      : `Join us this summer from Aug 5th to Aug 14th in an extraordinary journey with Roots of Our Civilization ✨ unforgettable adventure, designed for young people of Jordanian origin or wishing to live the Jordanian experience in all its aspects. We'll take you through the civilizations in the Kingdom of Time, the Hashemite Kingdom of Jordan 🇯🇴 over 9 immersive days.

Experience the warmth of Jordanian hospitality as you live among farmers, local families, and Bedouins, discovering the treasures of ancient and modern civilizations. We are going through nine Jordanian cities, beginning with the ancient ruins of Jerash and the northern wonders.

Moving towards the heart of Jordan, we'll explore the vibrant streets of Amman, and pausing at the peaceful beach of the Dead Sea. Continuing our adventure southward, we'll be awed by the majestic beauty of Wadi Rum, the breathtaking beauty of Petra, ending with a vibrant day in Aqaba.`,
    details: isArabic ? "انقر فوق الرابط للحصول على التفاصيل الكاملة وجدول الرحلة الكامل." : "Click the link for full details and the complete journey schedule."
  };

  return (
    <main className="min-h-screen bg-[#fafafa] pt-24 pb-12" dir={direction}>
      <div className="max-w-[95%] mx-auto px-6">
        
        {/* Main Card Container */}
        <div className="relative bg-white rounded-[4rem_1rem_4rem_1rem] shadow-[0_30px_100px_rgba(72,77,35,0.1)] overflow-hidden flex flex-col lg:flex-row items-stretch">
          
          {/* Content Side */}
          <div className="w-full lg:w-3/5 p-8 md:p-16 flex flex-col justify-center">
            {/* Tag/Badge */}
            <div className="flex items-center gap-2 text-[#b3c820] font-bold tracking-widest uppercase text-sm mb-6">
              <Sparkles size={18} />
              <span>{isArabic ? "مغامرة الصيف" : "Summer Adventure"}</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-[#484d23] mb-8 leading-[1.1]">
              {content.title}
            </h1>

            <div className="space-y-6 text-gray-700 text-lg leading-relaxed mb-10">
              <p className="whitespace-pre-line">
                {content.description}
              </p>
              
              <div className="flex items-start gap-3 p-4 bg-[#484d23]/5 rounded-2xl border-s-4 border-[#b3c820]">
                <Calendar className="text-[#484d23] mt-1 shrink-0" size={20} />
                <p className="font-medium text-[#484d23]">
                  {content.details}
                </p>
              </div>
            </div>

            {/* Action Area */}
            {pdfLinkEn && (
  <div className="flex flex-col sm:flex-row gap-4  items-center sm:items-start w-full">
    <a 
      href={isArabic?pdfLinkAr: pdfLinkEn} 
      target="_blank" 
      rel="noopener noreferrer"
      /* w-full makes the clickable area cover the screen width on mobile */
      className="group w-full sm:w-auto"
    >
      <DarkButton 
        className="flex items-center justify-center gap-3 px-6 py-4 md:px-10 md:py-5 transition-transform group-hover:scale-105 active:scale-95 w-full sm:w-auto"
      >
        <FileDown size={20} className="shrink-0 md:w-6 md:h-6" />
        <span className="text-sm md:text-base lg:text-lg font-bold uppercase whitespace-nowrap">
          {isArabic ? "تفاصيل الرحلة" : "Full Itinerary"}
        </span>
      </DarkButton>
    </a>
  </div>
)}
          </div>

          {/* Image Side */}
          <div className="w-full lg:w-2/5 relative min-h-[500px] lg:min-h-full">
            {rootImage ? (
              <Image
                src={rootImage}
                alt="Roots of Civilization"
                fill
                className="object-contain"
                priority
              />
            ) : (
              <div className="w-full h-full bg-[#484d23] flex flex-col items-center justify-center text-[#e4e4d2] p-10 text-center">
                 <MapPin size={80} className="mb-4 opacity-20" />
                 <p className="opacity-40 italic">{isArabic ? "صورة الرحلة" : "Journey Image"}</p>
              </div>
            )}
            
            {/* Visual Accents over Image */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#484d23]/60 via-transparent to-transparent lg:hidden" />
            
          
          </div>
        </div>

        {/* Bottom Decorative Section (Matching your AboutSection style) */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { en: "Culture", ar: "ثقافة", icon: "🏺" },
            { en: "Heritage", ar: "تراث", icon: "🏛️" },
            { en: "Nature", ar: "طبيعة", icon: "🌿" }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center p-6 rounded-3xl bg-white shadow-sm border border-gray-100">
              <span className="text-4xl mb-4">{item.icon}</span>
              <h3 className="text-[#484d23] font-bold text-xl">{isArabic ? item.ar : item.en}</h3>
            </div>
          ))}
        </div>

      </div>
      
      {/* Background Textures */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 opacity-[0.03] pointer-events-none">
        <div className="absolute top-20 right-[-10%] w-[500px] h-[500px] bg-[#b3c820] rounded-full blur-[120px]" />
        <div className="absolute bottom-20 left-[-10%] w-[500px] h-[500px] bg-[#484d23] rounded-full blur-[120px]" />
      </div>
    </main>
  );
}

export default Page;