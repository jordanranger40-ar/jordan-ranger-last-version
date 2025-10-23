"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface CardsWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export default function CardsWrapper({ children, className }: CardsWrapperProps) {
  return (
    <div className="w-full flex justify-center">
      <div
        className={cn(
          "w-full max-w-screen-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-6 md:px-8 py-8",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}
