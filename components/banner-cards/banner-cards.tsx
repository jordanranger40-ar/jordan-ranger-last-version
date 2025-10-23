'use client';

import React from 'react';

const cardItems = [
  { label: 'Tent', color: '#515151' },
  { label: 'Hiking', color: '#b3c820ff' },
  { label: 'Cooking', color: '#676e32' },
  { label: 'Telescope', color: '#9f721fff' },
];

export default function Bannercards() {
  return (
    <div className="flex justify-center items-start flex-wrap gap-6 mb-16 px-4">
      {cardItems.map((item, index) => (
        <div
          key={index}
          className="relative h-52 w-[90vw] sm:w-[40vw] md:w-[22vw] rounded-3xl shadow-xl overflow-hidden group transform transition duration-300 hover:scale-105"
          style={{ backgroundColor: item.color }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition duration-300" />

          {/* Card Content */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full p-4 text-center gap-2">
            {/* Emoji on top */}
            <div className="text-white text-opacity-30 text-5xl">
              {String.fromCodePoint(0x1F3D5 + index)}
            </div>

            <div className="text-white text-3xl font-bold drop-shadow-md">
              {item.label}
            </div>

            <div className="text-sm text-white/80">
              Explore the best {item.label.toLowerCase()} experiences
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
