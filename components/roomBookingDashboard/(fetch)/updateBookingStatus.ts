"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/app/models/db/authOptions";
import { updateBookingStatus } from "@/app/models/db/lib/services/room_booking";

export async function updateBookingStatusAction(is_confirmed: boolean, id: string) {
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
  if (!id) {
    return {
      success: false,
      status: 400,
      message: "Booking ID is required",
    };
  }

  try {
    // 4️⃣ Update booking status in DB
    const updated = await updateBookingStatus( is_confirmed,id);

    if (!updated) {
      return {
        success: false,
        status: 409,
        message: "Booking Not Found",
      };
    }

    // 5️⃣ Revalidate
    revalidatePath(`/admin/dashboard/disable_booking`);

    return {
      success: true,
      status: 201,
      message: "Booking Status Updated Successfully",
      data: updated,
    };
  } catch (error) {
    console.error("Update Booking Status Error:", error);
    return {
      success: false,
      status: 500,
      message: "Failed To Update Booking Status",
    };
  }
}
