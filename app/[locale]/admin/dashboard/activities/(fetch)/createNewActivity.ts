"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/app/models/db/authOptions";
import { z } from "zod";
import { addNewActivity } from "@/app/models/db/lib/services/activities";
import { newActivitySchema } from "@/app/models/db/lib/schemas/activitySchema";

type ActivityInput = z.infer<typeof newActivitySchema>;

export async function addActivityAction(data: ActivityInput) {
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
  const parsed = newActivitySchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      status: 400,
      message: "Invalid Activity Data",
    };
  }

  try {
    // 4️⃣ DB insert
    const created = await addNewActivity(parsed.data);

    if (!created) {
      return {
        success: false,
        status: 409,
        message: "Activity Could Not Be Added",
      };
    }

    // 5️⃣ Revalidate
    revalidatePath(`/dashboard/activities`);

    return {
      success: true,
      status: 201,
      message: "Activity Added Successfully",
      data: created,
    };
  } catch (error) {
    console.error("Add Activity Error:", error);
    return {
      success: false,
      status: 500,
      message: "Failed To Add The Activity",
    };
  }
}
