"use server"
import { authOptions } from "@/app/models/db/authOptions";
import { newActivity } from "@/types";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function editActivity(data: newActivity) {
  const session = await getServerSession(authOptions);
  const token = session?.user.token;
  console.log("dataid: ", data.id);
  
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/activities/${data.id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );
  
  if (!result.ok) throw new Error("Failed To Edit The Activity");
  revalidatePath(`/dashboard/activities`);
  return result.json();
}
