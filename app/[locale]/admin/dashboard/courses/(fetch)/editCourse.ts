"use server"
import { authOptions } from "@/app/models/db/authOptions";
import { type editCourse} from "@/types";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";


export async function editCourse (data:editCourse){
    const session= await getServerSession(authOptions)
    const token= session?.user.token
console.log("data.id:",data.id);

   const result= await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/courses/${data.id}`,
        {method:"PUT",
            headers:{
                "Content-Type":"application/json",
                Authorization:`Bearer ${token}`
            },
            body: JSON.stringify(data)
        }
    )

    if(!result.ok)  throw new Error("Failed to update the Course")

        revalidatePath("/dashboard/courses")
          return result.json();


}