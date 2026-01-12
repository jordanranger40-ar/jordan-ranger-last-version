"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/app/models/db/authOptions";
import { z } from "zod";
import { editUser } from "@/app/models/db/lib/services/users";

const updateUserRoleSchema = z.object({
  userId: z.string().min(1),
  role: z.string().min(1),
});

export async function updateUserRoleAction(formData: FormData) {
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
  const parsed = updateUserRoleSchema.safeParse({
    userId: formData.get("userId"),
    role: formData.get("newRole"),
  });

  if (!parsed.success) {
    return {
      success: false,
      status: 400,
      message: "Invalid User Role Data",
    };
  }

  try {
    // 4️⃣ DB update
    const updated = await editUser(
      parsed.data.userId,
      parsed.data.role
    );

    if (!updated) {
      return {
        success: false,
        status: 409,
        message: "User Not Found",
      };
    }

    // 5️⃣ Revalidate
    revalidatePath(`/dashboard/users`);

    return {
      success: true,
      status: 201,
      message: "User Role Updated Successfully",
      data: updated,
    };
  } catch (error) {
    console.error("Update User Role Error:", error);
    return {
      success: false,
      status: 500,
      message: "Failed To Update User Role",
    };
  }
}
