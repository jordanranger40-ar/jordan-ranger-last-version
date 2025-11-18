"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import camp from "@/public/images/camp.webp";
import Logo from "@/components/Logo/Logo";
import LightButton from "./light-button";

type Props = {
  locale: string;
};

const Footer: React.FC<Props> = ({ locale }) => {
  const t = useTranslations("Footer");

  return (
    <footer
      dir={locale === "ar" ? "rtl" : "ltr"}
      className="relative bg-[#484d23] text-[#e4e4d2] pt-20 pb-10 px-6 sm:px-12 overflow-hidden"
    >
      <Image
        src={camp}
        alt="Camping background"
        fill
        className="object-cover opacity-[0.05] z-0"
      />

      <div
        className={`relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 ${
          locale === "ar" ? "text-right" : "text-left"
        }`}
      >
        {/* اللوجو والوصف */}
        <div className="flex flex-col">
          <div className="mb-4">
            <Logo />
          </div>
          <h2 className="text-xl font-bold text-[#dcdca8] mb-2">{t("discoverTitle")}</h2>
          <p className="text-sm leading-relaxed max-w-[250px]">{t("discoverDesc")}</p>
        </div>

        {/* روابط مهمة */}
        <div>
          <h3 className="text-lg font-semibold text-[#dcdca8] mb-4">{t("importantLinks")}</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-white transition-colors duration-150">{t("home")}</a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors duration-150">{t("rooms")}</a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors duration-150">{t("trips")}</a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors duration-150">{t("events")}</a>
            </li>
          </ul>

<LightButton>            {t("bookNow")}
          </LightButton>
        </div>

        {/* النشرة البريدية */}
        <div>
          <h3 className="text-lg font-semibold text-[#dcdca8] mb-4">{t("newsletter")}</h3>
          <p className="text-sm mb-4">{t("newsletterDesc")}</p>

          <form className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder={t("emailPlaceholder")}
              className="px-4 py-2 text-[#484d23] focus:outline-none rounded-full"
            />
           <LightButton>
              {t("subscribe")}
            </LightButton>
          </form>
        </div>

       
        <div className="flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-[#dcdca8] mb-4">{t("followUs")}</h3>
            <div className="flex gap-3">
              {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, idx) => (
                <LightButton key={idx} className="px-3!"  >
                  <Icon />
                </LightButton>
              ))}
            </div>
          </div>

  
        </div>
      </div>
<hr className="border-[#dcdca8] mt-10" />

              <div className="mt-8   text-xs  md:text-base text-[#e4e4d2]/70 flex justify-self-center">
             
            © {new Date().getFullYear()} Jordan Ranger Camp. {t("rights")}
          </div>
    </footer>
  );
};

export default Footer;
