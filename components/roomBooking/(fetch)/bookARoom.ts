"use server";

import { authOptions } from "@/app/models/db/authOptions";
import { getServerSession } from "next-auth";
import { bookARoom } from "@/app/models/db/lib/services/room_booking";

type BookingType = {
  room_id: string;
  start_time: Date;
  end_time: Date;
};

export async function bookRoomAction(bookingDetails: BookingType) {
  const session = await getServerSession(authOptions);

  // 1️⃣ Auth
  if (!session) {
    return {
      success: false,
      status: 401,
      message: "Please login to book the room",
    };
  }

  // 2️⃣ Validate booking details
  if (!bookingDetails.room_id || !bookingDetails.start_time || !bookingDetails.end_time) {
    return {
      success: false,
      status: 400,
      message: "Invalid booking details",
    };
  }

  try {
    // 3️⃣ Book the room via DB service
    const result = await bookARoom({
      user_id: session.user.id,
      room_id: bookingDetails.room_id,
      start_time: bookingDetails.start_time,
      end_time: bookingDetails.end_time,
    });

    if (result?.status === 201) {
      return {
        success: true,
        status: 201,
        message: result.message || "Room booked successfully",
       
      };
    }

    return {
      success: false,
      status: result?.status || 400,
      message: result?.message || "Booking failed",
    };
  } catch (error) {
    console.error("Error booking room:", error);
    return {
      success: false,
      status: 500,
      message: "Error booking the room",
    };
  }
}
