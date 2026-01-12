"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/app/models/db/authOptions";
import { z } from "zod";
import { disableBookingRange } from "@/app/models/db/lib/services/booking_disabled_dates";
import {disableBookingSchema} from "@/app/models/db/lib/schemas/disableBookingSchema"


type DisableBookingInput = z.infer<typeof disableBookingSchema>;

export async function disableBookingRangeAction(data: DisableBookingInput) {
  const session = await getServerSession(authOptions);

  // 1️⃣ Auth
  if (!session) {
    return {
      success: false,
      status: 401,
      message: "Please Login To Perform This Action",
    };
  }

  // 2️⃣ Authorization
  if (session.user.role !== "admin") {
    return {
      success: false,
      status: 403,
      message: "You Are Not Allowed To Perform This Action",
    };
  }

  // 3️⃣ Validation
  const parsed = disableBookingSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      status: 400,
      message: "Invalid Disable Booking Data",
    };
  }

  try {
    // 4️⃣ DB insert
    const created = await disableBookingRange(parsed.data);

    if (!created) {
      return {
        success: false,
        status: 409,
        message: "Disable Booking Could Not Be Added",
      };
    }

    // 5️⃣ Revalidate
    revalidatePath(`/dashboard/disableBooking`);

    return {
      success: true,
      status: 201,
      message: "Disable Booking Added Successfully",
      data: created,
    };
  } catch (error) {
    console.error("Add Disable Booking Error:", error);
    return {
      success: false,
      status: 500,
      message: "Failed To Add Disable Booking",
    };
  }
}
