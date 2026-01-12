"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/app/models/db/authOptions";
import { z } from "zod";
import { editRoom } from "@/app/models/db/lib/services/rooms";

import { newRoomSchema } from "@/app/models/db/lib/schemas/roomsSchema";

type EditRoomInput = z.infer<typeof newRoomSchema>;

export async function editRoomAction(id: string, data: EditRoomInput) {
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
  const parsed = newRoomSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      status: 400,
      message: "Invalid Room Data",
    };
  }

  try {
    // 4️⃣ DB update
    const updated = await editRoom(id, parsed.data);

    if (!updated) {
      return {
        success: false,
        status: 409,
        message: "Room Not Found",
      };
    }

    // 5️⃣ Revalidate
    revalidatePath(`/dashboard/rooms`);

    return {
      success: true,
      status: 201,
      message: "Room Updated Successfully",
      data: updated,
    };
  } catch (error) {
    console.error("Edit Room Error:", error);
    return {
      success: false,
      status: 500,
      message: "Failed To Edit The Room",
    };
  }
}
