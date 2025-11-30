"use client";
import { newClient } from "@/types";
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
  client: newClient;
  action: (data:newClient ) => Promise<void>;
}

export default function EditClientForm({ client, action }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<newClient>({
    name: client.name ?? "",
    logo: client.logo ?? "",
    id:client.id?? ""
  });
  const [isPending, startTransition] = useTransition();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUploadComplete = (url: string) => {
    setForm({ ...form, logo: url });
  };

  const handleUploadError = (error: Error) => {
    console.error(error);
    toast.error(`Upload failed: ${error.message}`)
  };

  const handleImageDelete = () => {
    setForm({ ...form, logo: "" });
  };

  const handleFormSubmit = () => {
    startTransition(async () => {
      try {
        await action({ ...form });
        toast.success("Client updated successfully!")
        setTimeout(() => {
          router.replace("/admin/dashboard/clients");
        }, 1000); 
      } catch (_error) {
        toast.error("Failed to update Client.")
      }
    });
  };

  return (
    <main className="ml-3 xl:ml-7 mb-7">
      <div className="flex flex-col justify-start items-start border-b border-gray-500 w-[70vw] mb-7">
        <h1 className="text-lg md:text-2xl font-bold">Edit Client</h1>
        <p className="text-xs md:text-base text-gray-600">ID: {client.id}</p>
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
            <CardTitle>Edit Client Details</CardTitle>
            <CardDescription>
              Fill out the required fields below to update your Client.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col items-start gap-5 mb-7">
            <div className="flex flex-col">
              <label className="text-base text-black mb-1">
                <span className="text-red-500 text-sm">*</span> Name 
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleInputChange}
                className="border px-2 py-1 rounded border-black bg-white w-[80vw] md:w-[75vw] lg:w-[65vw] xl:w-[20vw] h-[5vh] text-black"
                required
              />
            </div>

            <div className="flex flex-col w-full max-w-sm">
              <label className="text-base text-black mb-1">Client Logo</label>
              <ImageUploader
                endpoint="ourClients"
                initialImageUrl={form.logo}
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
                    router.replace("/admin/dashboard/clients");
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
    </main>
  );
}
