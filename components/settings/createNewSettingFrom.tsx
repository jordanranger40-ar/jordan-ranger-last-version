"use client";

import React, { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { UploadDropzone } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import ImageUploader from "@/components/imageUpload";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { newSetting } from "@/types";

interface Option {
  value: string; // key stored in DB (key_name_en)
  label: string; // human label shown to user
  type: "text" | "number" | "textarea" | "image" | "video";
  placeholder?: string;
}

/**
 * Props:
 *  - action: function to call to create setting
 *  - existingKeys?: optional list of key_name_en already set in DB -> these options will be disabled
 *  - options?: optional override for available options and their input types
 */
interface Props {
  action: (data: newSetting) => Promise<void>;
  existingKeys?: string[]; // keys already present in DB (disable these)
  options?: Option[]; // optional override of options; if omitted, defaults used below
}

export default function CreateNewSetting({
  action,
  existingKeys = [],
  options,
}: Props) {
  const router = useRouter();
  const [form, setForm] = useState<newSetting>({
    id: "",
    key_name_en: "",
    key_name_ar: "",
    value_en: "",
    value_ar: "",
  });

  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Default options - change labels/values to match your DB keys if you like
  const defaultOptions: Option[] = [
    {
      value: "number_of_clients",
      label: "Number Of Clients",
      type: "number",
      placeholder: "e.g. 42",
    },
    {
      value: "number_of_projects",
      label: "Number Of Projects",
      type: "number",
      placeholder: "e.g. 120",
    },
    { value: "home_video", label: "Video In Home Page", type: "video" },
    { value: "home_banner_text", label: "Text In Home Page", type: "textarea" },
    { value: "part_one_text", label: "Text In Part One", type: "textarea" },
    { value: "part_two_text", label: "Text In Part Two", type: "textarea" },
    { value: "part_three_image", label: "Image In Part Three", type: "image" },
    { value: "part_three_text", label: "Text In Part Three", type: "textarea" },
    { value: "part_four_text", label: "Text In Part Four", type: "textarea" },
  ];

  const availableOptions = options ?? defaultOptions;

  // helper to set a form field
  const setField = <K extends keyof newSetting>(key: K, val: newSetting[K]) => {
    setForm((p) => ({ ...p, [key]: val }));
  };

  // When key changes, reset value_en (so previous uploaded url / text doesn't linger)
  useEffect(() => {
    setForm((p) => ({ ...p, value_en: "" }));
  }, [form.key_name_en]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setField(e.target.name as keyof newSetting, e.target.value as any);
  };

  // Called by ImageUploader on completion
  const handleImageUploaded = (url: string) => {
    setIsUploading(false);
    setField("value_en", url);
  };

  const handleImageUploadError = (err: Error) => {
    setIsUploading(false);
    setToast({
      message: "Image upload failed. Please try again.",
      type: "error",
    });
    setTimeout(() => setToast(null), 3000);
  };

  // Video upload via UploadDropzone (UploadThing) — make sure you created "videos" endpoint on server
  const handleVideoUploadComplete = (res: any) => {
    setIsUploading(false);
    if (res && res[0]) {
      const url = res[0].url as string;
      setField("value_en", url);
    } else {
      setToast({
        message: "Video upload failed. No file returned.",
        type: "error",
      });
      setTimeout(() => setToast(null), 3000);
    }
  };
console.log("existingKeys:", existingKeys);

  const handleVideoUploadError = () => {
    setIsUploading(false);
    setToast({
      message: "Video upload failed. Please try again.",
      type: "error",
    });
    setTimeout(() => setToast(null), 3000);
  };

  const handleFormSubmit = () => {
    // minimal validation: a key must be selected and value_en not empty (for image/video we assume upload completed)
    if (!form.key_name_en) {
      setToast({ message: "Please choose a setting key.", type: "error" });
      setTimeout(() => setToast(null), 2500);
      return;
    }
    // For keys that are text/number/textarea we require a value
    const selectedOpt = availableOptions.find(
      (o) => o.value === form.key_name_en
    );
    if (
      selectedOpt &&
      selectedOpt.type !== "image" &&
      selectedOpt.type !== "video" &&
      !form.value_en
    ) {
      setToast({ message: "Please enter a value.", type: "error" });
      setTimeout(() => setToast(null), 2500);
      return;
    }
    startTransition(async () => {
      try {
        // ensure everything saved as string
        if (typeof form.value_en !== "string") {
          form.value_en = String(form.value_en ?? "");
        }
        await action({ ...form });
        setToast({ message: "Setting added successfully!", type: "success" });
        setTimeout(() => {
          setToast(null);
          router.replace("/admin/dashboard/settings");
        }, 1500);
      } catch (err) {
        console.error(err);
        setToast({ message: "Failed to add Setting.", type: "error" });
        setTimeout(() => setToast(null), 3000);
      }
    });
  };

  // render the dynamic input depending on selected key type
  const renderValueInput = () => {
    const selected = availableOptions.find((o) => o.value === form.key_name_en);

    // if no selection yet, show simple hint
    if (!selected) {
      return (
        <div className="text-sm text-gray-500">
          Choose a key above to enter the appropriate value.
        </div>
      );
    }

    switch (selected.type) {
      case "text":
        return (
          <input
            type="text"
            name="value_en"
            value={form.value_en}
            onChange={handleInputChange}
            className="border px-2 py-1 rounded border-black bg-white w-[80vw] md:w-[75vw] lg:w-[55vw] xl:w-[20vw] h-[5vh] text-black"
            placeholder={selected.placeholder ?? ""}
            required
          />
        );

      case "number":
        return (
          <input
            type="number"
            name="value_en"
            value={form.value_en}
            onChange={handleInputChange}
            className="border px-2 py-1 rounded border-black bg-white w-[80vw] md:w-[75vw] lg:w-[55vw] xl:w-[20vw] h-[5vh] text-black"
            placeholder={selected.placeholder ?? ""}
            required
          />
        );

      case "textarea":
        return (
          <textarea
            name="value_en"
            value={form.value_en}
            onChange={handleInputChange}
            className="border px-2 py-1 rounded border-black bg-white w-[80vw] md:w-[75vw] lg:w-[65vw] xl:w-[40vw] h-[15vh] text-black"
            required
          />
        );

      case "image":
        return (
          <div className="flex flex-col gap-2">
            <ImageUploader
              endpoint="banners" // choose image endpoint (banners/services/courses...) as needed
              initialImageUrl={form.value_en ?? null}
              onUploadComplete={(url) => handleImageUploaded(url)}
              onUploadError={handleImageUploadError}
              onDelete={() => setField("value_en", "")}
            />
            {form.value_en && (
              <div className="mt-2">
                <Image
  src={form.value_en}
  alt="preview"
  width={400}
  height={220}
  className="object-cover rounded-lg border border-gray-300"
/>

              </div>
            )}
          </div>
        );

      case "video":
        return (
          <div className="flex flex-col gap-2">
            {/* NOTE: You must create a "videos" endpoint in your UploadThing router for this to work */}
            <UploadDropzone<OurFileRouter, "settings">
              endpoint="settings"
              onUploadBegin={() => {
                setIsUploading(true);
                setToast(null);
              }}
              onClientUploadComplete={(res) => handleVideoUploadComplete(res)}
              onUploadError={() => handleVideoUploadError()}
              appearance={{
                container:
                 "flex flex-col items-center justify-center h-64 w-[90vw] md:w-[70vw] lg:w-[50vw] xl:w-[30vw] text-center p-4 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors",
                button: "bg-[#125892] text-white rounded-md px-4 py-2 mt-3",
                label: "text-gray-500",
              }}
              content={{
                label: ({ isDragActive }) => (
                  <div className="flex flex-col items-center">
                    <div className="text-sm font-semibold">
                      {isDragActive
                        ? "Drop the video"
                        : "Drop video or click to browse"}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Allowed: video files (Max Size: 64MB)
                    </div>
                  </div>
                ),
                allowedContent: null,
              }}
            />
            {form.value_en && (
              <div className="mt-2">
                <video
  controls
  src={form.value_en}
  className="w-[90vw] md:w-[70vw] lg:w-[50vw] xl:w-[30vw] rounded-lg border border-gray-300"
/>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <main className="ml-3 xl:ml-7 mb-7">
      <div className="flex flex-col justify-start items-start border-b border-gray-500 w-[70vw] mb-7">
        <h1 className="text-lg md:text-2xl font-bold">Add New Setting</h1>
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
            <CardTitle>New Setting Details</CardTitle>
            <CardDescription>
              Pick a setting key and provide its value (all values stored as
              strings).
            </CardDescription>
          </CardHeader>

     <CardContent className="flex flex-col items-start gap-5 mb-7">
  {/* Select key */}
  <div className="flex flex-col gap-3">
    <label className="text-base text-black mb-1">
      <span className="text-red-500 text-sm">*</span> Setting Key
    </label>

    <Select
      value={form.key_name_en}
      onValueChange={(v) => {
        setField("key_name_en", v);
        setField("key_name_ar", "");
        setField("value_en", "");
      }}
    >
      <SelectTrigger className="w-[90vw] md:w-[70vw] lg:w-[50vw] xl:w-[30vw] border border-black text-black">
        <SelectValue placeholder="Select setting key" />
      </SelectTrigger>
      <SelectContent>
        {availableOptions
          .filter((opt) => !existingKeys.includes(opt.value))
          .map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  </div>

  {/* English value input */}
  <div className="flex flex-col mt-2">
    <label className="text-base text-black mb-1">
      <span className="text-red-500 text-sm">*</span> Value (English)
    </label>
    <div className="mt-1">{renderValueInput()}</div>
  </div>

  {/* Arabic value input */}
  <div className="flex flex-col mt-2">
    <label className="text-base text-black mb-1">Value (Arabic)</label>
    <input
      type="text"
      name="value_ar"
      value={form.value_ar}
      onChange={(e) => setField("value_ar", e.target.value)}
      className="border px-2 py-1 rounded border-black bg-white w-[90vw] md:w-[70vw] lg:w-[50vw] xl:w-[30vw] h-[5vh] text-black"
    />
  </div>

  <div className="w-full flex justify-center mt-5">
    <div className="flex flex-row gap-3">
      <button
        type="button"
        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
        onClick={() => router.replace('/admin/dashboard/settings')}
      >
        Cancel
      </button>
      <button
        type="submit"
        className="bg-[#125892] text-white px-4 py-2 rounded-md cursor-pointer hover:bg-[#0f4473]"
        disabled={isPending || isUploading}
      >
        {isPending ? 'Adding...' : isUploading ? 'Uploading...' : 'Add Setting'}
      </button>
    </div>
  </div>
</CardContent>

        </Card>
      </form>

      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-50 px-5 py-3 rounded-lg shadow-lg text-white font-medium transition-all duration-300 ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.message}
        </div>
      )}
    </main>
  );
}
