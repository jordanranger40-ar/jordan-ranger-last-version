'use client';

import React from 'react';

export default function Bannercards() {
  const cardItems = [
    { label: 'Tent', icon: '🏕️', color: '#515151' },
    { label: 'Hiking', icon: '🥾', color: '#b3c820ff' },
    { label: 'Cooking', icon: '🍳', color: '#676e32' },
    { label: 'Telescope', icon: '🔭', color: '#9f721fff' },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-8 px-4 mb-16 perspective-1000">
      {cardItems.map((item, index) => (
        <div
          key={index}
          className="relative h-64 w-[90vw] sm:w-[42vw] md:w-[22vw] overflow-hidden group transition-transform duration-500 transform-gpu hover:scale-105 hover:rotate-1"
          style={{
            backgroundColor: item.color,
            borderRadius: '2rem 0.5rem 2rem 0.5rem',
            boxShadow: '0 6px 20px rgba(0,0,0,0.25)', 
          }}
        >
          {/* محتوى البطاقة */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center p-6 gap-3 transform transition-transform duration-500 group-hover:-translate-y-2">
            <div className="text-6xl text-white drop-shadow-lg">{item.icon}</div>
            <div className="text-white text-2xl font-bold tracking-wide">{item.label}</div>
            <div className="text-sm text-white/80 italic">
              Explore {item.label.toLowerCase()} in style
            </div>
          </div>

          {/* shine subtle عند hover */}
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-40 transition duration-500"
              style={{ borderRadius: '2rem 0.5rem 2rem 0.5rem' }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
