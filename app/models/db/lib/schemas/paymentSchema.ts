import { z } from "zod";

export const BillingFormSchema = z.object({
  // Billing
  billing_country: z
    .string()
    .length(2, "Please enter a valid 2-letter country code, e.g., JO"),
  billing_street: z
    .string()
    .min(1, "Please enter your street address"),
  billing_city: z
    .string()
    .min(1, "Please enter your city"),
  billing_state: z
    .string()
    .min(1, "Please enter your state or region"),
  billing_postal_code: z
    .string()
    .min(1, "Please enter your postal code"),
  // Customer
  customer_first_name: z
    .string()
    .min(1, "Please enter your first name"),
  customer_last_name: z
    .string()
    .min(1, "Please enter your last name"),
  customer_email: z
    .string()
    .email("Please enter a valid email address"),
});
