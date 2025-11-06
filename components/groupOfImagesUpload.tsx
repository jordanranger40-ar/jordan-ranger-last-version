"use client";

import { UploadDropzone } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { UploadCloudIcon, X } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";

interface ImageUploaderProps {
  endpoint: keyof OurFileRouter;
  onUploadComplete: (urls: string[]) => void; // returns all uploaded URLs
  onUploadError: (error: Error) => void;
  initialImageUrls?: string[]; // initial images
  maxImages?: number; // default 5
   onDelete?: () => void;
}

export default function GroupImageUploader({
  endpoint,
  onUploadComplete,
  onUploadError,
  initialImageUrls = [],
  maxImages = 5,
}: ImageUploaderProps) {
  const [imageUrls, setImageUrls] = useState<string[]>(initialImageUrls);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setImageUrls(initialImageUrls);
  }, [initialImageUrls]);

  const handleDelete = (index: number) => {
    const newUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newUrls);
    onUploadComplete(newUrls);
  };

  return (
    <div className="flex flex-col items-start gap-2 mt-2">
      <div className="flex flex-wrap gap-2 mb-3">
        {imageUrls.map((url, idx) => (
          <div key={idx} className="relative w-32 h-32">
            <Image
              src={url}
              alt={`Uploaded ${idx}`}
              fill
              className="rounded-lg object-cover"
            />
            <button
              onClick={() => handleDelete(idx)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1.5 shadow-md hover:bg-red-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {imageUrls.length < maxImages && (
        <UploadDropzone<OurFileRouter, keyof OurFileRouter>
          endpoint={endpoint}
          onUploadBegin={() => {
            setIsUploading(true);
            setErrorMessage(null);
          }}
          onClientUploadComplete={(res) => {
            setIsUploading(false);
            if (res && res.length) {
              const newUrls = res.map((file) => file.url);
              const updatedUrls = [...imageUrls, ...newUrls].slice(0, maxImages);
              setImageUrls(updatedUrls);
              onUploadComplete(updatedUrls);
            }
          }}
          onUploadError={(err) => {
            setIsUploading(false);
            setErrorMessage(
              "Upload failed. Please try again or use a smaller image (max 2 MB)."
            );
            onUploadError(err);
          }}
          appearance={{
            container:
              "flex flex-col items-center justify-center h-48 w-full max-w-sm text-center p-4 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors",
            button:
              "bg-[#676e32] text-white rounded-md px-4 py-4 mt-4 hover:bg-[#7b8444]",
            label: "text-gray-500 dark:text-gray-400",
          }}
          content={{
            label: ({ isDragActive }) => (
              <div className="flex flex-col items-center justify-center">
                <UploadCloudIcon className="w-12 h-12 text-gray-400 mb-2" />
                <div className="text-sm font-semibold">
                  {isUploading
                    ? "Uploading..."
                    : isDragActive
                    ? "Drop the files here"
                    : "Drop files here or click to browse"}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Images (Max {maxImages}, each max 2MB)
                </div>
              </div>
            ),
            allowedContent: null,
          }}
        />
      )}

      {errorMessage && (
        <p className="text-red-600 text-sm font-medium mt-2 text-center">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
