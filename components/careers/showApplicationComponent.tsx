"use client";

import React, { useEffect, useRef, useState } from "react";
import { Eye, X, FileText } from "lucide-react";
import { newCareer } from "@/types";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
type Application = newCareer;

interface Props {
  application: Application;
  title?: string;
  triggerClassName?: string;
}

export default function ApplicationDetailsModal({
  application,
  title = "Application Details",
}: Props) {
  const [open, setOpen] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => closeBtnRef.current?.focus(), 50);
    }
  }, [open]);

  const createdAtDisplay = (() => {
    if (!application?.created_at) return "";
    try {
      const d = new Date(application.created_at );
      if (!isNaN(d.getTime())) return d.toLocaleString();
    } catch {}
    return String(application.created_at);
  })();

  const fileName =
    typeof application?.cv === "string" && application.cv
      ? getFileNameFromUrl(application.cv)
      : null;

  return (
    <>
      <button
        type="button"
        aria-label="View application details"
        onClick={() => setOpen(true)}
        className="p-1"
        title="View"
      >
        <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Eye
                  className="w-5 h-5 text-[#125892] cursor-pointer hover:text-[#0e4370]"
                />
              </TooltipTrigger>
              <TooltipContent side="top" align="center">
                <p>View</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
      </button>

      {/* Modal */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Modal Panel */}
          <div className="relative z-10 w-full max-w-2xl bg-white dark:bg-gray-900 rounded-lg shadow-xl overflow-auto">
            {/* Header */}
            <div className="flex items-start justify-between p-4 border-b dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {title}
              </h3>
              <button
                ref={closeBtnRef}
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-gray-700 dark:text-gray-200" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 text-sm text-gray-700 dark:text-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Info label="Name" value={`${application.first_name ?? ""} ${application.last_name ?? ""}`} />
                <Info label="Email" value={application.email} />
                <Info label="Phone" value={application.phone_number} />
                <Info label="Country" value={application.city} />
                <Info label="Applied At" value={createdAtDisplay} />
                <Info label="Application ID" value={application.id} />
              </div>

              {/* CV Section */}
              <div>
                <div className="text-xs text-gray-500 mb-1">CV</div>
                {application.cv ? (
                  <a
                    href={application.cv}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:underline"
                  >
                    <FileText className="w-4 h-4" />
                    <span className="break-all">{fileName || "CV File"}</span>
                    <span className="text-xs text-gray-400">(opens in new tab)</span>
                  </a>
                ) : (
                  <div className="text-sm text-gray-500">No CV uploaded</div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-4 border-t dark:border-gray-700">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-sm cursor-pointer"
                type="button"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* Reusable Info Row */
function Info({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <div className="text-xs text-gray-500">{label}</div>
      <div className="font-medium">{value || "-"}</div>
    </div>
  );
}

/* ✅ Safely extract filename from URL */
function getFileNameFromUrl(url: string) {
  try {
    const decoded = decodeURIComponent(url);
    console.log("decoded: ",decoded);
    
    const lastSegment = decoded.split("/").pop() ?? "";
    return lastSegment.split("?")[0]; // Remove any query string
  } catch {
    return url;
  }
}
