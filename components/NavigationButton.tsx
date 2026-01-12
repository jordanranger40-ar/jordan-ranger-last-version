"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation";

interface NavigationButtonProps {
  routeName: string;
  value: string;
}

export default function NavigationButton({ routeName, value }: NavigationButtonProps) {
  const router = useRouter();
  const pathname = usePathname(); // e.g. "/dashboard/rooms"

  const handleClick = () => {
    // Ensure there’s no double slash if routeName starts with "/"
    const normalizedRoute =
      routeName.startsWith("/")
        ? `${pathname}${routeName}`
        : `${pathname}/${routeName}`;

    router.push(normalizedRoute);
  };

  return (
    <button
      onClick={handleClick}
      className={`mt-4 px-6 py-3 bg-[#484d23] text-white mb-10 font-semibold rounded-full shadow-md 
                 hover:bg-[#5a5e3a] hover:text-[#fdfdfd] hover:scale-105 
                 transition-all duration-300 `}
    >
      {value}
    </button>
  );
}
