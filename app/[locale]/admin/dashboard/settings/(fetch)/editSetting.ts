"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/app/models/db/authOptions";
import { editSetting } from "@/app/models/db/lib/services/settings";
import { newSetting } from "@/types";

export async function editSettingAction(settingId:string,data: Partial<newSetting>) {
  const session = await getServerSession(authOptions);

  // 2️⃣ Auth
  if (!session) {
    return {
      success: false,
      status: 401,
      message: "Please Login To Perform This Action",
    };
  }

  // 3️⃣ Authorization
  if (session.user.role !== "admin") {
    return {
      success: false,
      status: 403,
      message: "You Are Not Allowed To Perform This Action",
    };
  }

  // 4️⃣ Validate ID
  if (!data.id) {
    return {
      success: false,
      status: 400,
      message: "Invalid Setting ID",
    };
  }

  

  try {
    // 6️⃣ DB update
    const updated = await editSetting(settingId, data);

    if (!updated) {
      return {
        success: false,
        status: 409,
        message: "Setting Not Found Or Not Updated",
      };
    }

    // 7️⃣ Revalidate
    revalidatePath("/dashboard/settings");

    return {
      success: true,
      status: 201,
      message: "Setting Updated Successfully",
      data: updated,
    };
  } catch (error) {
    console.error("Edit Setting Error:", error);
    return {
      success: false,
      status: 500,
      message: "Failed To Update The Setting",
    };
  }
}
