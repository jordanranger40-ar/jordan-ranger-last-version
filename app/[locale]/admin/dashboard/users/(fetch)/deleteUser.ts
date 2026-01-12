"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/app/models/db/authOptions";
import { removeUser } from "@/app/models/db/lib/services/users";

export async function deleteUserAction(userId: string) {
  const session = await getServerSession(authOptions);

  // 1️⃣ Auth
  if (!session) {
    return {
      success: false,
      status: 401,
      message: "Please Login To Perform This Action",
    };
  }

  // 2️⃣ Authorization
  if (session.user.role !== "admin") {
    return {
      success: false,
      status: 403,
      message: "You Are Not Allowed To Perform This Action",
    };
  }

  // 3️⃣ Validation
  if (!userId) {
    return {
      success: false,
      status: 400,
      message: "Invalid User ID",
    };
  }

  try {
    // 4️⃣ DB delete
    const deleted = await removeUser(userId);

    if (!deleted) {
      return {
        success: false,
        status: 409,
        message: "User Not Found",
      };
    }

    // 5️⃣ Revalidate
    revalidatePath(`/dashboard/users`);

    return {
      success: true,
      status: 201,
      message: "User Deleted Successfully",
    };
  } catch (error) {
    console.error("Delete User Error:", error);
    return {
      success: false,
      status: 500,
      message: "Failed To Delete User",
    };
  }
}
