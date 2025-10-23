"use server"
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/models/db/authOptions";
import { memeberOrder } from "@/types";

export async function updateMemberOrder(data: memeberOrder[]) {
  
const session = await getServerSession(authOptions);
  const token = session?.user.token;
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/ourTeam/updateOrder`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to update Member Order");

  revalidatePath(`/dashboard/ourTeam`);

  return res.json();
}
