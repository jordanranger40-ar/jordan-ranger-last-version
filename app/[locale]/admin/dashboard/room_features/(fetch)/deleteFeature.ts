"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/app/models/db/authOptions";
import { deleteFeatureById } from "@/app/models/db/lib/services/rooms_features";

export async function deleteFeatureAction(featureId: string) {
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
  if (!featureId) {
    return {
      success: false,
      status: 400,
      message: "Invalid Feature ID",
    };
  }

  try {
    // 4️⃣ DB delete
    const deleted = await deleteFeatureById(featureId);

    if (!deleted) {
      return {
        success: false,
        status: 409,
        message: "Feature Not Found",
      };
    }

    // 5️⃣ Revalidate
    revalidatePath(`/dashboard/room_features`);

    return {
      success: true,
      status: 201,
      message: "Feature Deleted Successfully",
      data: deleted,
    };
  } catch (error) {
    console.error("Delete Feature Error:", error);
    return {
      success: false,
      status: 500,
      message: "Failed To Delete The Feature",
    };
  }
}
