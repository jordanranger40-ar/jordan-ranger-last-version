import React from "react";
import ThankYouPage from "@/components/checkout/ThankYouPage";
import {
  getCartByUserId,
} from "@/app/models/db/lib/services/cart";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/models/db/authOptions";
interface Props {
  params: Promise<{ locale: "en" | "ar" }>;
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
  const cartData = (await getCartByUserId(session.user.id)).data[0];
   const userDeatils= session.user
   const userEmail= userDeatils.email
   const total_amount= cartData.total_amount
  
   return (
    <div>
      <ThankYouPage  paramsData={{
         userEmail,
         total_amount,
        locale
      }}  />
    </div>
  );
}

export default Page;
