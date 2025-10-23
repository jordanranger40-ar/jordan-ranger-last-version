"use server"
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/models/db/authOptions";
import { newMember } from "@/types";

export async function editMember(data: newMember) {
  
const session = await getServerSession(authOptions);
  const token = session?.user.token;
  console.log("data: ",data);
  
  console.log("data.id: ",data.id);
  
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/ourTeam/${data.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to update Member");

  revalidatePath(`/dashboard/ourTeam`);

  return res.json();
}
