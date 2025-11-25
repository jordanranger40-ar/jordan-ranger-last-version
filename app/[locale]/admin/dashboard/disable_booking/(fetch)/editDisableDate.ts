"use server";

import { authOptions } from "@/app/models/db/authOptions";
import { DisableBookingData } from "@/types";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function editDisabledBooking(data: DisableBookingData) {
  if (!data.id) throw new Error("Missing disabled booking ID");

  const session = await getServerSession(authOptions);
  const token = session?.user.token;

  const result = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/booking_disabled_dates/${data.id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );

  if (!result.ok) throw new Error("Failed to edit the disabled booking");


  revalidatePath(`/admin/dashboard/disable_booking`);

  return result.json();
}
