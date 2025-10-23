"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface CardsWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export default function CardsWrapper({ children, className }: CardsWrapperProps) {
  return (
    <div className="w-full flex flex-col text-center bg-white mt-10 mb-10 px-4 sm:px-10 py-10 rounded-[150px] shadow-lg">

        <section className="text-4xl font-bold text-[#125892]  ">OUR NUMBERS</section>
        <section className="text-xl text-gray-500 mt-2 mb-10">Some impressive numbers that speak for themselves</section>
      <div
        className={cn(
          "w-[100%] ",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}
