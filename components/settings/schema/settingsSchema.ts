import { z } from "zod";

export const newSettingSchema = z.object({
  key_name_en: z.string().min(1, "Setting key is required"),
  key_name_ar: z.string().optional(),
  value_en: z.string().min(1, "Value (English) is required"),
  value_ar: z.string().optional(),
});

export type NewSettingSchema = z.infer<typeof newSettingSchema>;
