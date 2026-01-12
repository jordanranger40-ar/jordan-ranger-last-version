"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DarkButton from "@/components/ui/dark-button";
import { BillingFormSchema } from "@/app/models/db/lib/schemas/paymentSchema";
import CountrySelect from "@/components/CountrySelect";
import { useEffect } from "react";

import { z } from "zod";

type LocaleType = "en" | "ar";

interface Props {
  locale: LocaleType;
  loading: boolean;
  error: string | null;
  onSubmit: (billing: z.infer<typeof BillingFormSchema>) => void;
}

export default function BillingForm({
  locale,
  loading,
  error,
  onSubmit,
}: Props) {
  const isAr = locale === "ar";

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof BillingFormSchema>>({
    resolver: zodResolver(BillingFormSchema),
    defaultValues: {
      customer_first_name: "",
      customer_last_name: "",
      customer_email: "",
      billing_state: "",
      billing_city: "",
      billing_street: "",
      billing_postal_code: "",
      billing_country: "JO",
    },
  });
  const watchedCountry = watch("billing_country");

  useEffect(() => {
    // ensure uppercase default
    if (watchedCountry && watchedCountry !== watchedCountry.toUpperCase()) {
      setValue("billing_country", watchedCountry.toUpperCase(), {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [watchedCountry, setValue]);

  return (
    <div
      dir={isAr ? "rtl" : "ltr"}
      className={isAr ? "text-right rtl" : "text-left ltr"}
    >
      <h2 className="text-xl font-semibold mb-4">
        {isAr ? "بيانات الفاتورة" : "Billing information"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* First name */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              {isAr ? "الاسم الأول" : "First name"}
            </label>
            <input
              className={`border rounded p-2 w-full ${
                isAr ? "text-right" : "text-left"
              }`}
              {...register("customer_first_name")}
            />
            {errors.customer_first_name && (
              <p className="text-red-600 text-xs mt-1">
                {isAr ? "حقل مطلوب" : errors.customer_first_name.message}
              </p>
            )}
          </div>

          {/* Last name */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              {isAr ? "اسم العائلة" : "Last name"}
            </label>
            <input
              className={`border rounded p-2 w-full ${
                isAr ? "text-right" : "text-left"
              }`}
              {...register("customer_last_name")}
            />
            {errors.customer_last_name && (
              <p className="text-red-600 text-xs mt-1">
                {isAr ? "حقل مطلوب" : errors.customer_last_name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="md:col-span-2">
            <label className="block mb-1 font-medium text-gray-700">
              {isAr ? "البريد الإلكتروني" : "Email"}
            </label>
            <input
              type="email"
              className={`border rounded p-2 w-full ${
                isAr ? "text-right" : "text-left"
              }`}
              {...register("customer_email")}
            />
            {errors.customer_email && (
              <p className="text-red-600 text-xs mt-1">
                {isAr
                  ? "بريد إلكتروني غير صالح"
                  : errors.customer_email.message}
              </p>
            )}
          </div>

          {/* Street */}
          <div className="md:col-span-2">
            <label className="block mb-1 font-medium text-gray-700">
              {isAr ? "العنوان" : "Street"}
            </label>
            <input
              className={`border rounded p-2 w-full ${
                isAr ? "text-right" : "text-left"
              }`}
              {...register("billing_street")}
            />
            {errors.billing_street && (
              <p className="text-red-600 text-xs mt-1">
                {isAr ? "حقل مطلوب" : errors.billing_street.message}
              </p>
            )}
          </div>

          {/* City */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              {isAr ? "المدينة" : "City"}
            </label>
            <input
              className={`border rounded p-2 w-full ${
                isAr ? "text-right" : "text-left"
              }`}
              {...register("billing_city")}
            />
            {errors.billing_city && (
              <p className="text-red-600 text-xs mt-1">
                {isAr ? "حقل مطلوب" : errors.billing_city.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">
              {isAr ? "الدولة" : "Country"}
            </label>

            <CountrySelect
              value={watchedCountry}
              onChange={(code) =>
                setValue("billing_country", code.toUpperCase(), {
                  shouldValidate: true,
                })
              }
              locale={locale}
              allowCustomCode={true}
            />

            <p className="text-gray-500 text-xs mt-1">
              {isAr
                ? "يجب إدخال رمز الدولة بحرفين "
                : "Country must be entered as 2-letter code "}
            </p>
            {errors.billing_country && (
              <p className="text-red-600 text-xs mt-1">
                {isAr ? "رمز الدولة من حرفين" : errors.billing_country.message}
              </p>
            )}
          </div>

          {/* Postal Code */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              {isAr ? "الرقم البريدي" : "Postal Code"}
            </label>
            <input
              className={`border rounded p-2 w-full ${
                isAr ? "text-right" : "text-left"
              }`}
              {...register("billing_postal_code")}
            />
            {errors.billing_postal_code && (
              <p className="text-red-600 text-xs mt-1">
                {isAr
                  ? "الرقم البريدي مطلوب"
                  : errors.billing_postal_code.message}
              </p>
            )}
          </div>

          {/* State */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              {isAr ? "الولاية/مقاطعة" : "State/Province"}
            </label>
            <input
              className={`border rounded p-2 w-full ${
                isAr ? "text-right" : "text-left"
              }`}
              {...register("billing_state")}
            />
            {errors.billing_state && (
              <p className="text-red-600 text-xs mt-1">
                {isAr ? "الولاية مطلوبة" : errors.billing_state.message}
              </p>
            )}
          </div>
        </div>

        {error && <p className="text-red-600 mt-3">{error}</p>}

        <DarkButton type="submit" disabled={loading} className="mt-4 w-full">
          {loading
            ? isAr
              ? "جارٍ الإنشاء..."
              : "Creating..."
            : isAr
            ? "إنشاء جلسة الدفع"
            : "Create checkout"}
        </DarkButton>
      </form>
    </div>
  );
}
