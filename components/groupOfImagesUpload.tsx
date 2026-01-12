"use client";

import { UploadCloudIcon, X } from "lucide-react";
import { useState, useEffect, useRef, DragEvent } from "react";
import Image from "next/image";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { useUploadThing } from "@/lib/uploadthing";

interface GroupImageUploaderProps {
  endpoint: keyof OurFileRouter;
  onUploadComplete: (urls: string[]) => void; // returns all uploaded URLs
  onUploadError: (error: Error) => void;
  initialImageUrls?: string[]; // initial images
  maxImages?: number; // default 5
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

export default function GroupImageUploader({
  endpoint,
  onUploadComplete,
  onUploadError,
  initialImageUrls = [],
  maxImages = 5,
  onDelete,
}: GroupImageUploaderProps) {
  const [imageUrls, setImageUrls] = useState<string[]>(initialImageUrls);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // useUploadThing hook typed to your router; pass endpoint directly
  const { startUpload, isUploading: hookUploading } = useUploadThing(endpoint);

  useEffect(() => {
    setImageUrls(initialImageUrls || []);
  }, [initialImageUrls]);

  const MAX_BYTES = 2 * 1024 * 1024; // 2MB

  const handleDelete = (index: number) => {
    const newUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newUrls);
    onUploadComplete(newUrls);
    onDelete?.();
  };

  function extractUrlFromItem(item: UploadThingFile | undefined): string | null {
    if (!item) return null;
    return (
      item.url ??
      item.uploadedUrl ??
      item.file?.url ??
      item.file?.ufsUrl ??
      item.file?.ufs_url ??
      null
    );
  }

  // Normalize the raw response that startUpload may return.
  // Some upload hooks return an array of arrays (per-file responses), others return a flat array.
  function normalizeResponse(raw: unknown): UploadThingFile[] {
    if (!raw) return [];
    if (!Array.isArray(raw)) return [];
    // if first element is an array, flatten one level
    if (Array.isArray(raw[0])) {
      // raw is something like UploadThingFile[][]
      // flatten and return as UploadThingFile[]
      return (raw as any[]).flat() as UploadThingFile[];
    }
    return raw as UploadThingFile[];
  }

  async function uploadFiles(files: File[]) {
    setErrorMessage(null);
    if (!files || files.length === 0) return;

    // Filter by size and available slots
    const availableSlots = Math.max(0, maxImages - imageUrls.length);
    const filesToUpload = files.slice(0, availableSlots);

    // Check sizes
    const oversized = filesToUpload.find((f) => f.size > MAX_BYTES);
    if (oversized) {
      const err = new Error("One or more files exceed 2 MB.");
      setErrorMessage("One or more files are too large — maximum is 2 MB each.");
      onUploadError(err);
      return;
    }

    try {
      // startUpload accepts an array of File/Blob objects
      const rawRes = await startUpload(filesToUpload);
      const flat = normalizeResponse(rawRes);
      // map each item to URL if possible
      const newUrls = flat
        .map((item) => extractUrlFromItem(item))
        .filter((u): u is string => typeof u === "string");

      if (newUrls.length === 0) {
        const debugErr = new Error(
          "Upload succeeded but no URLs were returned from UploadThing."
        );
        // eslint-disable-next-line no-console
        console.error("UploadThing result (no URLs):", rawRes);
        setErrorMessage("Upload failed to return file URLs.");
        onUploadError(debugErr);
        return;
      }

      const updatedUrls = [...imageUrls, ...newUrls].slice(0, maxImages);
      setImageUrls(updatedUrls);
      onUploadComplete(updatedUrls);
    } catch (err: unknown) {
      const normalizedError =
        err instanceof Error ? err : new Error(String(err ?? "Unknown error"));
      // eslint-disable-next-line no-console
      console.error("Upload error:", normalizedError);
      setErrorMessage(
        "Upload failed. Please try again or use a smaller image (max 2 MB)."
      );
      onUploadError(normalizedError);
    }
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    uploadFiles(files);
    // reset input so same files can be reselected later
    e.currentTarget.value = "";
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files ?? []);
    if (files.length === 0) return;
    uploadFiles(files);
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragOver(true);
  }

  function handleDragLeave() {
    setIsDragOver(false);
  }

  const isUploading = hookUploading;

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
              type="button"
              aria-label={`Delete image ${idx + 1}`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {imageUrls.length < maxImages && (
        <>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
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
              {isUploading
                ? "Uploading..."
                : isDragOver
                ? "Drop the files here"
                : `Drop files here or click to browse`}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Images (Max {maxImages}, each max 2MB)
            </div>

            <div className="mt-4">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className={`mt-4 px-6 py-4 bg-[#484d23] text-white font-semibold rounded-full shadow-md 
                  hover:bg-[#5a5e3a] hover:text-[#fdfdfd] hover:scale-105 
                  transition-all duration-300`}
                aria-label="Choose images"
              >
                {isUploading ? "Uploading..." : "Choose Images"}
              </button>
            </div>
          </div>
        </>
      )}

      {errorMessage && (
        <p className="text-red-600 text-sm font-medium mt-2 text-center">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
