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
  const handleConfirm = async (method: "card" | "cod") => {
    try {
      if (!safeCartData?.id || !safeCartData?.user_id) return;

      if (method === "card") {
       router.push("/payment")
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
