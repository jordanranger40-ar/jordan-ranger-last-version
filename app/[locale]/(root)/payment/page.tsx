import React from "react";
import { getCartByUserId } from "@/app/models/db/lib/services/cart";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/models/db/authOptions";
import PaymentPage from "@/components/checkout/PaymentPage";
type Locale = "en" | "ar";

interface Props {
  params: Promise <{locale:Locale}>
}

export default async function Page({ params }: Props) {
  const locale=(await params).locale
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-10">
        <p className="text-gray-600 text-lg">
          Please log in to view your cart 🛒
        </p>
      </div>
    );
  }

  const cartData = (await getCartByUserId(session.user.id)).data[0];

  const safeCartData = JSON.parse(JSON.stringify(cartData || []));

  return (
    <div className="h-full bg-gray-50 mt-14">
     <PaymentPage  cartDetails={safeCartData} Locale={locale} />
    </div>
  );
}
