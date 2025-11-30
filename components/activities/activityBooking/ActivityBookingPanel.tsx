"use client";
import { useState, useRef, useEffect } from "react";
import CheckAvailabilityForm from "./CheckAvailabilityForm";
import ActivityBookingForm from "./ActivityBookingForm";
import BookingConfirmation from "./BookingConfirmation";
import BookingProgressBar from "./BookingProgressBar";
import DarkButton from "@/components/ui/dark-button";
import { CircleX } from "lucide-react";
import { useSession } from "next-auth/react";
import { newActivity } from "@/types";
import { useLocale } from "next-intl";

type Activity = newActivity;

export default function ActivityBookingPanel({ activity,uniqueTypes }: { activity: Activity,uniqueTypes:string[] }) {
  const { data: session } = useSession();
  console.log("session: ",session);
  
  const userDetails = session?.user;
  const locale = useLocale();
  const isArabic = locale === "ar";

  const [open, setOpen] = useState(false);
  const [available, setAvailable] = useState<number | null>(null);
  const [selectedRange, setSelectedRange] = useState<{ start: string } | null>(null);
  const [bookingDone, setBookingDone] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const modalRef = useRef<HTMLDivElement>(null);

  const currentStep = bookingDone ? 3 : selectedRange ? 2 : 1;

  // Handlers for modal behavior
  const openModal = () => {
    setSelectedRange(null);
    setAvailable(null);
    setBookingDone(false);
    setQuantity(1);
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setSelectedRange(null);
    setAvailable(null);
    setBookingDone(false);
    setQuantity(1);
  };

  // Close modal on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        closeModal();
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Close modal on Escape
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeModal();
    };
    if (open) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [open]);

  return (
    <div className="mt-3">
      <DarkButton onClick={openModal}>
        {isArabic ? "احجز هذا النشاط" : "Book this activity"}
      </DarkButton>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center   bg-black/40 p-4"
          dir={isArabic ? "rtl" : "ltr"}
        >
          <div
            ref={modalRef}
            className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {isArabic
                  ? `احجز ${activity.name_ar ?? activity.name_en}`
                  : `Book ${activity.name_en}`}
              </h3>
              <button onClick={closeModal} className="text-gray-600 cursor-pointer">
                <CircleX />
              </button>
            </div>

            {/* Booking Progress */}
            <BookingProgressBar currentStep={currentStep}  locale={locale}/>

            {/* Step 3: Booking Confirmation */}
            {bookingDone && selectedRange && (
              <BookingConfirmation
                activityName={isArabic ? activity.name_ar ?? activity.name_en : activity.name_en}
                start={selectedRange.start}
                quantity={quantity}
                price={activity.price ?? 1}
                user={{
                  name: `${userDetails?.firstName ?? ""} ${userDetails?.lastName ?? ""}`,
                  email: userDetails?.email ?? "",
                }}
                onGoToCart={() => {
                  closeModal();
                  window.location.href = "/my-cart";
                }}
                continueButton={closeModal}
                locale={locale}
                uniqueTypes={uniqueTypes}
              />
            )}

            {/* Step 1: Check Availability */}
            {!bookingDone && !selectedRange && (
              <CheckAvailabilityForm
                activityId={activity.id ?? ""}
                onAvailable={(remaining, range) => {
                  setAvailable(remaining);
                  setSelectedRange(range);
                }}
                locale={locale}
              />
            )}

            {/* Step 2: Booking Form */}
            {!bookingDone && selectedRange && available !== null && (
              <ActivityBookingForm
                activityId={activity.id ?? ""}
                available={available}
                minimum_quantity={activity.minimum_quantity}
                price={activity.price ?? 1}
                selectedRange={selectedRange}
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
