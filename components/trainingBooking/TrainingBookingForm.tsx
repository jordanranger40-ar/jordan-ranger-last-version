"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Users } from "lucide-react";
import { bookTrainingFunction } from "./(fetch)/bookTraining";
import DarkButton from "../ui/dark-button";

export default function TrainingBookingForm({
  training_id,
  price,
  capacity,
  numberOfBooked,
  onBooked,
  locale
}: {
  training_id: string;
  price: number;
  capacity: number;
  numberOfBooked: number;
  onBooked: (success: boolean, quantity: number) => void;
  locale: string;
}) {
  const { data: session } = useSession();
  const router = useRouter();

  const isArabic = locale === "ar";

  const available = Math.max(0, capacity - numberOfBooked);

  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const t = {
    availableSpots: isArabic ? "المقاعد المتاحة" : "Available Spots",
    fullyBooked: isArabic ? "مكتمل الحجز" : "Fully Booked",
    participants: isArabic ? "عدد المشاركين" : "Number of Participants",
    price: isArabic ? "السعر" : "Price",
    total: isArabic ? "المجموع" : "Total",
    book: isArabic ? "احجز" : "Book",
    booking: isArabic ? "جارٍ الحجز..." : "Booking...",
    loginMsg: isArabic ? "يرجى تسجيل الدخول لإتمام الحجز" : "Please login to book the training",
    success: isArabic ? "تم تأكيد الحجز بنجاح!" : "Booking confirmed!",
    failed: isArabic ? "فشل الحجز" : "Booking failed.",
    qtyError: isArabic
      ? `❌ يجب أن يكون العدد بين 1 و ${available}.`
      : `❌ Quantity must be between 1 and ${available}.`,
    fullyBookedMsg: isArabic
      ? "❌ هذا التدريب مكتمل الحجز."
      : "❌ This training is fully booked.",
    networkError: isArabic
      ? "⚠️ خطأ في الشبكة. يرجى المحاولة مرة أخرى."
      : "⚠️ Network error. Please try again.",
    currency: isArabic ? "دينار" : "JOD"
  };

  const handleBook = async () => {
    if (!session) {
      router.push("/login");
      return;
    }

    if (available <= 0) {
      setMsg(t.fullyBookedMsg);
      return;
    }

    if (quantity < 1 || quantity > available) {
      setMsg(t.qtyError);
      return;
    }

    setLoading(true);
    setMsg(null);

    try {
      const result = await bookTrainingFunction({
        training_id,
        quantity,
      });

      if (result.success) {
        setMsg("✅ " + t.success);
        onBooked(true, quantity);
      } else {
        setMsg(result.message || t.failed);
        if (result.message === "Please login to book the Training") {
          router.push("/login");
        }
        onBooked(false, quantity);
      }
    } catch (err) {
      console.error(err);
      setMsg(t.networkError);
      onBooked(false, quantity);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="border-t pt-6 mt-6 space-y-5 p-4 rounded-lg shadow-md bg-white"
      dir={isArabic ? "rtl" : "ltr"}
    >
      {/* User Info */}
      {session && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
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

      {/* Availability */}
      <div className="text-sm text-gray-700 mb-2">
        🧍‍♂️ <strong>{t.availableSpots}:</strong>{" "}
        {available > 0 ? (
          <span className="text-green-600">{available}</span>
        ) : (
          <span className="text-red-600">{t.fullyBooked}</span>
        )}
      </div>

      {/* Quantity */}
      {available > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-500" />
            {t.participants}
          </label>
          <input
            type="number"
            min={1}
            max={available}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="border rounded-md px-3 py-2 w-32 focus:outline-none focus:ring-2 focus:ring-[#676e32]"
          />
        </div>
      )}

      {/* Price */}
      <div className="text-sm text-gray-700">
        💰 <strong>{t.price}:</strong> {price} {t.currency} /{" "}
        {isArabic ? "للفرد" : "person"}
      </div>

      {/* Total */}
      {available > 0 && (
        <div className="text-sm text-gray-700">
          🧾 <strong>{t.total}:</strong> {price * quantity} {t.currency}
        </div>
      )}

      {/* Book Button */}
      <div>
        <DarkButton
          onClick={handleBook}
          disabled={loading || available <= 0}
          className="bg-[#676e32] text-white px-6 py-2 rounded-md hover:bg-[#7c863a] disabled:opacity-60 transition"
        >
          {available <= 0
            ? t.fullyBooked
            : loading
            ? t.booking
            : `${t.book} (${quantity})`}
        </DarkButton>
      </div>

      {/* Message */}
      {msg && (
        <div
          className={`text-sm mt-2 ${
            msg.includes("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {msg}
        </div>
      )}
    </div>
  );
}
