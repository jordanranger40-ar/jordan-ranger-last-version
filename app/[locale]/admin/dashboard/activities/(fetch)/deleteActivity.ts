"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/app/models/db/authOptions";
import { deleteActivityById } from "@/app/models/db/lib/services/activities";

export async function deleteActivityAction(activityId: string) {
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

  // 3️⃣ Validate ID
  if (!activityId) {
    return {
      success: false,
      status: 400,
      message: "Invalid Activity ID",
    };
  }

  try {
    // 4️⃣ DB delete
    const deleted = await deleteActivityById(activityId);

    if (!deleted) {
      return {
        success: false,
        status: 409,
        message: "Activity Not Found",
      };
    }

    // 5️⃣ Revalidate
    revalidatePath(`/dashboard/activities`);

    return {
      success: true,
      status: 201,
      message: "Activity Deleted Successfully",
      data: deleted,
    };
  } catch (error) {
    console.error("Delete Activity Error:", error);
    return {
      success: false,
      status: 500,
      message: "Failed To Delete The Activity",
    };
  }
}
