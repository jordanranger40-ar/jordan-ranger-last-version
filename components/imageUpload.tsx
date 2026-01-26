"use client";

import { UploadCloudIcon, X } from "lucide-react";
import { useState, useEffect, useRef, DragEvent } from "react";
import Image from "next/image";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { useUploadThing } from "@/lib/uploadthing"; 

interface ImageUploaderProps {
  endpoint: keyof OurFileRouter;
  onUploadComplete: (url: string) => void;
  onUploadError: (error: Error) => void;
  initialImageUrl?: string | null;
  onDelete?: () => void;
}

/** Minimal shape of UploadThing's per-file response we rely on */
type UploadThingFile = {
  url?: string;
  uploadedUrl?: string;
  file?: {
    url?: string;
    ufsUrl?: string;
    ufs_url?: string;
  };
};

export default function ImageUploader({
  endpoint,
  onUploadComplete,
  onUploadError,
  initialImageUrl,
  onDelete,
}: ImageUploaderProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(
    initialImageUrl || null
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // useUploadThing hook typed to your router; pass endpoint directly
  const { startUpload, isUploading: hookUploading } = useUploadThing(
    endpoint
  );

  useEffect(() => {
    setImageUrl(initialImageUrl || null);
  }, [initialImageUrl]);

  const inputRef = useRef<HTMLInputElement | null>(null);
const MAX_BYTES = 16 * 1024 * 1024; // 16MB

  const handleDelete = () => {
    setImageUrl(null);
    setErrorMessage(null);
    onDelete?.();
  };

  // Helper to extract a usable URL from UploadThing result
  function extractUrlFromResult(res: UploadThingFile[] | undefined): string | null {
    if (!res || !res[0]) return null;
    return (
      res[0].url ??
      res[0].uploadedUrl ??
      res[0].file?.url ??
      res[0].file?.ufsUrl ??
      res[0].file?.ufs_url ??
      null
    );
  }

  async function uploadFile(file: File) {
    setErrorMessage(null);

    if (file.size > MAX_BYTES) {
      const err = new Error("File size exceeds 2 MB.");
setErrorMessage("File is too large — maximum is 16 MB.");
      onUploadError(err);
      return;
    }

    try {
      // startUpload accepts an array of File/Blob objects
      const rawRes = await startUpload([file]);
      // normalize result shape
      const res = rawRes as UploadThingFile[];
      const url = extractUrlFromResult(res);
      if (!url) {
        const debugErr = new Error(
          "Upload succeeded but no URL returned from UploadThing result."
        );
        // still log for developer debugging
        // eslint-disable-next-line no-console
        console.error("UploadThing result:", res);
        setErrorMessage("Upload failed to return a file URL.");
        onUploadError(debugErr);
        return;
      }

      setImageUrl(url);
      onUploadComplete(url);
    } catch (err: unknown) {
      const normalizedError =
        err instanceof Error ? err : new Error(String(err ?? "Unknown error"));
      // eslint-disable-next-line no-console
      console.error("Upload error:", normalizedError);
      setErrorMessage(
  "Upload failed. Please try again or use a smaller image (max 16 MB)."
);

      onUploadError(normalizedError);
    }
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadFile(file);
    // reset input so same file can be reselected later
    e.currentTarget.value = "";
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    uploadFile(file);
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragOver(true);
  }

  function handleDragLeave() {
    setIsDragOver(false);
  }

  // show preview if imageUrl exists
  if (imageUrl) {
    return (
      <div className="relative w-full max-w-sm h-48">
        <Image
          src={imageUrl}
          alt="Uploaded Image"
          fill
          className="rounded-lg object-cover"
        />
        <button
          onClick={handleDelete}
          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 shadow-md hover:bg-red-600 transition-colors"
          aria-label="Delete image"
          type="button"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const isUploading = hookUploading;

  return (
    <div className="flex flex-col gap-2 items-start">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileInput}
      />

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`flex flex-col items-center justify-center h-48 w-full max-w-sm text-center p-4 border-2 border-dashed rounded-lg transition-colors
    ${isDragOver ? "bg-gray-50 dark:bg-gray-800" : ""}`}
      >
        <UploadCloudIcon className="w-12 h-12 text-gray-400 mb-2" />
        <div className="text-sm font-semibold">
          {isUploading ? "Uploading..." : isDragOver ? "Drop the file here" : "Drop file here or click to browse"}
        </div>
        <div className="text-xs text-gray-400 mt-1">Image (Max 16MB)</div>

        <div className="mt-4">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className={
              `mt-4 px-6 py-3 bg-[#484d23] text-white font-semibold rounded-full shadow-md 
                 hover:bg-[#5a5e3a] hover:text-[#fdfdfd] hover:scale-105 
                 transition-all duration-300`
            }
            aria-label="Choose image"
          >
            {isUploading ? "Uploading..." : "Choose Image"}
          </button>
        </div>
      </div>

      {errorMessage && (
        <p className="text-red-600 text-sm font-medium mt-2 text-center">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
