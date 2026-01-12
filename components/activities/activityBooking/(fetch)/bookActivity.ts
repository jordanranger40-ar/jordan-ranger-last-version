"use server";

import { authOptions } from "@/app/models/db/authOptions";
import { getServerSession } from "next-auth";
import { bookAnActivity } from "@/app/models/db/lib/services/activity_booking";
import { newActivityBooking } from "@/types";

export async function bookActivityAction(bookingDetails: newActivityBooking) {
  const session = await getServerSession(authOptions);

  // 1️⃣ Auth check
  if (!session) {
    return {
      success: false,
      status: 401,
      message: "Please login to book the activity",
    };
  }

  // 2️⃣ Validate required fields
  if (
    !bookingDetails.activity_id ||
    !bookingDetails.start_time ||
    !bookingDetails.quantity
  ) {
    return {
      success: false,
      status: 400,
      message: "Invalid booking details",
    };
  }

  try {
    // 3️⃣ Book the activity via DB service
    const result = await bookAnActivity({
      user_id: session.user.id,
      activity_id: bookingDetails.activity_id,
      start_time: bookingDetails.start_time,
      end_time: bookingDetails.end_time,
      quantity: bookingDetails.quantity,
    });

    if (result.status === 201) {
      return {
        success: true,
        status: 201,
        message: result.message || "Activity booked successfully",
      };
    }

    return {
      success: false,
      status: result.status || 400,
      message: result.message || "Booking failed",
    };
  } catch (error) {
    console.error("Error booking activity:", error);
    return {
      success: false,
      status: 500,
      message: "Error in booking the activity",
    };
  }
}
