"use client";

import { UploadDropzone } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { X, FileTextIcon } from "lucide-react";
import { useState, useEffect } from "react";

interface FileUploaderProps {
  endpoint: keyof OurFileRouter;
  onUploadComplete: (url: string) => void;
  onUploadError: (error: Error) => void;
  initialFileUrl?: string | null;
  onDelete?: () => void;
  locale?: string;
}

export default function FileUploader({
  endpoint,
  onUploadComplete,
  onUploadError,
  initialFileUrl,
  onDelete,
  locale = "en",
}: FileUploaderProps) {
  const isArabic = locale === "ar";

  const [fileUrl, setFileUrl] = useState<string | null>(initialFileUrl || null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setFileUrl(initialFileUrl || null);
    if (initialFileUrl) {
      const decodedUrl = decodeURIComponent(initialFileUrl);
      const parts = decodedUrl.split("/");
      const lastPart = parts[parts.length - 1].split("?")[0];
      setFileName(lastPart);
    }
  }, [initialFileUrl]);

  const handleDelete = () => {
    setFileUrl(null);
    setFileName(null);
    setErrorMessage(null);
    if (onDelete) onDelete();
  };

  const getErrorMessage = () =>
    isArabic
      ? "فشل التحميل. الرجاء رفع ملف PDF صالح (الحد الأقصى 8 ميغابايت)."
      : "Upload failed. Please upload a valid PDF file (max 8 MB).";

  const extractUrlAndName = (item: any): { url: string | null; name: string | null } => {
    if (!item) return { url: null, name: null };
    let fileName = item.name || null;
    const candidates = [item.url, item.fileUrl, item.uploadedUrl, item.path];
    let url = null;

    for (const c of candidates) {
      if (typeof c === "string" && c.length > 0) {
        url = ensureAbsoluteUrl(c);
        if (!fileName) {
          const decoded = decodeURIComponent(c);
          const parts = decoded.split("/");
          fileName = parts[parts.length - 1].split("?")[0];
        }
        break;
      }
    }

    return { url, name: fileName };
  };

  const ensureAbsoluteUrl = (u: string) => {
    try {
      new URL(u);
      return u;
    } catch {
      if (typeof window !== "undefined") {
        return `${window.location.origin}/${u.replace(/^\/+/, "")}`;
      }
      return u;
    }
  };

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      {fileUrl ? (
        <div className="relative w-full max-w-md flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-4">
          <FileTextIcon className="w-16 h-16 text-gray-500" />
          <span className="mt-2 text-sm text-gray-700 break-all">
  {fileName ? fileName : isArabic ? "تم تحميل الملف بنجاح" : "File uploaded successfully"}
</span>
          <button
            onClick={handleDelete}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 shadow-md hover:bg-red-600 transition-colors"
            aria-label={isArabic ? "حذف الملف المرفوع" : "Delete uploaded file"}
            type="button"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <UploadDropzone<OurFileRouter, keyof OurFileRouter>
          endpoint={endpoint}
          onUploadBegin={() => {
            setIsUploading(true);
            setErrorMessage(null);
          }}
          onClientUploadComplete={(res: any) => {
            setIsUploading(false);
            const item = Array.isArray(res) ? res[0] : res;
            const { url: uploadedUrl, name: uploadedFileName } = extractUrlAndName(item);
            console.log("name: ",uploadedFileName);
                        console.log("url: ",uploadedUrl);

            
            if (uploadedUrl) {
              setFileUrl(uploadedUrl);
              setFileName(uploadedFileName || "Uploaded file");
              onUploadComplete(uploadedUrl);
            } else {
              const msg = getErrorMessage();
              setErrorMessage(msg);
              onUploadError(new Error(msg));
            }
          }}
          onUploadError={(err: any) => {
            setIsUploading(false);
            const msg = getErrorMessage();
            setErrorMessage(msg);
            onUploadError(err instanceof Error ? err : new Error(msg));
          }}
          config={{ mode: "auto" }}
          appearance={{
            container:
              "flex flex-col items-center justify-center min-h-[160px] w-full max-w-md text-center p-4 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-all duration-200",
            button:
              "bg-[#125892] text-white font-medium rounded-lg px-6 py-3 mt-4 hover:bg-[#0f4473] active:scale-95 transition-all",
            label: "text-gray-500 text-sm sm:text-base",
          }}
          content={{
            button({ isUploading }) {
              return isUploading ? (isArabic ? "جاري التحميل..." : "Uploading...") : isArabic ? "اختيار ملف" : "Choose File";
            },
            label({ isDragActive, isUploading }) {
              if (isUploading) {
                return (
                  <div className="flex flex-col items-center justify-center">
                    <div className="text-sm font-semibold">{isArabic ? "جاري التحميل..." : "Uploading..."}</div>
                    <div className="text-xs text-gray-400 mt-1">{isArabic ? "الرجاء الانتظار" : "Please wait"}</div>
                  </div>
                );
              }
              return (
                <div className="flex flex-col items-center justify-center">
                  <div className="text-sm font-semibold">
                    {isDragActive ? (isArabic ? "اسحب الملف هنا" : "Drop your file here") : isArabic ? "اضغط أو اسحب ملف PDF هنا" : "Click or drop a PDF file here"}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">{isArabic ? "PDF فقط • الحد الأقصى 8 ميغابايت" : "PDF only • Max 8 MB"}</div>
                </div>
              );
            },
            allowedContent: null,
          }}
        />
      )}
      {errorMessage && <p className="text-red-600 text-sm font-medium mt-2 text-center px-2">{errorMessage}</p>}
    </div>
  );
}
