import { z } from "zod";

export const getLoginSchema = (isArabic: boolean) => {
  return z.object({
    email: z
      .string()
      .min(1, isArabic ? "البريد الإلكتروني مطلوب" : "Email is required")
      .email(isArabic ? "الرجاء إدخال بريد إلكتروني صالح" : "Please enter a valid email"),
    password: z
      .string()
      .min(6, isArabic ? "كلمة المرور يجب أن تحتوي على 6 أحرف على الأقل" : "Password must be at least 6 characters"),
  });
};
