import React from "react";

type Locale = "en" | "ar";

interface PaymentBoxProps {
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
  accentColor: string;
  locale: Locale;
  placementLabel: string;
  icon: React.ReactNode;
}

export default function PaymentBox({
  title,
  description,
  selected,
  onClick,
  accentColor,
  locale,
  placementLabel,
  icon,
}: PaymentBoxProps) {
  return (
    <button
      onClick={onClick}
      aria-pressed={selected}
      className={`w-full rounded-2xl h-36 p-8 flex items-center gap-4 text-left transition-transform transform hover:-translate-y-1 shadow-sm focus:outline-none focus:ring-1`}
      style={{
        border: `1px solid #676e32`,
        background: selected
          ? "linear-gradient(180deg, rgba(103,110,50,0.06), rgba(103,110,50,0.02))"
          : "white",
      }}
    >
      <div className="shrink-0 text-gray-700">{icon}</div>

      <div className="flex-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="mt-2 text-sm text-gray-500">{description}</p>
          </div>

          <div
            className={`text-sm font-semibold px-3 py-1 rounded-full`}
            style={{
              backgroundColor: selected ? accentColor : "#f3f4f6",
              color: selected ? "white" : "#374151",
            }}
          >
            {selected ? placementLabel : locale === "ar" ? "اختيار" : "Choose"}
          </div>
        </div>
      </div>
    </button>
  );
}
