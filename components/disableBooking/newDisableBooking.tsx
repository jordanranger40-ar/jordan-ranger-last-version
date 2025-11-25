"use client";

import React, { useState, useTransition } from "react";
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

interface Props {
  action: (data: DisableBookingData) => Promise<{ message: string; status?: number }>;
  activities: { id: string; name_en: string }[];
  rooms: { id: string; name_en: string }[];
}

export default function CreateDisableBookingForm({
  action,
  activities,
  rooms,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [form, setForm] = useState<DisableBookingData>({
    type: "activity",
    ref_id: "",
    start_date: "",
    end_date: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // compute list directly each render (no effect)
  const list = form.type === "activity" ? activities : rooms;

  const handleTypeChange = (newType: "activity" | "room") => {
    setForm((prev) => ({
      ...prev,
      type: newType,
      ref_id: "", // reset selection reliably
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const validation = disableBookingSchema.safeParse(form);

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((err) => {
        fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);

      setToast({ message: "Please complete all required fields", type: "error" });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    setErrors({});
    startTransition(async () => {
      try {
        const result = await action(form);

        if (result.status === 201) {
          // success
          setToast({ message: result.message, type: "success" });
          setTimeout(() => {
            setToast(null);
            router.push("/admin/dashboard/disable_booking");
          }, 700);
        } else {
          // conflict or other error
          setToast({ message: result.message, type: "error" });
          setTimeout(() => setToast(null), 3000);
        }
      } catch (error) {
        console.error(error);
        setToast({ message: "Failed to disable booking.", type: "error" });
        setTimeout(() => setToast(null), 3000);
      }
    });
  };

  return (
    <main className="ml-3 xl:ml-7 mb-10 text-gray-800">
      <div className="flex flex-col border-b border-gray-300 pb-3 w-[65vw] mb-8">
        <h1 className="text-2xl font-semibold text-[#676e32]">Disable Booking</h1>
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
            <CardTitle className="text-[#676e32]">Disable Booking</CardTitle>
            <CardDescription>Select type and date range to disable booking.</CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-6 mb-7">
            {/* Type selector */}
            <div className="flex flex-col md:w-[90%]">
              <Label className="text-sm font-medium text-gray-700 mb-1">
                <span className="text-red-500">*</span> Type
              </Label>
              <select
                name="type"
                disabled={isPending}
                value={form.type}
                onChange={(e) => handleTypeChange(e.target.value as "activity" | "room")}
                className="border border-gray-300 px-3 py-2 rounded-md text-gray-800"
              >
                <option value="activity">Activity</option>
                <option value="room">Accommodation</option>
              </select>
            </div>

            {/* Activity/Room selector */}
            <div className="flex flex-col md:w-[90%]">
              <Label className="text-sm font-medium text-gray-700 mb-1">
                <span className="text-red-500">*</span>{" "}
                {form.type === "activity" ? "Activity" : "Accommodation"}
              </Label>
              <select
                key={form.type}
                name="ref_id"
                disabled={isPending}
                value={form.ref_id}
                onChange={handleInputChange}
                className="border border-gray-300 px-3 py-2 rounded-md text-gray-800"
              >
                <option value="">Select one</option>
                {list.length === 0 ? (
                  <option value="" disabled>
                    No items available
                  </option>
                ) : (
                  list.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name_en}
                    </option>
                  ))
                )}
              </select>
              {errors.ref_id && <p className="text-red-500 text-sm">{errors.ref_id}</p>}
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col md:w-[90%]">
                <Label className="text-sm font-medium text-gray-700 mb-1">
                  <span className="text-red-500">*</span> Start Date
                </Label>
                <input
                  type="datetime-local"
                  name="start_date"
                  disabled={isPending}
                  value={form.start_date??""}
                  onChange={handleInputChange}
                  className="border border-gray-300 px-3 py-2 rounded-md text-gray-800"
                />
                {errors.start_date && <p className="text-red-500 text-sm">{errors.start_date}</p>}
              </div>

              <div className="flex flex-col md:w-[90%]">
                <Label className="text-sm font-medium text-gray-700 mb-1">
                  <span className="text-red-500">*</span> End Date
                </Label>
                <input
                  type="datetime-local"
                  name="end_date"
                  disabled={isPending}
                  value={form.end_date??""}
                  onChange={handleInputChange}
                  className="border border-gray-300 px-3 py-2 rounded-md text-gray-800"
                />
                {errors.end_date && <p className="text-red-500 text-sm">{errors.end_date}</p>}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-center mt-8">
              <div className="flex gap-4">
                <button
                  type="button"
                  disabled={isPending}
                  className="px-5 py-2 rounded-md border border-gray-400 text-gray-700 hover:bg-gray-100"
                  onClick={() => router.replace("/admin/dashboard/disable_booking")}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 rounded-md bg-[#676e32] text-white hover:bg-[#7b8444]"
                >
                  {isPending ? "Saving..." : "Disable Booking"}
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-50 px-5 py-3 rounded-lg shadow-lg text-white font-medium transition-all duration-500 transform ${
            toast ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          } ${toast.type === "success" ? "bg-[#676e32]" : "bg-red-600"}`}
        >
          {toast.message}
        </div>
      )}
    </main>
  );
}
