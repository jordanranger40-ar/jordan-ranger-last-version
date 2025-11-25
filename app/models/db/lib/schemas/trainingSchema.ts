// app/models/db/lib/schemas/trainingSchema.ts

import { z } from "zod";

export const newTrainingSchema = z.object({
  id: z.string().uuid().optional(),

  name_en: z
    .string()
    .min(2, "English name is required and must be at least 2 characters."),

  name_ar: z
    .string()
    .min(2, "Arabic name is required and must be at least 2 characters."),

  description_en: z
    .string()
    .min(5, "English description must be at least 5 characters."),

  description_ar: z
    .string()
    .min(5, "Arabic description must be at least 5 characters."),

  category_en: z.string().min(2, "English category is required."),

  category_ar: z.string().min(2, "Arabic category is required."),

  start_date: z.coerce.date({
    required_error: "Start date is required.",
    invalid_type_error: "Invalid start date format.",
  }),

  end_date: z.coerce.date({
    required_error: "End date is required.",
    invalid_type_error: "Invalid end date format.",
  }),

  price: z.coerce.number().min(0, "Price must be a positive number."),

  capacity: z.coerce.number().min(1, "Capacity must be at least 1."),

  card_image: z.string().url("Card image must be a valid URL"),
  post_image: z.string().url("Poster image must be a valid URL"),
  header_image: z.string().url("Header image must be a valid URL"),

  is_deleted: z.boolean().default(false),

  slug: z
    .string()
    .min(1, "Slug is required.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format."),
});

export type newTraining = z.infer<typeof newTrainingSchema>;
