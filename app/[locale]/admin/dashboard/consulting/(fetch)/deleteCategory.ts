"use server";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/app/models/db/authOptions";

export async function deleteCategory(categoryId:string) {
  const session = await getServerSession(authOptions);
  const token = session?.user.token;
 console.log("userId: ",categoryId);
 
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/consulting/${categoryId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
console.log("result.ok: ",result.ok);

  if (!result.ok) throw new Error("Failed to delete category");

  revalidatePath(`/dashboard/consulting`);
  return await result.json();
}
