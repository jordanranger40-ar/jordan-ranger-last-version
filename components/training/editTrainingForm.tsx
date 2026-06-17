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
  training: newTraining;
  action: (
    id: string,
    data: newTraining
  ) => Promise<{ status: number; message: string; success: boolean }>;
}
import { toast } from "sonner";
import LightButton from "../ui/light-button";
import DarkButton from "../ui/dark-button";
import { Checkbox } from "../ui/checkbox";
import { Label } from "@radix-ui/react-label";
export default function EditTrainingForm({ training, action }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [form, setForm] = useState<newTraining>({
    id: training.id ?? "",
    slug: training.slug ?? "",
    name_en: training.name_en ?? "",
    name_ar: training.name_ar ?? "",
    description_en: training.description_en ?? "",
    description_ar: training.description_ar ?? "",
    category_en: training.category_en ?? "",
    category_ar: training.category_ar ?? "",
    start_date: training.start_date
      ? new Date(training.start_date)
      : new Date(),
    end_date: training.end_date ? new Date(training.end_date) : new Date(),
    price: training.price ?? 0,
    capacity: training.capacity ?? 0,
    card_image: training.card_image ?? "",
    is_deleted: training.is_deleted ?? false,
    header_image: training.header_image ?? "",
    post_image: training.post_image ?? "",
    coming_soon:training.coming_soon ?? false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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
console.log("errors: ",errors );
console.log("validation: ",validation);

    if (!validation.success) {
       const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((err) => {
        fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      toast.error("Please fill the highlighted fields.");
      return;
    }

    setErrors({});
    startTransition(async () => {
      try {
        const result = await action(training.id!, form);
        if (result.status === 201) {
          toast.success(result.message);
          router.push("/admin/dashboard/training");
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
          return;
        }
      } catch (_error) {
        toast.error("Failed to update training.");
      }
    });
  };

  return (
    <main className="ml-3 xl:ml-7 mb-10 text-gray-800">
      <div className="flex flex-col border-b border-gray-300 pb-3 w-[65vw] mb-8">
        <h1 className="text-2xl font-semibold text-[#676e32]">Edit Training</h1>
        <p className="text-sm text-gray-500">ID: {training.id}</p>
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
            <CardTitle className="text-[#676e32]">Training Details</CardTitle>
            <CardDescription>
              Update the training information below.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-6 mb-7">
            {/* Slug */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col md:w-[90%]">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Slug (Auto Generated)
                </label>
                <input
                  disabled={isPending}
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
                    disabled={isPending}
                    type="text"
                    name={field.name}
                    value={field.value}
                    onChange={handleInputChange}
                    className="border border-gray-300 px-3 py-2 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#676e32]"
                  />
                  {errors[field.name] && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors[field.name]}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Category (Select Inputs) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col md:w-[90%]">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  <span className="text-red-500">*</span> English Category
                </label>
                <select
                  disabled={isPending}
                  name="category_en"
                  value={form.category_en}
                  onChange={handleInputChange}
                  className="border border-gray-300 px-3 py-2 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#676e32]"
                >
                  <option value="">Select a category</option>
                  <option value="Schools Training">Schools Training</option>
                  <option value="Corporate Team Building">
                    Corporate Team Building
                  </option>
                   <option value="Training For Work">
                    Training For Work
                  </option>
                </select>
                {errors.category_en && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.category_en}
                  </p>
                )}
              </div>

              <div className="flex flex-col md:w-[90%]">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  <span className="text-red-500">*</span> Arabic Category
                </label>
                <select
                  disabled={isPending}
                  name="category_ar"
                  value={form.category_ar}
                  onChange={handleInputChange}
                  className="border border-gray-300 px-3 py-2 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#676e32]"
                >
                  <option value="">اختر الفئة</option>
                  <option value="تدريب المدارس">تدريب المدارس</option>
                  <option value="بناء فرق الشركات">بناء فرق الشركات</option>
                  <option value="التدريب من أجل العمل">التدريب من أجل العمل</option>
                </select>
                {errors.category_ar && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.category_ar}
                  </p>
                )}
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  label: "Start Date",
                  name: "start_date",
                  value: form.start_date,
                },
                { label: "End Date", name: "end_date", value: form.end_date },
              ].map((field) => (
                <div key={field.name} className="flex flex-col md:w-[90%]">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    <span className="text-red-500">*</span> {field.label}
                  </label>
                  <input
                    disabled={isPending}
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
                </div>
              ))}
            </div>

            {/* Price & Capacity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  label: "Price",
                  name: "price",
                  value: form.price,
                  type: "text",
                },
                {
                  label: "Capacity",
                  name: "capacity",
                  value: form.capacity,
                  type: "text",
                },
              ].map((field) => (
                <div key={field.name} className="flex flex-col md:w-[90%]">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    <span className="text-red-500">*</span> {field.label}
                  </label>
                  <input
                    disabled={isPending}
                    type={field.type}
                    name={field.name}
                    value={field.value}
                    onChange={handleInputChange}
                    className="border border-gray-300 px-3 py-2 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#676e32]"
                  />
                  {errors[field.name] && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors[field.name]}
                    </p>
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
                    disabled={isPending}
                    name={field.name}
                    value={field.value}
                    onChange={handleInputChange}
                    className="border border-gray-300 px-3 py-2 rounded-md text-gray-800 h-[12vh] resize-none focus:outline-none focus:ring-2 focus:ring-[#676e32]"
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-gray-200 p-4 bg-gray-50 w-fit">
              <Checkbox
                id="coming_soon"
                name="coming_soon"
                checked={form.coming_soon}
                disabled={isPending}
                onCheckedChange={(checked) => {
                  setForm({ ...form, coming_soon: checked === true });
                }}
                className="shadow-black cursor-pointer"
              />
              <Label className="text-sm font-medium text-gray-800 cursor-pointer select-none">
                Coming Soon
              </Label>
            </div>

            {/* Image Upload */}
            <div className="flex flex-col gap-8 mt-4">
              {/* Card Image */}
              <div>
                <label className="text-base text-black mb-2">
                  <span className="text-red-500">*</span> Card Image
                </label>
                <ImageUploader
                  endpoint="activities"
                  initialImageUrl={form.card_image ?? ""}
                  onUploadComplete={(url) =>
                    setForm({ ...form, card_image: url })
                  }
                  onUploadError={(e) => toast.error(e.message)}
                  onDelete={() => setForm({ ...form, card_image: "" })}
                />
                {errors.card_image && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.card_image}
                  </p>
                )}
              </div>

              {/* Poster Image */}
              <div>
                <label className="text-base text-black mb-2">
                  <span className="text-red-500">*</span> Poster Image
                </label>
                <ImageUploader
                  endpoint="activities"
                  initialImageUrl={form.post_image ?? ""}
                  onUploadComplete={(url) =>
                    setForm({ ...form, post_image: url })
                  }
                  onUploadError={(e) => toast.error(e.message)}
                  onDelete={() => setForm({ ...form, post_image: "" })}
                />
                {errors.post_image && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.post_image}
                  </p>
                )}
              </div>

              {/* Header Image */}
              <div>
                <label className="text-base text-black mb-2">
                  <span className="text-red-500">*</span> Header Image
                </label>
                <ImageUploader
                  endpoint="activities"
                  initialImageUrl={form.header_image ?? ""}
                  onUploadComplete={(url) =>
                    setForm({ ...form, header_image: url })
                  }
                  onUploadError={(e) => toast.error(e.message)}
                  onDelete={() => setForm({ ...form, header_image: "" })}
                />
                {errors.header_image && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.header_image}
                  </p>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-center mt-8">
              <div className="flex gap-4">
                <LightButton
                  disabled={isPending}
                  type="button"
                  onClick={() => router.replace("/admin/dashboard/training")}
                >
                  Cancel
                </LightButton>
                <DarkButton
                  disabled={isPending}
                  type="submit"
                  
                >
                  {isPending ? "Updating..." : "Save Changes"}
                </DarkButton>
                
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </main>
  );
}
