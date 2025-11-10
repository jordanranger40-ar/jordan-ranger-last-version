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
      className="px-5 py-2 bg-[#676e32] text-white mb-20 font-medium rounded-md cursor-pointer hover:bg-[#7b8444] transition"
    >
      {value}
    </button>
  );
}
