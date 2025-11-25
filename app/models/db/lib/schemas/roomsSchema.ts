import {z} from "zod"
import { getRoomFeaturesSchema } from "./roomFeaturesSchema";
export const newRoomSchema = z.object({
  id: z.string().uuid().optional(),
  name_en: z.string().min(1, "English name is required"),
  description_en: z.string().min(1, "English description is required"),
  name_ar: z.string().min(1, "Arabic name is required"),
  description_ar: z.string().min(1, "Arabic description is required"),
  cover_image: z.string().url("Cover image must be a valid URL"),
  price: z.number().min(1,"Price must be positive"),
  room_images: z.array(z.string().url("Each room image must be a valid URL")),
  is_deleted: z.boolean().optional(),
  room_features: z.array(getRoomFeaturesSchema()),
  room_type_en: z.string().min(1, "English room type is required"),
  room_type_ar: z.string().min(1, "Arabic room type is required"),
  slug: z.string().min(1, "Slug is required"),
});



export type NewRoomInput = z.infer<typeof newRoomSchema>;