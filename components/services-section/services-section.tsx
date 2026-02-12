import React from 'react'
import Link from 'next/link';

interface Props {
  isArabic: boolean;
}

export default function ServicesSection({ isArabic }: Props) {
  return (
    <section className="w-full mt-20 px-2  lg:px-20">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-12">
        {[
          { title: isArabic ? "الفعاليات الداخلية" : "Indoor Activities", icon: "🏠",link:"/activities/indoor-activities" },          
          { title: isArabic ? "الفعاليات الخارجية" : "Outdoor Activities", icon: "🌳",link:"/activities/outdoor-activities" },       
          { title: isArabic ? "الاقامات" : "Accommodation", icon: "🛏️",link:"/Accommodation/Cabins" },     
          { title: isArabic ? "المطعم" : "Restaurant", icon: "🍽️" ,link:"/restaurant"},                    
          { title: isArabic ? "التدريب المدرسي" : "School Training", icon: "📚",link:"/training/schools-training" },               
          { title: isArabic ? "تدريبات وبناء فرق" : "Corporate Team Building", icon: "🤝" ,link:"/training/corporate-team-building"},  
                                   
        ].map((service, i) => (
          <Link  key={i} href={service.link} >
          <div
           
            className="relative overflow-hidden group h-48 transition-transform duration-500 transform-gpu hover:-translate-y-2 hover:shadow-[0_12px_25px_rgba(0,0,0,0.25)]"
            style={{
              borderRadius: '2rem 0.5rem 2rem 0.5rem', 
              border: '2px solid transparent',
              boxShadow: '0 6px 15px rgba(0,0,0,0.15)',
            }}
          >
            <div className="absolute inset-0 pointer-events-none">
              <div
                className="absolute top-0 left-0 w-full h-full bg-linear-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-30 transition duration-500"
                style={{ borderRadius: '2rem 0.5rem 2rem 0.5rem' }}
              />
            </div>

            <div className=" rounded-xl px-2 py-8 sm:px-8 text-center transition-all duration-300 group-hover:border-[#484d23]">
              <div className="text-5xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold text-[#484d23]">{service.title}</h3>
            </div>
          </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
