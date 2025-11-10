"use client";

import React, { useEffect, useRef } from "react";
import mapboxgl, { Map, AnyLayer } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

export default function JerashDarkMap() {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // 🔹 تفعيل RTL Arabic support
    mapboxgl.setRTLTextPlugin(
      "https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.3.0/mapbox-gl-rtl-text.js",
      null,
      true
    );

    const map: Map = new mapboxgl.Map({
      container: mapContainer.current,
      // 🔹 استبدل هذا بالستايل الخاص بك مع خط عربي
      style: "mapbox://styles/omarallabadi/cmhrsxtoi005n01s50mxw79te",
      center: [35.858922550110634, 32.3449335],


      zoom: 14,
      scrollZoom: false, // تعطيل scrollZoom افتراضيًا
    });

    // تفعيل السكروول فقط عند المرور فوق الخريطة
    map.on("mouseenter", () => map.scrollZoom.enable());
    map.on("mouseleave", () => map.scrollZoom.disable());

    map.on("load", () => {
      const layers = map.getStyle().layers;
      if (!layers) return;

      layers.forEach((layer: AnyLayer) => {
        // 🔹 نعدل فقط الطبقات النصية (symbol)
        if (
          layer.type === "symbol" &&
          layer.layout &&
          "text-field" in layer.layout
        ) {
          // نص عربي مع fallback للنص الإنجليزي
          map.setLayoutProperty(
            layer.id,
            "text-field",
            ["coalesce", ["get", "name_ar"], ["get", "name"]]
          );

          // استخدام خط عربي كامل لتصحيح الربط
          map.setLayoutProperty(layer.id, "text-font", ["Noto Sans Arabic Regular"]);
        }
      });
    });

    // أدوات التكبير والتصغير
    map.addControl(new mapboxgl.NavigationControl());

    return () => map.remove();
  }, []);

  return (
    <div
      ref={mapContainer}
      className="w-full h-screen" 
      style={{ touchAction: "pan-y" }} 
    />
  );
}
