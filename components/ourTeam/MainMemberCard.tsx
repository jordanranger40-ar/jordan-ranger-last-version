import React from "react";
import { newMember } from "@/types";
import MemberDialog from "./MemberDialog";

type Props = {
  member: newMember;
  locale: string;
};

export default function MainMemberCard({ member, locale }: Props) {
  const isArabic = locale === "ar";

  const name = isArabic ? member.name_ar : member.name_en;
  const position = isArabic ? member.position_ar : member.position_en;
  const description = isArabic ? member.description_ar || "" : member.description_en || "";

  const shortDesc = description.length > 100 ? description.slice(0, 95) + "..." : description;
  const hasLongDesc = description.length > 100;

  return (
    <div className="w-[280px] min-h-[75px]">
      <div className="flex flex-col items-center text-center p-8 rounded-xl shadow-md bg-[#125892] border-2 border-gray-300 transform transition-transform duration-300 hover:scale-105 hover:shadow-lg cursor-pointer">
        <div className="w-[130px] h-[130px] rounded-full overflow-hidden shadow-sm mb-5 border-4 border-white">
          <img src={member.image} alt={name} className="w-full h-full object-cover" />
        </div>

        <p className="text-lg font-extrabold text-white mb-1">{name}</p>
        <p className="text-gray-300 mb-4">{position}</p>
        <p className="text-gray-200 text-sm leading-relaxed mb-4">
          {shortDesc}{" "}
          {hasLongDesc && <MemberDialog member={member} locale={locale} />}
        </p>
      </div>
    </div>
  );
}
