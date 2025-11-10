"use client";
import { newRoomSchema } from "@/app/models/db/lib/schemas/roomsSchema";
import { newRoom } from "@/types";
import ImageUploader from "@/components/imageUpload";
import GroupImageUploader from "@/components/groupOfImagesUpload";
import RoomFeaturesMultiSelect from "@/components/room_features/roomFeaturesSelector";
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
  action: (data: newRoom) => Promise<void>;
}
export default function CreateRoomForm({ action }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [form, setForm] = useState<newRoom>({
    slug: "",
    name_en: "",
    name_ar: "",
    description_en: "",
    description_ar: "",
    room_type_en: "",
    room_type_ar: "",
    price: 0,
    cover_image: "",
    room_images: [],
    roomFeatures: [],
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
    const validation = newRoomSchema.safeParse(form);

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
        setToast({ message: "Room updated successfully!", type: "success" });
        setTimeout(() => {
          setToast(null);
          router.push("/admin/dashboard/rooms");
        }, 200);
      } catch (error) {
        console.error(error);
        setToast({ message: "Failed to update Room.", type: "error" });
        setTimeout(() => setToast(null), 3000);
      }
    });
  };

  const handleUploadComplete = (url: string) => {
    setForm({ ...form, cover_image: url });
  };

  const handleImageDelete = () => {
    setForm({ ...form, cover_image: "" });
  };

  const handleRoomImagesUploadComplete = (urls: string[]) => {
    setForm((prev) => ({ ...prev, room_images: urls }));
  };

  const handleRoomImagesDelete = () => {
    setForm((prev) => ({ ...prev, room_images: [] }));
  };

  return (
    <main className="ml-3 xl:ml-7 mb-10 text-gray-800">
      <div className="flex flex-col border-b border-gray-300 pb-3 w-[65vw] mb-8">
        <h1 className="text-2xl font-semibold text-[#676e32]">New Room</h1>
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
            <CardTitle className="text-[#676e32]">Room Details</CardTitle>
            <CardDescription>Add Room Details below.</CardDescription>
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

            {/* Room Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  label: "English Room Type",
                  name: "room_type_en",
                  value: form.room_type_en,
                  options: [
                    { value: "cabins", label: "Cabins" },
                    { value: "tents", label: "Tents" },
                  ],
                },
                {
                  label: "Arabic Room Type",
                  name: "room_type_ar",
                  value: form.room_type_ar,
                  options: [
                    { value: "الغرف", label: "غرف" },
                    { value: "الخيام", label: "خيام" },
                  ],
                },
              ].map((field) => (
                <div key={field.name} className="flex flex-col md:w-[90%]">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    <span className="text-red-500">*</span> {field.label}
                  </label>
                  <select
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
                type="number"
                name="price"
                value={form.price}
                onChange={handleInputChange}
                className="border border-gray-300 px-3 py-2 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#676e32]"
              />
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">{errors.price}</p>
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

            {/* Room Features */}
            <div className="flex flex-col md:w-[70%]">
              <label className="text-sm font-medium text-gray-700 mb-1">
                <span className="text-red-500">*</span> Room Features
              </label>
              <RoomFeaturesMultiSelect
                selectedFeatures={form.roomFeatures}
                onChange={(features) =>
                  setForm((prev) => ({ ...prev, roomFeatures: features }))
                }
              />
              {errors.roomFeatures && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.roomFeatures}
                </p>
              )}
            </div>

            {/* Cover & Room Images */}
            <div className="flex flex-col gap-8 mt-4">
              <div>
                <label className="text-base text-black mb-2">
                  <span className="text-red-500">*</span> Cover Image
                </label>
                <ImageUploader
                  endpoint="rooms"
                  initialImageUrl={form.cover_image ?? ""}
                  onUploadComplete={handleUploadComplete}
                  onUploadError={(e) =>
                    setToast({ message: e.message, type: "error" })
                  }
                  onDelete={handleImageDelete}
                />
                {errors.cover_image && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.cover_image}
                  </p>
                )}
              </div>

              <div>
                <label className="text-base text-black mb-1">
                  <span className="text-red-500">*</span> Room Images
                </label>
                <GroupImageUploader
                  endpoint="rooms"
                  initialImageUrls={form.room_images}
                  maxImages={5}
                  onUploadComplete={handleRoomImagesUploadComplete}
                  onUploadError={(e) =>
                    setToast({ message: e.message, type: "error" })
                  }
                  onDelete={handleRoomImagesDelete}
                />
                {errors.room_images && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.room_images}
                  </p>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-center mt-8">
              <div className="flex gap-4">
                <button
                  type="button"
                  className="px-5 py-2 rounded-md border border-gray-400 cursor-pointer text-gray-700 hover:bg-gray-100 transition"
                  onClick={() => router.replace("/admin/dashboard/rooms")}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-md bg-[#676e32] text-white cursor-pointer hover:bg-[#7b8444] transition"
                  disabled={isPending}
                >
                  {isPending ? "Adding..." : "Add Room"}
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
