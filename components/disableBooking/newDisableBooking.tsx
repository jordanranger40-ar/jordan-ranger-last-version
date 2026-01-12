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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { disableBookingSchema } from "@/app/models/db/lib/schemas/disableBookingSchema";
import { toast } from "sonner";
import TimeSelect from "@/components/activities/activityBooking/TimeSelect";
import LightButton from "../ui/light-button";
import DarkButton from "../ui/dark-button";

interface Props {
  action: (
    data: DisableBookingData
  ) => Promise<{ message: string; status: number; success: boolean }>;
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
  const [form, setForm] = useState<DisableBookingData>({
    type: "activity",
    ref_id: "",
    start_date: "",
    end_date: "",
  });

  const [timeStart, setTimeStart] = useState("");
  const [timeEnd, setTimeEnd] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const list = form.type === "activity" ? activities : rooms;

  const handleTypeChange = (newType: "activity" | "room") => {
    setForm({
      type: newType,
      ref_id: "",
      start_date: "",
      end_date: "",
    });
    setTimeStart("");
    setTimeEnd("");
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    let finalStart = form.start_date;
    let finalEnd = form.end_date;

    if (form.type === "activity") {
      if (!timeStart || !timeEnd) {
        toast.error("Choose start and end hours");
        return;
      }
      finalStart = `${form.start_date} ${timeStart}:00`;
      finalEnd = `${form.end_date} ${timeEnd}:00`;
    }

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
      toast.error("Please fill all required fields");
      return;
    }

    setErrors({});
    startTransition(async () => {
      const result = await action(validated.data);
      if (result.status === 201) {
        toast.success(result.message);
        router.push("/admin/dashboard/disable_booking");
        return;
      } else if (result.status === 401) {
        toast.error(result.message);
        router.push("/login");
        return;
      } else if (result.status === 403) {
        toast.error(result.message);
        router.push("/");
        return;
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <main className="ml-3 xl:ml-7 mb-10 text-gray-800">
      <div className="flex flex-col border-b border-gray-300 pb-3 w-[65vw] mb-8">
        <h1 className="text-2xl font-semibold text-[#676e32]">
          Disable Booking
        </h1>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="flex flex-col w-full lg:w-[65vw] gap-6"
      >
        <Card className="w-full shadow-md">
          <CardHeader>
            <CardTitle className="text-[#676e32]">Disable Booking</CardTitle>
            <CardDescription>Choose type and date range</CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-6 mb-7">
            {/* Type selector */}
           <div className="flex flex-col md:w-[70%]">
  <Label className="mb-2 ml-2">
    <span className="text-red-500">*</span>Type
  </Label>

  <Select
    value={form.type}
    onValueChange={(value) =>
      handleTypeChange(value as "activity" | "room")
    }
  >
    <SelectTrigger className="h-10 w-full border focus:ring-2 focus:ring-[#676e32]">
      <SelectValue placeholder="Select type" />
    </SelectTrigger>

    <SelectContent>
      <SelectItem value="activity">Activity</SelectItem>
      <SelectItem value="room">Accommodation</SelectItem>
    </SelectContent>
  </Select>
</div>


            {/* Activity / Room selector */}
            <div className="flex flex-col md:w-[70%]">
  <Label className="mb-2 ml-2">
    <span className="text-red-500">*</span>{" "}
    {form.type === "activity" ? "Activity" : "Accommodation"}
  </Label>

  <Select
    value={form.ref_id}
    onValueChange={(value) =>
      handleInputChange({
        target: { name: "ref_id", value },
      } as React.ChangeEvent<HTMLInputElement>)
    }
  >
    <SelectTrigger
      className={`h-10 w-full border focus:ring-2 focus:ring-[#676e32] ${
        errors.ref_id ? "border-red-500" : "border-gray-300"
      }`}
    >
      <SelectValue placeholder="Select one" />
    </SelectTrigger>

    <SelectContent>
      {list.map((item) => (
        <SelectItem key={item.id} value={item.id}>
          {item.name_en}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>

  {errors.ref_id && (
    <p className="text-red-500 text-sm mt-1">{errors.ref_id}</p>
  )}
</div>


            {/* Date input */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="mb-2 ml-2">
                  <span className="text-red-500">*</span> Start Date
                </Label>
                <input
                  type="date"
                  name="start_date"
                  value={form.start_date ?? ""}
                  onChange={handleInputChange}
                  className="border px-3 py-2 rounded-md w-full"
                />
              </div>
              <div>
                <Label className="mb-2 ml-2">
                  <span className="text-red-500">*</span> End Date
                </Label>
                <input
                  type={form.type === "activity" ? "date" : "date"}
                  name="end_date"
                  value={form.end_date ?? ""}
                  onChange={handleInputChange}
                  className="border px-3 py-2 rounded-md w-full"
                />
              </div>
            </div>

            {/* TIME PICKERS (activity only) */}
            {form.type === "activity" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="mb-2 ml-2">Start Time</Label>
                  <TimeSelect value={timeStart} onChange={setTimeStart} />
                </div>
                <div>
                  <Label className="mb-2 ml-2">End Time</Label>
                  <TimeSelect value={timeEnd} onChange={setTimeEnd} />
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-center mt-8 gap-4">
              <LightButton
                type="button"
                disabled={isPending}
                onClick={() =>
                  router.replace("/admin/dashboard/disable_booking")
                }
              >
                Cancel
              </LightButton>
              <DarkButton type="submit" disabled={isPending}>
                {" "}
                {isPending ? "Saving..." : "Disable Booking"}
              </DarkButton>
            </div>
          </CardContent>
        </Card>
      </form>
    </main>
  );
}
