import React from "react";
import Image from "next/image";
import { getSettingsData } from "@/app/models/db/lib/services/settings";
import DarkButton from "@/components/ui/dark-button"; 
import { BookOpen, Users, Globe, FileDown, Sparkles, Languages, Calendar } from "lucide-react";

interface PageProps {
  params: Promise<{ locale: string }>;
}

async function SummerProgramPage({ params }: PageProps) {
  const { locale } = await params;
  const isArabic = locale === "ar";
  const direction = isArabic ? "rtl" : "ltr";

  // Data Fetching
  const settingData = await getSettingsData();
  
  // Update these keys in your DB to match
  const pdfLink = settingData.find((s) => s.key_name_en === "link_of_pdf_summer_program")?.value_en;
 
  const programImage = settingData.find((s) => s.key_name_en === "image_summer_program_page")?.value_en;

  const content = {
    title: isArabic 
      ? "البرنامج التفاعلي الصيفي لتعلم اللغة العربية والاندماج المجتمعي 2026" 
      : "Interactive Summer Program for Learning Arabic and Social Integration 2026",
    description: isArabic 
      ? "البرنامج التفاعلي الصيفي لتعلّم اللغة العربية والاندماج المجتمعي 2026 هو تجربة تعليمية وثقافية متكاملة تتيح للمشاركين تعلّم اللغة العربية من خلال التفاعل المباشر مع المجتمع المحلي في الأردن. يجمع البرنامج بين التعليم التفاعلي، والعمل التطوعي، والأنشطة الثقافية، والرحلات الاستكشافية، مما يمنح المشاركين فرصة فريدة لاكتشاف الثقافة العربية، وبناء مهارات التواصل، وخوض تجربة أصيلة داخل المجتمع، تحت إشراف فريق متخصص وضمن بيئة تعليمية آمنة ومحفّزة."
      : "Interactive Summer Program for Learning Arabic and Social Integration 2026 is a comprehensive educational and cultural experience that enables participants to learn Arabic through direct engagement with local communities in Jordan. The program combines interactive learning, volunteer work, cultural activities, and exploratory trips, offering participants a unique opportunity to discover Arab culture, develop communication skills, and experience authentic community life under the supervision of a specialized team within a safe and inspiring learning environment.",
    cta: isArabic 
      ? "اضغط على الرابط للاطلاع على جميع التفاصيل وجدول الرحلة الكامل." 
      : "Click the link for full details and the complete journey schedule."
  };

  return (
    <main className="min-h-screen bg-[#fafafa] pt-28 pb-16 px-2" dir={direction}>
      <div className="max-w-[95%] mx-auto">
        
        {/* Hero Section Card */}
        <div className="relative bg-white rounded-[3rem_1rem_3rem_1rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row items-stretch border border-gray-100">
          
          {/* Text Content */}
          <div className="w-full lg:w-3/5 py-8 px-3 md:p-16 flex flex-col justify-center">
            <div className="flex items-center gap-2 text-[#b3c820] font-bold mb-4">
              <Languages size={20} />
              <span className="uppercase tracking-widest text-sm">
                {isArabic ? "برنامج تعليمي" : "Educational Program"}
              </span>
            </div>

            <h1 className="text-lg md:text-3xl lg:text-4xl font-black text-[#484d23] mb-8 leading-tight">
              {content.title}
            </h1>

            <p className="text-sm text-gray-700 leading-relaxed mb-10">
              {content.description}
            </p>
           {pdfLink&& <div className="flex items-start gap-3 p-4 bg-[#484d23]/5 rounded-2xl border-s-4 border-[#b3c820]">
                <Calendar className="text-[#484d23] mt-1 shrink-0" size={20} />
                <p className="font-medium text-[#484d23]">
                  {content.cta}
                </p>
              </div>}

            {/* Responsive PDF Button */}
            {pdfLink && (
              <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start w-full">
                <a 
                  href={ pdfLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group w-full sm:w-auto"
                >
                  <DarkButton className="flex items-center justify-center gap-3 px-6 py-4 md:px-10 md:py-5 transition-all group-hover:scale-105 active:scale-95 w-full sm:w-auto shadow-lg shadow-[#484d23]/20">
                    <FileDown size={22} className="shrink-0" />
                    <span className="text-sm md:text-base lg:text-lg font-bold uppercase whitespace-nowrap">
                      {isArabic ? "تفاصيل البرنامج" : "Program Details"}
                    </span>
                  </DarkButton>
                </a>
                
              </div>
            )}
          </div>

          {/* Visual Side */}
          <div className="w-full lg:w-2/5 relative min-h-[400px]">
            {programImage ? (
              <Image
                src={programImage}
                alt="Summer Program"
                fill
                className="object-contain"
                priority
              />
            ) : (
              <div className="w-full h-full bg-[#484d23] flex items-center justify-center">
                <BookOpen size={100} className="text-white/10" />
              </div>
            )}
            
          
          </div>
        </div>

        {/* Feature Icons Grid */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { en: "Language", ar: "اللغة", icon: BookOpen },
            { en: "Volunteer", ar: "تطوع", icon: Users },
            { en: "Culture", ar: "ثقافة", icon: Globe },
            { en: "Safety", ar: "أمان", icon: Sparkles }
          ].map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 flex flex-col items-center text-center group hover:border-[#b3c820] transition-colors">
              <item.icon className="text-[#484d23] mb-3 group-hover:text-[#b3c820] transition-colors" size={32} />
              <h3 className="font-bold text-[#484d23]">{isArabic ? item.ar : item.en}</h3>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}

export default SummerProgramPage;