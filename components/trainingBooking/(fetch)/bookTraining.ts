"use server";
import { authOptions } from "@/app/models/db/authOptions";
import { getServerSession } from "next-auth";
import { bookATraining } from "@/app/models/db/lib/services/training_booking";

type bookingType = {
  training_id: string;
  quantity: number;
};

export async function bookTrainingFunction(bookingDetails: bookingType) {
  const userDetails = await getServerSession(authOptions);
  if (!userDetails)
    return { success: false, message: "Please login to book the Training" };

  try {
    const result = await bookATraining({
      user_id: userDetails.user.id,
      training_id: bookingDetails.training_id,
      quantity:bookingDetails.quantity
    });

    if (result?.status === 201) {
      return { success: true, message: result.message };
    } else {
      return { success: false, message: result?.message || "Booking failed" };
    }
  } catch (error) {
    console.error("Error booking Training:", error);
    return { success: false, message: "Error in booking the Training" };
  }
}
