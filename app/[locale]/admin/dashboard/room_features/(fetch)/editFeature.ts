"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/app/models/db/authOptions";
import { z } from "zod";
import { editFeature } from "@/app/models/db/lib/services/rooms_features";
import { getRoomFeaturesSchema } from "@/app/models/db/lib/schemas/roomFeaturesSchema";
const schema = getRoomFeaturesSchema();
type EditRoomFeatureInput = z.infer<typeof schema>;



export async function editFeatureAction(id:string,data: EditRoomFeatureInput) {
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
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      status: 400,
      message: "Invalid Feature Data",
    };
  }


  try {
    // 4️⃣ DB update
    const updated = await editFeature(parsed.data,id);

    if (!updated) {
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
      message: "Feature Updated Successfully",
      data: updated,
    };
  } catch (error) {
    console.error("Edit Feature Error:", error);
    return {
      success: false,
      status: 500,
      message: "Failed To Edit The Feature",
    };
  }
}
