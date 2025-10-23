"use server";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/app/models/db/authOptions";

export async function updateUserRole(formData: FormData) {
  const session = await getServerSession(authOptions);
  const token = session?.user.token;
  const userId = formData.get("userId") as string;
  const role = formData.get("newRole") as string;
  console.log("token: ",token);
  
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/users/editUser/${userId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ role }),
    }
  );
 
  

  if (!result.ok) throw new Error("Failed to update user role");

  revalidatePath(`/dashboard/users/${userId}`);
  return await result.json();
}
