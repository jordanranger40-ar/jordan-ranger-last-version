"use client";

import React, {  useState } from "react";
import type { cartWithItems } from "@/types/index";
import Link from "next/link";

type CartProps = {
  data: cartWithItems[] | undefined;
  action: (id: string) => void;
};

const Cart: React.FC<CartProps> = ({ data, action }: CartProps) => {
  const [cartItems, setCartItems] = useState<cartWithItems[]>(data || []);

  const shipping = 0;
  const tax = 0;

  const handleRemoveItem = async (id?: string) => {
    if (!id) return;

    try {
      await action(id);
      console.log(id);

      setCartItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  return (
    <div className="lg:max-w-5xl max-lg:max-w-2xl mx-auto bg-white p-4 mt-20">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* 🛍 Cart Items */}
        <div className="lg:col-span-2 bg-gray-100 p-6 rounded-md">
          <h3 className="text-lg font-semibold text-[#484d23]">Your Cart</h3>
          <hr className="border-gray-300 mt-4 mb-8" />

          {cartItems.length === 0 ? (
            <p className="text-center text-slate-500 py-10">
              Your cart is empty 🛍️
            </p>
          ) : (
            cartItems.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center mb-6"
              >
                <div>
                  <h4 className="text-[15px] font-semibold text-[#484d23]">
                    Booking: {item.booking_type}
                  </h4>
                  <p className="text-sm text-[#484d23] mt-1">
                    Total: ${Number(item.price || 0).toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="text-red-500 text-sm hover:underline"
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>

        {/* 🧾 Order Summary */}
        <div className="bg-gray-100 rounded-md p-6 md:sticky top-0 h-max">
          <h3 className="text-lg font-semibold text-[#484d23]">
            Order Details
          </h3>
          <hr className="border-gray-300 mt-4 mb-8" />

          <ul className="text-slate-600 font-medium mt-8 space-y-4">
            <li className="flex justify-between text-sm">
              Discount{" "}
              <span className="text-[#484d23] font-semibold">$0.00</span>
            </li>
            <li className="flex justify-between text-sm">
              Shipping{" "}
              <span className="text-[#484d23] font-semibold">
                ${shipping.toFixed(2)}
              </span>
            </li>
            <li className="flex justify-between text-sm">
              Tax{" "}
              <span className="text-[#484d23] font-semibold">
                ${tax.toFixed(2)}
              </span>
            </li>
            <li className="flex justify-between text-sm text-[#484d23]">
              Total{" "}
              <span className="font-semibold">
                ${Number(data[0].total_amount).toFixed(2)}
              </span>
            </li>
          </ul>

          <div className="mt-8 space-y-3">
            <button className="text-sm px-4 py-2.5 w-full font-medium tracking-wide bg-[#484d23] hover:bg-[#5b6230] text-white rounded-md cursor-pointer transition">
              Checkout
            </button>
            <Link href={"/"}>
            <button className="text-sm px-4 py-2.5 w-full font-medium tracking-wide bg-transparent text-[#484d23] border border-gray-300 rounded-md cursor-pointer hover:bg-gray-200 transition">
              Continue Shopping
            </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
