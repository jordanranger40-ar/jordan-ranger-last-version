"use client";
import { useState, useRef, useEffect } from "react";
import CheckAvailabilityForm from "./CheckAvailabilityForm";
import ActivityBookingForm from "./ActivityBookingForm";
import BookingConfirmation from "./BookingConfirmation";
import { CircleX } from "lucide-react";
import { useSession } from "next-auth/react";
import BookingProgressBar from "./BookingProgressBar"; 
import DarkButton from "@/components/ui/dark-button";

type Activity = { id: string ; name: string; capacity?: number; price?: number };

export default function ActivityBookingPanel({ activity }: { activity: Activity }) {
  const { data: session } = useSession();
  const userDetails = session?.user;
  const [open, setOpen] = useState(false);
  const [available, setAvailable] = useState<number | null>(null);
  const [selectedRange, setSelectedRange] = useState<{ start: string; end: string } | null>(null);
  const [bookingDone, setBookingDone] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const modalRef = useRef<HTMLDivElement>(null);

  // ✅ Compute current booking step
  const currentStep = bookingDone ? 3 : selectedRange ? 2 : 1;

  // close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setOpen(false);
        setBookingDone(false);
        setSelectedRange(null);
        setAvailable(null);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // close modal on Escape
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setBookingDone(false);
      }
    };
    if (open) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [open]);

  return (
    <div className="mt-6">
      <DarkButton
        onClick={() => {
          setOpen(true);
          setAvailable(null);
          setSelectedRange(null);
          setBookingDone(false);
        }}

      >
        Book this activity
      </DarkButton>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div ref={modalRef} className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Book {activity.name}</h3>
              <button onClick={() => setOpen(false)} className="text-gray-600 cursor-pointer">
                <CircleX />
              </button>
            </div>

            {/* ✅ Booking Progress Bar */}
            <BookingProgressBar currentStep={currentStep} />

            {/* ✅ Step 3: Confirmation */}
            {bookingDone && selectedRange && (
              <BookingConfirmation
                activityName={activity.name}
                start={selectedRange.start}
                end={selectedRange.end}
                quantity={quantity}
                price={activity.price ?? 1}
                user={{
                  name: `${userDetails?.firstName ?? ""} ${userDetails?.lastName ?? ""}`,
                  email: userDetails?.email ?? "",
                }}
                onGoToCart={() => {
                  setOpen(false);
                  window.location.href = "/my-cart";
                }}
                continueButton={() => setOpen(false)}
              />
            )}

            {/* ✅ Step 1: Check Availability */}
            {!bookingDone && !selectedRange && (
              <CheckAvailabilityForm
                activityId={activity.id}
                onAvailable={(remaining, range) => {
                  setAvailable(remaining);
                  setSelectedRange(range);
                }}
              />
            )}

            {/* ✅ Step 2: Fill Booking Form */}
            {!bookingDone && selectedRange && available !== null && (
              <ActivityBookingForm
                activityId={activity.id}
                available={available}
                price={activity.price ?? 1}
                selectedRange={selectedRange}
                onBooked={(success, bookedQuantity) => {
                  if (success) {
                    setQuantity(bookedQuantity);
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
