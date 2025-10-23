"use client";

import React from "react";
import { newMember } from "@/types";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Props = {
  member: newMember;
  locale: string;
};

export default function MemberDialog({ member, locale }: Props) {
  const isArabic = locale === "ar";

  const name = isArabic ? member.name_ar : member.name_en;
  const position = isArabic ? member.position_ar : member.position_en;
  const description = isArabic ? member.description_ar || "" : member.description_en || "";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className={`p-0 underline underline-offset-2 cursor-pointer ${
            isArabic ? "text-white text-sm" : "text-white text-xs"
          }`}
        >
          {isArabic ? "اعرف المزيد" : "See More"}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto bg-white rounded-lg shadow-lg">
        <DialogHeader>
          <div
            className={`flex items-center ${
              isArabic ? "flex-row-reverse space-x-reverse space-x-4" : "space-x-4"
            }`}
          >
            <img
              src={member.image}
              alt={name}
              className="w-20 h-20 rounded-full object-cover border-2 border-[#125892]"
            />
            <div className="flex flex-col">
              <DialogTitle className="text-lg font-bold text-[#125892]">{name}</DialogTitle>
              <DialogDescription className="text-gray-600">{position}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4 whitespace-pre-line text-gray-700 text-sm">{description}</div>
      </DialogContent>
    </Dialog>
  );
}
