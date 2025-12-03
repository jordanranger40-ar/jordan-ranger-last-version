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
          <div className="mb-4 ">
            <Logo width={32} height={28} />
          </div>
          <h2 className="text-xl font-bold text-[#dcdca8] mb-2">{t("discoverTitle")}</h2>
          <p className="text-sm leading-relaxed max-w-[250px]">{t("discoverDesc")}</p>
        </div>

        {/* روابط مهمة */}
        <div>
          <h3 className="text-lg font-semibold text-[#dcdca8] mb-4">{t("importantLinks")}</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/" className="hover:text-white transition-colors duration-150">{t("home")}</a>
            </li>
            <li>
              <a href="/about" className="hover:text-white transition-colors duration-150">{t("about")}</a>
            </li>
            <li>
              <a href="/training-rooms" className="hover:text-white transition-colors duration-150">{t("training room")}</a>
            </li>
            <li>
              <a href="/tour-operators" className="hover:text-white transition-colors duration-150">{t("restaurant")}</a>
            </li>
          </ul>
        </div>

        {/* النشرة البريدية */}
        <div>
          <h3 className="text-lg font-semibold text-[#dcdca8] mb-4">{t("booking")}</h3>
 <ul className="space-y-2 text-sm">
            <li>
              <a href="/Accommodation/Cabins" className="hover:text-white transition-colors duration-150">{t("cabins")}</a>
            </li>
            <li>
              <a href="/Accommodation/Tents" className="hover:text-white transition-colors duration-150">{t("tents")}</a>
            </li>
            <li>
              <a href="/activities/indoor-activities" className="hover:text-white transition-colors duration-150">{t("indooractivities")}</a>
            </li>
            <li>
              <a href="/activities/outdoor-activities" className="hover:text-white transition-colors duration-150">{t("outdooractivities")}</a>
            </li>
            <li>
              <a href="/training/corporate-team-building" className="hover:text-white transition-colors duration-150">{t("corporateteambuilding")}</a>
            </li>
            <li>
              <a href="/training/schools-training" className="hover:text-white transition-colors duration-150">{t("schooltraining")}</a>
            </li>
          </ul>
      
        </div>

       
        <div className="flex flex-col justify-between">
          <div>
            {/* Contact Us (added) */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-[#dcdca8] mb-4">{t("contactUs")}</h3>
              <p className="text-sm leading-relaxed">
                <span className="font-medium">Email: </span>
                <a href="mailto:info@jordanrangercamp.com" className="hover:text-white transition-colors duration-150">info@jordanrangercamp.com</a>
              </p>
              <p className="text-sm leading-relaxed mt-2">
                <span className="font-medium">Phone: </span>
                <a href="tel:+962777000000" className="hover:text-white transition-colors duration-150">+962 7 7700 0000</a>
              </p>
            </div>

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
