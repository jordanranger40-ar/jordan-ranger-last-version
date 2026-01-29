"use client";

import React from "react";
import { Phone, Mail, MapPin } from "lucide-react";

const SITE_PHONE = process.env.NEXT_PUBLIC_PHONE_NUMBER1 || "+9627xxxxxxx";
const SITE_EMAIL = process.env.NEXT_PUBLIC_EMAIL || "info@Example.com";
const SITE_ADDRESS_EN =
  process.env.NEXT_PUBLIC_LOCATION_EN || "Thaghret Asfour, near Jerash, Jordan";
const SITE_ADDRESS_AR =
  process.env.NEXT_PUBLIC_LOCATION_AR || "Thaghret Asfour, near Jerash, Jordan";

interface Props {
  locale?: "en" | "ar";
}

export default function ContactHours({ locale = "en" }: Props) {
  const isAr = locale === "ar";
  const dir = isAr ? "rtl" : "ltr";
  const textAlign = isAr ? "text-right" : "text-left";
  const accent = "#484d23";

  // Opening hours
  const hours = [
    {
      id: 1,
      labelEn: "Monday",
      labelAr: "الاثنين",
      open: "09:00",
      close: "21:00",
    },
    {
      id: 2,
      labelEn: "Tuesday",
      labelAr: "الثلاثاء",
      open: "09:00",
      close: "21:00",
    },
    {
      id: 3,
      labelEn: "Wednesday",
      labelAr: "الأربعاء",
      open: "09:00",
      close: "21:00",
    },
    {
      id: 4,
      labelEn: "Thursday",
      labelAr: "الخميس",
      open: "09:00",
      close: "21:00",
    },
    {
      id: 5,
      labelEn: "Friday",
      labelAr: "الجمعة",
      open: "09:00",
      close: "21:00",
    },
    {
      id: 6,
      labelEn: "Saturday",
      labelAr: "السبت",
      open: "09:00",
      close: "21:00",
    },
    {
      id: 0,
      labelEn: "Sunday",
      labelAr: "الأحد",
      open: "09:00",
      close: "21:00",
    },
  ];

  const todayIndex = new Date().getDay();

  const title = isAr ? "الاتصال وساعات العمل" : "Contact & Opening Hours";
  const callLabel = isAr ? "اتصل الآن" : "Call";
  const emailLabel = isAr ? "أرسل بريدًا" : "Email";
  const directionsLabel = isAr ? "احصل على الاتجاهات" : "Get directions";
  const LAT = process.env.NEXT_PUBLIC_CAMP_LAT;
  const LNG = process.env.NEXT_PUBLIC_CAMP_LNG;
  const mapsHref = `https://www.google.com/maps?q=${LAT},${LNG}`;

  return (
    <section dir={dir} className="w-full  mx-auto p-6 md:p-14 my-7">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="md:grid md:grid-cols-2">
          {/* Left: Contact */}
          <div className="p-6 md:p-8 flex flex-col justify-between gap-6">
            <div>
              <h3 className={`text-2xl font-extrabold mb-2 ${textAlign}`}>
                {title}
              </h3>
              <p className={`text-sm text-gray-600 mb-4 ${textAlign}`}>
                {isAr
                  ? "زورونا للاستمتاع بتجربة طعام في قلب الطبيعة أو اتصلوا بنا للحجز."
                  : "Visit us for a unique dining experience in the forest — or contact us to make a reservation."}
              </p>

              <div className={`flex flex-col gap-3 `}>
                <ContactItem
                  icon={<Phone className="w-5 h-5" style={{ color: accent }} />}
                  label={isAr ? "الهاتف" : "Phone"}
                  value={SITE_PHONE}
                  href={`tel:${SITE_PHONE}`}
                />
                <ContactItem
                  icon={<Mail className="w-5 h-5" style={{ color: accent }} />}
                  label={isAr ? "البريد الإلكتروني" : "Email"}
                  value={SITE_EMAIL}
                  href={`mailto:${SITE_EMAIL}`}
                />
                <ContactItem
                  icon={
                    <MapPin className="w-5 h-5" style={{ color: accent }} />
                  }
                  label={isAr ? "الموقع" : "Address"}
                  value={isAr ? SITE_ADDRESS_AR : SITE_ADDRESS_EN}
                  href={mapsHref}
                />
              </div>
            </div>

            {/* Actions */}
            <div className={`flex flex-wrap gap-3 mt-4 `}>
              <ActionButton
                href={`tel:${SITE_PHONE}`}
                icon={<Phone className="w-4 h-4" />}
                label={callLabel}
                primary
              />
              <ActionButton
              
                href={`mailto:${SITE_EMAIL}`}
                icon={<Mail className="w-4 h-4" />}
                label={emailLabel}
              />
              <ActionButton
                href={mapsHref}
                icon={<MapPin className="w-4 h-4" />}
                label={directionsLabel}
              />
            </div>
          </div>

          {/* Right: Hours */}
          <div className="p-6 md:p-8 bg-gray-50">
            <div className="max-w-md mx-auto">
              <h4 className={`text-sm font-semibold mb-4 ${textAlign}`}>
                {isAr ? "ساعات العمل" : "Opening Hours"}
              </h4>
              <dl className="space-y-2">
                {hours.map((h) => {
                  const isToday = h.id === todayIndex;
                  return (
                    <div
                      key={h.id}
                      className={`flex items-center justify-between gap-4 rounded-lg p-3 ${isToday ? "bg-white ring-1 ring-[rgba(72,77,35,0.12)] shadow-sm" : ""}`}
                      aria-current={isToday ? "true" : undefined}
                    >
                      <dt className={`text-sm text-gray-700 ${textAlign}`}>
                        {isAr ? h.labelAr : h.labelEn}
                      </dt>
                      <dd className="text-sm font-medium text-gray-900">
                        <span
                          className="inline-block px-2 py-1 rounded-md"
                          style={{
                            background: isToday ? `${accent}14` : "transparent",
                          }}
                        >
                          {h.open} - {h.close}
                        </span>
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactItem({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-md flex items-center justify-center bg-[rgba(72,77,35,0.08)]">
        {icon}
      </div>
      <div className="text-sm">
        <div className="text-xs text-gray-500">{label}</div>
        <a href={href} className="text-base font-medium hover:underline">
          {value}
        </a>
      </div>
    </div>
  );
}

function ActionButton({
  href,
  icon,
  label,
  primary,
  
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  primary?: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium shadow-sm ${
        primary
          ? "bg-[rgba(72,77,35,0.9)] text-white hover:brightness-110"
          : "border border-gray-200 hover:bg-gray-50 text-gray-700"
      }`}
    >
      {icon}
      {label}
    </a>
  );
}
