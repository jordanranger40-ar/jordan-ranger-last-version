"use server";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/app/models/db/authOptions";
import { z } from "zod";
import { editClients } from "@/app/models/db/lib/services/clients";

 const editClientSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  logo: z.string().min(1),
});

type EditClientInput = z.infer<typeof editClientSchema>;

export async function editClientAction(id:string,data: EditClientInput) {
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
  const parsed = editClientSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      status: 400,
      message: "Invalid Client Data",
    };
  }

  try {
    // 4️⃣ DB update
    const updated = await editClients(id, parsed.data);

    if (!updated) {
      return {
        success: false,
        status: 409,
        message: "Client Not Found",
      };
    }

    // 5️⃣ Revalidate
    revalidatePath(`/dashboard/clients`);

    return {
      success: true,
      status: 201,
      message: "Client Updated Successfully",
      data: updated,
    };
  } catch (error) {
    console.error("Edit Client Error:", error);
    return {
      success: false,
      status: 500,
      message: "Failed To Update Client",
    };
  }
}
