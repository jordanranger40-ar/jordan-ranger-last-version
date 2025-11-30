"use client";

import React from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";

import { newCategory, newTraining } from "@/types";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

type Props = {
  categories: newCategory[];
  trainingData: newTraining[];
};



export default function Navbar({ categories, trainingData }: Props) {
  const t = useTranslations("Navbar");
  const locale = useLocale();
  const isArabic = locale === "ar";

  const aboutItems = [
    {
      href: "/about-jordan-ranger",
      label: t("aboutus"),
    },
    {
      href: "/our-clients",
      label: t("ourclients"),
    },
    {
      href: "/contact-us",
      label: t("contactus"),
    },
  ];
  const rangerAcademyItams = [
    {
      href: "/training/school-training",
      label: t("schooltraining"),
    },
    {
      href: "/training/corporate-team-building",
      label: t("corporateteambuilding"),
    },
 
  ];
  const accommodationItems = [
    {
      href: "/Accommodation/Cabins",
      label: t("cabins"),
    },
    {
      href: "/Accommodation/Tents",
      label: t("tents"),
    },
   
  ];

  const activityItems = [
    {
      href: "/activities/indoor-activities",
      label: t("indooractivities"),
    },
    {
      href: "/activities/outdoor-activities",
      label: t("outdooractivities"),
    },
  ];

  const menuItems = [
    {
      type: "link",
      href: "/",
      label: t("home"),
      key: "home",
    },
    {
      type: "dropdown",
      label: t("about"),
      key: "about",
      content: aboutItems.map((item, index) => (
        <NavigationMenuLink asChild key={index}>
          <Link href={item.href}>{item.label}</Link>
        </NavigationMenuLink>
      )),
    },

   
    {
      type: "dropdown",
      label: t("activities"),
      key: "activities",

      content: activityItems.map((item, index) => (
        <NavigationMenuLink asChild key={index}>
          <Link href={item.href}>{item.label}</Link>
        </NavigationMenuLink>
      )),
    },
    {
      type: "dropdown",
      label: t("accommodation"),
      key: "accommodation",

      content: accommodationItems.map((item, index) => (
        <NavigationMenuLink asChild key={index}>
          <Link href={item.href}>{item.label}</Link>
        </NavigationMenuLink>
      )),
    },
    {
      type: "dropdown",
      label: t("rangeracademy"),
      key: "rangeracademy",

      content: rangerAcademyItams.map((item, index) => (
        <NavigationMenuLink asChild key={index}>
          <Link href={item.href}>{item.label}</Link>
        </NavigationMenuLink>
      )),
    },
    {
      type: "link",
      href: "/restaurant/",
      label: t("restaurant"),
      key: "restaurant",
    },
  ];

  const finalMenu = isArabic ? [...menuItems].reverse() : menuItems;

  return (
    <NavigationMenu
      viewport={false}
      className="text-white focus:text-white"
      style={{ direction: isArabic ? "rtl" : "ltr" }}
    >
      <NavigationMenuList className="flex-row">
        {finalMenu.map((item) => {
          if (item.type === "link") {
            return (
              <NavigationMenuItem key={item.key}>
                <NavigationMenuLink asChild className="bg-transparent">
                  <Link
                    className={navigationMenuTriggerStyle()}
                    href={item.href ?? "/"}
                  >
                    {item.label}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            );
          }

          if (item.type === "dropdown") {
            return (
              <NavigationMenuItem key={item.key}>
                <NavigationMenuTrigger className="bg-transparent">
                  {item.label}
                </NavigationMenuTrigger>
                <NavigationMenuContent
                  className={`grid gap-3 p-4 md:w-[400px] lg:w-[250px] ${
                    isArabic ? "text-right" : "text-left"
                  }`}
                >
                  {item.content}
                </NavigationMenuContent>
              </NavigationMenuItem>
            );
          }

          return null;
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
