"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BillingForm from "./BillingForm";
import HyperPayWidget from "./HyperPayWidget";
import OrderSummary from "./OrderSummary";
import { newCart, NewPayment,newCartItem } from "@/types";

type LocaleType = "en" | "ar";

interface Props {
  cartDetails: newCart;
  locale: LocaleType;
  cartDetailsData: newCartItem[]
}

export default function PaymentPage({ cartDetails, locale,cartDetailsData }: Props) {
  const router = useRouter();

  const [checkoutId, setCheckoutId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const amount = Number(cartDetails.total_amount);
  const currency = "JOD";

  async function handleCreateCheckout(billing: NewPayment) {
    setCreating(true);
    setError(null);

    try {
      const res = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart_id: cartDetails.id,
          user_id: cartDetails.user_id,
          billing,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.checkoutId) {
        throw new Error(json.error || "Failed to create checkout");
      }

      setCheckoutId(json.checkoutId);
    } catch (err) {
      setError("An error occured");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow">
          {!checkoutId && (
            <BillingForm
              locale={locale}
              loading={creating}
              error={error}
             onSubmit ={handleCreateCheckout}
            />
          )}

          {checkoutId && (
            <HyperPayWidget
              checkoutId={checkoutId}
              locale={locale}
            />
          )}
        </div>

        {/* RIGHT */}
        <OrderSummary
          amount={amount}
          currency={currency}
          locale={locale}
          onBack={() => router.push("/my-cart")}
          cartDetailsData={cartDetailsData}
        />
      </div>
    </div>
  );
}
