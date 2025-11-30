"use client";
import { useState, useRef, useEffect } from "react";
import TrainingBookingForm from "./TrainingBookingForm";
import BookingConfirmation from "./BookingConfirmation";
import { CircleX } from "lucide-react";
import { useSession } from "next-auth/react";
import BookingProgressBar from "./BookingProgressBar";
import { newTraining } from "@/types";
import DarkButton from "../ui/dark-button";
import { useLocale } from "next-intl";

export default function TrainingBookingPanel({
  training,
  numberOfBooked,
  uniqueTypes
}: {
  training: newTraining;
  numberOfBooked: number;
  uniqueTypes:string[]
}) {
  const { data: session } = useSession();
  const userDetails = session?.user;

  const locale = useLocale();
  const isArabic = locale === "ar";

  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [bookingDone, setBookingDone] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);

  const currentStep = bookingDone ? 2 : 1;

  
  // Close modal on outside click
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setOpen(false);
        setBookingDone(false);
        setQuantity(1);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  
  // Close on Escape key

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
    <div className="mt-6" dir={isArabic ? "rtl" : "ltr"}>
      <DarkButton
        onClick={() => {
          setOpen(true);
          setBookingDone(false);
          setQuantity(1);
        }}
      >
        {isArabic ? "احجز هذا التدريب" : "Book this training"}
      </DarkButton>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div
            ref={modalRef}
            className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {isArabic
                  ? `احجز ${training.name_ar ?? training.name_en}`
                  : `Book ${training.name_en}`}
              </h3>

              <button
                onClick={() => setOpen(false)}
                className="text-gray-600 cursor-pointer"
              >
                <CircleX />
              </button>
            </div>

            {/* Progress bar */}
            <BookingProgressBar currentStep={currentStep} locale={locale} />

            {/* Confirmation */}
            {bookingDone && (
              <BookingConfirmation
                activityName={
                  isArabic ? training.name_ar ?? training.name_en : training.name_en
                }
                start={training.start_date.toISOString() ?? ""}
                end={training.end_date.toISOString() ?? ""}
                quantity={quantity}
                price={training.price ?? 1}
                user={{
                  name: `${userDetails?.firstName ?? ""} ${userDetails?.lastName ?? ""}`,
                  email: userDetails?.email ?? ""
                }}
                onGoToCart={() => {
                  setOpen(false);
                  window.location.href = "/my-cart";
                }}
                continueButton={() => setOpen(false)}
                locale={locale}
                uniqueTypes={uniqueTypes}
              />
            )}

            {/*  Training Booking Form */}
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
                locale={locale}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
