import { z } from "zod";


export const disableBookingSchema = z.object({
  id:z.string().min(1).optional(),
  type: z.enum(["activity", "room"]),
  ref_id: z.string().min(1, "Please select an item"),
  start_date: z.string().min(1, "Start date is required").nullable(),
  end_date: z.string().min(1, "End date is required").nullable(),
  })

export type disableBookingSchema = z.infer<typeof disableBookingSchema>;
