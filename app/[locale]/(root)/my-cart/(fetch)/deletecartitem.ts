




"use server"
import {removeCartItemByItemId} from "@/app/models/db/lib/services/cart_items"
import { authOptions } from "@/app/models/db/authOptions";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function deletecartitem(id: string) {
  const session = await getServerSession(authOptions);
  const token = session?.user.token;
  if(!token){
    return "please login"
  }
  const result = await removeCartItemByItemId(id)
  if (!result) throw new Error("Failed To Delete The Activity");
  revalidatePath(`/my-cart`);
  return result;
}
