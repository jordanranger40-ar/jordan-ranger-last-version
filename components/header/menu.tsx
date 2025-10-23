"use client";

import React from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ModeToggle from "./modetoggle";
import type { newCategory, newTraining } from "@/types";

type Props = {
  categories: newCategory[];
  trainingData: newTraining[];
};

export default function Menu({ categories, trainingData }: Props) {
  const t = useTranslations("Navbar");
  const locale = useLocale();
  const isArabic = locale === "ar";

  const getCategoryName = (item: newCategory) =>
    isArabic ? item.category_name_ar ?? item.category_name_en : item.category_name_en;

  const getTrainingName = (item: newTraining) =>
    isArabic ? item.name_ar ?? item.name_en : item.name_en;

  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger className="p-2">
          {t("menu")}
        </SheetTrigger>
        <SheetContent
          className="p-4"
          style={{ direction: isArabic ? "rtl" : "ltr" }}
        >
          <SheetHeader>
            <SheetTitle>{t("menu")}</SheetTitle>
            <div className="my-4">
              <ModeToggle />
            </div>

            <nav className="flex flex-col space-y-4">
              <Link href="/" className="text-lg font-semibold">
                {t("home")}
              </Link>

              <div>
                <div className="font-semibold">{t("accommodation")}</div>
                <div className="mt-2 flex flex-col space-y-2">
                  {categories.map((item) => (
                    <Link
                      key={item.slug}
                      href={`/accommodation/${item.slug}`}
                      className="pl-4"
                    >
                      {getCategoryName(item)}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-semibold">{t("training")}</div>
                <div className="mt-2 flex flex-col space-y-2">
                  {trainingData.map((item) => (
                    <Link
                      key={item.id}
                      href={`/Training/${item.id}`}
                      className="pl-4"
                    >
                      {getTrainingName(item)}
                    </Link>
                  ))}
                </div>
              </div>

              <Link href="/about" className="text-lg font-semibold">
                {t("about")}
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
