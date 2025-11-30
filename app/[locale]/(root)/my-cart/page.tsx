import React from "react";
import Cart from "@/components/cart/cart";
import { getCartByUserId, getCartItemsByUserId } from "@/app/models/db/lib/services/cart";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/models/db/authOptions";
import { deletecartitem } from "./(fetch)/deletecartitem";

export default async function Page() {
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

  const cartDataResponse = await getCartByUserId(session.user.id);
  const cartItemsResponse = await getCartItemsByUserId(session.user.id);

  const cartData = cartDataResponse.data[0];
  const cartDetails = cartItemsResponse.data;

  console.log("data:", cartData);
  console.log("cartDetails:", cartDetails);

  const safeCartData = JSON.parse(JSON.stringify(cartData || []));
  const safeCartDetails = JSON.parse(JSON.stringify(cartDetails || []));

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <Cart
        cartData={safeCartData}
        action={deletecartitem}
        cartDetails={safeCartDetails}
      />
    </div>
  );
}
