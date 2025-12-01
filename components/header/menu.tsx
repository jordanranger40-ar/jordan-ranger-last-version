"use client";

import React from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import LanguageSwitcher from "./languageSwitcher";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Menu() {
  const t = useTranslations("Navbar");
  const locale = useLocale();
  const isArabic = locale === "ar";
  const aboutItems = [
    { href: "/about-jordan-ranger", label: t("aboutus") },
    { href: "/our-clients", label: t("ourclients") },
    { href: "/contact-us", label: t("contactus") },
  ];

  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger className="p-2">
          <button aria-label={t("menu")}>☰</button>
        </SheetTrigger>

        <SheetContent
          className="p-4"
          style={{ direction: isArabic ? "rtl" : "ltr" }}
        >
          <div
            className={`w-full mb-4 flex ${
              isArabic ? "justify-end" : "justify-start"
            }`}
          >
            <LanguageSwitcher />
          </div>

          <SheetHeader>
            <SheetTitle>{t("menu")}</SheetTitle>

            <nav className="flex flex-col space-y-4 mt-4">
              <Link href="/" className="text-lg font-semibold">
                {t("home")}
              </Link>

              <div>
                <div className="font-semibold">{t("about")}</div>
                <div className="mt-2 flex flex-col space-y-2">
                  {aboutItems.map((ele, i) => (
                    <Link href={ele.href} className="pl-4" key={i}>
                      {ele.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-semibold">{t("activities")}</div>
                <div className="mt-2 flex flex-col space-y-2">
                  <Link href={`/activities/indoor-activities`} className="pl-4">
                    {isArabic ? "الأنشطة الداخلية" : "Indoor Activities"}
                  </Link>
                  <Link
                    href={`/activities/outdoor-activities`}
                    className="pl-4"
                  >
                    {isArabic ? "الأنشطة الخارجية" : "Outdoor Activities"}
                  </Link>
                </div>
              </div>

              <div>
                <div className="font-semibold">{t("accommodation")}</div>
                <div className="mt-2 flex flex-col space-y-2">
                  <Link href={`/accommodation/Cabins`} className="pl-4">
                    {isArabic ? "الغرف" : "Cabins"}
                  </Link>
                  <Link href={`/accommodation/Tents`} className="pl-4">
                    {isArabic ? "الخيام" : "Tents"}
                  </Link>
                </div>
              </div>

              <div>
                <div className="font-semibold">{t("rangeracademy")}</div>
                <div className="mt-2 flex flex-col space-y-2">
                  <Link href={`/training/schools-training`} className="pl-4">
                    {isArabic ? "التدريب المدرسي" : "School Training"}
                  </Link>
                  <Link
                    href={`/training/corporate-team-building`}
                    className="pl-4"
                  >
                    {isArabic ? "بناء فرق الشركات" : "Corporate Team Building"}
                  </Link>
                </div>
              </div>

              <Link href="/restaurant" className="text-lg font-semibold">
                {t("restaurant")}
              </Link>
            </nav>

            <SheetDescription className="mt-6">
              {t("menuDescription")}
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
}
