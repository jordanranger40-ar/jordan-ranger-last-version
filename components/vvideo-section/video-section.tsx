import React from 'react';

export default function VideoSection() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <video
        src="/vedios/home.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      {/* محتوى آخر فوق الفيديو */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <h1 className="text-white text-4xl font-bold">مرحبا بك</h1>
      </div>
    </div>
  );
}
