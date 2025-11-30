"use client";

import React, { useState, useTransition, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { DisableBookingData } from "@/types";
import { disableBookingSchema } from "@/app/models/db/lib/schemas/disableBookingSchema";
import { toast } from "sonner";
import TimeSelect from "@/components/activities/activityBooking/TimeSelect";

interface Props {
  action: (
    data: DisableBookingData
  ) => Promise<{ message: string; status?: number }>;
  initialData: DisableBookingData;
  activities: { id: string; name_en: string }[];
  rooms: { id: string; name_en: string }[];
  locale: string;
}

export default function EditDisableBookingForm({
  action,
  initialData,
  activities,
  rooms,
  locale,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const isArabic = locale === "ar";

  // form state including the ID
  const [form, setForm] = useState<DisableBookingData>({ ...initialData });

  // activity time
  const [timeStart, setTimeStart] = useState("");
  const [timeEnd, setTimeEnd] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  const list = form.type === "activity" ? activities : rooms;

  // populate times if activity with datetime
useEffect(() => {
  if (
    form.type === "activity" &&
    typeof form.start_date === "string" &&
    form.start_date.includes(" ")
  ) {
    const [startDate, startTime] = form.start_date.split(" ");
    const [endDate, endTime] =
      typeof form.end_date === "string" ? form.end_date.split(" ") : ["", ""];
    setForm((prev) => ({
      ...prev,
      start_date: startDate,
      end_date: endDate,
    }));
    setTimeStart(startTime.slice(0, 2));
    setTimeEnd(endTime.slice(0, 2));
  }
}, [form.type]);


  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (newType: "activity" | "room") => {
    setForm((prev) => ({
      ...prev,
      type: newType,
      ref_id: "",
      start_date: "",
      end_date: "",
    }));
    setTimeStart("");
    setTimeEnd("");
  };

  const handleSubmit = () => {
    let finalStart = form.start_date;
    let finalEnd = form.end_date;

    // append times if activity
    if (form.type === "activity") {
      if (!timeStart || !timeEnd) {
        toast.error(isArabic ? "اختر وقت البداية والنهاية" : "Choose start and end hours");
        return;
      }
      finalStart = `${form.start_date} ${timeStart}:00`;
      finalEnd = `${form.end_date} ${timeEnd}:00`;
    }

    console.log(" form kk: ",form);
    
    const validated = disableBookingSchema.safeParse({
      ...form,
      start_date: finalStart,
      end_date: finalEnd,
    });

    if (!validated.success) {
      const fieldErrors: Record<string, string> = {};
      validated.error.issues.forEach((err) => {
        fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      toast.error(isArabic ? "يرجى ملء جميع الحقول المطلوبة" : "Please fill all required fields");
      return;
    }

    setErrors({});
    startTransition(async () => {
      try {
        console.log("validated: ",validated);
        
        const result = await action(validated.data);
        if (result.status === 200 || result.status === 201) {
          toast.success(result.message);
          setTimeout(() => router.push("/admin/dashboard/disable_booking"), 900);
        } else {
          toast.error(result.message);
        }
      } catch (_error) {
        toast.error(isArabic ? "فشل في تحديث الحجز المعطل" : "Failed to update disabled booking.");
      }
    });
  };

  const currentItem =
    form.type === "activity"
      ? activities.find((a) => a.id === form.ref_id)
      : rooms.find((r) => r.id === form.ref_id);

  return (
    <main className="ml-3 xl:ml-7 mb-10 text-gray-800">
      <div className="flex flex-col border-b border-gray-300 pb-3 w-[65vw] mb-8">
        <h1 className="text-2xl font-semibold text-[#676e32]">
          {isArabic ? "تعديل الحجز المعطل" : "Edit Disabled Booking"}
        </h1>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="flex flex-col w-full lg:w-[65vw] gap-6"
      >
        <Card className="w-full shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-[#676e32]">{isArabic ? "تعديل الحجز المعطل" : "Edit Disabled Booking"}</CardTitle>
            <CardDescription>{isArabic ? "قم بتحديث التواريخ للحجز المعطل." : "Update the date range of the disabled booking."}</CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-6 mb-7">
            {/* Type & item (disabled) */}
            <div className="flex flex-col md:w-[90%]">
              <Label className="text-sm font-medium text-gray-700 mb-1">
                {isArabic ? "النوع والعنصر" : "Type & Item"}
              </Label>
              <input
                type="text"
                disabled
                value={`${form.type === "activity" ? (isArabic ? "نشاط" : "Activity") : (isArabic ? "إقامة" : "Room")}: ${currentItem?.name_en || "Unknown"}`}
                className="border border-gray-300 px-3 py-2 rounded-md text-gray-800 bg-gray-100"
              />
            </div>

            {/* Date inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col md:w-[90%]">
                <Label className="text-sm font-medium text-gray-700 mb-1">
                  <span className="text-red-500">*</span> {isArabic ? "تاريخ البداية" : "Start Date"}
                </Label>
                <input
                  type="date"
                  name="start_date"
                  value={form.start_date ?? ""}
                  onChange={handleInputChange}
                  className="border border-gray-300 px-3 py-2 rounded-md text-gray-800"
                  disabled={isPending}
                />
                {errors.start_date && <p className="text-red-500 text-sm">{errors.start_date}</p>}
              </div>

              <div className="flex flex-col md:w-[90%]">
                <Label className="text-sm font-medium text-gray-700 mb-1">
                  <span className="text-red-500">*</span> {isArabic ? "تاريخ النهاية" : "End Date"}
                </Label>
                <input
                  type="date"
                  name="end_date"
                  value={form.end_date ?? ""}
                  onChange={handleInputChange}
                  className="border border-gray-300 px-3 py-2 rounded-md text-gray-800"
                  disabled={isPending}
                />
                {errors.end_date && <p className="text-red-500 text-sm">{errors.end_date}</p>}
              </div>
            </div>

            {/* Time pickers for activity */}
            {form.type === "activity" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>{isArabic ? "وقت البداية" : "Start Time"}</Label>
                  <TimeSelect value={timeStart} onChange={setTimeStart} locale={locale} />
                </div>
                <div>
                  <Label>{isArabic ? "وقت النهاية" : "End Time"}</Label>
                  <TimeSelect value={timeEnd} onChange={setTimeEnd} locale={locale} />
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-center mt-8 gap-4">
              <button
                type="button"
                disabled={isPending}
                className="px-5 py-2 rounded-md border border-gray-400 text-gray-700 hover:bg-gray-100"
                onClick={() => router.replace("/admin/dashboard/disable_booking")}
              >
                {isArabic ? "إلغاء" : "Cancel"}
              </button>

              <button
                type="submit"
                disabled={isPending}
                className="px-5 py-2 rounded-md bg-[#676e32] text-white hover:bg-[#7b8444]"
              >
                {isPending ? (isArabic ? "جاري الحفظ..." : "Saving...") : (isArabic ? "تحديث" : "Update")}
              </button>
            </div>
          </CardContent>
        </Card>
      </form>
    </main>
  );
}
