"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/app/models/db/authOptions";
import { deleteDisabledDate } from "@/app/models/db/lib/services/booking_disabled_dates";

export async function deleteDisableBookingAction(disableBookingId: string) {
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

  // 3️⃣ Validate ID
  if (!disableBookingId) {
    return {
      success: false,
      status: 400,
      message: "Invalid Disable Booking ID",
    };
  }

  try {
    // 4️⃣ DB delete
    const deleted = await deleteDisabledDate(disableBookingId);

    if (!deleted) {
      return {
        success: false,
        status: 409,
        message: "Disable Booking Not Found",
      };
    }

    // 5️⃣ Revalidate
    revalidatePath(`/dashboard/disable_booking`);

    return {
      success: true,
      status: 201,
      message: "Disable Booking Deleted Successfully",
      data: deleted,
    };
  } catch (error) {
    console.error("Delete Disable Booking Error:", error);
    return {
      success: false,
      status: 500,
      message: "Failed To Delete Disable Booking",
    };
  }
}
