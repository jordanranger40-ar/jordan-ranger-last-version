"use client";

import { newSetting } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Button2 from "../ui/dark-button";
import Button1 from "../ui/light-button";
import { toast } from "sonner";
import Image from "next/image";
import ImageUploader from "@/components/imageUpload";

interface prop {
  setting: newSetting;
  action: (settingId: string, data: newSetting) => Promise<{ success: boolean; message: string; status: number }>;
}

interface Option {
  value: string;
  label: string;
  type: "text" | "textarea" | "number" | "image" | "video";
  placeholder?: string;
}

const defaultOptions: Option[] = [
  { value: "image_root_page", label: "Image In Root Page", type: "image" },
  {
    value: "link_of_pdf_root",
    label: "Link Of PDF File In Root",
    type: "text",
  },
];

function EditSettingForm({ setting, action }: prop) {
  const router = useRouter();
  const [form, setForm] = useState<newSetting>({
    id: setting.id ?? "",
    key_name_en: setting.key_name_en ?? "",
    key_name_ar: setting.key_name_ar,
    value_en: setting.value_en ?? "",
    value_ar: setting.value_ar ?? "",
  });

  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = () => {
    const selectedOption = defaultOptions.find((opt) => opt.value === form.key_name_en);

    // If it's an image key, ensure upload finished and there's an image value
    if (selectedOption?.type === "image") {
      if (isUploading) {
        toast.error("Image is still uploading. Please wait until upload completes.");
        return;
      }
      if (!form.value_en) {
        toast.error("Please upload an image before saving.");
        return;
      }
    }

    startTransition(async () => {
      try {
        const result = await action(form.id ?? "", form);
        if (result.status === 401) {
          toast.error(result.message);
          router.push("/login");
        } else if (result.status === 403) {
          toast.error(result.message);
          router.push("/");
        } else if (result.status === 201) {
          toast.success(result.message);
          setTimeout(() => {
            router.replace("/admin/dashboard/settings");
          }, 1000);
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        toast.error("Failed to update Setting.");
      }
    });
  };

  const selectedOption = defaultOptions.find((opt) => opt.value === form.key_name_en);

  const renderValueInput = () => {
    if (!selectedOption) return null;

    const commonClass =
      "border px-3 py-2 rounded border-gray-300 bg-white w-full md:w-[70vw] lg:w-[50vw] text-black";

    if (selectedOption.type === "text" || selectedOption.type === "textarea") {
      const InputComponent = selectedOption.type === "textarea" ? "textarea" : "input";
      const extraStyles = selectedOption.type === "textarea" ? "h-24 resize-none" : "";

      return (
        <div className="flex flex-col gap-4 ">
          <div className="flex flex-col gap-2">
            <label className="text-base font-medium text-gray-700">
              English Value <span className="text-red-500">*</span>
            </label>
            <InputComponent
              // @ts-ignore - React supports 'textarea' as a string tag in JSX
              type={selectedOption.type === "text" ? "text" : undefined}
              name="value_en"
              value={form.value_en!}
              onChange={handleInputChange}
              className={`${commonClass} ${extraStyles}`}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-base font-medium text-gray-700">
              Arabic Value <span className="text-red-500">*</span>
            </label>
            <InputComponent
              // @ts-ignore
              type={selectedOption.type === "text" ? "text" : undefined}
              name="value_ar"
              value={form.value_ar!}
              onChange={handleInputChange}
              className={`${commonClass} ${extraStyles}`}
              dir="rtl"
              required
            />
          </div>
        </div>
      );
    }

    if (selectedOption.type === "number") {
      return (
        <input
          type="number"
          name="value_en"
          value={form.value_en!}
          onChange={handleInputChange}
          className={commonClass}
          placeholder={selectedOption.placeholder || "Enter number"}
          required
        />
      );
    }

    if (selectedOption.type === "image") {
      return (
        <div className="flex flex-col gap-3">
          <ImageUploader
            endpoint="banners"
            initialImageUrl={form.value_en ?? null}
            onUploadComplete={(url: string) => {
              setIsUploading(false);
              setForm((prev) => ({ ...prev, value_en: url }));
              toast.success("Image uploaded.");
            }}
            onUploadError={() => {
              setIsUploading(false);
              toast.error("Image upload failed. Please try again.");
            }}
            onDelete={() => {
              setForm((prev) => ({ ...prev, value_en: "" }));
            }}
            // Let uploader inform parent when upload starts
          />
          {form.value_en && (
            <div className="mt-2">
              <Image
                src={form.value_en}
                alt="setting preview"
                width={400}
                height={220}
                className="object-cover rounded-lg border border-gray-300"
              />
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <main className="ml-3 xl:ml-7 mb-7">
      <div className="flex flex-col justify-start items-start border-b border-gray-300 w-full md:w-[70vw] mb-7">
        <h1 className="text-lg md:text-2xl font-bold">Edit Setting</h1>
        <p className="text-sm md:text-base text-gray-500">ID: {setting.id}</p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleFormSubmit();
        }}
        className="flex flex-col gap-6 w-full md:w-[70vw]"
      >
        <Card className="pt-5 pb-5 ">
          <CardHeader>
            <CardTitle>Edit Setting Details</CardTitle>
            <CardDescription>Update the fields below.</CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-base font-medium text-gray-700">Setting Key</label>
              <Select value={form.key_name_en!} disabled>
                <SelectTrigger className="w-full md:w-[70vw] lg:w-[50vw] border border-gray-300 text-black">
                  <SelectValue placeholder={form.key_name_en} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={form.key_name_en ?? ""}>{form.key_name_en}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-base font-medium text-gray-700">Value</label>
              {renderValueInput()}
            </div>

            <div className="flex gap-3 mt-4 justify-end">
              <Button1
                type="button"
                onClick={() => router.replace("/admin/dashboard/settings")}
              >
                Cancel
              </Button1>
              <Button2
                type="submit"
                disabled={isPending || isUploading}
              >
                {isPending ? "Updating..." : isUploading ? "Uploading..." : "Save Changes"}
              </Button2>
            </div>
          </CardContent>
        </Card>
      </form>
    </main>
  );
}

export default EditSettingForm;
