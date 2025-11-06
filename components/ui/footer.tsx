import React from "react";
import Image from "next/image";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import camp from "@/public/images/camp.webp";
import Logo from "@/components/Logo/Logo"

const Footer: React.FC = () => {
  return (
    <footer className="relative bg-[#515151] text-gray-300 py-10 px-6 sm:px-12 overflow-hidden">
      <Image
        src={camp}
        alt="Camping background"
        fill
        className="object-cover opacity-5 z-0"
      />

      <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10 items-start">
        {/* العمود الأول - لوجو + وصف */}
        <div className="flex flex-col items-start">
          <div className="mb-3">
       <Logo/>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed">
            منصة المغامرات والرحلات البرية. استكشف الطبيعة، تعلم مهارات التخييم، واستمتع بتجربة لا تُنسى.
          </p>
        </div>

        {/* العمود الثاني - روابط */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">روابط مهمة</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-[#b3c820ff] transition-colors">الرئيسية</a></li>
            <li><a href="#" className="hover:text-[#b3c820ff] transition-colors">رحلاتنا</a></li>
            <li><a href="#" className="hover:text-[#b3c820ff] transition-colors">معدات التخييم</a></li>
            <li><a href="#" className="hover:text-[#b3c820ff] transition-colors">المدونة</a></li>
            <li><a href="#" className="hover:text-[#b3c820ff] transition-colors">الفعاليات</a></li>
          </ul>
        </div>

        {/* العمود الثالث - أيقونات تواصل اجتماعي */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">تابعنا</h3>
          <p className="text-sm text-gray-300 mb-3">
            تابعنا على منصات التواصل الاجتماعي للحصول على آخر الأخبار والعروض.
          </p>
          <div className="flex gap-3">
            <a href="#" className="bg-[#676e32] hover:bg-[#9f721fff] p-3 rounded-full text-white transition-colors">
              <FaFacebookF />
            </a>
            <a href="#" className="bg-[#676e32] hover:bg-[#9f721fff] p-3 rounded-full text-white transition-colors">
              <FaTwitter />
            </a>
            <a href="#" className="bg-[#676e32] hover:bg-[#9f721fff] p-3 rounded-full text-white transition-colors">
              <FaInstagram />
            </a>
            <a href="#" className="bg-[#676e32] hover:bg-[#9f721fff] p-3 rounded-full text-white transition-colors">
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>

      <hr className="border-[#9f721fff] my-8" />

      <div className="relative z-10 text-center text-xs text-gray-300">
        © {new Date().getFullYear()} AdventureBase. جميع الحقوق محفوظة.
      </div>
    </footer>
  );
};

export default Footer;
