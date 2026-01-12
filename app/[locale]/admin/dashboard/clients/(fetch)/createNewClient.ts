"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/app/models/db/authOptions";
import { z } from "zod";
import { addNewClient } from "@/app/models/db/lib/services/clients";

const clientSchema = z.object({
   id: z.string().optional(),
  name: z.string().min(1),
  logo: z.string().min(1),
});

type ClientInput = z.infer<typeof clientSchema>;

export async function createClientAction(data: ClientInput) {
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
  const parsed = clientSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      status: 400,
      message: "Invalid Client Data",
    };
  }

  try {
    // 4️⃣ DB insert
    const created = await addNewClient(parsed.data);

    if (!created) {
      return {
        success: false,
        status: 409,
        message: "Client Could Not Be Added",
      };
    }

    // 5️⃣ Revalidate
    revalidatePath(`/dashboard/clients`);

    return {
      success: true,
      status: 201,
      message: "Client Added Successfully",
      data: created,
    };
  } catch (error) {
    console.error("Add Client Error:", error);
    return {
      success: false,
      status: 500,
      message: "Failed To Add Client",
    };
  }
}
