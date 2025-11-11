"use client";

import React from "react";
import Image from "next/image";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import camp from "@/public/images/camp.webp";
import Logo from "@/components/Logo/Logo";

const Footer: React.FC = () => {
  return (
    <footer className="relative bg-[#1e2319] text-[#e4e4d2] pt-20 pb-10 px-6 sm:px-12 overflow-hidden">
      {/* 🌄 خلفية شفافة */}
      <Image
        src={camp}
        alt="Camping background"
        fill
        className="object-cover opacity-[0.05] z-0"
      />

      {/* 🧭 المحتوى */}
      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* 🏕️ القسم الأول: اللوجو والوصف */}
        <div className="flex flex-col">
          <div className="mb-4">
            <Logo />
          </div>
          <h2 className="text-xl font-bold text-[#dcdca8] mb-2">
            اكتشف مغامرتك القادمة
          </h2>
          <p className="text-sm leading-relaxed max-w-[250px]">
            منصة التخييم والمغامرات المثالية في قلب الطبيعة.
          </p>
        </div>

        {/* 🔗 القسم الثاني: روابط مهمة */}
        <div>
          <h3 className="text-lg font-semibold text-[#dcdca8] mb-4">
            روابط مهمة
          </h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-[#dcdca8] transition-colors">الرئيسية</a></li>
            <li><a href="#" className="hover:text-[#dcdca8] transition-colors">غرفنا</a></li>
            <li><a href="#" className="hover:text-[#dcdca8] transition-colors">الرحلات</a></li>
            <li><a href="#" className="hover:text-[#dcdca8] transition-colors">الفعاليات</a></li>
          </ul>

          {/* زر */}
          <button className="mt-6 px-5 py-2 bg-[#dcdca8] text-[#484d23] font-semibold rounded-full hover:bg-white transition-all duration-300">
            احجز الآن
          </button>
        </div>

        {/* ✉️ القسم الثالث: النشرة البريدية */}
        <div>
          <h3 className="text-lg font-semibold text-[#dcdca8] mb-4">
            اشترك في النشرة
          </h3>
          <p className="text-sm mb-4">
            اشترك ليصلك كل جديد وعروضنا الحصرية.
          </p>
          <form className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="أدخل بريدك الإلكتروني"
              className="px-4 py-2 text-[#1e2319] focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-full bg-[#676e32] text-white hover:bg-[#9f721f] transition-all duration-300"
            >
              اشترك
            </button>
          </form>
        </div>

        {/* 🌐 القسم الرابع: تواصل اجتماعي */}
        <div className="flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-[#dcdca8] mb-4">
              تابعنا
            </h3>
            <div className="flex gap-3">
              {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="p-3 bg-[#676e32] rounded-full hover:bg-[#dcdca8] hover:text-[#484d23] transition-all duration-300"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          <div className="mt-8 text-xs text-[#e4e4d2]/70">
            © {new Date().getFullYear()} Oasis Camp. جميع الحقوق محفوظة.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
