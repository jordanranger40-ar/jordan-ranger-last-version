"use server"
import { authOptions } from "@/app/models/db/authOptions";
import { DisableBookingData } from "@/types";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function disableBookingRange(data: DisableBookingData) {
  const session = await getServerSession(authOptions);
  const token = session?.user.token;
  console.log("token: ",token);
  
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/booking_disabled_dates`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );
  if (!result.ok) throw new Error("Failed To Disable Bookings");
  revalidatePath(`/dashboard/disableBooking`);
  return result.json();
}
