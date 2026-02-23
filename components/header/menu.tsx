"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import LanguageSwitcher from "./languageSwitcher";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useSession, signOut } from "next-auth/react";
import { Inter, Cairo } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
const cairo = Cairo({ subsets: ["arabic"], weight: ["400", "700"] });

type UserShape = {
  id?: string | number;
  role?: string;
  email?: string;
  name?: string;
};

export default function Menu({
  currentUser,
}: {
  currentUser?: UserShape | null;
}) {
  const t = useTranslations("Navbar");
  const locale = useLocale();
  const isArabic = locale === "ar";
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  const isLoggedIn = !!(
    session?.user &&
    (session?.user.id || session?.user.email)
  );

  const isAdmin = session?.user.role === "admin";

  const closeMenu = () => setOpen(false);

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
    setOpen(false);
  };

  const oliveHeader = "text-lg font-semibold text-[#676e32]";
  const oliveSub =
    "pl-4 text-[15px] text-gray-700 hover:text-[#676e32] transition";
  const blackHeader = "text-lg font-semibold text-[#676e32]";
  const blackSub =
    "pl-4 text-[15px] text-gray-900 hover:text-black transition";

  const aboutItems = [
    { href: "/about-jordan-ranger", label: t("aboutus") },
    { href: "/our-clients", label: t("ourclients") },
    { href: "/contact-us", label: t("contactus") },
  ];

  const activityItems = [
    { href: "/activities/indoor-activities", label: t("indooractivities") },
    { href: "/activities/outdoor-activities", label: t("outdooractivities") },
  ];

  const accommodationItems = [
    { href: "/Accommodation/Cabins", label: t("cabins") },
    { href: "/Accommodation/Tents", label: t("tents") },
  ];

  const rangerAcademyItems = [
    { href: "/training/schools-training", label: t("schooltraining") },
    {
      href: "/training/corporate-team-building",
      label: t("corporateteambuilding"),
    },
  ];

  const facilitiesItems = [
    { href: "/training-room", label: t("training room") },
    { href: "/tour-operators", label: t("tour operators") },
  ];

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger className="p-2 text-white">☰</SheetTrigger>

        <SheetContent
          className={`p-2 bg-white shadow-xl max-h-[calc(100vh-4rem)] overflow-y-auto ${
            isArabic ? cairo.className : inter.className
          }`}
          style={{ direction: isArabic ? "rtl" : "ltr" }}
        >
          <div
            className={`w-full flex ${
              isArabic ? "justify-end" : "justify-start"
            }`}
          >
            <LanguageSwitcher />
          </div>

          <SheetHeader>
            <nav className="flex flex-col space-y-2.5">
              <Link onClick={closeMenu} href="/" className={oliveHeader}>
                {t("home")}
              </Link>

              <div>
                <div className={oliveHeader}>{t("about")}</div>
                <div className="mt-2 flex flex-col space-y-2">
                  {aboutItems.map((it, i) => (
                    <Link
                      key={i}
                      onClick={closeMenu}
                      href={it.href}
                      className={oliveSub}
                    >
                      {it.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <div className={oliveHeader}>{t("activities")}</div>
                <div className="mt-2 flex flex-col space-y-2">
                  {activityItems.map((it, i) => (
                    <Link
                      key={i}
                      onClick={closeMenu}
                      href={it.href}
                      className={oliveSub}
                    >
                      {it.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <div className={oliveHeader}>{t("accommodation")}</div>
                <div className="mt-2 flex flex-col space-y-2">
                  {accommodationItems.map((it, i) => (
                    <Link
                      key={i}
                      onClick={closeMenu}
                      href={it.href}
                      className={oliveSub}
                    >
                      {it.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <div className={oliveHeader}>{t("rangeracademy")}</div>
                <div className="mt-2 flex flex-col space-y-2">
                  {rangerAcademyItems.map((it, i) => (
                    <Link
                      key={i}
                      onClick={closeMenu}
                      href={it.href}
                      className={oliveSub}
                    >
                      {it.label}
                    </Link>
                  ))}
                </div>
              </div>

              <Link
                onClick={closeMenu}
                href="/restaurant"
                className={oliveHeader}
              >
                {t("restaurant")}
              </Link>
            </nav>

            <hr className="my-5 border-t border-gray-200" />

            <nav className="flex flex-col space-y-4">
              <Link
                onClick={closeMenu}
                href="/summer-program"
                className={blackHeader}
              >
                {t("summer program")}
              </Link>

              <Link
                onClick={closeMenu}
                href="/roots-of-our-civilization"
                className={blackHeader}
              >
                {t("Roots Of Our Civilization")}
              </Link>

              <Link
                onClick={closeMenu}
                href="/Orienteering/"
                className={blackHeader}
              >
                {t("Orienteering")}
              </Link>

              <div>
                <div className={blackHeader}>{t("facilities")}</div>
                <div className="mt-2 flex flex-col space-y-2">
                  {facilitiesItems.map((it, i) => (
                    <Link
                      key={i}
                      onClick={closeMenu}
                      href={it.href}
                      className={blackSub}
                    >
                      {it.label}
                    </Link>
                  ))}
                </div>
              </div>
            </nav>

            <hr className="my-5 border-t border-gray-200" />

            <div>
              <div className="text-lg font-semibold text-[#676e32]">
                {t("myaccount")}
              </div>

              <div className="mt-2 flex flex-col space-y-2">
                <Link onClick={closeMenu} href="/my-cart" className={oliveSub}>
                  {t("mycart") ?? "My Cart"}
                </Link>

                <Link
                  onClick={closeMenu}
                  href="/my-bookings"
                  className={oliveSub}
                >
                  {t("mybookings") ?? "My Bookings"}
                </Link>

                {isAdmin && (
                  <Link
                    onClick={closeMenu}
                    href="/admin/dashboard"
                    className={blackSub}
                  >
                    {t("dashboard") ?? "Dashboard"}
                  </Link>
                )}

                {isLoggedIn ? (
                  <>
                    <Link
                      onClick={closeMenu}
                      href="/change-password"
                      className={oliveSub}
                    >
                      {t("changepassword") ?? "Change Password"}
                    </Link>

                    <button
                      onClick={handleLogout}
                      className={`${
                        isArabic ? "text-right" : "text-left"
                      } pl-4 text-[15px]`}
                    >
                      {t("logout") ?? "Logout"}
                    </button>
                  </>
                ) : (
                  <Link
                    onClick={closeMenu}
                    href="/login"
                    className={`${
                      isArabic ? "text-right" : "text-left"
                    } pl-4 text-[15px]`}
                  >
                    {t("login") ?? "Login"}
                  </Link>
                )}
              </div>
            </div>

            <SheetDescription className="mt-6 text-sm text-gray-500">
              {t("menuDescription")}
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
}