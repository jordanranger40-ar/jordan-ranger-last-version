"use client";

import { useState, useEffect } from "react";
import { checkActivityAvailability } from "./(fetch)/checkAvailability";
import { Clock } from "lucide-react";

// Time selector component
function TimeSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#676e32]"
    >
      <option value="">Select hour</option>
      {hours.map((h) => (
        <option key={h} value={h.toString().padStart(2, "0")}>
          {h.toString().padStart(2, "0")}:00
        </option>
      ))}
    </select>
  );
}

export default function CheckAvailabilityForm({
  activityId,
  onAvailable,
}: {
  activityId: string;
  onAvailable: (
    remaining: number,
    range: { start: string; end: string }
  ) => void;
}) {
  const [startDate, setStartDate] = useState<string>(""); // YYYY-MM-DD
  const [startHour, setStartHour] = useState<string>(""); // HH
  const [endDate, setEndDate] = useState<string>("");
  const [endHour, setEndHour] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [userTimeZone, setUserTimeZone] = useState<string>("");

  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setUserTimeZone(tz);
  }, []);

  const handleCheck = async () => {
    if (!startDate || !startHour || !endDate || !endHour) {
      setMessage("Please select both start and end date/time.");
      return;
    }

    const start = new Date(`${startDate}T${startHour}:00:00`).toISOString();
    const end = new Date(`${endDate}T${endHour}:00:00`).toISOString();

    setLoading(true);
    const result = await checkActivityAvailability(activityId, start, end);
    setLoading(false);
    setMessage(null);

    if (result.success && result.available) {
      onAvailable(result.available, { start, end });
    } else {
      setMessage(result.message || "Unavailable for selected time");
    }
  };

  return (
    <div className="space-y-4">
      {/* Start */}
      <div className="flex flex-col gap-2">
        <div className=" text-sm text-gray-600">
          <span className="text-red-700">*</span> Start
        </div>
        <div className="flex gap-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded px-3 py-2 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#676e32]"
          />
          <TimeSelect value={startHour} onChange={setStartHour} />
        </div>
      </div>

      {/* End */}
      <div className="flex flex-col gap-2">
        <div className=" text-sm text-gray-600">
          <span className="text-red-700">*</span> End
        </div>
        <div className="flex gap-2">
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded px-3 py-2 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#676e32]"
          />
          <TimeSelect value={endHour} onChange={setEndHour} />
        </div>
      </div>
      <div className="text-xs text-gray-400 mt-1">
        All activities occur in <strong>Jordan time (GMT+3)</strong>.
        <br />
        Your local time zone: <strong>{userTimeZone}</strong>
      </div>

      {/* Button */}
      <div className="flex justify-center">
        <button
          onClick={handleCheck}
          disabled={loading}
          className="bg-[#676e32] text-white px-5 py-2 rounded hover:bg-[#7c863a] disabled:opacity-60 transition"
        >
          {loading ? "Checking..." : "Check Availability"}
        </button>
      </div>

      {/* Message */}
      {message && (
        <p className="text-sm text-red-600 text-center font-medium">
          {message}
        </p>
      )}
      <p className="text-xs text-gray-500 text-center">
        Duration will be calculated automatically after check.
      </p>
    </div>
  );
}
