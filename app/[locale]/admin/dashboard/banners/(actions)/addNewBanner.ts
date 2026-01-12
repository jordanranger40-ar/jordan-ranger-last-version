"use server";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/app/models/db/authOptions";
import { addNewBanner } from "@/app/models/db/lib/services/banners";
import { newBanner } from "@/types";
import { z } from "zod";

const bannerSchema = z.object({
  alt: z.string().min(1),
  description_en: z.string().min(1),
  description_ar: z.string().min(1),
  image: z.string().nullable(),
});

export async function createBanner(data: newBanner) {
  const session = await getServerSession(authOptions);
  try {
    const parsed = bannerSchema.safeParse(data);
    if (!parsed.success) {
      return {
        success: false,
        status: 400,
        message: "Invalid Banner Data",
      };
    }
    if (!session)
      return {
        success: false,
        status: 401,
        message: "Please Login To Perform This Action",
      };
    if (session.user.role !== "admin")
      return {
        success: false,
        status: 403,
        message: "You Are Not Allowed To Perform This Action",
      };

    const result = await addNewBanner(parsed.data);
    revalidatePath(`/dashboard/banners`);
    return {
      success: true,
      status: 201,
      message: "Banner Added Successfully",
    };
  } catch (error) {
    return {
      success: false,
      status: 500,
      message: "Failded To Add Banner",
    };
  }
}
