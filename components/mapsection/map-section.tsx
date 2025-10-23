"use client";

import React, { useState, useEffect } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";
import { Feature } from "geojson";
import { useLocale } from "next-intl";

const geoUrl =
  "https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json";

const arabicCountries = [
  "Algeria",
  "Bahrain",
  "Comoros",
  "Djibouti",
  "Egypt",
  "Iraq",
  "Jordan",
  "Kuwait",
  "Lebanon",
  "Libya",
  "Mauritania",
  "Morocco",
  "Oman",
  "Palestine",
  "Qatar",
  "Saudi Arabia",
  "Sudan",
  "Syria",
  "Tunisia",
  "United Arab Emirates",
  "Yemen",
];

const highlightedCountries = [
  "Bahrain",
  "Egypt",
  "Iraq",
  "Jordan",
  "Kuwait",
  "Lebanon",
  "Morocco",
  "Oman",
  "Palestine",
  "Qatar",
  "Saudi Arabia",
  "Syria",
  "United Arab Emirates",
  "Yemen",
];

type TooltipData = {
  name: string;
  x: number;
  y: number;
};

export default function MapSection() {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const locale = useLocale();
  const isArabic = locale === "ar";

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 600);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <section
      dir={isArabic ? "rtl" : "ltr"}
      className={`flex flex-col items-center w-full overflow-hidden relative ${
        isMobile ? "h-[60vh] p-4" : "h-screen p-8"
      } text-center`}
    >
      <h2
        className={`font-bold text-[#125892] mb-6 ${
          isMobile ? "text-xl" : "text-2xl"
        }`}
      >
        {isArabic ? "أين نحن متواجدون" : "Where We Are Present"}
      </h2>

      {isMobile ? (
        <img
          src="/path-to-your-image.jpg"
          alt="Arabic countries map"
          className="w-4/5 h-auto object-contain"
        />
      ) : (
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 800,
            center: [22, 25],
          }}
          width={800}
          height={600}
          className="w-3/4 h-auto"
          onMouseLeave={() => setTooltip(null)}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }: { geographies: Feature[] }) =>
              geographies
                .filter(
                  (geo) =>
                    geo.properties?.name &&
                    arabicCountries.includes(geo.properties.name)
                )
                .map((geo: Feature) => {
                  const name = geo.properties?.name;
                  const isHighlighted = highlightedCountries.includes(name);

                  return (
                    <Geography
                      key={name}
                      geography={geo}
                      fill={isHighlighted ? "#125892" : "#d1d5db"}
                      stroke="#0b3d66"
                      style={{
                        default: { outline: "none" },
                        hover: isHighlighted
                          ? {
                              fill: "#0b3d66",
                              cursor: "pointer",
                              outline: "none",
                            }
                          : {
                              fill: "#d1d5db",
                              outline: "none",
                              cursor: "default",
                            },
                        pressed: { outline: "none" },
                      }}
                      onMouseEnter={
                        isHighlighted
                          ? (event: React.MouseEvent<SVGElement, MouseEvent>) => {
                              const { clientX, clientY } = event;
                              setTooltip({
                                name: name || "Unknown",
                                x: clientX,
                                y: clientY,
                              });
                            }
                          : undefined
                      }
                      onMouseLeave={isHighlighted ? () => setTooltip(null) : undefined}
                    />
                  );
                })
            }
          </Geographies>
        </ComposableMap>
      )}

      {tooltip && !isMobile && (
        <div
          className="absolute bg-white dark:bg-[#020618] px-2 py-1 rounded shadow-md text-sm whitespace-nowrap z-10 pointer-events-none "
          style={{
            top: tooltip.y + 10,
            left: tooltip.x + 10,
          }}
        >
          {tooltip.name}
        </div>
      )}
    </section>
  );
}
