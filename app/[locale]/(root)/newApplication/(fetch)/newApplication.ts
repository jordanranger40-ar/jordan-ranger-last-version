"use server"

import { newCareer } from "@/types";
import { revalidatePath } from "next/cache";

export const newApplication = async (data: newCareer) => {
    console.log("JSON.stringify(data): ",JSON.stringify(data));
    
 const result= await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/careers`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!result.ok) throw new Error("Error in creating the application")

    revalidatePath("/newApplcation")
    return result.json()
};
