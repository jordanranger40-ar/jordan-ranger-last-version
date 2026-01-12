"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/app/models/db/authOptions";
import { deleteBanner } from "@/app/models/db/lib/services/banners";

export async function deleteBannerAction(bannerId: string) {
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

  // 3️⃣ Validate bannerId
  if (!bannerId) {
    return {
      success: false,
      status: 400,
      message: "Invalid Banner ID",
    };
  }

  try {
    // 4️⃣ DB delete
    const deleted = await deleteBanner(bannerId);

    if (!deleted) {
      return {
        success: false,
        status: 409, // following your reference pattern
        message: "Banner Not Found",
      };
    }

    // 5️⃣ Revalidate
    revalidatePath(`/dashboard/banners`);

    return {
      success: true,
      status: 201,
      message: "Banner Deleted Successfully",
      data: deleted,
    };
  } catch (error) {
    console.error("Delete Banner Error:", error);
    return {
      success: false,
      status: 500,
      message: "Failed To Delete Banner",
    };
  }
}
