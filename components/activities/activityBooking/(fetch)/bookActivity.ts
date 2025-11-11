"use server";
import { authOptions } from "@/app/models/db/authOptions";
import { newActivityBooking } from "@/types";
import { getServerSession } from "next-auth";
import { bookAnActivity } from "@/app/models/db/lib/services/activity_booking";

export async function bookActivity(bookingDetails: newActivityBooking) {
  const userDetails = await getServerSession(authOptions);
  if (!userDetails)
    return { success: false, message: "Please login to book the activity" };

  try {
    const result = await bookAnActivity({
      user_id: userDetails.user.id,
      activity_id: bookingDetails.activity_id,
      start_time: bookingDetails.start_time,
      end_time: bookingDetails.end_time,
      quantity: bookingDetails.quantity,
    });

    if (result.status === 201) {
      return { success: true, message: result.message };
    } else {
      return { success: false, message: result.message || "Booking failed" };
    }
  } catch (error) {
    console.error("Error booking activity:", error);
    return { success: false, message: "Error in booking the activity" };
  }
}
