"use server"
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/models/db/authOptions";
import { newClient } from "@/types";

export async function editClient(data: newClient) {
  
const session = await getServerSession(authOptions);
  const token = session?.user.token;
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/clients/${data.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to update Client");

  revalidatePath(`/dashboard/clients`);

  return res.json();
}
