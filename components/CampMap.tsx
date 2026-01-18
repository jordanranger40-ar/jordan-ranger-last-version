'use client';

import React, { useRef, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

interface Props {
  locale: 'ar' | 'en';
  lat?: number;
  lng?: number;
}

const CampMap: React.FC<Props> = ({ locale, lat, lng }) => {
  const envLat = typeof process !== 'undefined' && process.env.NEXT_PUBLIC_CAMP_LAT
    ? parseFloat(process.env.NEXT_PUBLIC_CAMP_LAT)
    : undefined;
  const envLng = typeof process !== 'undefined' && process.env.NEXT_PUBLIC_CAMP_LNG
    ? parseFloat(process.env.NEXT_PUBLIC_CAMP_LNG)
    : undefined;

  const finalLat = lat ?? envLat ?? 31.9539;
  const finalLng = lng ?? envLng ?? 35.9106;

  const campPos: [number, number] = [finalLat, finalLng];
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${finalLat},${finalLng}`;

  const mapRef = useRef<L.Map | null>(null);

const campIcon = L.divIcon({
  html: `
    <div style="
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: radial-gradient(circle at 30% 30%, #e0e0e0, #a8a8a8);
      box-shadow: 0 4px 12px rgba(0,0,0,0.25);
      border: 2px solid #fff;
    ">
      <img src="/favicon.ico" alt="Camp" style="width:24px;height:24px;" />
    </div>
  `,
  className: '',
  iconSize: [50, 50],
  iconAnchor: [25, 50],
  popupAnchor: [0, -50],
});


  // Click anywhere to open Google Maps
  const ClickHandler = () => {
    useMapEvents({
      click: () => window.open(googleMapsUrl, '_blank', 'noopener'),
    });
    return null;
  };

  // Once map is available, fix z-index
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    try {
      const container = map.getContainer();
      container.style.cssText += 'position:relative; z-index:0 !important; transform:none !important;';

      const panes = map.getPanes ? map.getPanes() : null;
      if (panes) {
        Object.keys(panes).forEach((k) => {
          const pane = (panes as any)[k] as HTMLElement | undefined;
          if (pane && pane.style) {
            pane.style.cssText += 'z-index:0 !important; position:relative !important; transform:none !important;';
          }
        });
      }

      // Lower Leaflet controls/popups
      const controlSelectors = ['.leaflet-control', '.leaflet-popup', '.leaflet-tooltip'];
      controlSelectors.forEach((sel) => {
        const els = container.querySelectorAll<HTMLElement>(sel);
        els.forEach((el) => {
          el.style.cssText += 'z-index:1 !important; transform:none !important;';
        });
      });
    } catch (err) {
      // fail silently
    }
  }, []);

  return (
    <div className="w-full py-20 mt-10 px-6 md:px-20">
      <h2 className="text-2xl md:text-3xl font-extrabold mb-6 text-[#484d23] tracking-tight text-center">
        {locale === 'ar' ? 'موقعنا' : 'Our Location'}
      </h2>

      <div
        className="w-full rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/5"
        style={{ height: '480px', position: 'relative', zIndex: 0 }}
      >
        <MapContainer
          center={campPos}
          zoom={13}
          scrollWheelZoom={false}
          className="w-full h-full"
          ref={mapRef} // <-- use ref instead of whenCreated
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <ClickHandler />
          <Marker position={campPos} icon={campIcon}>
            <Popup>
              <div style={{ minWidth: 180 }}>
                <div style={{ fontWeight: 800, marginBottom: 6 }}>
                  {locale === 'ar' ? 'مخيم جوردن رانجر' : 'Jordan Ranger Camp'}
                </div>
                
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-block',
                    padding: '6px 10px',
                    borderRadius: 8,
                    background: '#111827',
                    color: '#fff',
                    textDecoration: 'none',
                    fontSize: 13,
                  }}
                >
                  {locale === 'ar' ? 'الحصول على الاتجاهات' : 'Get directions'}
                </a>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};

export default CampMap;
