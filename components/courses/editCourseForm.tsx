"use client";
import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { editCourse, newTraining } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import ImageUploader from "@/components/imageUpload";

interface Props {
  course: editCourse;
  training: newTraining[];
  action: (data: editCourse) => Promise<void>;
}

export default function EditServiceForm({ course, training, action }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<editCourse>({
    id: course.id ?? "",
    training_name_en: course.training_name_en ,
    description_en: course.description_en ,
    description_ar: course.description_ar ,
    title_en: course.title_en,
    title_ar: course.title_ar,
    training_id: course.training_id,
    target_audience_en: course.target_audience_en,
    target_audience_ar: course.target_audience_ar,
    delivery_method_en: course.delivery_method_en,
    delivery_method_ar: course.delivery_method_ar,
    duration_en: course.duration_en,
    duration_ar: course.duration_ar,
    image:course.image
  });

  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // 🔹 Normal input handler
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* hadndle scalable inputs functions*/
  const handleArrayChange = (
    field: keyof editCourse,
    index: number,
    value: string
  ) => {
    const currentArray = Array.isArray(form[field]) ? form[field] : [];
    const newArray = [...currentArray];
    newArray[index] = value;
    setForm({ ...form, [field]: newArray });
  };

  const addArrayItem = (field: keyof editCourse) => {
    const currentArray = Array.isArray(form[field]) ? form[field] : [];
    setForm({ ...form, [field]: [...currentArray, ""] });
  };

  const removeArrayItem = (field: keyof editCourse, index: number) => {
    const currentArray = Array.isArray(form[field]) ? form[field] : [];
    const newArray = currentArray.filter((_, i) => i !== index);
    setForm({ ...form, [field]: newArray });
  };


  /* upload image functions*/
  const handleUploadComplete = (url: string) => {
    setForm({ ...form, image: url });
  };

  const handleUploadError = (error: Error) => {
    console.error(error);
    setToast({ message: `Upload failed: ${error.message}`, type: "error" });
    setTimeout(() => setToast(null), 3000);
  };

  const handleImageDelete = () => {
    setForm({ ...form, image: "" });
  };

  const handleFormSubmit = () => {
    startTransition(async () => {
      try {
        await action(form);
        setToast({ message: "Course updated successfully!", type: "success" });
        setTimeout(() => {
          setToast(null);
          router.replace("/admin/dashboard/courses");
        }, 1500);
      } catch (error) {
        console.error(error);
        setToast({ message: "Failed to update Course.", type: "error" });
        setTimeout(() => setToast(null), 3000);
      }
    });
  };

  return (
    <main className="ml-3 xl:ml-7 mb-7">
      <div className="flex flex-col justify-start items-start border-b border-gray-500 w-[70vw] mb-7">
        <h1 className="text-lg md:text-2xl font-bold">Edit Course</h1>
        <p className="text-xs md:text-base text-gray-600">ID: {course.id}</p>
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
            <CardTitle>Edit Course Details</CardTitle>
            <CardDescription>
              Modify the fields below to update your course information.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col items-start gap-5 mb-7">
            {/* Training select */}
            <Select
              value={form.training_id}
              onValueChange={(value) => {
                setForm({ ...form, training_id: value });
              }}
            >
              <SelectTrigger className="w-[80vw] md:w-[75vw] lg:w-[55vw] xl:w-[20vw] border border-black text-black">
                <SelectValue
                  placeholder="Select Training Program"
                  className="placeholder:text-black"
                />
              </SelectTrigger>
              <SelectContent>
                {training.map((ele, i) => (
                  <SelectItem value={ele.id ?? ""} key={i}>
                    {ele.name_en}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Titles */}
            <div className="flex flex-col lg:flex-row gap-7">
              <div className="flex flex-col">
                <label className="text-base text-black mb-1">
                  <span className="text-red-500 text-sm">*</span> English Title
                </label>
                <input
                  type="text"
                  name="title_en"
                  value={form.title_en}
                  onChange={handleInputChange}
                  className="border px-2 py-1 rounded border-black bg-white w-[80vw] md:w-[75vw] lg:w-[55vw] xl:w-[19vw] h-[5vh] text-black"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="text-base text-black mb-1">
                  <span className="text-red-500 text-sm">*</span> Arabic Title
                </label>
                <input
                  type="text"
                  name="title_ar"
                  value={form.title_ar}
                  onChange={handleInputChange}
                  className="border px-2 py-1 rounded border-black bg-white w-[80vw] md:w-[75vw] lg:w-[55vw] xl:w-[19vw] h-[5vh] text-black"
                  required
                />
              </div>
            </div>

            {/* Descriptions */}
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

            {/* Target Audience */}
            <div className="flex flex-col lg:flex-row gap-7">
              {/* English */}
              <div className="flex flex-col">
                <label className="text-base text-black mb-1">
                  Target Audience (English)
                </label>
                {form.target_audience_en.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) =>
                        handleArrayChange(
                          "target_audience_en",
                          index,
                          e.target.value
                        )
                      }
                      className="border px-2 py-1 rounded border-black bg-white w-[80vw] md:w-[75vw] lg:w-[55vw] xl:w-[15vw] h-[5vh] text-black"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => addArrayItem("target_audience_en")}
                      className="text-[#0f4473]"
                    >
                      <Plus />
                    </button>
                    {form.target_audience_en.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          removeArrayItem("target_audience_en", index)
                        }
                        className="text-red-500"
                      >
                        <Trash2 className="w-5 h-5 text-[#8B0000]" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Arabic */}
              <div className="flex flex-col">
                <label className="text-base text-black mb-1">
                  Target Audience (Arabic)
                </label>
                {form.target_audience_ar.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) =>
                        handleArrayChange(
                          "target_audience_ar",
                          index,
                          e.target.value
                        )
                      }
                      className="border px-2 py-1 rounded border-black bg-white w-[80vw] md:w-[75vw] lg:w-[55vw] xl:w-[15vw] h-[5vh] text-black"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => addArrayItem("target_audience_ar")}
                      className="text-[#0f4473]"
                    >
                      <Plus />
                    </button>
                    {form.target_audience_ar.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          removeArrayItem("target_audience_ar", index)
                        }
                        className="text-red-500"
                      >
                        <Trash2 className="w-5 h-5 text-[#8B0000]" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Methods */}
            <div className="flex flex-col lg:flex-row gap-7">
              {/* English */}
              <div className="flex flex-col">
                <label className="text-base text-black mb-1">
                  Delivery Method (English)
                </label>
                {form.delivery_method_en.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) =>
                        handleArrayChange(
                          "delivery_method_en",
                          index,
                          e.target.value
                        )
                      }
                      className="border px-2 py-1 rounded border-black bg-white w-[80vw] md:w-[75vw] lg:w-[55vw] xl:w-[15vw] h-[5vh] text-black"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => addArrayItem("delivery_method_en")}
                      className="text-[#0f4473]"
                    >
                      <Plus />
                    </button>
                    {form.delivery_method_en.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          removeArrayItem("delivery_method_en", index)
                        }
                        className="text-red-500"
                      >
                        <Trash2 className="w-5 h-5 text-[#8B0000]" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Arabic */}
              <div className="flex flex-col">
                <label className="text-base text-black mb-1">
                  Delivery Method (Arabic)
                </label>
                {form.delivery_method_ar.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) =>
                        handleArrayChange(
                          "delivery_method_ar",
                          index,
                          e.target.value
                        )
                      }
                      className="border px-2 py-1 rounded border-black bg-white w-[80vw] md:w-[75vw] lg:w-[55vw] xl:w-[15vw] h-[5vh] text-black"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => addArrayItem("delivery_method_ar")}
                      className="text-[#0f4473]"
                    >
                      <Plus />
                    </button>
                    {form.delivery_method_ar.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          removeArrayItem("delivery_method_ar", index)
                        }
                        className="text-red-500"
                      >
                        <Trash2 className="w-5 h-5 text-[#8B0000]" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div className="flex flex-col lg:flex lg:flex-row lg:justify-start gap-7 ">
              <div className="flex flex-col">
                <label className="text-base text-black mb-1">
                  <span className="text-red-500 text-sm">*</span> Duration
                  (English)
                </label>
                <input
                  type="text"
                  name="duration_en"
                  value={form.duration_en}
                  onChange={handleInputChange}
                  className="border px-2 py-1 rounded border-black bg-white w-[80vw] md:w-[75vw] lg:w-[55vw] xl:w-[19vw] h-[5vh] text-black"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="text-base text-black mb-1">
                  <span className="text-red-500 text-sm">*</span> Duration
                  (Arabic)
                </label>
                <input
                  type="text"
                  name="duration_ar"
                  value={form.duration_ar}
                  onChange={handleInputChange}
                  className="border px-2 py-1 rounded border-black bg-white w-[80vw] md:w-[75vw] lg:w-[55vw] xl:w-[19vw] h-[5vh] text-black"
                  required
                />
              </div>
            </div>

              <div className="flex flex-col w-full max-w-sm">
                          <label className="text-base text-black mb-1">Course Image</label>
                          <ImageUploader
                            endpoint="courses"
                            initialImageUrl={form.image}
                            onUploadComplete={handleUploadComplete}
                            onUploadError={handleUploadError}
                            onDelete={handleImageDelete}
                          />
                        </div>
            

            {/* Buttons */}
            <div className="w-full flex justify-center mt-5">
              <div className="flex gap-3">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
                  onClick={() => router.replace("/admin/dashboard/courses")}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#125892] text-white px-4 py-2 rounded-md hover:bg-[#0f4473]"
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
