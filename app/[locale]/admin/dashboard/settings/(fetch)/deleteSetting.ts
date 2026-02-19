"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/app/models/db/authOptions";
import { deleteSettings } from "@/app/models/db/lib/services/settings";

export async function deleteSettingAction(settingId: string) {
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
  if (!settingId) {
    return {
      success: false,
      status: 400,
      message: "Invalid Setting ID",
    };
  }

  try {
    // 4️⃣ DB delete
    const deleted = await deleteSettings(settingId);

    if (!deleted) {
      return {
        success: false,
        status: 409,
        message: "Setting Not Found",
      };
    }

    // 5️⃣ Revalidate
    revalidatePath(`/dashboard/settings`);

    return {
      success: true,
      status: 201,
      message: "Setting Deleted Successfully",
      data: deleted,
    };
  } catch (error) {
    console.error("Delete Setting Error:", error);
    return {
      success: false,
      status: 500,
      message: "Failed To Delete The Setting",
    };
  }
}
