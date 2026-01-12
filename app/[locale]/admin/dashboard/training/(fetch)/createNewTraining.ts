"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/app/models/db/authOptions";
import { z } from "zod";
import { addNewTraining } from "@/app/models/db/lib/services/training";
import {newTrainingSchema} from "@/app/models/db/lib/schemas/trainingSchema"

type TrainingInput = z.infer<typeof newTrainingSchema>;

export async function addTrainingAction(data: TrainingInput) {
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
    // 4️⃣ DB insert
    const created = await addNewTraining(parsed.data);

    if (!created) {
      return {
        success: false,
        status: 409,
        message: "Training Could Not Be Added",
      };
    }

    // 5️⃣ Revalidate
    revalidatePath(`/dashboard/training`);

    return {
      success: true,
      status: 201,
      message: "Training Added Successfully",
      data: created,
    };
  } catch (error) {
    console.error("Add Training Error:", error);
    return {
      success: false,
      status: 500,
      message: "Failed To Add The Training",
    };
  }
}
