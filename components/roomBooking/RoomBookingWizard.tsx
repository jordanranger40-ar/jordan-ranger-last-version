"use client";
import { useState } from "react";
import RoomBookingForm from "./roomBookingForm";
import BookingProgressBar from "./BookingProgressBar";
import BookingConfirmation from "./roomBookingConfirmation";
import { useSession } from "next-auth/react";
import { newRoom } from "@/types";

type RoomBookingWizardProps = {
  room: newRoom;
  bookedDates: { start: string; end: string }[];
  locale: string; // "ar" or "en"
  uniqueTypes:string[]
};

export default function RoomBookingWizard({
  room,
  bookedDates,
  locale,
  uniqueTypes
}: RoomBookingWizardProps) {
  const isArabic = locale === "ar";
  const { data: session } = useSession();
  const user = session?.user;

  const [selectedRange, setSelectedRange] = useState<{
    start: string;
    end: string;
  } | null>(null);
  const [bookingDone, setBookingDone] = useState(false);

  return (
    <div
      className="bg-white shadow-md rounded-lg p-6 w-[95%]"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <BookingProgressBar
        currentStep={bookingDone ? 2 : 1}
        locale={locale}
      />

      {!bookingDone && (
        <RoomBookingForm
          room={room}
          bookedDates={bookedDates}
          locale={locale}
          onBooked={(range) => {
            setSelectedRange(range);
            setBookingDone(true);
          }}
        />
      )}

      {bookingDone && selectedRange && (
        <BookingConfirmation
          RoomName={isArabic ? room.name_ar ?? room.name_en : room.name_en}
          start={selectedRange.start}
          end={selectedRange.end}
          price={Number(room.price) ?? 0}
          user={{
            name: `${user?.firstName ?? ""} ${user?.lastName ?? ""}`,
            email: user?.email,
          }}
          onGoToCart={() => (window.location.href = "/my-cart")}
          continueButton={() =>
            (window.location.href = "/my-bookings")
          }
          locale={locale}
          uniqueTypes={uniqueTypes}
        />
      )}
    </div>
  );
}
