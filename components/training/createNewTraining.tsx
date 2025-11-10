"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { newTrainingSchema } from "@/app/models/db/lib/schemas/trainingSchema";
import { newTraining } from "@/types";
import ImageUploader from "@/components/imageUpload";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Props {
  action: (data: newTraining) => Promise<void>;
}

export default function CreateEventForm({ action }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [form, setForm] = useState<newTraining>({
    slug: "",
    name_en: "",
    name_ar: "",
    description_en: "",
    description_ar: "",
    category_en: "",
    category_ar: "",
    start_date: new Date(),
    end_date: new Date(),
    price: 0,
    capacity: 0,
    image: "",
    is_deleted: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => {
      const updated = { ...prev, [name]: value };

      if (name === "name_en") {
        updated.slug = value
          .toLowerCase()
          .replace(/&/g, "and")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");
      }

      return updated;
    });
  };

  const handleFormSubmit = () => {
    const validation = newTrainingSchema.safeParse(form);

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((err) => {
        fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      setToast({ message: "Please fill the highlighted fields.", type: "error" });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    setErrors({});
    startTransition(async () => {
      try {
        await action({ ...form });
        setToast({ message: "Event created successfully!", type: "success" });
        setTimeout(() => {
          setToast(null);
          router.push("/admin/dashboard/training");
        }, 200);
      } catch (error) {
        console.error(error);
        setToast({ message: "Failed to create event.", type: "error" });
        setTimeout(() => setToast(null), 3000);
      }
    });
  };

  const handleUploadComplete = (url: string) => {
    setForm({ ...form, image: url });
  };

  const handleImageDelete = () => {
    setForm({ ...form, image: "" });
  };

  return (
    <main className="ml-3 xl:ml-7 mb-10 text-gray-800">
      <div className="flex flex-col border-b border-gray-300 pb-3 w-[65vw] mb-8">
        <h1 className="text-2xl font-semibold text-[#676e32]">New Event</h1>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleFormSubmit();
        }}
        className="h-full w-full lg:w-[65vw] flex flex-col gap-6"
      >
        <Card className="w-full shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-[#676e32]">Event Details</CardTitle>
            <CardDescription>Fill in the event details below.</CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-6 mb-7">
            {/* Slug */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="flex flex-col md:w-[90%]">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Slug (Auto Generated)
              </label>
              <input
                type="text"
                name="slug"
                value={form.slug}
                readOnly
                className="border border-gray-300 px-3 py-2 rounded-md bg-gray-100 text-gray-800 cursor-not-allowed"
              />
            </div>
            </div>
           

            {/* Names */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: "English Name", name: "name_en", value: form.name_en },
                { label: "Arabic Name", name: "name_ar", value: form.name_ar },
              ].map((field) => (
                <div key={field.name} className="flex flex-col md:w-[90%]">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    <span className="text-red-500">*</span> {field.label}
                  </label>
                  <input
                    type="text"
                    name={field.name}
                    value={field.value}
                    onChange={handleInputChange}
                    className="border border-gray-300 px-3 py-2 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#676e32]"
                  />
                  {errors[field.name] && (
                    <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>
                  )}
                </div>
              ))}
            </div>

           {/* Category (Select Inputs) */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* English Category */}
  <div className="flex flex-col md:w-[90%]">
    <label className="text-sm font-medium text-gray-700 mb-1">
      <span className="text-red-500">*</span> English Category
    </label>
    <select
      name="category_en"
      value={form.category_en}
      onChange={handleInputChange}
      className="border border-gray-300 px-3 py-2 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#676e32]"
    >
      <option value="">Select a category</option>
      <option value="Schools Training">Schools Training</option>
      <option value="Corporate Team Building">Corporate Team Building</option>
    </select>
    {errors.category_en && (
      <p className="text-red-500 text-sm mt-1">{errors.category_en}</p>
    )}
  </div>

  {/* Arabic Category */}
  <div className="flex flex-col md:w-[90%]">
    <label className="text-sm font-medium text-gray-700 mb-1">
      <span className="text-red-500">*</span> Arabic Category
    </label>
    <select
      name="category_ar"
      value={form.category_ar}
      onChange={handleInputChange}
      className="border border-gray-300 px-3 py-2 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#676e32]"
    >
      <option value="">اختر الفئة</option>
      <option value="تدريب المدارس">تدريب المدارس</option>
      <option value="بناء فرق الشركات">بناء فرق الشركات</option>
    </select>
    {errors.category_ar && (
      <p className="text-red-500 text-sm mt-1">{errors.category_ar}</p>
    )}
  </div>
</div>


            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: "Start Date", name: "start_date", value: form.start_date },
                { label: "End Date", name: "end_date", value: form.end_date },
              ].map((field) => (
                <div key={field.name} className="flex flex-col md:w-[90%]">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    <span className="text-red-500">*</span> {field.label}
                  </label>
                  <input
                    type="date"
                    name={field.name}
                    value={new Date(field.value).toISOString().split("T")[0]}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        [field.name]: new Date(e.target.value),
                      }))
                    }
                    className="border border-gray-300 px-3 py-2 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#676e32]"
                  />
                  {errors[field.name] && (
                    <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Price & Capacity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: "Price", name: "price", value: form.price, type: "number" },
                { label: "Capacity", name: "capacity", value: form.capacity, type: "number" },
              ].map((field) => (
                <div key={field.name} className="flex flex-col md:w-[90%]">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    <span className="text-red-500">*</span> {field.label}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={field.value}
                    onChange={handleInputChange}
                    className="border border-gray-300 px-3 py-2 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#676e32]"
                  />
                  {errors[field.name] && (
                    <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Descriptions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  label: "English Description",
                  name: "description_en",
                  value: form.description_en,
                },
                {
                  label: "Arabic Description",
                  name: "description_ar",
                  value: form.description_ar,
                },
              ].map((field) => (
                <div key={field.name} className="flex flex-col md:w-[90%]">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    <span className="text-red-500">*</span> {field.label}
                  </label>
                  <textarea
                    name={field.name}
                    value={field.value}
                    onChange={handleInputChange}
                    className="border border-gray-300 px-3 py-2 rounded-md text-gray-800 h-[12vh] resize-none focus:outline-none focus:ring-2 focus:ring-[#676e32]"
                  />
                  {errors[field.name] && (
                    <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Image Upload */}
            <div className="flex flex-col md:w-[60%]">
              <label className="text-base text-black mb-2">
                <span className="text-red-500">*</span> Event Image
              </label>
              <ImageUploader
                endpoint="courses"
                initialImageUrl={form.image ?? ""}
                onUploadComplete={handleUploadComplete}
                onUploadError={(e) =>
                  setToast({ message: e.message, type: "error" })
                }
                onDelete={handleImageDelete}
              />
              {errors.image && (
                <p className="text-red-500 text-sm mt-1">{errors.image}</p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-center mt-8">
              <div className="flex gap-4">
                <button
                  type="button"
                  className="px-5 py-2 rounded-md border border-gray-400 cursor-pointer text-gray-700 hover:bg-gray-100 transition"
                  onClick={() => router.replace("/admin/dashboard/events")}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-md bg-[#676e32] text-white cursor-pointer hover:bg-[#7b8444] transition"
                  disabled={isPending}
                >
                  {isPending ? "Saving..." : "Save Changes"}
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
