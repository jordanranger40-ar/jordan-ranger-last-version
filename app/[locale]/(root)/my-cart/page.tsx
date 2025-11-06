import React from "react";

const cartItems = [
  { id: 1, name: "Deluxe Room", price: 120, qty: 1, img: "/room1.jpg" },
  { id: 2, name: "Standard Room", price: 80, qty: 2, img: "/room2.jpg" },
  { id: 3, name: "Suite Room", price: 200, qty: 1, img: "/room3.jpg" },
];

export default function CartPage() {
  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex justify-center py-12 px-4 mt-14 ">
      <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-8">
        {/* ================= Left Section - Cart Items ================= */}
        <div className="flex-1 bg-white rounded-3xl shadow-2xl p-8 space-y-6">
          <h2 className="text-3xl font-bold text-[#515151] mb-6">Your Cart</h2>

          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-6 bg-[#f0f0f0] p-4 rounded-2xl hover:shadow-lg transition-all"
            >
              <img
                src={item.img}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-xl"
              />
              <div className="flex-1">
                <h3 className="text-[#515151] font-semibold text-lg">{item.name}</h3>
                <p className="text-[#515151] text-sm mt-1">Quantity: {item.qty}</p>
              </div>
              <div className="text-[#676e32] font-bold text-lg">${item.price * item.qty}</div>
            </div>
          ))}
        </div>

        {/* ================= Right Section - Summary ================= */}
        <div className="w-full lg:w-96 bg-white rounded-3xl shadow-2xl p-8 flex flex-col justify-between">
          <h3 className="text-2xl font-bold text-[#515151] mb-6">Order Summary</h3>

          <div className="space-y-4">
            <div className="flex justify-between text-[#515151] font-medium">
              <span>Subtotal</span>
              <span>${total}</span>
            </div>
            <div className="flex justify-between text-[#515151] font-medium">
              <span>Taxes (10%)</span>
              <span>${(total * 0.1).toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-300 pt-4 flex justify-between text-[#676e32] font-bold text-xl">
              <span>Total</span>
              <span>${(total * 1.1).toFixed(2)}</span>
            </div>
          </div>

          <button className="mt-8 w-full py-4 bg-[#676e32] text-white font-semibold rounded-2xl text-lg hover:bg-[#515151] transition-colors shadow-md">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
