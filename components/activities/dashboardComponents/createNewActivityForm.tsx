"use client";
import { newActivitySchema } from "@/app/models/db/lib/schemas/activitySchema";
import { newActivity } from "@/types";
import ImageUploader from "@/components/imageUpload";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@radix-ui/react-dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

interface Props {
  action: (data: newActivity) => Promise<void>;
}
export default function CreateActivityForm({ action }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [form, setForm] = useState<newActivity>({
    slug: "",
    name_en: "",
    name_ar: "",
    description_en: "",
    description_ar: "",
    location_type_en: "",
    location_type_ar: "",
    price: 0,
    card_image: "",
    poster_image: "",
    header_image: "",
    capacity: 0,
    coming_soon: false,
    minimum_quantity: 1,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setForm((prev) => {
      let updated = { ...prev, [name]: value };

      // convert numeric inputs to numbers
      if (
        name === "price" ||
        name === "capacity" ||
        name === "minimum_quantity"
      ) {
        updated = { ...prev, [name]: Number(value) };
      }

      // auto-generate slug from English name
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
    const validation = newActivitySchema.safeParse(form);

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((err) => {
        fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      setToast({
        message: "Please fill the highlighted fields.",
        type: "error",
      });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    setErrors({});
    startTransition(async () => {
      try {
        await action({ ...form });
        setToast({
          message: "Activity Created successfully!",
          type: "success",
        });
        setTimeout(() => {
          setToast(null);
          router.push("/admin/dashboard/activities");
        }, 700);
      } catch (error) {
        console.error(error);
        setToast({ message: "Failed to Create Activity.", type: "error" });
        setTimeout(() => setToast(null), 3000);
      }
    });
  };

  return (
    <main className="ml-3 xl:ml-7 mb-10 text-gray-800">
      <div className="flex flex-col border-b border-gray-300 pb-3 w-[65vw] mb-8">
        <h1 className="text-2xl font-semibold text-[#676e32]">New Activity</h1>
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
            <CardTitle className="text-[#676e32]">Activity Details</CardTitle>
            <CardDescription>Add Activity Details below.</CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-6 mb-7">
            {/* Slug */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col md:w-[90%] ">
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

            {/* Activity Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  label: "English Loacation Type",
                  name: "location_type_en",
                  value: form.location_type_en,
                  options: [
                    { value: "indoor", label: "Indoor" },
                    { value: "outdoor", label: "Outdoor" },
                  ],
                },
                {
                  label: "Arabic Loacation Type",
                  name: "location_type_ar",
                  value: form.location_type_ar,
                  options: [
                    { value: "داخلي", label: "داخلي" },
                    { value: "خارجي", label: "خارجي" },
                  ],
                },
              ].map((field) => (
                <div key={field.name} className="flex flex-col md:w-[90%]">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    <span className="text-red-500">*</span> {field.label}
                  </label>
                  <select
                  disabled={isPending}
                    name={field.name}
                    value={field.value}
                    onChange={handleInputChange}
                    className="border border-gray-300 px-3 py-2 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#676e32]"
                  >
                    <option value="">Select {field.label}</option>
                    {field.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  {errors[field.name] && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors[field.name]}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Name Fields */}
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

            {/* Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col md:w-[90%] ">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  <span className="text-red-500">*</span> Price
                </label>
                <input
                disabled={isPending}
                  type="number"
                  name="price"
                  onChange={handleInputChange}
                  className="border border-gray-300 px-3 py-2 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#676e32]"
                />
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                )}
              </div>
            </div>
            {/* Capacity And Minimum Quantity */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col md:w-[90%] ">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  <span className="text-red-500">*</span> Capacity
                </label>
                <input
                disabled={isPending}
                  type="number"
                  name="capacity"
                  onChange={handleInputChange}
                  className="border border-gray-300 px-3 py-2 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#676e32]"
                />
                {errors.capacity && (
                  <p className="text-red-500 text-sm mt-1">{errors.capacity}</p>
                )}
              </div>
              <div className="flex flex-col md:w-[90%] ">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  <span className="text-red-500">*</span> Minimum Quantity
                </label>
                <input
                disabled={isPending}
                  type="number"
                  name="minimum_quantity"
                  onChange={handleInputChange}
                  className="border border-gray-300 px-3 py-2 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#676e32]"
                />
                {errors.minimum_quantity && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.minimum_quantity}
                  </p>
                )}
              </div>
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
                  {errors[field.name] && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors[field.name]}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3  rounded-2xl border border-gray-200 p-4 bg-gray-50  w-fit">
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

            {/* Card, Poster & Header Images */}
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
                  onUploadError={(e) =>
                    setToast({ message: e.message, type: "error" })
                  }
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
                  initialImageUrl={form.poster_image ?? ""}
                  onUploadComplete={(url) =>
                    setForm({ ...form, poster_image: url })
                  }
                  onUploadError={(e) =>
                    setToast({ message: e.message, type: "error" })
                  }
                  onDelete={() => setForm({ ...form, poster_image: "" })}
                />
                {errors.poster_image && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.poster_image}
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
                  onUploadError={(e) =>
                    setToast({ message: e.message, type: "error" })
                  }
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
                <button
                disabled={isPending}
                  type="button"
                  className="px-5 py-2 rounded-md border border-gray-400 cursor-pointer text-gray-700 hover:bg-gray-100 transition"
                  onClick={() => router.replace("/admin/dashboard/activities")}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-md bg-[#676e32] text-white cursor-pointer hover:bg-[#7b8444] transition"
                  disabled={isPending}
                >
                  {isPending ? "Adding..." : "Add Activity"}
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
