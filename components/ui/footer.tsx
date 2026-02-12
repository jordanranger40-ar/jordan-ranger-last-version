"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import { SiX } from "react-icons/si";
import { Mail, Phone, MapPinIcon } from "lucide-react";
import camp from "@/public/images/camp.webp";
import Logo from "@/components/Logo/Logo";
import LightButton from "./light-button";

type Props = {
  locale: string;
};

const Footer: React.FC<Props> = ({ locale }) => {
  const t = useTranslations("Footer");
  const isArabic = locale === "ar";
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "";
  const phoneNumber1 = process.env.NEXT_PUBLIC_PHONE_NUMBER1 || "";
  const phoneNumber2 = process.env.NEXT_PUBLIC_PHONE_NUMBER2 || "";
  const locationUrl = process.env.NEXT_PUBLIC_LOCATION_URL || "";
  const facebookUrl = process.env.NEXT_PUBLIC_FACEBOOK_URL || "#";
  const linkedinUrl = process.env.NEXT_PUBLIC_LINKEDIN_URL || "#";
  const twitterUrl = process.env.NEXT_PUBLIC_TWITTER_URL || "#";
  const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL || "#";
  const nurembergUrl = process.env.NEXT_PUBLIC_NUREMBERG_URL || "#";
  const arabicLocation = process.env.NEXT_PUBLIC_LOCATION_AR || "الأردن - جرش";
  const englishLocation = process.env.NEXT_PUBLIC_LOCATION_EN || "Jerash - Jordan";

  return (
    <footer
      dir={locale === "ar" ? "rtl" : "ltr"}
      className="relative bg-[#484d23] text-[#e4e4d2] pt-6 pb-6 md:pt-20 md:pb-10 px-6 sm:px-12 overflow-hidden"
    >
      <Image
        src={camp}
        alt="Camping background"
        fill
        className="object-cover opacity-[0.05] z-0"
      />

      <div
        /* Changed to grid-cols-2 for mobile, kept md:grid-cols-4 for laptop */
        className={`relative z-10 max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-5  md:gap-y-10 md:gap-12 ${
          locale === "ar" ? "text-right" : "text-left"
        }`}
      >
        {/* LOGO + Description - Full width on mobile */}
        <div className="flex flex-col col-span-2 md:col-span-1">
          <div className="mb-4">
            <Logo width={32} height={28} />
          </div>
          <h2 className="text-xl font-bold text-[#dcdca8] mb-2">
            {t("discoverTitle")}
          </h2>
          <p className="text-sm leading-relaxed max-w-full md:max-w-62.5">
            {t("discoverDesc")}
          </p>
        </div>

        {/* Important Links - Side by side on mobile */}
        <div className="col-span-1 hidden md:block">
          <h3 className="text-lg font-semibold text-[#dcdca8] mb-4">
            {t("importantLinks")}
          </h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-white">{t("home")}</Link></li>
            <li><Link href="/about" className="hover:text-white">{t("about")}</Link></li>
            <li><Link href="/training-rooms" className="hover:text-white">{t("training room")}</Link></li>
            <li><Link href="/tour-operators" className="hover:text-white">{t("restaurant")}</Link></li>
          </ul>
        </div>

        {/* Booking - Side by side on mobile */}
        <div className="col-span-1 hidden md:block">
          <h3 className="text-lg font-semibold text-[#dcdca8] mb-4">
            {t("booking")}
          </h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/Accommodation/Cabins" className="hover:text-white">{t("cabins")}</Link></li>
            <li><Link href="/Accommodation/Tents" className="hover:text-white">{t("tents")}</Link></li>
            <li><Link href="/activities/indoor-activities" className="hover:text-white">{t("indooractivities")}</Link></li>
            <li><Link href="/activities/outdoor-activities" className="hover:text-white">{t("outdooractivities")}</Link></li>
            <li><Link href="/training/corporate-team-building" className="hover:text-white">{t("corporateteambuilding")}</Link></li>
            <li><Link href="/training/schools-training" className="hover:text-white">{t("schooltraining")}</Link></li>
          </ul>
        </div>

        {/* Contact + Social - Full width on mobile */}
        <div className="flex flex-col col-span-2 md:col-span-1">
          <h3 className="text-lg font-semibold text-[#dcdca8] mb-4">
            {t("contactUs")}
          </h3>
          <div className="space-y-1 mb-3 md:mb-6">
            <p className="text-base flex items-center gap-2">
              <Mail size={18} className="flex-shrink-0 opacity-80" />
              <a href={`mailto:${contactEmail}`} className="hover:text-white truncate">
                {contactEmail}
              </a>
            </p>
            <p className="text-base flex items-center gap-2">
              <Phone size={18} className="flex-shrink-0 opacity-80" />
              <a href={`tel:${phoneNumber1}`} className="hover:text-white">{phoneNumber1}</a>
            </p>
            <p className="text-base flex items-center gap-2">
              <Phone size={18} className="flex-shrink-0 opacity-80" />
              <a href={`tel:${phoneNumber2}`} className="hover:text-white">{phoneNumber2}</a>
            </p>
            <p className="text-base flex items-center gap-2">
              <a href={locationUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <MapPinIcon size={20} className="flex-shrink-0 opacity-80" />
                <span className="hover:text-white">{isArabic ? arabicLocation : englishLocation}</span>
              </a>
            </p>
          </div>

          <div className="flex gap-3">
            {[
              { Icon: FaFacebookF, url: facebookUrl, label: "Facebook" },
              { Icon: SiX, url: twitterUrl, label: "X" },
              { Icon: FaInstagram, url: instagramUrl, label: "Instagram" },
              { Icon: FaLinkedinIn, url: linkedinUrl, label: "LinkedIn" },
            ].map(({ Icon, url, label }, idx) => (
              <a key={idx} href={url} target="_blank" rel="noopener noreferrer" aria-label={label}>
                <LightButton className="px-3!">
                  <Icon size={18} />
                </LightButton>
              </a>
            ))}
          </div>
        </div>
      </div>

      <hr className="border-[#dcdca8] mt-10" />

      <div className="text-center pt-5 ">
        <p className="text-sm text-white/90">
          {isArabic ? (
            <>
              © 2025 Jordan Ranger. جميع الحقوق محفوظة. مملوك لمنتجع إيكو فيو. تم الإنشاء بواسطة{" "}
              <a href={nurembergUrl} target="_blank" className="underline hover:text-gray-300">Nuremberg Group</a>.
            </>
          ) : (
            <>
              © 2025 Jordan Ranger. All rights reserved. Owned by Eco View Resort. Powered by{" "}
              <a href={nurembergUrl} target="_blank" className="underline hover:text-white">Nuremberg Group</a>.
            </>
          )}
        </p>
      </div>
    </footer>
  );
};

export default Footer;