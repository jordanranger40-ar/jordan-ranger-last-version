"use client";

import React from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";


export default function Navbar() {
  const t = useTranslations("Navbar");
  const locale = useLocale();
  const isArabic = locale === "ar";

  
  const facilitiesItems = [
    {
      href: "/training-room",
      label: t("training room"),
    },
    {
      href: "/tour-operators",
      label: t("tour operators"),
    },

  ];

  const menuItems = [
    {
      type: "link",
      href: "/Ranger-Camp-Activity",
      label: t("Ranger Camp Activity"),
      key: "Ranger Camp Activity",
    },
    {
      type: "dropdown",
      label: t("facilities"),
      key: "facilities",
      content: facilitiesItems.map((item, index) => (
        <NavigationMenuLink asChild key={index}>
          <Link href={item.href}>{item.label}</Link>
        </NavigationMenuLink>
      )),
    },
    {
      type: "link",
      href: "/expedition-activities/",
      label: t("expedition activities"),
      key: "expedition activities",
    },
    {
      type: "link",
      href: "/Orienteering/",
      label: t("Orienteering"),
      key: "Orienteering",
    },
  ];

  const finalMenu = isArabic ? [...menuItems].reverse() : menuItems;

  return (
    <NavigationMenu
      viewport={false}
      className="text-white focus:text-white hidden md:block "
      style={{ direction: isArabic ? "rtl" : "ltr" }}
    >
      <NavigationMenuList className="flex-row">
        {finalMenu.map((item) => {
          if (item.type === "link") {
            return (
              <NavigationMenuItem key={item.key}>
                <NavigationMenuLink asChild className="bg-transparent ">
                  <Link className={navigationMenuTriggerStyle()} href={item.href ?? "/"}>
                    {item.label}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            );
          } else if (item.type === "dropdown") {
            return (
              <NavigationMenuItem key={item.key} >
                <NavigationMenuTrigger className="bg-transparent ">{item.label}</NavigationMenuTrigger>
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
