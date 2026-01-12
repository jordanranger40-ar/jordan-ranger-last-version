"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/app/models/db/authOptions";
import { z } from "zod";
import { editDisabledBookingRange } from "@/app/models/db/lib/services/booking_disabled_dates";
import { disableBookingSchema } from "@/app/models/db/lib/schemas/disableBookingSchema";

type EditDisableBookingInput = z.infer<typeof disableBookingSchema>;

export async function editDisabledBookingAction(
  id: string,
  data: EditDisableBookingInput
) {
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
    // 4️⃣ DB update
    const updated = await editDisabledBookingRange(id, parsed.data);

    if (!updated) {
      return {
        success: false,
        status: 409,
        message: "Disable Booking Not Found",
      };
    }

    // 5️⃣ Revalidate
    revalidatePath(`/dashboard/disableBooking`);

    return {
      success: true,
      status: 201,
      message: "Disable Booking Updated Successfully",
      data: updated,
    };
  } catch (error) {
    console.error("Edit Disable Booking Error:", error);
    return {
      success: false,
      status: 500,
      message: "Failed To Update Disable Booking",
    };
  }
}
