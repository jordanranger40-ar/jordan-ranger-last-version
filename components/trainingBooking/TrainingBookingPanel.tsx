"use client";
import { useState, useRef, useEffect } from "react";
import TrainingBookingForm from "./TrainingBookingForm";
import BookingConfirmation from "./BookingConfirmation";
import { CircleX } from "lucide-react";
import { useSession } from "next-auth/react";
import BookingProgressBar from "./BookingProgressBar";
import { newTraining } from "@/types";
import DarkButton from "../ui/dark-button";

export default function TrainingBookingPanel({
  training,
  numberOfBooked
}: {
  training: newTraining;
  numberOfBooked:number
}) {
  const { data: session } = useSession();
  const userDetails = session?.user;

  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [bookingDone, setBookingDone] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);

  // Current booking step
  const currentStep = bookingDone ? 2 : 1;

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setBookingDone(false);
        setQuantity(1);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Close modal on Escape key
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


  console.log("training.start_date: ",training.start_date);
  
  return (
    <div className="mt-6">
      <DarkButton
        onClick={() => {
          setOpen(true);
          setBookingDone(false);
          setQuantity(1);
        }}
       
      >
        Book this Training
      </DarkButton>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div
            ref={modalRef}
            className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Book {training.name_en}</h3>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-600 cursor-pointer"
              >
                <CircleX />
              </button>
            </div>

            {/* Progress Bar */}
            <BookingProgressBar currentStep={currentStep} />

            {/* ✅ Step 2: Confirmation */}
            {bookingDone && (
              <BookingConfirmation
                activityName={training.name_en}
                start={training.start_date.toISOString() ?? ""}
                end={training.end_date.toISOString() ?? ""}
                quantity={quantity}
                price={training.price ?? 1}
                user={{
                  name: `${userDetails?.firstName ?? ""} ${
                    userDetails?.lastName ?? ""
                  }`,
                  email: userDetails?.email ?? "",
                }}
                onGoToCart={() => {
                  setOpen(false);
                  window.location.href = "/my-cart";
                }}
                continueButton={() => setOpen(false)}
              />
            )}

            {/* ✅ Step 1: Booking Form (quantity only) */}
            {!bookingDone && (
              <TrainingBookingForm
                training_id={training.id ?? ""}
                price={training.price ?? 1}
                capacity={training.capacity ?? 0}
                numberOfBooked={numberOfBooked ?? 0}
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
