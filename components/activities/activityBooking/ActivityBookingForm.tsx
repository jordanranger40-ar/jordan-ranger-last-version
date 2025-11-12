"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Clock, User, Mail } from "lucide-react"; // icons
import { bookActivity } from "./(fetch)/bookActivity"; // your server function

function formatDurationISO(startIso: string, endIso: string) {
  const s = new Date(startIso);
  const e = new Date(endIso);
  const diffMs = e.getTime() - s.getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  const remHours = hours % 24;
  if (days > 0)
    return `${days} day${days > 1 ? "s" : ""}${remHours ? ` ${remHours}h` : ""}`;
  return `${remHours} hour${remHours !== 1 ? "s" : ""}`;
}

export default function ActivityBookingForm({
  activityId,
  selectedRange,
  available,
  price,
  onBooked,
}: {
  activityId: string;
  selectedRange: { start: string; end: string };
  available: number;
  price:number
  onBooked: (success: boolean, quantity: number) => void;

}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [userTimeZone, setUserTimeZone] = useState<string>("");

  useEffect(() => {
    setUserTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);

  const duration = formatDurationISO(selectedRange.start, selectedRange.end);
  console.log("type: ",typeof Number(duration[0]),duration[0]);
  
  console.log("yrgedhwjk: ",Number(selectedRange.end)-Number(selectedRange.start));
  

  const handleBook = async () => {
    if (!session) {
      router.push("/login");
      return;
    }

    if (quantity < 1 || quantity > available) {
      setMsg("Invalid quantity");
      return;
    }

    setLoading(true);
    setMsg(null);

    try {
      const result = await bookActivity({
        activity_id: activityId,
        start_time: new Date(selectedRange.start),
        end_time: new Date(selectedRange.end),
        quantity,
      });

      if (result.success) {
        setMsg("✅ Booking confirmed!");
        onBooked(true,quantity);
      } else {
        setMsg(result.message || "Booking failed");
        onBooked(false,quantity);
      }
    } catch (err) {
      console.error(err);
      setMsg("Network error");
      onBooked(false,quantity);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="border-t pt-6 mt-6 space-y-5 p-4 rounded-lg shadow-md bg-white">
      {/* User Info */}
      {session && (
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1 text-gray-700">
            <User className="w-5 h-5 text-gray-500" />
            <span>{session.user.name}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-700">
            <Mail className="w-5 h-5 text-gray-500" />
            <span>{session.user.email}</span>
          </div>
        </div>
      )}

      {/* Selected Range */}
      <div className="flex items-center gap-2 text-gray-700">
        <div>
          <div className="text-sm font-medium flex flex-row gap-2 mb-2">
            <Clock className="w-5 h-5 text-gray-500" /> Selected range
          </div>
          <div className="text-gray-800 font-semibold mb-2">
            {new Date(selectedRange.start).toLocaleString()} —{" "}
            {new Date(selectedRange.end).toLocaleString()}
          </div>
          <div className="text-sm text-gray-500 mb-2">Duration: {duration}</div>
          <div className="text-xs text-gray-400 ">
            ⚠️ Times are shown in <strong>Jordan time (GMT+3)</strong>.  
            Your local time zone: <strong>{userTimeZone}</strong>
          </div>
        </div>
      </div>
<div className="text-sm text-gray-600 mb-2">Price: {price} JOD / Person / Hour</div>
      {/* Quantity Input */}
      <label className="block">
        
        <div className="text-sm text-gray-600 mb-2">Quantity (max {available} Persons)</div>
        
        <input
          type="number"
          min={1}
          max={available}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="border rounded-md px-3 py-2 w-32 focus:outline-none focus:ring-2 focus:ring-[#676e32]"
        />
         <div className="text-sm text-gray-600 mb-1 mt-2">Total Price: {price * quantity * Number(duration[0])} JOD </div>
      </label>

      {/* Book Button */}
      <div>
        <button
          onClick={handleBook}
          disabled={loading}
          className="bg-[#676e32] text-white px-6 py-2 rounded-md hover:bg-[#7c863a] disabled:opacity-60 transition"
        >
          {loading ? "Booking..." : `Book (${quantity})`}
        </button>
      </div>

      {/* Message */}
      {msg && (
        <div
          className={`text-sm mt-2 ${msg.includes("✅") ? "text-green-600" : "text-red-600"}`}
        >
          {msg}
        </div>
      )}
    </div>
  );
}
