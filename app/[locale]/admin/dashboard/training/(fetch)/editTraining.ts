"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/app/models/db/authOptions";
import { z } from "zod";
import { editTraining } from "@/app/models/db/lib/services/training";
import { newTrainingSchema } from "@/app/models/db/lib/schemas/trainingSchema";

type EditTrainingInput = z.infer<typeof newTrainingSchema>;

export async function editTrainingAction(id: string, data: EditTrainingInput) {
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
  const parsed = newTrainingSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      status: 400,
      message: "Invalid Training Data",
    };
  }

  try {
    // 4️⃣ DB update
    const updated = await editTraining(id, parsed.data);

    if (!updated) {
      return {
        success: false,
        status: 409,
        message: "Training Not Found",
      };
    }

    // 5️⃣ Revalidate
    revalidatePath(`/dashboard/training`);

    return {
      success: true,
      status: 201,
      message: "Training Updated Successfully",
      data: updated,
    };
  } catch (error) {
    console.error("Edit Training Error:", error);
    return {
      success: false,
      status: 500,
      message: "Failed To Update The Training",
    };
  }
}
