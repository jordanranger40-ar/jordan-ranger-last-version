import React from 'react'
import Image from 'next/image'
import logo1 from "@/public/images/logo1.png"
import logo2 from "@/public/images/logo2.png"

export default function Logo() {
  return (
    <div className="relative w-24 h-16 group overflow-hidden flex items-center justify-center ml-4">
      <Image
        src={logo1}
        alt="Logo 1"
        className="w-full h-full object-contain transition-opacity duration-300 group-hover:opacity-0"
        fill={false}
        priority
      />
      <Image
        src={logo2}
        alt="Logo 2"
        className="w-full h-full object-contain absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
        fill={false}
        priority
      />
    </div>
  )
}
