"use client";

import React from "react";
import { newMember } from "@/types";
import { useLocale } from "next-intl";

import MainMemberCard from "./MainMemberCard";
import OtherMemberCard from "./OtherMemberCard";

type Props = {
  members: newMember[];
};

export default function OurTeamPage({ members }: Props) {
  const locale = useLocale();
  const isArabic = locale === "ar";

  const mainMembers = members.filter((member) => member.main === true);
  const otherMembers = members.filter((member) => member.main !== true);

  const title = isArabic ? "فريقنا" : "Our Team";

  return (
    <main className="max-w-[1380px] mx-auto my-16 px-6 md:px-12  mt-20">
      <h1
        className={`text-4xl md:text-6xl font-extrabold text-center text-[#125892] mb-16 leading-tight ${
          isArabic ? "font-almarai" : ""
        }`}
      >
        {title}
      </h1>

      {/* Main Members */}
      {mainMembers.length > 0 && (
        <section className="mb-24">
          <h2
            className={`text-2xl md:text-3xl font-semibold mb-10 text-center text-[#0e3e62] ${
              isArabic ? "font-almarai" : ""
            }`}
          >
            {isArabic ? "الأعضاء الرئيسيون" : "Key Members"}
          </h2>

          <div className="flex flex-row justify-center flex-wrap gap-8">
            {mainMembers.map((member) => (
              <MainMemberCard
                key={member.id}
                member={member}
                locale={locale}
              />
            ))}
          </div>
        </section>
      )}

      {/* Other Members */}
      {otherMembers.length > 0 && (
        <section>
          <h2
            className={`text-2xl md:text-3xl font-semibold mb-10 text-center text-[#0e3e62] ${
              isArabic ? "font-almarai" : ""
            }`}
          >
            {isArabic ? "الأعضاء الآخرون" : "Other Members"}
          </h2>

          {otherMembers.length < 3 ? (
            <div className="flex justify-center gap-10">
              {otherMembers.map((member) => (
                <OtherMemberCard
                  key={member.id}
                  member={member}
                  locale={locale}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
              {otherMembers.map((member) => (
                <OtherMemberCard
                  key={member.id}
                  member={member}
                  locale={locale}
                />
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  );
}
