"use server"
import { authOptions } from "@/app/models/db/authOptions";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function deleteRoom(id: string) {
  const session = await getServerSession(authOptions);
  const token = session?.user.token;
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/rooms/${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!result.ok) throw new Error("Failed To Delete The Room");
  revalidatePath(`/dashboard/rooms`);
  return result.json();
}
