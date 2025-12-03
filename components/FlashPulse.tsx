"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

type Props = {
  size?: number; // diameter of the outer container
  pulseCount?: number; // number of ripple rings
  targetId?: string; // id of the section to scroll to
  locale:string
};

export default function FlashPulseComingSoon({
  size = 110,
  pulseCount = 10,
  targetId = "coming-soon",
  locale
}: Props) {
  const rootRef = useRef<HTMLButtonElement | null>(null);
  const centerRef = useRef<HTMLDivElement | null>(null);
  const ringsRef = useRef<HTMLDivElement[]>([]);
  const isArabic= locale==="ar"
  ringsRef.current = [];
  const addRingRef = (el: HTMLDivElement | null) => {
    if (!el) return;
    ringsRef.current.push(el);
  };

  useEffect(() => {
    if (!rootRef.current || !centerRef.current) return;

    const tl = gsap.timeline({ repeat: -1 });

    // center pulse
    tl.to(centerRef.current, {
      scale: 1.3,
      duration: 0.4,
      ease: "power1.inOut",
      yoyo: true,
      repeat: 5,
    });

    // ripple animation
    tl.add(() => {
      const rings = ringsRef.current;
      gsap.set(rings, { scale: 0.2, opacity: 0.8, display: "block" });
      gsap.to(rings, {
        scale: (i) => 2 + i * 0.1,
        opacity: 0,
        duration: 1.2,
        ease: "power2.out",
        stagger: 0.18,
        onComplete() {
          gsap.set(rings, { display: "none" });
        },
      });
    }, ">-0.2");

    // final pop
    tl.to(centerRef.current, {
      scale: 1,
      duration: 0.1,
      ease: "elastic.out(1, 0.5)",
    });

    tl.to({}, { duration: 0.9 });

    return () => {
      tl.kill();
      gsap.killTweensOf([centerRef.current, ...ringsRef.current]);
    };
  }, []);

  const handleClick = () => {
    const target = document.getElementById(targetId);
    if (!target) return;

    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <button
      ref={rootRef}
      onClick={handleClick}
      aria-label="Coming Soon Activities"
      className="relative flex items-center justify-center rounded-full focus:outline-none focus:ring-4 focus:ring-offset-2"
      style={{
        width: size,
        height: size,
        outline: "none",
        boxShadow: "none",
      }}
    >
      {/* Ripple rings */}
      {Array.from({ length: pulseCount }).map((_, i) => (
        <div
          key={i}
          ref={addRingRef}
          aria-hidden
          className="absolute rounded-full pointer-events-none"
          style={{
            width: "100%",
            height: "100%",
            borderWidth: 3,
            borderStyle: "solid",
            borderColor: "#FFD700",
            transformOrigin: "50% 50%",
            opacity: 0,
            display: "none",
            boxShadow: "0 10px 25px #FFD70055",
          }}
        />
      ))}

      {/* Center circle */}
      <div
        ref={centerRef}
        className="relative rounded-full flex items-center text-xs md:text-sm justify-center text-white select-none"
        style={{
          width: "70%",
          height: "70%",
          background: "linear-gradient(45deg, #FFD700, #FFA500, #FF4500)",
          boxShadow: "0 8px 28px #FFAA0077, 0 0 50px #FFD70066",
        }}
      >
        <span className="text-sm md:text-base font-bold uppercase">
          {isArabic?"قريباً":"Coming Soon"}
        </span>
      </div>

      {/* optional glow halo */}
      <span
        aria-hidden
        className="absolute rounded-full pointer-events-none"
        style={{
          width: "160%",
          height: "160%",
          boxShadow: "0 25px 60px #FFD70044, 0 0 30px #FFA50055",
          filter: "blur(8px)",
        }}
      />
    </button>
  );
}
