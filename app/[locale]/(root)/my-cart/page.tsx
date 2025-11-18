import React from 'react';
import Cart from "@/components/cart/cart";
import { getCartByUserId } from "@/app/models/db/lib/services/cart";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/models/db/authOptions";
import {deletecartitem} from "./(fetch)/deletecartitem";


export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return (
      <div className="bg-gray-50 min-h-screen py-10 flex items-center justify-center">
        <p className="text-gray-600 text-lg">Please log in to view your cart 🛒</p>
      </div>
    );
  }

  const data = await getCartByUserId(session.user.id);
   console.log("data: ",data);
   
 
  const safeData = JSON.parse(JSON.stringify(data.data || []));


  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <Cart data={safeData} action={deletecartitem} />
    </div>
  );
}
