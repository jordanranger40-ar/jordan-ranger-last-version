"use client";
import { type newBanner } from "@/types";
import ImageUploader from "@/components/imageUpload";
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
  action: (
    data: newBanner
  ) => Promise<{ success: boolean; status: number; message: string }>;
}

export default function AddBannerForm({ action }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<newBanner>({
    alt: "",
    description_en: "",
    description_ar: "",
    image: "",
  });
  const [isPending, startTransition] = useTransition();
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUploadComplete = (url: string) => {
    setForm({ ...form, image: url });
  };

  const handleUploadError = (error: Error) => {
    console.error(error);
    toast.error(`Upload failed: ${error.message}`);
  };

  const handleImageDelete = () => {
    setForm({ ...form, image: null });
  };

  const handleFormSubmit = () => {
    startTransition(async () => {
      try {
        const result = await action({ ...form });
        if (result.status === 201) {
          toast.success("Banner added successfully!");
          setTimeout(() => {
            router.push("/admin/dashboard/banners");
          }, 500);
          return;
        } else if (result.status === 401) {
          toast.error(result.message);
          router.push("/login");
          return;
        } else if (result.status === 403) {
          toast.error(result.message);
          router.push("/");
          return;
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to add banner.");
      }
    });
  };

  return (
    <main className="ml-2 xl:ml-7 mb-7">
      <div className="flex flex-col justify-start items-start border-b border-gray-500 w-[90vw] lg:w-[75vw] mb-7">
        <h1 className="text-lg md:text-2xl font-bold">Add New Banner</h1>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleFormSubmit();
        }}
        className="h-full w-[90vw] lg:w-[70vw] flex flex-col gap-5"
      >
        <Card className="w-[95vw] lg:w-[75vw] h-full">
          <CardHeader>
            <CardTitle>New Banner Details</CardTitle>
            <CardDescription>
              Fill out the required fields below to create a new banner.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col items-start gap-5 mb-7">
            <div className="flex flex-col">
              <label className="text-base text-black mb-1">
                <span className="text-red-500 text-sm">*</span> Name (Alt Text)
              </label>
              <input
                type="text"
                name="alt"
                value={form.alt}
                onChange={handleInputChange}
                className="border px-2 py-1 rounded border-black bg-white w-[80vw] md:w-[75vw] lg:w-[65vw] xl:w-[40vw] h-[5vh] text-black"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-base text-black mb-1">
                <span className="text-red-500 text-sm">*</span> English
                Description
              </label>
              <textarea
                name="description_en"
                value={form.description_en}
                onChange={handleInputChange}
                className="border px-2 py-1 rounded border-black bg-white w-[80vw] md:w-[75vw] lg:w-[65vw] xl:w-[40vw] h-[15vh] text-black"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-base text-black mb-1">
                <span className="text-red-500 text-sm">*</span> Arabic
                Description
              </label>
              <textarea
                name="description_ar"
                value={form.description_ar}
                onChange={handleInputChange}
                className="border px-2 py-1 rounded border-black bg-white w-[80vw] md:w-[75vw] lg:w-[65vw] xl:w-[40vw] h-[15vh] text-black"
                required
              />
            </div>

            <div className="flex flex-col w-full max-w-sm">
              <label className="text-base text-black mb-1">Banner Image</label>
              <ImageUploader
                endpoint="banners"
                initialImageUrl={form.image}
                onUploadComplete={handleUploadComplete}
                onUploadError={handleUploadError}
                onDelete={handleImageDelete}
              />
            </div>

            <div className="w-full flex justify-center mt-5">
              <div className="flex flex-row gap-3">
                <LightButton
                  type="button"
                  onClick={() => router.replace("/admin/dashboard/banners")}
                >
                  Cancel
                </LightButton>
                <DarkButton type="submit" disabled={isPending}>
                  {" "}
                  {isPending ? "Adding..." : "Add Banner"}
                </DarkButton>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </main>
  );
}
