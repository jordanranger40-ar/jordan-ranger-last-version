"use server"
import { authOptions } from "@/app/models/db/authOptions";
import { type editService } from "@/types";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";


export async function editService (data:editService){
    const session= await getServerSession(authOptions)
    const token= session?.user.token
console.log("data.id:",data.id);

   const result= await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/services/${data.id}`,
        {method:"PUT",
            headers:{
                "Content-Type":"application/json",
                Authorization:`Bearer ${token}`
            },
            body: JSON.stringify(data)
        }
    )

    if(!result.ok)  throw new Error("Failed to update Service")

        revalidatePath("/dashboard/services")
          return result.json();


}