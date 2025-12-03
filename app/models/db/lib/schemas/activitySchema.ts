import { z } from "zod";

export const newActivitySchema = z.object({
  id: z.string().uuid().optional(),
  name_en: z.string().min(1, "English name is required"),
  name_ar: z.string().min(1, "Arabic name is required"),
  description_en: z.string().min(1, "English description is required"),
  description_ar: z.string().min(1, "Arabic description is required"),
  location_type_en: z.string().min(1, "English location type is required"),
  location_type_ar: z.string().min(1, "Arabic location type is required"),
  card_image: z.string().url("Card image must be a valid URL"),
  poster_image: z.string().url("Poster image must be a valid URL"),
  header_image: z.string().url("Header image must be a valid URL"),
  capacity: z.number().int().positive("Capacity must be a positive integer"),
  price: z.number(),
  minimum_quantity: z.number().min(1, "Minimum Quantity should be at least 1"),
  slug: z.string().min(1, "Slug is required"),
}).refine(
  (data) => data.capacity >= data.minimum_quantity,
  {
    message: "Capacity must be greater than or equal to Minimum Quantity",
    path: ["capacity"], // this will show the error under the capacity field
  })

export type NewActivitySchema = z.infer<typeof newActivitySchema>;
