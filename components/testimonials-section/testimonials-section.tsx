import React from 'react'
interface Props {
    isArabic: boolean;
  }

export default function TestimonialsSection({isArabic}:Props) {
  return (
    <div> {/* Testimonials Section */}
    <section className="w-full mt-40 bg-[#484d23] py-20 text-white">
      <div className="max-w-6xl mx-auto text-center px-6">
        <h2 className="text-3xl font-bold mb-12">
          {isArabic ? "آراء عملائنا" : "What Our Guests Say"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "Sara",
              text: isArabic
                ? "تجربة رائعة! المكان هادئ والطبيعة ساحرة."
                : "Amazing experience! The place is peaceful and beautiful.",
            },
            {
              name: "Omar",
              text: isArabic
                ? "أفضل موقع للتخييم والراحة بعد أسبوع طويل من العمل."
                : "The best place to relax and camp after a long week!",
            },
            {
              name: "Lina",
              text: isArabic
                ? "خدمة ممتازة وأنشطة متنوعة لجميع الأعمار."
                : "Excellent service and fun activities for everyone!",
            },
          ].map((review, i) => (
            <div
              key={i}
              className="relative overflow-hidden group transition-transform duration-500 transform-gpu hover:-translate-y-2 hover:shadow-[0_12px_25px_rgba(0,0,0,0.25)]"
              style={{
                borderRadius: "2rem 0.5rem 2rem 0.5rem", 
                boxShadow: "0 6px 15px rgba(0,0,0,0.15)", 
              }}
            >
              {/* shine subtle عند hover */}
              <div className="absolute inset-0 pointer-events-none">
                <div
                  className="absolute top-0 left-0 w-full h-full bg-linear-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-30 transition duration-500"
                  style={{ borderRadius: "2rem 0.5rem 2rem 0.5rem" }}
                />
              </div>

              {/* محتوى الكارد */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 text-white">
                <p className="text-lg italic mb-4">“{review.text}”</p>
                <span className="block font-semibold text-[#dcdca8]">
                  — {review.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section></div>
  )
}
