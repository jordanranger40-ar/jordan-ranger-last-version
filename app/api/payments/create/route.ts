import { NextResponse } from "next/server";
import { getCartByUserId } from "@/app/models/db/lib/services/cart";
import {
  createPendingCardPayment,
  updatePaymentCheckoutId,
} from "@/app/models/db/lib/services/payments";
import { newCart } from "@/types";

const HYPERPAY_HOST = process.env.HYPERPAY_HOST ?? "eu-test.oppwa.com";
const HYPERPAY_ENTITY = process.env.HYPERPAY_ENTITY_ID!;
const HYPERPAY_TOKEN = process.env.HYPERPAY_TOKEN!;
const ORIGIN = process.env.NEXT_PUBLIC_APP_ORIGIN ?? "http://localhost:3000";

function formatAmount(amount: number) {
  return Number(amount).toFixed(2);
}

export async function POST(req: Request) {
  try {
    const { cart_id, user_id, billing } = await req.json();
    console.log("Incoming body:", cart_id);
    console.log("billing: ", billing);

    if (!cart_id || !user_id || !billing) {
      return NextResponse.json(
        { error: "cart_id, userId and billing are required" },
        { status: 400 }
      );
    }

    // load cart
    const cartResp = await getCartByUserId(user_id);
    const cart = Array.isArray(cartResp.data)
      ? cartResp.data.find((c: newCart) => c.id === cart_id)
      : null;

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    // ✅ create pending payment AND include billing info directly
    const payment = await createPendingCardPayment({
      user_id,
      cart_id,
      amount: Number(cart.total_amount),
      currency: "JOD",
      // add billing info here
      billing_street: billing.billing_street,
      billing_city: billing.billing_city,
      billing_state: billing.billing_state ?? "",
      billing_country: billing.billing_country,
      billing_postal_code: billing.billing_postal_code ?? "",
      // optional customer info
      customer_email: billing.customer_email,
      customer_first_name: billing.customer_first_name,
      customer_last_name: billing.customer_last_name,
      status: "PENDING",
      provider: "Hyperpay",
    });

    // merchantTransactionId <= 18 chars
    const merchantTransactionId = String(payment.id)
      .replace(/[^a-zA-Z0-9]/g, "")
      .slice(0, 18);

    // HyperPay params
    const params = new URLSearchParams({
      entityId: HYPERPAY_ENTITY,
      amount: formatAmount(cart.total_amount),
      currency: "JOD",
      paymentType: "DB",
      testMode: "EXTERNAL",
      integrity: "true",
      merchantTransactionId,
      //"customParameters[3DS2_enrolled]": "true",

      // customer
      "customer.email": billing.customer_email,
      "customer.givenName": billing.customer_first_name,
      "customer.surname": billing.customer_last_name,

      // billing
      "billing.street1": billing.billing_street,
      "billing.city": billing.billing_city,
      "billing.state": billing.billing_state ?? "NA",
      "billing.country": billing.billing_country,
      "billing.postcode": billing.billing_postal_code ?? "00000",

      // redirect
      shopperResultUrl: `${ORIGIN}/payment-result`,
    });

    console.log("fhjdha: ", params);

    const res = await fetch(`https://${HYPERPAY_HOST}/v1/checkouts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${HYPERPAY_TOKEN}`,
      },
      body: params.toString(),
      cache: "no-store",
    });

    const json = await res.json();
    console.log("json :json: ", json);

    if (json?.result?.parameterErrors) {
      console.error("HyperPay parameterErrors:", json.result.parameterErrors);
    }

    if (!res.ok || !json.id) {
      return NextResponse.json(
        { error: "HyperPay error", details: json },
        { status: 502 }
      );
    }

    // save checkoutId in the payment record
    await updatePaymentCheckoutId(payment.id, json.id);
    return NextResponse.json({ checkoutId: json.id });
  } catch (err) {
    console.error("payments/create error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
