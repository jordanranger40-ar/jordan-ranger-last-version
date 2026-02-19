"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/app/models/db/authOptions";
import { z } from "zod";
import { addNewSetting } from "@/app/models/db/lib/services/settings";
import { newSetting } from "@/types";



export async function createSettingsAction(data: newSetting) {
  const session = await getServerSession(authOptions);

  // 2️⃣ Authentication
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

  

  try {

    const created = await addNewSetting(data);

    if (!created) {
      return {
        success: false,
        status: 409,
        message: "Settings Could Not Be Created",
      };
    }


    revalidatePath("/dashboard/settings");

    return {
      success: true,
      status: 201,
      message: "Settings Created Successfully",
      data: created,
    };
  } catch (error) {
    console.error("Create Settings Error:", error);
    return {
      success: false,
      status: 500,
      message: "Failed To Create Settings",
    };
  }
}
