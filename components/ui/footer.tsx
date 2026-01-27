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
  FaYoutube,
} from "react-icons/fa";
import {

  SiX,
} from "react-icons/si"
import { Mail, Phone, MapPinIcon } from "lucide-react";
import camp from "@/public/images/camp.webp";
import Logo from "@/components/Logo/Logo";
import LightButton from "./light-button";

type Props = {
  locale: string;
};

const Footer: React.FC<Props> = ({ locale }) => {
  const t = useTranslations("Footer");
  const isArabic= locale==="ar"
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "";
  const phoneNumber1 = process.env.NEXT_PUBLIC_PHONE_NUMBER1 || "";
  const phoneNumber2 = process.env.NEXT_PUBLIC_PHONE_NUMBER2 || "";
  const locationUrl = process.env.NEXT_PUBLIC_LOCATION_URL || "";
  const facebookUrl = process.env.NEXT_PUBLIC_FACEBOOK_URL || "#";
  const linkedinUrl = process.env.NEXT_PUBLIC_LINKEDIN_URL || "#";
  const twitterUrl = process.env.NEXT_PUBLIC_TWITTER_URL || "#";
//  const youtubeUrl = process.env.NEXT_PUBLIC_YOUTUBE_URL || "#";
  const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL || "#";
  const nurembergUrl = process.env.NEXT_PUBLIC_NUREMBERG_URL || "#";
  const arabicLocation= process.env.NEXT_PUBLIC_LOCATION_AR|| "الأردن - جرش"
    const englishLocation= process.env.NEXT_PUBLIC_LOCATION_EN|| "Jerash - Jordan"

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
        {/* LOGO + Description */}
        <div className="flex flex-col">
          <div className="mb-4">
            <Logo width={32} height={28} />
          </div>
          <h2 className="text-xl font-bold text-[#dcdca8] mb-2">
            {t("discoverTitle")}
          </h2>
          <p className="text-sm leading-relaxed max-w-[250px]">
            {t("discoverDesc")}
          </p>
        </div>

        {/* Important Links */}
        <div>
          <h3 className="text-lg font-semibold text-[#dcdca8] mb-4">
            {t("importantLinks")}
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:text-white">
                {t("home")}
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-white">
                {t("about")}
              </Link>
            </li>
            <li>
              <Link href="/training-rooms" className="hover:text-white">
                {t("training room")}
              </Link>
            </li>
            <li>
              <Link href="/tour-operators" className="hover:text-white">
                {t("restaurant")}
              </Link>
            </li>
          </ul>
        </div>

        {/* Booking */}
        <div>
          <h3 className="text-lg font-semibold text-[#dcdca8] mb-4">
            {t("booking")}
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/Accommodation/Cabins" className="hover:text-white">
                {t("cabins")}
              </Link>
            </li>
            <li>
              <Link href="/Accommodation/Tents" className="hover:text-white">
                {t("tents")}
              </Link>
            </li>
            <li>
              <Link
                href="/activities/indoor-activities"
                className="hover:text-white"
              >
                {t("indooractivities")}
              </Link>
            </li>
            <li>
              <Link
                href="/activities/outdoor-activities"
                className="hover:text-white"
              >
                {t("outdooractivities")}
              </Link>
            </li>
            <li>
              <Link
                href="/training/corporate-team-building"
                className="hover:text-white"
              >
                {t("corporateteambuilding")}
              </Link>
            </li>
            <li>
              <Link
                href="/training/schools-training"
                className="hover:text-white"
              >
                {t("schooltraining")}
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact + Social */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="">
              <h3 className="text-lg font-semibold text-[#dcdca8] mb-4">
                {t("contactUs")}
              </h3>

              {/* Email */}
              <p className="text-base flex items-center gap-2 leading-relaxed">
                <Mail size={20} className="opacity-80" />
                <a href={`mailto:${contactEmail}`} className="hover:text-white">
                  {contactEmail}
                </a>
              </p>

              {/* Phone */}
              <p className="text-base flex items-center gap-2 leading-relaxed mt-2">
                <Phone size={20} className="opacity-80" />
                <a href={`tel:${phoneNumber1}`} className="hover:text-white">
                  {phoneNumber1}
                </a>
              </p>
                <p className="text-base flex items-center gap-2 leading-relaxed mt-2">
                <Phone size={20} className="opacity-80" />
                <a href={`tel:${phoneNumber2}`} className="hover:text-white">
                  {phoneNumber2}
                </a>
              </p>
              <p className="text-base flex items-center gap-2 leading-relaxed mt-2">
                <a
                  href={locationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 "
                >
                  <MapPinIcon size={22} className="opacity-80"/>
                  <span className="hover:text-white">{isArabic ?arabicLocation:englishLocation}</span>
                </a>
              </p>
            </div>

            {/* Social Icons */}
            <div className="flex gap-3">
              {[
                { Icon: FaFacebookF, url: facebookUrl, label: "Facebook" },
                { Icon: SiX, url: twitterUrl, label: "X" },
                { Icon: FaInstagram, url: instagramUrl, label: "Instagram" },
                { Icon: FaLinkedinIn, url: linkedinUrl, label: "LinkedIn" },
               // { Icon: FaYoutube, url: youtubeUrl, label: "YouTube" },
              ].map(({ Icon, url, label }, idx) => (
                <a
                  key={idx}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                >
                  <LightButton className="px-3!">
                    <Icon size={18} />
                  </LightButton>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <hr className="border-[#dcdca8] mt-10" />

      <div className="text-center pt-5 pb-10 border-t border-white/20">
  <p className="text-sm text-white wrap-break-word">
    {isArabic ? (
      <>
        © 2025 Jordan Ranger. جميع الحقوق محفوظة. مملوك لمنتجع إيكو فيو. تم الإنشاء بواسطة{" "}
        <a
          href={nurembergUrl}
          target="_blank"
          className="underline hover:text-gray-300"
        >
          Nuremberg Group
        </a>
        .
      </>
    ) : (
      <>
        © 2025 Jordan Ranger. All rights reserved. Owned by Eco View Resort. Powered by{" "}
        <a
          href={nurembergUrl}
          target="_blank"
          className="underline hover:text-black"
        >
          Nuremberg Group
        </a>
        .
      </>
    )}
  </p>
</div>

    </footer>
  );
};

export default Footer;
