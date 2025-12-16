import React from "react";
import {
  getCartByUserId,
} from "@/app/models/db/lib/services/cart";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/models/db/authOptions";
import CliqTrasfer from "@/components/checkout/CliqTransfer"
import { toast } from "sonner";
import { redirect } from "next/navigation";
type Locale = "en" | "ar";

interface Props {
  params: Promise<{ locale: Locale }>;
}
async function Page({ params }: Props) {
  const session = await getServerSession(authOptions);
  const locale = (await params).locale;
  if (!session?.user?.id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-10">
        <p className="text-gray-600 text-lg">
          Please log in to procced to checkout
        </p>
      </div>
    );
  }
  console.log("session.user.id: ",session.user.id);
  const cartData = (await getCartByUserId(session.user.id)).data
  if(cartData.length===0){
   toast.error("Your Cart Is Empty")
   redirect("/")
  }
  console.log("cartData: ",cartData);
  const totlaAmount= cartData[0].total_amount
  
  
  return <div>
    <CliqTrasfer locale={locale} totalAmount={totlaAmount} />
  </div>;
}

export default Page;
