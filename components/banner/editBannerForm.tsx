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
import {toast} from "sonner"

interface Props {
  banner: newBanner;
  action: (data: {
    alt: string;
    description_en: string;
    description_ar: string;
    image?: string | null;
    bannerId?: string;
  }) => Promise<void>;
}

export default function EditBannerForm({ banner, action }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<newBanner>({
    alt: banner.alt ?? "",
    description_en: banner.description_en ?? "",
    description_ar: banner.description_ar ?? "",
    image: banner.image ?? null,
  });

  const [isPending, startTransition] = useTransition();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUploadComplete = (url: string) => {
    setForm({ ...form, image: url });
  };

  const handleUploadError = (error: Error) => {
    console.error(error);
    toast.error(`Upload failed: ${error.message}`)
  };

  const handleImageDelete = () => {
    setForm({ ...form, image: null });
  };

  const handleFormSubmit = () => {
    startTransition(async () => {
      try {
        await action({ ...form, bannerId: banner.id });
        toast.success("Banner updated successfully!")
        setTimeout(() => {
          router.push("/admin/dashboard/banners");
        }, 1500); 
      } catch (error) {
        console.error(error);
        toast.error("Failed to update banner.")
      }
    });
  };

  return (
    <main className="ml-3 xl:ml-7 mb-7">
      <div className="flex flex-col justify-start items-start border-b border-gray-500 w-[70vw] mb-7">
        <h1 className="text-lg md:text-2xl font-bold">Edit Banner</h1>
        <p className="text-xs md:text-base text-gray-600">ID: {banner.id}</p>
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
            <CardTitle>Edit Banner Details</CardTitle>
            <CardDescription>
              Fill out the required fields below to update your banner.
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
                <span className="text-red-500 text-sm">*</span> English Description
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
                <span className="text-red-500 text-sm">*</span> Arabic Description
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

            <div className="w-full flex justify-center mt-5 ">
              <div className="flex flex-row gap-3">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
                  onClick={()=>{
                    router.replace("/admin/dashboard/banners");
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#676e32] text-white px-4 py-2 rounded-md cursor-pointer hover:bg-[#7e8d0d]"
                  disabled={isPending}
                >
                  {isPending ? "Updating..." : "Save Changes"}
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>

    </main>
  );
}
