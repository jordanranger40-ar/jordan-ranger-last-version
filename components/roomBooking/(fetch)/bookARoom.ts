"use server";
import { authOptions } from "@/app/models/db/authOptions";
import { getServerSession } from "next-auth";
import { bookARoom } from "@/app/models/db/lib/services/room_booking";

type bookingType = {
  room_id: string;
  start_time: Date;
  end_time: Date;
};

export async function bookRoom(bookingDetails: bookingType) {
  const userDetails = await getServerSession(authOptions);
  if (!userDetails)
    return { success: false, message: "Please login to book the Room" };

  try {
    const result = await bookARoom({
      user_id: userDetails.user.id,
      room_id: bookingDetails.room_id,
      start_time: bookingDetails.start_time,
      end_time: bookingDetails.end_time,
    });

    if (result?.status === 201) {
      return { success: true, message: result.message };
    } else {
      return { success: false, message: result?.message || "Booking failed" };
    }
  } catch (error) {
    console.error("Error booking Room:", error);
    return { success: false, message: "Error in booking the Room" };
  }
}
