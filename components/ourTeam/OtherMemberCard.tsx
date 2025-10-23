import React from "react";
import { newMember } from "@/types";
import MemberDialog from "./MemberDialog";

type Props = {
  member: newMember;
  locale: string;
};

export default function OtherMemberCard({ member, locale }: Props) {
  const isArabic = locale === "ar";

  const name = isArabic ? member.name_ar : member.name_en;
  const position = isArabic ? member.position_ar : member.position_en;
  const description = isArabic ? member.description_ar || "" : member.description_en || "";

  const shortDesc = description.length > 75 ? description.slice(0, 75) + "..." : description;
  const hasLongDesc = description.length > 75;

  return (
    <div className="w-[200px] min-h-[60px] flex-shrink-0">
      <div className="flex flex-col items-center text-center p-6 rounded-lg shadow-md bg-white border border-gray-300 transform transition-transform duration-300 hover:scale-105 hover:shadow-lg cursor-pointer">
        <div className="w-[100px] h-[100px] rounded-full overflow-hidden shadow-sm mb-4 border-2 border-[#125892]">
          <img src={member.image} alt={name} className="w-full h-full object-cover" />
        </div>

        <p className="text-md font-semibold text-[#125892] mb-1">{name}</p>
        <p className="text-gray-600 mb-3">{position}</p>
        <p className="text-gray-500 text-xs leading-snug">
          {shortDesc}{" "}
          {hasLongDesc && <MemberDialog member={member} locale={locale} />}
        </p>
      </div>
    </div>
  );
}
