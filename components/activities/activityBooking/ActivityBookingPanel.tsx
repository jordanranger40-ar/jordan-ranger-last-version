"use client";
import { useState, useRef, useEffect } from "react";
import CheckAvailabilityForm from "./CheckAvailabilityForm";
import ActivityBookingForm from "./ActivityBookingForm";
import BookingConfirmation from "./BookingConfirmation";
import { CircleX } from "lucide-react";
import { useSession } from "next-auth/react";

type Activity = { id: string; name: string; capacity?: number; price?: number };


export default function ActivityBookingPanel({ activity }: { activity: Activity }) {
  const session= useSession()
const userDetails= session.data?.user
  const [open, setOpen] = useState(false);
  const [available, setAvailable] = useState<number | null>(null);
  const [selectedRange, setSelectedRange] = useState<{ start: string; end: string } | null>(null);
  const [bookingDone, setBookingDone] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setOpen(false);
        setBookingDone(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    else document.removeEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setBookingDone(false);
      }
    };
    if (open) document.addEventListener("keydown", handleEsc);
    else document.removeEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [open]);
  console.log(activity.price)

  return (
    <div className="mt-6">
      <button
        onClick={() => {
          setOpen(true);
          setAvailable(null);
          setSelectedRange(null);
          setBookingDone(false);
        }}
        className="bg-[#676e32] text-white px-4 py-2 rounded-md hover:bg-[#7c863a]"
      >
        Book this activity
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div ref={modalRef} className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Book {activity.name}</h3>
              <button onClick={() => setOpen(false)} className="text-gray-600 cursor-pointer">
                <CircleX />
              </button>
            </div>

            {/* Show confirmation if booking done */}
            {bookingDone && selectedRange && (
              <BookingConfirmation
                activityName={activity.name}
                start={selectedRange.start}
                end={selectedRange.end}
                quantity={quantity}
                price={quantity* (Number(activity.price)??1)}
                user={{ name: userDetails?.firstName??"" + userDetails?.lastName, email: userDetails?.email }} 
                onGoToCart={() => {
                  setOpen(false);
                  window.location.href = "/cart";
                }}
                continueButton= {()=>{
                  setOpen(false)
                }}
              />
            )}
            

            {/* Show booking forms if booking not done */}
            {!bookingDone && !selectedRange && (
              <CheckAvailabilityForm
                activityId={activity.id}
                onAvailable={(remaining, range) => {
                  setAvailable(remaining);
                  setSelectedRange(range);
                }}
              />
            )}

            {!bookingDone && selectedRange && available !== null && (
              <ActivityBookingForm
              activityId={activity.id}
              available={available}
              selectedRange={selectedRange}
              onBooked={(success, bookedQuantity) => {
                if (success) {
                  setQuantity(bookedQuantity); // ✅ احفظ الكمية الفعلية
                  setBookingDone(true);
                }
              }}
            />
            
            )}
          </div>
        </div>
      )}
    </div>
  );
}
