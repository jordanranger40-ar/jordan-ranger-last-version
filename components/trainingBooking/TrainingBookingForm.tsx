"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Users } from "lucide-react";
import { bookTrainingFunction } from "./(fetch)/bookTraining";

export default function TrainingBookingForm({
  training_id,
  price,
  capacity,
  numberOfBooked,
  onBooked,
}: {
  training_id: string;
  price: number;
  capacity: number;
  numberOfBooked: number;
  onBooked: (success: boolean, quantity: number) => void;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  

  const available = Math.max(0, capacity - numberOfBooked);
  console.log("numberOfBooked: ",numberOfBooked);
  console.log("capacity: ",capacity);
    console.log("available: ",available);

  
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const handleBook = async () => {
    if (!session) {
      router.push("/login");
      return;
    }

    if (available <= 0) {
      setMsg("❌ This training is fully booked.");
      return;
    }

    if (quantity < 1 || quantity > available) {
      setMsg(`❌ Quantity must be between 1 and ${available}.`);
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
        setMsg("✅ Booking confirmed!");
        onBooked(true, quantity);
      } else {
        setMsg(result.message || "Booking failed.");
        if(result.message==="Please login to book the Training"){}
        onBooked(false, quantity);
        router.push("/login")
      }
      onBooked(false, quantity)
    } catch (err) {
      console.error(err);
      setMsg("⚠️ Network error. Please try again.");
      onBooked(false, quantity);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-t pt-6 mt-6 space-y-5 p-4 rounded-lg shadow-md bg-white">
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
        🧍‍♂️ <strong>Available Spots:</strong>{" "}
        {available > 0 ? (
          <span className="text-green-600">{available}</span>
        ) : (
          <span className="text-red-600">Fully Booked</span>
        )}
      </div>

      {/* Quantity Input */}
      {available > 0 && (
        <div className="space-y-2">
          <label className=" text-sm font-medium text-gray-700 flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-500" /> Number of Participants
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

      {/* Price Display */}
      <div className="text-sm text-gray-700">
        💰 <strong>Price:</strong> {price} JOD / person
      </div>

      {/* Total Price */}
      {available > 0 && (
        <div className="text-sm text-gray-700">
          🧾 <strong>Total:</strong> {price * quantity} JOD
        </div>
      )}

      {/* Book Button */}
      <div>
        <button
          onClick={handleBook}
          disabled={loading || available <= 0}
          className="bg-[#676e32] text-white px-6 py-2 rounded-md hover:bg-[#7c863a] disabled:opacity-60 transition"
        >
          {available <= 0
            ? "Fully Booked"
            : loading
            ? "Booking..."
            : `Book (${quantity})`}
        </button>
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
