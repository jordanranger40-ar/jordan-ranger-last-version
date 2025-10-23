"use server";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/app/models/db/authOptions";

export async function deleteSetting(settingId:string) {
  const session = await getServerSession(authOptions);
  const token = session?.user.token;
 console.log("settingId: ",settingId);
 
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/settings/${settingId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
console.log("result.ok: ",result.ok);

  if (!result.ok) throw new Error("Failed to delete Setting");

  revalidatePath(`/dashboard/settings`);
  return await result.json();
}
