"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/app/models/db/authOptions";
import { deleteClient } from "@/app/models/db/lib/services/clients";

export async function deleteClientAction(clientId: string) {
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
  if (!clientId) {
    return {
      success: false,
      status: 400,
      message: "Invalid Client ID",
    };
  }

  try {
    // 4️⃣ DB delete
    const deleted = await deleteClient(clientId);

    if (!deleted) {
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
      message: "Client Deleted Successfully",
      data: deleted,
    };
  } catch (error) {
    console.error("Delete Client Error:", error);
    return {
      success: false,
      status: 500,
      message: "Failed To Delete Client",
    };
  }
}
