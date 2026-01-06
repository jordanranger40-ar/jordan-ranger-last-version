"use client"; 
import React from "react";
import MainCheckoutPage from "@/components/checkout/MainPage";
import { useRouter } from "next/navigation";
import type { cartWithItems, newCart } from "@/types/index";
import { toast } from "sonner";

interface Props {
  safeCartData: newCart | undefined;
  safeCartDetails: cartWithItems[] | undefined;
  locale?: "en" | "ar";
  initial?: "card" | "cod";
  onConfirm?: (method: "card" | "cod") => void;
}

export default function CheckoutWrapper({
  locale,
  safeCartData,
  safeCartDetails,
}: Props) {
  const router = useRouter();

  console.log("safeCartData: ", safeCartData);

  const handleConfirm = async (method: "card" | "cod") => {
    try {
      if (!safeCartData?.id || !safeCartData?.user_id) return;

      if (method === "card") {
        const res = await fetch("/api/payments/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cartId: safeCartData.id,
            userId: safeCartData.user_id,
          }),
        });
        const data = await res.json();

        if (data.checkoutId) {
          router.push(`/payment?checkoutId=${data.checkoutId}`);
        }
      } else if (method === "cod") {
        router.push(`/checkout/cashOnDelivery`);
      }
    } catch (err) {
      toast.error("An Error Occurred")
    }
  };

  return (
    <MainCheckoutPage
      locale={locale}
      safeCartData={safeCartData}
      safeCartDetails={safeCartDetails}
      onConfirm={handleConfirm} // ✅ Pass the handler
    />
  );
}
