"use client";

import React, { useEffect, useRef } from "react";
import mapboxgl, { Map, AnyLayer } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

declare module "mapbox-gl" {
  interface MapboxGL {
    getRTLTextPluginStatus?: () => string;
    setRTLTextPlugin?: (url: string, callback: (() => void) | null, deferred?: boolean) => void;
  }
}

export default function JerashDarkMap({ isArabic }: { isArabic: boolean }) {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // ✅ تفعيل دعم RTL مرة واحدة فقط لتجنب الخطأ
    const status =
      typeof mapboxgl.getRTLTextPluginStatus === "function"
        ? mapboxgl.getRTLTextPluginStatus()
        : "unavailable";

    if (status === "unavailable" && mapboxgl.setRTLTextPlugin) {
      mapboxgl.setRTLTextPlugin(
        "https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.3.0/mapbox-gl-rtl-text.js",
        null,
        true
      );
    }

    // ✅ إنشاء الخريطة
    const map: Map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/omarallabadi/cmhrsxtoi005n01s50mxw79te",
      center: [35.858922550110634, 32.3449335],
      zoom: 14,
      scrollZoom: false,
    });

    // ✅ تفعيل وتعطيل Scroll Zoom عند المرور
    map.on("mouseenter", () => map.scrollZoom.enable());
    map.on("mouseleave", () => map.scrollZoom.disable());

    // ✅ عند تحميل الخريطة عدل النصوص العربية
    map.on("load", () => {
      const layers = map.getStyle().layers;
      if (!layers) return;

      layers.forEach((layer: AnyLayer) => {
        if (layer.type === "symbol" && layer.layout && "text-field" in layer.layout) {
          map.setLayoutProperty(layer.id, "text-field", [
            "coalesce",
            ["get", "name_ar"],
            ["get", "name"],
          ]);
          map.setLayoutProperty(layer.id, "text-font", ["Noto Sans Arabic Regular"]);
        }
      });
    });

    // ✅ أدوات التحكم
    map.addControl(new mapboxgl.NavigationControl(), "bottom-right");

    // ✅ تنظيف عند الإزالة
    return () => map.remove();
  }, []);

  return (
    <div>
      <section className="relative w-full mt-20 py-20">
        <div className="max-w-6xl mx-auto px-6 text-center mb-12">
          <h2 className="text-3xl font-bold text-[#484d23] mb-4">
            {isArabic ? "موقعنا على الخريطة" : "Find Us on the Map"}
          </h2>
          <p className="text-[#484d23]/80 text-lg">
            {isArabic
              ? "تعال واستمتع بتجربة التخييم الفريدة وسط الطبيعة."
              : "Come enjoy a unique camping experience in the heart of nature."}
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto rounded-2xl overflow-hidden shadow-xl border-4 border-[#484d23]/20">
          <section
            ref={mapContainer}
            className="w-full h-[600px] md:h-[700px] rounded-2xl overflow-hidden shadow-lg border-4 border-[#484d23]/20"
            style={{ touchAction: "pan-y" }}
          ></section>

          <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md shadow-md rounded-lg p-6 text-left">
            <h3 className="text-[#484d23] text-2xl font-semibold mb-2">
              {isArabic ? "مخيم الواحة" : "Oasis Camp"}
            </h3>
            <p className="text-[#484d23]/80 text-sm mb-3">
              {isArabic
                ? "مفتوح يوميًا من 9 صباحًا حتى 11 مساءً"
                : "Open daily from 9 AM to 11 PM"}
            </p>
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noreferrer"
              className="inline-block bg-[#484d23] text-white px-4 py-2 rounded-md hover:bg-[#5a6230] transition-all duration-300"
            >
              {isArabic ? "الاتجاهات" : "Get Directions"}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
