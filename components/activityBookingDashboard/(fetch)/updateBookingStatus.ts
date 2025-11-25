"use server"
import { authOptions } from "@/app/models/db/authOptions";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function updateBookingStatus(is_confirmed: boolean, id: string) {
  const session = await getServerSession(authOptions);
  const token = session?.user.token;

  const result = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/activityBooking/updateBookingStatus/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(is_confirmed),
    }
  );
  if (!result.ok) throw new Error("Failed To Update the Status");

  revalidatePath(`/admin/dashboard/activitiesBooking`);

  return result.json();
}
