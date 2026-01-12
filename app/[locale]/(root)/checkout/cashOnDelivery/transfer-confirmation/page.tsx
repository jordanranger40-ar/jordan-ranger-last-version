import React from 'react'
import {
  getCartByUserId,
} from "@/app/models/db/lib/services/cart";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/models/db/authOptions";
import { emailConfermationAction } from '@/components/checkout/(fetch)/emailConfermationAction';
import { toast } from "sonner";
import { redirect } from "next/navigation";
import TransferConfirmationForm from '@/components/checkout/Transfer-ConfirmationForm';
type Locale = "en" | "ar";
interface Props {
    params: Promise<{locale:Locale}>
}
async function Page({params}:Props) {
     const session = await getServerSession(authOptions);
      const locale = (await params).locale;
     const  userDetails= session?.user
      if (!session?.user) {
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center py-10">
            <p className="text-gray-600 text-lg">
              Please log in to procced to checkout
            </p>
          </div>
        );
      }
      const cartData = (await getCartByUserId(session.user.id)).data
      if(cartData.length===0){
       toast.error("Your Cart Is Empty")
       redirect("/")
      }
      console.log("cartData: ",cartData);
      const userEmail= userDetails?.email
      const userId= userDetails?.id
      const expireAt= cartData[0].expires_at?.toISOString()
  return (
    <div>
        <TransferConfirmationForm locale={locale} expireAt={expireAt??""} cartData={cartData[0]} email={userEmail??""} id={userId??""}  emailAction={emailConfermationAction}/>
    </div>
  )
}

export default Page