// app/api/payments/create/route.ts
import { NextResponse } from "next/server";
import { createPendingCardPayment, updatePaymentCheckoutId, /* optionally updatePaymentRawResponse */ } from "@/app/models/db/lib/services/payments";
import { getCartByUserId } from "@/app/models/db/lib/services/cart";
import { newCart } from "@/types";

const HYPERPAY_HOST = process.env.HYPERPAY_HOST ?? "eu-test.oppwa.com";
const HYPERPAY_ENTITY = process.env.HYPERPAY_ENTITY_ID!;
const HYPERPAY_TOKEN = process.env.HYPERPAY_TOKEN!;
const ORIGIN = process.env.NEXT_PUBLIC_APP_ORIGIN ?? "";

console.log("HYPERPAY_HOST: ",HYPERPAY_HOST,"HYPERPAY_ENTITY: ",HYPERPAY_ENTITY, "HYPERPAY_TOKEN: ",HYPERPAY_TOKEN, " ORIGIN: ",ORIGIN);

function formatAmountForHyperpay(amountRaw: string | number) {
  const n = Number(amountRaw);
  if (Number.isNaN(n)) throw new Error("Invalid amount");
  // HyperPay requires 2 decimals for this endpoint
  return n.toFixed(2); 
}



async function callHyperpayCreateCheckout(amountStr: string, ) {
    console.log("amountStr: ",amountStr);
    
  const params = new URLSearchParams({
    entityId: HYPERPAY_ENTITY,
    amount: amountStr,
    currency:"JOD",
    paymentType: "DB",
    integrity: "true",
    // where HyperPay will redirect after payment (adjust as needed)
    shopperResultUrl: `${ORIGIN}/payment-result`,
  });
console.log("HyperPay request params:", params.toString());

  const url = `https://${HYPERPAY_HOST}/v1/checkouts`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${HYPERPAY_TOKEN}`,
    },
    body: params.toString(),
    // ensure no caching on server-side call
    cache: "no-store",
  });

  const json = await res.json().catch(() => null);
  console.log("HyperPay parameter errors:", json.result.parameterErrors);

  return { ok: res.ok, status: res.status, json };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { cartId, userId } = body ?? {};

    if (!cartId || !userId) {
      return NextResponse.json({ error: "cartId and userId required" }, { status: 400 });
    }

    // load cart (your helper returns .data[] as you implemented earlier)
    const cartResp = await getCartByUserId(userId);
    const cart = Array.isArray(cartResp.data) ? cartResp.data.find((c:newCart) => c.id === cartId) : null;
    console.log("cart: cart: :cart: ",cart);
    
    if (!cart) return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    if (cart.is_paid) return NextResponse.json({ error: "Cart already paid" }, { status: 400 });

    const currency = "JOD";
    const amountStr = formatAmountForHyperpay(Number(cart.total_amount));

    // create pending payment (DB helper) — store numeric amount for your records too
    const payment = await createPendingCardPayment({
      userId,
      cartId,
      amount: Number(cart.total_amount),
      currency:"JOD",
    });

    // call HyperPay

    const { ok, json } = await callHyperpayCreateCheckout(amountStr);
    console.log("json: ",json,"Ok oK : ",ok);
    

    // store raw response (optional helper) and checkoutId
    if (json) {
      // if HyperPay returned data.id, save it
      if (json.id) {
        await updatePaymentCheckoutId(payment.id, json.id);
      }

      // if you have helper updatePaymentRawResponse, call it. Otherwise consider adding it:
      // await updatePaymentRawResponse(payment.id, json);
    }

    if (!ok) {
        console.log("ok okok ok:  ",ok);
        
      // mark payment failed (you can add a helper for that) and return error
      return NextResponse.json({ error: "HyperPay returned an error", details: json }, { status: 502 });
    }

    return NextResponse.json({ checkoutId: json?.id, raw: json });
  } catch (err) {

    console.error("payments/create error:", err);
    return NextResponse.json({ error:  "Internal error" }, { status: 500 });
  }
}
