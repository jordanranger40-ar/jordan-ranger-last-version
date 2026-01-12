// app/api/payments/status/route.ts
import { NextResponse } from "next/server";
import pool from "@/app/models/db/lib";
import {
  markPaymentPaid,
  markPaymentFailed,
  updatePaymentRawResponse,
} from "@/app/models/db/lib/services/payments";
import { confirmBookingsForCart } from "@/app/models/db/lib/services/cart";
import { sendBookingConfirmation } from "@/app/models/db/lib/services/email";

const SUCCESS_REGEX = /^(000\.000\.|000\.100\.1|000\.[36]|000\.200\.100)/;

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const resourcePath = url.searchParams.get("resourcePath");
    const checkoutId = url.searchParams.get("checkoutId");

    if (!resourcePath || !checkoutId) {
      return NextResponse.json(
        { error: "resourcePath and checkoutId are required" },
        { status: 400 }
      );
    }

    const host = process.env.HYPERPAY_HOST ?? "eu-test.oppwa.com";
    const verifyUrl = `https://${host}${resourcePath}?entityId=${process.env.HYPERPAY_ENTITY_ID}`;

    const res = await fetch(verifyUrl, {
      headers: {
        Authorization: `Bearer ${process.env.HYPERPAY_TOKEN}`,
      },
      cache: "no-store",
    });

    const json = await res.json();
    
    console.log("HyperPay status response:", json);

    const code = json?.result?.code;

    const paymentRes = await pool.query(
      "SELECT id, status, cart_id FROM payments WHERE checkout_id=$1",
      [checkoutId]
    );

    const payment = paymentRes.rows[0];
    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    // Already paid → idempotent
    if (payment.status === "PAID") {
      return NextResponse.json({ ok: true, status: "PAID" });
    }

    // SUCCESS
    if (code && SUCCESS_REGEX.test(code)) {
      await markPaymentPaid(checkoutId);
      await updatePaymentRawResponse(payment.id, json);
      await confirmBookingsForCart(payment.cart_id);
      await sendBookingConfirmation({email:json.customer.email,name:json.customer.givenName})
      await pool.query(
        "UPDATE cart SET is_paid=true, checked_out_at=now() WHERE id=$1",
        [payment.cart_id]
      );

      return NextResponse.json({ ok: true, status: "PAID" });
    }

    // FAILURE
    if (code?.startsWith("100.") || code?.startsWith("200.")) {
      await markPaymentFailed(checkoutId);
      return NextResponse.json({ ok: false, status: "FAILED" });
    }

    return NextResponse.json({ ok: false, status: "PENDING" });
  } catch (err) {
    console.error("payments/status error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
