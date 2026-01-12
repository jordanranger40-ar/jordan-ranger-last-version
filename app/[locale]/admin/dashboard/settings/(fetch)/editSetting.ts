"use server"
import { authOptions } from "@/app/models/db/authOptions";
import { newSetting } from "@/types";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";


export async function editSetting (data:newSetting){
    const session= await getServerSession(authOptions)
    const token= session?.user.token

   const result= await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/settings/${data.id}`,
        {method:"PUT",
            headers:{
                "Content-Type":"application/json",
                Authorization:`Bearer ${token}`
            },
            body: JSON.stringify(data)
        }
    )

    if(!result.ok)  throw new Error("Failed to update Setting")

        revalidatePath("/dashboard/settings")
          return result.json();


}