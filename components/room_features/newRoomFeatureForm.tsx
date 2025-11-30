"use client";
import { getRoomFeaturesSchema } from "@/app/models/db/lib/schemas/roomFeaturesSchema";
import {toast} from "sonner"
import { roomFeatures } from "@/types";
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
  action: (data: roomFeatures) => Promise<void>;
}

export default function CreateNewFeature({ action }: Props) {
  const schema = getRoomFeaturesSchema();
  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof form, string>>
  >({});
  const router = useRouter();
  const [form, setForm] = useState<roomFeatures>({
    feature_title_en: "",
    feature_title_ar: "",
    feature_description_en: "",
    feature_description_ar: "",
  });

  const [isPending, startTransition] = useTransition();
 /* const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);*/
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleFormSubmit = () => {
    const validation = schema.safeParse(form);
    if (!validation.success) {
      const fieldError: Record<string, string> = {};
      validation.error.issues.forEach((err) => {
        const fieldName = err.path[0] as string;
        fieldError[fieldName] = err.message;
      });
      setErrors(fieldError);
      toast.error("Please fix the highlighted fields.")
      return;
    }

    startTransition(async () => {
      try {
        await action({ ...form });
        toast.success("Feature added successfully!")
        setTimeout(() => {
          router.replace("/admin/dashboard/room_features");
        }, 1500);
      } catch (_error) {
        toast.error("Failed to add Feature.")
      }
    });
  };

  return (
    <main className="ml-3 xl:ml-7 mb-7">
      <div className="flex flex-col justify-start items-start border-b border-gray-500 w-[70vw] mb-7">
        <h1 className="text-2xl font-semibold text-[#676e32]">
          Add New Feature
        </h1>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleFormSubmit();
        }}
        className="h-full w-full lg:w-[70vw] flex flex-col gap-5"
      >
        <Card className="w-full h-full">
          <CardHeader>
            <CardTitle className="text-[#676e32]">
              New Feature Details
            </CardTitle>
            <CardDescription>
              Fill out the required fields below to create a new Feature.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col items-start gap-5 mb-7">
            {[
              {
                label: "English Title",
                name: "feature_title_en",
                value: form.feature_title_en,
              },
              {
                label: "Arabic Title",
                name: "feature_title_ar",
                value: form.feature_title_ar,
              },
            ].map((field, index) => {
              return (
                <div key={field.name} className="flex flex-col w-full">
                  <label
                    htmlFor={field.name}
                    className="text-sm font-medium text-gray-700 mb-1"
                  >
                    <span className="text-red-500">*</span> {field.label}
                  </label>
                  <input
                    type="text"
                    name={field.name}
                    value={field.value}
                    onChange={handleInputChange}
                    className="border border-gray-300 px-3 py-2 rounded-md w-[80vw] md:w-[65vw] xl:w-[40vw] text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#676e32] focus:border-transparent disabled:bg-gray-100"
                    disabled={isPending}
                  />
                  {errors[field.name as keyof typeof form] && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors[field.name as keyof typeof form]}
                    </p>
                  )}
                </div>
              );
            })}

            {[
              {
                label: "English Description",
                name: "feature_description_en",
                value: form.feature_description_en,
              },
              {
                label: "Arabic Description",
                name: "feature_description_ar",
                value: form.feature_description_ar,
              },
            ].map((field) => (
              <div key={field.name} className="flex flex-col w-full">
                <label
                  htmlFor={field.name}
                  className="text-sm font-medium text-gray-700 mb-1"
                >
                  <span className="text-red-500">*</span> {field.label}
                </label>
                <textarea
                  name={field.name}
                  value={field.value}
                  onChange={handleInputChange}
                  className="border border-gray-300 px-3 py-2 rounded-md w-[80vw] md:w-[65vw] xl:w-[40vw] text-gray-800 h-[15vh] resize-none focus:outline-none focus:ring-2 focus:ring-[#676e32] disabled:bg-gray-100"
                  disabled={isPending}
                />
                {errors[field.name as keyof typeof form] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors[field.name as keyof typeof form]}
                  </p>
                )}
              </div>
            ))}
            <div className="w-full flex justify-center mt-5">
              <div className="flex flex-row gap-3">
                <button
                  type="button"
                  className="px-5 py-2 rounded-md border border-gray-400 cursor-pointer text-gray-700 hover:bg-gray-100 transition"
                  onClick={() => router.push("/admin/dashboard/room_features")}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-md bg-[#676e32] text-white cursor-pointer hover:bg-[#7b8444] transition"
                  disabled={isPending}
                >
                  {isPending ? "Adding..." : "Add Feature"}
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </main>
  );
}
