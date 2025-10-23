"use server";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/app/models/db/authOptions";
import {  newTraining } from "@/types";



export async function createTraining(data: newTraining) {
  const session = await getServerSession(authOptions);
  const token = session?.user.token;
 
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/training`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data)
    }
  );
console.log("result.ok: ",result.ok);

  if (!result.ok) throw new Error("Failed to delete training");

  revalidatePath(`/dashboard/training`);
  return await result.json();
}
