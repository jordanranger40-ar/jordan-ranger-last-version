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
interface prop {
  setting: newSetting;
  action: (data: newSetting) => Promise<void>;
}

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
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const handleFormSubmit = () => {
    startTransition(async () => {
      try {
        await action(form);
        setToast({ message: "Setting updated successfully!", type: "success" });

        setTimeout(() => {
          setToast(null);
          router.replace("/admin/dashboard/consulting");
        }, 1500);
      } catch (error) {
        console.error(error);
        setToast({ message: "Failed to update Setting.", type: "error" });
        setTimeout(() => setToast(null), 3000);
      }
    });
  };
  return (
    <main className="ml-3 xl:ml-7 mb-7">
      <div className="flex flex-col justify-start items-start border-b border-gray-500 w-[70vw] mb-7">
        <h1 className="text-lg md:text-2xl font-bold">Edit Setting</h1>
        <p className="text-xs md:text-base text-gray-600">ID: {setting.id}</p>
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
            <CardTitle>Edit Setting Details</CardTitle>
            <CardDescription>
              Fill out the required fields below to update your Setting.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col items-start gap-5 mb-7">
           
            <div className="flex flex-col lg:flex lg:flex-row lg:justify-start gap-7 ">
              <div className="flex flex-col">
                <label className="text-base text-black mb-1">
                  <span className="text-red-500 text-sm">*</span> Setting Name
                </label>
                <Select>
              <SelectTrigger className="w-[80vw] md:w-[75vw] lg:w-[55vw] xl:w-[20vw]  border border-black text-black">
                <SelectValue
                  placeholder={form.key_name_en || "Select category"}
                  className=" placeholder:text-black"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={form.key_name_en ?? ""}>
                  {setting.key_name_en}
                </SelectItem>
              </SelectContent>
            </Select>
              </div>

              <div className="flex flex-col">
                <label className="text-base text-black mb-1">
                  <span className="text-red-500 text-sm">*</span> Value
                </label>
                <input
                  type="text"
                  name="value_en"
                  value={form.value_en}
                  onChange={handleInputChange}
                  className="border px-2 py-1 rounded border-black bg-white w-[80vw] md:w-[75vw] lg:w-[55vw] xl:w-[20vw] h-[5vh] text-black"
                  required
                />
              </div>
            </div>

            {/* <div className="flex flex-col">
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
            </div>*/}

            {/* <div className="flex flex-col w-full max-w-sm">
              <label className="text-base text-black mb-1">Category Logo</label>
              <ImageUploader
                endpoint="consulting"
                initialImageUrl={form.category_logo ?? ""}
                onUploadComplete={handleUploadComplete}
                onUploadError={handleUploadError}
                onDelete={handleImageDelete}
              />
            </div>*/}
            <div className="w-full flex justify-center mt-5 ">
              <div className="flex flex-row gap-3">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
                  onClick={() => {
                    router.replace("/admin/dashboard/settings");
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#125892] text-white px-4 py-2 rounded-md cursor-pointer hover:bg-[#0f4473]"
                  disabled={isPending}
                >
                  {isPending ? "Updating..." : "Save Changes"}
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

export default EditSettingForm;
