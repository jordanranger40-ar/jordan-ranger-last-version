"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/app/models/db/authOptions";
import { editBanner } from "@/app/models/db/lib/services/banners";
import { z } from "zod";
import { newBanner } from "@/types";

const editBannerSchema = z.object({
 
  alt: z.string().min(1),
  description_en: z.string().min(1),
  description_ar: z.string().min(1),
  image: z.string().nullable(),
});


export async function editBannerAction( bannerId: string, data: newBanner) {
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
  const parsed = editBannerSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      status: 400,
      message: "Invalid Banner Data",
    };
  }
  try {
    // 4️⃣ DB update
    const updated = await editBanner(bannerId, parsed.data);

    if (!updated) {
      return {
        success: false,
        status: 409,
        message: "Banner Not Found",
      };
    }

    // 5️⃣ Revalidate
    revalidatePath(`/dashboard/banners`);

    return {
      success: true,
      status: 201,
      message: "Banner Updated Successfully",
      data: updated,
    };
  } catch (error) {
    console.error("Edit Banner Error:", error);
    return {
      success: false,
      status: 500,
      message: "Failed To Update Banner",
    };
  }
}
