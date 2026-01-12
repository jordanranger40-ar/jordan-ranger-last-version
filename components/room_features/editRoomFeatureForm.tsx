"use client";
import { getRoomFeaturesSchema } from "@/app/models/db/lib/schemas/roomFeaturesSchema";
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
import { toast } from "sonner";
import LightButton from "../ui/light-button";
import DarkButton from "../ui/dark-button";
interface Props {
  feature: roomFeatures;
  action: (
    id: string,
    data: roomFeatures
  ) => Promise<{ status: number; message: string; success: boolean }>;
}

export default function EditfeatureForm({ feature, action }: Props) {
  const schema = getRoomFeaturesSchema();
  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof form, string>>
  >({});
  const router = useRouter();
  const [form, setForm] = useState<roomFeatures>({
    feature_title_en: feature.feature_title_en ?? "",
    feature_title_ar: feature.feature_title_ar ?? "",
    feature_description_en: feature.feature_description_en ?? "",
    feature_description_ar: feature.feature_description_ar ?? "",
  });

  const [isPending, startTransition] = useTransition();
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
      toast.error("Please fix the highlighted fields.");
      return;
    }

    startTransition(async () => {
      try {
        const result = await action(feature.id!, form);
        if (result.status === 201) {
          toast.success(result.message);
          router.push("/admin/dashboard/room_features");
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
        toast.error("Failed to update feature.");
      }
    });
  };

  return (
    <main className="ml-2 xl:ml-7 mb-10 text-gray-800">
      {/* Header */}
      <div className="flex flex-col border-b border-gray-300 pb-3 w-full mb-8">
        <h1 className="text-2xl font-semibold text-[#676e32]">
          Edit Room Feature
        </h1>
        <p className="text-sm text-gray-500">Feature ID: {feature.id}</p>
      </div>

      {/* Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleFormSubmit();
        }}
        className="h-full w-full lg:w-[70vw] flex flex-col gap-6"
      >
        <Card className="w-full shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-[#676e32]">Feature Details</CardTitle>
            <CardDescription>
              Update the titles and descriptions below.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col items-start gap-6 mb-7">
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
            ].map((field) => (
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
            ))}

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

            {/* Buttons */}
            <div className="w-full flex justify-center mt-5">
              <div className="flex flex-row gap-4">
                <LightButton
                  type="button"
                  onClick={() =>
                    router.replace("/admin/dashboard/room_features")
                  }
                >
                  Cancel
                </LightButton>
                <DarkButton type="submit" disabled={isPending}>
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
