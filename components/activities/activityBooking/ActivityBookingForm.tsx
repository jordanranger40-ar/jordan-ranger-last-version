"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Clock, User, Mail } from "lucide-react";
import { bookActivity } from "./(fetch)/bookActivity";
import { toast } from "sonner";

export default function ActivityBookingForm({
  locale,
  activityId,
  selectedRange,
  available,
  price,
  minimum_quantity,
  onBooked,
}: {
  locale: string;
  activityId: string;
  selectedRange: { start: string };
  available: number;
  price: number;
  minimum_quantity: number;
  onBooked: (success: boolean, quantity: number) => void;
}) {
  const isArabic = locale === "ar";

  
  const { data: session } = useSession();
  const router = useRouter();

  const [quantity, setQuantity] = useState<number>(minimum_quantity);
  const [loading, setLoading] = useState(false);
  const [userTimeZone, setUserTimeZone] = useState<string>("");
  const [showQuantityMessage, setShowQuantityMessage] = useState<boolean>(false);

  useEffect(() => {
    setQuantity(minimum_quantity);
    if (Number(minimum_quantity) > 1) setShowQuantityMessage(true);
  }, [minimum_quantity]);

  useEffect(() => {
    setUserTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);

    console.log("isArabic: ",isArabic);

  const handleBook = async () => {
    if (!session) {
      toast.error(
        isArabic ? "يرجى تسجيل الدخول لحجز النشاط." : "Please login to book the activity."
      );
      router.push("/login");
      return;
    }
    if (!selectedRange?.start) {
      toast.error(isArabic ? "يرجى اختيار الوقت." : "Please select a time.");
      return;
    }
    if (quantity < minimum_quantity) {
      toast.error(
        isArabic
          ? `الحد الأدنى للكمية هو ${minimum_quantity}`
          : `Minimum quantity is ${minimum_quantity}`
      );
      return;
    }
    if (quantity > available) {
      toast.error(
        isArabic
          ? `فقط ${available} مقاعد متاحة`
          : `Only ${available} spaces available`
      );
      return;
    }

    setLoading(true);
    try {
      const result = await bookActivity({
        activity_id: activityId,
        start_time: new Date(selectedRange.start),
        quantity,
      });

      if (result.success) {
        toast.success(isArabic ? "✅ تم إرسال الحجز!" : "✅ Booking Submitted!");
        onBooked(true, quantity);
      } else {
        toast.error(result.message || (isArabic ? "فشل الحجز" : "Booking failed"));
        onBooked(false, quantity);
      }
    } catch (err) {
      console.error(err);
      toast.error(isArabic ? "خطأ في الشبكة" : "Network error");
      onBooked(false, quantity);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-t pt-6 mt-6 space-y-5 p-4 rounded-lg shadow-md bg-white" dir={isArabic ? "rtl" : "ltr"}>
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

      {/* Selected Time */}
      <div className="flex items-center gap-2 text-gray-700">
        <div>
          <div className="text-sm font-medium flex flex-row gap-2 mb-2">
            <Clock className="w-5 h-5 text-gray-500" /> 
            {isArabic ? "الوقت المحدد" : "Selected Time"}
          </div>

          <div className="text-gray-800 font-semibold mb-2">
            {selectedRange?.start
              ? new Date(selectedRange.start).toLocaleString(isArabic ? "ar-JO" : "en-US", {
                  timeZone: "Asia/Amman",
                })
              : isArabic ? "لم يتم اختيار الوقت" : "No time selected"}
          </div>

          <div className="text-xs text-gray-400">
            ⚠️ {isArabic 
                  ? "الأوقات معروضة بتوقيت الأردن (GMT+3). المنطقة الزمنية المحلية الخاصة بك:" 
                  : "Times shown in Jordan time (GMT+3). Your local timezone:"} 
            <strong> {userTimeZone}</strong>
          </div>
        </div>
      </div>

      {/* Price Info */}
      <div className="text-sm text-gray-600 mb-2">
        {isArabic ? "السعر" : "Price"}: {price} JOD / {isArabic ? "شخص" : "Person"}
      </div>

      {/* Quantity Input */}
      <label className="block">
        <div className="text-sm text-gray-600 mb-2">
          {isArabic
            ? `الكمية (الحد الأدنى ${minimum_quantity}, الحد الأقصى ${available})`
            : `Quantity (min ${minimum_quantity}, max ${available})`}
        </div>

        <input
          type="number"
          min={Number(minimum_quantity)}
          max={available}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="border rounded-md px-3 py-2 w-32 focus:outline-none focus:ring-2 focus:ring-[#676e32]"
        />

        <div className="text-sm text-gray-600 mb-1 mt-2">
          {isArabic ? "السعر الإجمالي" : "Total Price"}: {price * quantity} JOD
        </div>
      </label>

      {/* Book Button */}
      <div>
        <button
          onClick={handleBook}
          disabled={loading}
          className="bg-[#676e32] text-white px-6 py-2 rounded-md hover:bg-[#7c863a] disabled:opacity-60 transition"
        >
          {loading ? (isArabic ? "جارٍ الحجز..." : "Booking...") : `${isArabic ? "احجز" : "Book"} (${quantity})`}
        </button>
        {showQuantityMessage && (
          <div className="flex justify-start text-sm flex-row font-semibold text-gray-500 mt-2">
            {isArabic
              ? `يجب أن تكون الكمية على الأقل ${minimum_quantity}`
              : `Quantity should be at least ${minimum_quantity}`}
          </div>
        )}
      </div>
    </div>
  );
}
