"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

type Props = {
  size?: number;
  pulseCount?: number;
  targetId?: string;
  locale: string;
};

export default function FlashPulseComingSoon({
  size = 110,
  pulseCount = 10,
  targetId = "coming-soon",
  locale,
}: Props) {
  const rootRef = useRef<HTMLButtonElement | null>(null);
  const centerRef = useRef<HTMLDivElement | null>(null);
  const ringsRef = useRef<HTMLDivElement[]>([]);
  const isArabic = locale === "ar";

  ringsRef.current = ringsRef.current.slice(0, pulseCount);
  const addRingRef = (el: HTMLDivElement | null) => {
    if (!el) return;
    if (!ringsRef.current.includes(el)) ringsRef.current.push(el);
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

    // ripple animation (circular waves)
    tl.add(() => {
      const rings = ringsRef.current;
      gsap.set(rings, { scale: 0.2, opacity: 0.8, display: "block" });
      gsap.to(rings, {
        scale: (i) => 2 + i * 0.1,
        opacity: 0,
        duration: 1.2,
        ease: "power2.out",
        stagger: 0.18,
        borderRadius: "50%",
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
      aria-label={isArabic ? "قريباً" : "Coming Soon Activities"}
      className="relative flex items-center justify-center rounded-full focus:outline-none focus:ring-4 focus:ring-offset-2"
      style={{
        ["--fp-size"]: `clamp(48px, 20vw, ${size}px)`,
        width: "var(--fp-size)",
        height: "var(--fp-size)",
        outline: "none",
        boxShadow: "none",
      } as React.CSSProperties}
    >
      {/* Ripple rings (circular) */}
      {Array.from({ length: pulseCount }).map((_, i) => (
        <div
          key={i}
          ref={addRingRef}
          aria-hidden
          className="absolute pointer-events-none"
          style={{
            width: "100%",
            height: "100%",
            borderWidth: "calc(var(--fp-size) * 0.03)",
            borderStyle: "solid",
            borderColor: "#9f721fff",
            borderRadius: "50%", // دائري
            transformOrigin: "50% 50%",
            opacity: 0,
            display: "none",
            boxShadow: "0 10px 25px #9f721f55",
          }}
        />
      ))}

      {/* Center circle */}
      <div
        ref={centerRef}
        className="relative rounded-full flex items-center justify-center text-white select-none"
        style={{
          width: "70%",
          height: "70%",
          background: "linear-gradient(135deg, #cfa45bff, #9f721fff, #7c5711ff)",
          boxShadow: "0 8px 28px #cfa45b77, 0 0 50px #9f721f66",
        }}
      >
        <span className="font-bold uppercase leading-none text-[10px] md:text-xs lg:text-sm">
          {isArabic ? "قريباً" : "Coming Soon"}
        </span>
      </div>

      {/* optional glow halo */}
      <span
        aria-hidden
        className="absolute rounded-full pointer-events-none"
        style={{
          width: "160%",
          height: "160%",
          boxShadow: "0 25px 60px #9f721f44, 0 0 30px #cfa45b55",
          filter: "blur(8px)",
          borderRadius: "50%", // دائري
        }}
      />
    </button>
  );
}
