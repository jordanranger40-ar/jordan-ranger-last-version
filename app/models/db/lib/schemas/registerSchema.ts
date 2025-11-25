import { z } from "zod";

export const getRegisterSchema = (isArabic: boolean) => {
  return z
    .object({
      first_name: z
        .string()
        .min(1, isArabic ? "الاسم الأول مطلوب" : "First Name Is Required"),

      last_name: z
        .string()
        .min(1, isArabic ? "اسم العائلة مطلوب" : "Last Name Is Required"),

      email: z
        .string()
        .min(
          1,
          isArabic ? "يرجى إدخال البريد الإلكتروني" : "Please Enter Your Email"
        )
        .email(
          isArabic
            ? "الرجاء إدخال بريد إلكتروني صالح"
            : "Please enter a valid email"
        ),

      password: z
        .string()
        .min(
          6,
          isArabic
            ? "كلمة المرور يجب أن تحتوي على 6 أحرف على الأقل"
            : "Password must be at least 6 characters"
        ),

      confirmPassword: z
        .string()
        .min(
          6,
          isArabic
            ? "تأكيد كلمة المرور مطلوب"
            : "Confirm password is required"
        ),
    })
    .refine(
      (data) => data.password === data.confirmPassword,
      {
        message: isArabic ? "كلمتا المرور غير متطابقتين" : "Passwords don't match",
        path: ["confirmPassword"],
      }
    );
};

export type RegisterFormType = z.infer<ReturnType<typeof getRegisterSchema>>;
