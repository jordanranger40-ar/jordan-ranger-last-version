import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  banners: f({
    image: { maxFileSize: "16MB", maxFileCount: 1 },
  }).onUploadComplete(async ({ file }) => {
    console.log("Banner Upload Complete:", file.url);
    return { uploadedUrl: file.ufsUrl };
  }),

  rooms: f({
    image: { maxFileSize: "16MB", maxFileCount: 5 },
  }).onUploadComplete(async ({ file }) => {
    console.log("Room Upload Complete:", file.url);
    return { uploadedUrl: file.ufsUrl };
  }),

  activities: f({
    image: { maxFileSize: "16MB", maxFileCount: 1 },
  }).onUploadComplete(async ({ file }) => {
    console.log("Activity Upload Complete:", file.url);
    return { uploadedUrl: file.ufsUrl };
  }),

  ourClients: f({
    image: { maxFileSize: "16MB", maxFileCount: 1 },
  }).onUploadComplete(async ({ file }) => {
    console.log("Our Clients Upload Complete:", file.url);
    return { uploadedUrl: file.ufsUrl };
  }),

  services: f({
    image: { maxFileSize: "16MB", maxFileCount: 1 },
  }).onUploadComplete(async ({ file }) => {
    console.log("Services Upload Complete:", file.url);
    return { uploadedUrl: file.ufsUrl };
  }),

  courses: f({
    image: { maxFileSize: "16MB", maxFileCount: 2 },
  }).onUploadComplete(async ({ file }) => {
    console.log("Courses Upload Complete:", file.url);
    return { uploadedUrl: file.ufsUrl };
  }),

  settings: f({
    video: {
      maxFileSize: "64MB",
      maxFileCount: 1,
    },
  }).onUploadComplete(async ({ file }) => {
    console.log("Video Upload Complete:", file.url);
    return { uploadedUrl: file.ufsUrl };
  }),
  cvUpload: f({
    pdf: {
      maxFileSize: "8MB",
      maxFileCount: 1,
    },
  }).onUploadComplete(async ({ file }) => {
    console.log("Video Upload Complete:", file.url);
    return {
      uploadedUrl: file.ufsUrl,
      name: file.name,
      size: file.size,
      type: file.type,
    };
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
