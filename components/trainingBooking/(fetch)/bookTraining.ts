"use server";

import { authOptions } from "@/app/models/db/authOptions";
import { getServerSession } from "next-auth";
import { bookATraining } from "@/app/models/db/lib/services/training_booking";

type BookingType = {
  training_id: string;
  quantity: number;
};

export async function bookTrainingAction(bookingDetails: BookingType) {
  const session = await getServerSession(authOptions);

  // 1️⃣ Auth check
  if (!session) {
    return {
      success: false,
      status: 401,
      message: "Please login to book the training",
    };
  }

  // 2️⃣ Validate required fields
  if (!bookingDetails.training_id || !bookingDetails.quantity) {
    return {
      success: false,
      status: 400,
      message: "Invalid booking details",
    };
  }

  try {
    // 3️⃣ Book training via DB service
    const result = await bookATraining({
      user_id: session.user.id,
      training_id: bookingDetails.training_id,
      quantity: bookingDetails.quantity,
    });

    if (result?.status === 201) {
      return {
        success: true,
        status: 201,
        message: result.message || "Training booked successfully",
        
      };
    }

    return {
      success: false,
      status: result?.status || 400,
      message: result?.message || "Booking failed",
    };
  } catch (error) {
    console.error("Error booking training:", error);
    return {
      success: false,
      status: 500,
      message: "Error in booking the training",
    };
  }
}
