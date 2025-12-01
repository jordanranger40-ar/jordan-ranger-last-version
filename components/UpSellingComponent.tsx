"use client";

import React, { useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import gsap from "gsap";

type ServiceKey = "room" | "activity" | "training";

interface Props {
  uniqueTypes?: string[]; // booked services
  locale?: string;
  className?: string;
  routes?: Partial<Record<ServiceKey, string>>;
  /**
   * The current page/service type to exclude from suggestions
   */
  currentType?: ServiceKey;
}

const DEFAULT_ROUTES: Record<ServiceKey, string> = {
  room: "/rooms",
  activity: "/activities",
  training: "/trainings",
};

export default function UpSellingComponent({
  uniqueTypes = [],
  locale = "en",
  className = "",
  routes = {},
  currentType,
}: Props) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animationRefs = useRef<gsap.core.Tween[]>([]);

  // Normalize booked service types
  const booked = useMemo(
    () =>
      Array.from(
        new Set(
          (uniqueTypes || []).map((t) =>
            typeof t === "string" ? t.trim().toLowerCase() : ""
          )
        )
      ) as ServiceKey[],
    [uniqueTypes]
  );

  // Priority/order of services to suggest
  const services: ServiceKey[] = ["room", "activity", "training"];

  const messages: Record<
    ServiceKey,
    { title: { en: string; ar: string }; description: { en: string; ar: string } }
  > = {
    room: {
      title: { en: "Explore Rooms", ar: "استكشف الغرف" },
      description: {
        en: "Find a comfortable room for your stay.",
        ar: "اعثر على غرفة مريحة لإقامتك.",
      },
    },
    activity: {
      title: { en: "Explore Activities", ar: "استكشف الأنشطة" },
      description: {
        en: "See activities and experiences you may like.",
        ar: "اطّلع على الأنشطة والتجارب التي قد تعجبك.",
      },
    },
    training: {
      title: { en: "Explore Trainings", ar: "استكشف التدريبات" },
      description: {
        en: "Check available trainings and skill sessions.",
        ar: "تحقق من التدريبات وجلسات المهارات المتاحة.",
      },
    },
  };

  // Filter out booked services and the current page type
  const missingServices = services.filter(
    (s) => !booked.includes(s) && s !== currentType
  );

  const missingService = missingServices.length > 0 ? missingServices[0] : null;

  // ---- ALWAYS call useEffect at top level ----
  useEffect(() => {
    if (!missingService) return; // early exit, hook is still called

    const container = containerRef.current;
    if (!container) return;

    const cards = Array.from(
      container.querySelectorAll<HTMLElement>(".upsell-card")
    );

    // Kill previous animations
    animationRefs.current.forEach((t) => t.kill());
    animationRefs.current = [];

    // Initial fade-in animation
    gsap.fromTo(
      cards,
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" }
    );

    // Looping hover-like animation
    cards.forEach((card, i) => {
      const tween = gsap.to(card, {
        scale: 1.02,
        backgroundColor: "#ffffff",
        duration: 1.2 + i * 0.1,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        keyframes: [
          { backgroundColor: "#ffeaea", duration: 0.6 },
          { backgroundColor: "#ffffff", duration: 0.6 },
        ],
      });
      animationRefs.current.push(tween);
    });

    return () => {
      animationRefs.current.forEach((t) => t.kill());
      animationRefs.current = [];
    };
  }, [missingService, uniqueTypes]);

  const handleClick = (service: ServiceKey) => {
    const route = routes[service] ?? DEFAULT_ROUTES[service];
    router.push(route);
  };

  // If no missing service, hide component
  if (!missingService) return null;

  const m = messages[missingService];
  const key = String(missingService);

  return (
    <div
      ref={containerRef}
      className={`grid grid-cols-1 gap-2.5 mt-3 ${className}`}
      dir={locale === "ar" ? "rtl" : "ltr"}
      aria-label={locale === "ar" ? "اقتراحات" : "Suggestions"}
    >
      <button
        key={key}
        type="button"
        onClick={() => handleClick(missingService)}
        className="upsell-card relative w-full p-2 rounded-xl border cursor-pointer text-left shadow-lg"
        aria-label={locale === "ar" ? m.title.ar : m.title.en}
        style={{ transformOrigin: "center center", backgroundColor: "#ffeaea" }}
      >
        <div className="flex flex-col gap-1">
          <div className="text-base font-semibold text-gray-700">
            {locale === "ar" ? m.title.ar : m.title.en}
          </div>
          <div className="text-sm text-[#7b4444]">
            {locale === "ar" ? m.description.ar : m.description.en}
          </div>
        </div>

        <div className="mt-2 flex items-center gap-2 text-gray-700 font-medium">
          {locale === "ar" ? "إكتشف" : "Explore"}
          <ChevronRight className="w-4 h-4" />
        </div>
      </button>
    </div>
  );
}
