"use client";

import React, { useMemo, useState } from "react";

type LocaleType = "en" | "ar";

interface Country {
  code: string; 
  name_en: string;
  name_ar?: string;
}

interface Props {
  value?: string; 
  onChange: (code: string) => void;
  locale: LocaleType;
  className?: string;
  id?: string;
  name?: string;
  placeholder?: string;
  countries?: Country[];
  allowCustomCode?: boolean; 
}


export default function CountrySelect({
  value,
  onChange,
  locale,
  className = "",
  id,
  name,
  countries,
}: Props) {
  
  const ISO_CODES = useMemo(
    () => [
      "AF","AX","AL","DZ","AS","AD","AO","AI","AQ","AG","AR","AM","AW","AU","AT","AZ",
      "BS","BH","BD","BB","BY","BE","BZ","BJ","BM","BT","BO","BQ","BA","BW","BV","BR",
      "IO","BN","BG","BF","BI","CV","KH","CM","CA","KY","CF","TD","CL","CN","CX","CC",
      "CO","KM","CG","CD","CK","CR","CI","HR","CU","CW","CY","CZ","DK","DJ","DM","DO",
      "EC","EG","SV","GQ","ER","EE","SZ","ET","FK","FO","FJ","FI","FR","GF","PF","TF",
      "GA","GM","GE","DE","GH","GI","GR","GL","GD","GP","GU","GT","GG","GN","GW","GY",
      "HT","HM","VA","HN","HK","HU","IS","IN","ID","IR","IQ","IE","IT","JM",
      "JP","JE","JO","KZ","KE","KI","KP","KR","KW","KG","LA","LV","LB","LS","LR","LY",
      "LI","LT","LU","MO","MG","MW","MY","MV","ML","MT","MH","MQ","MR","MU","YT","MX",
      "FM","MD","MC","MN","ME","MS","MA","MZ","MM","NA","NR","NP","NL","NC","NZ","NI",
      "NE","NG","NU","NF","MK","MP","NO","OM","PK","PW","PS","PA","PG","PY","PE","PH",
      "PN","PL","PT","PR","QA","RE","RO","RU","RW","BL","SH","KN","LC","MF","PM","VC",
      "WS","SM","ST","SA","SN","RS","SC","SL","SG","SX","SK","SI","SB","SO","ZA","GS",
      "SS","ES","LK","SD","SR","SJ","SE","CH","SY","TW","TJ","TZ","TH","TL","TG","TK",
      "TO","TT","TN","TR","TM","TC","TV","UG","UA","AE","GB","US","UM","UY","UZ","VU",
      "VE","VN","VG","VI","WF","EH","YE","ZM","ZW"
    ],
    []
  );

  const defaultCountries: Country[] = useMemo(() => {
    let dnEn: Intl.DisplayNames | null = null;
    let dnAr: Intl.DisplayNames | null = null;
    try {
      dnEn = new Intl.DisplayNames(["en"], { type: "region" });
    } catch {}
    try {
      dnAr = new Intl.DisplayNames(["ar"], { type: "region" });
    } catch {}

    return ISO_CODES.map((c) => ({
      code: c,
      name_en: dnEn ? dnEn.of(c) || c : c,
      name_ar: dnAr ? dnAr.of(c) || dnEn?.of(c) || c : undefined,
    }));
  }, [ISO_CODES]);

  const list = countries && countries.length ? countries : defaultCountries;

  const [query, setQuery] = useState("");
  const loweredQuery = query.toLowerCase();

  const filtered = list.filter((c) => {
    const name = (locale === "ar" ? c.name_ar ?? c.name_en : c.name_en).toLowerCase();
    return c.code.toLowerCase().includes(loweredQuery) || name.includes(loweredQuery);
  });

  const normalizedValue = (value ?? "").toUpperCase();

  function onSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const code = (e.target.value || "").toUpperCase();
    onChange(code);
  }

  return (
    <div className={`country-select ${className}`}>

      {/* search input */}
      <div className={`mb-2 ${locale === "ar" ? "text-right" : "text-left"}`}>
        <input
          type="search"
          aria-label={locale === "ar" ? "ابحث عن دولة" : "Search country"}
          placeholder={locale === "ar" ? "ابحث عن دولة أو رمز (مثال: JO)" : "Search country or code (e.g. JO)"}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={`w-full border rounded px-3 py-2 ${locale === "ar" ? "text-right" : "text-left"}`}
        />
      </div>

      {/* native select — shows filtered options */}
      <div>
        <select
          id={id}
          name={name}
          value={normalizedValue}
          onChange={onSelectChange}
          className={`w-full border rounded p-2 ${locale === "ar" ? "text-right" : "text-left"}`}
          aria-label={locale === "ar" ? "اختر الدولة" : "Choose country"}
        >
          {/* empty option */}
          <option value="">{locale === "ar" ? "اختر دولة..." : "Select a country..."}</option>

          {filtered.map((c) => {
            const label = locale === "ar" ? c.name_ar ?? c.name_en : c.name_en;
            return (
              <option key={c.code} value={c.code}>
                {c.code} — {label}
              </option>
            );
          })}
        </select>
      </div>

      
    </div>
  );
}
