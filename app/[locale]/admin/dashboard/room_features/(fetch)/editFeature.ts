"use server"
import { authOptions } from "@/app/models/db/authOptions";
import { roomFeatures } from "@/types";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function editFeature(data: roomFeatures) {
  const session = await getServerSession(authOptions);
  const token = session?.user.token;
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/room_features/${data.id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );
  if (!result.ok) throw new Error("Failed To Edit The Feature");
  revalidatePath(`/dashboard/room_features`);
  return result.json();
}
