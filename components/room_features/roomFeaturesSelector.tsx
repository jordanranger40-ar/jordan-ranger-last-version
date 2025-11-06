// components/RoomFeaturesMultiSelect.tsx
"use client";
import { roomFeatures } from "@/types";
import React, { useEffect, useRef, useState } from "react";
import { X, ChevronDown } from "lucide-react";

interface Props {
  selectedFeatures: roomFeatures[];
  onChange: (features: roomFeatures[]) => void;
  placeholder?: string;
  maxHeight?: string;
}

interface Props {
  selectedFeatures: roomFeatures[];
  onChange: (features: roomFeatures[]) => void;
  placeholder?: string;
  maxHeight?: string; // tailwind h- class fallback, e.g. "h-56"
}

export default function RoomFeaturesMultiSelect({
  selectedFeatures,
  onChange,
  placeholder = "features",
  maxHeight = "h-52",
}: Props) {
  const [open, setOpen] = useState(false);
  const [all, setAll] = useState<roomFeatures[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement | null>(null);

  // fetch features
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/room_features");
        const data: roomFeatures[] = await res.json();
        if (mounted) setAll(data ?? []);
      } catch (err) {
        console.error("Failed to load features:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // close on outside click
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const toggleFeature = (f: roomFeatures) => {
    const exists = selectedFeatures.some((s) => s.id === f.id);
    if (exists) {
      onChange(selectedFeatures.filter((s) => s.id !== f.id));
    } else {
      onChange([...selectedFeatures, f]);
    }
  };

  const removeFeature = (id?: string) => {
    onChange(selectedFeatures.filter((s) => s.id !== id));
  };

  const filtered = all.filter((f) =>
    (f.feature_title_en + " " + (f.feature_description_en ?? ""))
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  return (
    <div className="w-full max-w-2xl" ref={ref}>
      {/* Toggle */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-md border border-gray-300 bg-white shadow-sm hover:shadow-md transition"
      >
        <div className="text-sm text-gray-700">
          {selectedFeatures.length > 0
            ? `${selectedFeatures.length} ${placeholder} selected`
            : `Select ${placeholder}`}
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-600 ${open ? "rotate-180" : ""}`} />
      </button>

      {/* dropdown */}
      {open && (
        <div className="mt-2 rounded-md border border-gray-200 bg-white shadow-lg z-50 w-full">
          <div className="p-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#676e32]"
              placeholder="Search features..."
              autoFocus
            />
          </div>

          <div className={`px-2 pb-2 overflow-auto ${maxHeight}`}>
            {loading ? (
              <div className="px-3 py-2 text-sm text-gray-500">Loading...</div>
            ) : filtered.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500">No features</div>
            ) : (
              filtered.map((f) => {
                const checked = selectedFeatures.some((s) => s.id === f.id);
                return (
                  <label
                    key={f.id ?? `${f.feature_title_en}-${Math.random()}`}
                    className="flex items-start gap-3 px-3 py-2 rounded-md hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleFeature(f)}
                      className="mt-1 h-4 w-4 text-[#676e32] rounded"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-800">
                        {f.feature_title_en}
                      </div>
                      {f.feature_description_en && (
                        <div className="text-xs text-gray-500">{f.feature_description_en}</div>
                      )}
                    </div>
                  </label>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* chips */}
      <div className="mt-3 flex flex-wrap gap-2">
        {selectedFeatures.map((f) =>
          f.id ? (
            <div
              key={f.id}
              className="flex items-center gap-2 py-1 px-3 bg-gray-100 rounded-full text-sm"
            >
              <span className="font-medium text-gray-800">{f.feature_title_en}</span>
              <button
                type="button"
                onClick={() => removeFeature(f.id)}
                className="p-0.5 rounded-full hover:bg-gray-200"
                aria-label="remove"
              >
                <X className="w-3 h-3 text-gray-600" />
              </button>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
