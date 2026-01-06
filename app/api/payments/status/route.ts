// app/api/payments/status/route.ts
import { NextResponse } from "next/server";
import {
  markPaymentPaid,
  markPaymentFailed,
  updatePaymentRawResponse,
} from "@/app/models/db/lib/services/payments";
import pool from "@/app/models/db/lib/index";
import { confirmBookingsForCart } from "@/app/models/db/lib/services/cart";
const SUCCESS_REGEX = /^(000\.000\.|000\.100\.1|000\.[36])/;

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const resourcePath = url.searchParams.get("resourcePath");

    if (!resourcePath) {
      return NextResponse.json(
        { error: "resourcePath required" },
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
    const code: string | undefined = json?.result?.code;
    const checkoutId: string | undefined = json?.id;

    if (!checkoutId) {
      return NextResponse.json(
        { error: "checkoutId missing" },
        { status: 400 }
      );
    }

    // Load payment row (idempotency)
    const paymentRes = await pool.query(
      "SELECT id, status, cart_id FROM payments WHERE checkout_id=$1",
      [checkoutId]
    );

    const payment = paymentRes.rows[0];
    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    // If already paid → return success (idempotent)
    if (payment.status === "PAID") {
      return NextResponse.json({ ok: true, status: "PAID", raw: json });
    }

    // SUCCESS
    if (code && SUCCESS_REGEX.test(code)) {
      await markPaymentPaid(checkoutId);
      await updatePaymentRawResponse(payment.id, json); // store raw response
      await confirmBookingsForCart(payment.cart_id);
      await pool.query(
        "UPDATE cart SET is_paid=true, checked_out_at=now() WHERE id=$1",
        [payment.cart_id]
      );

      // 👉 Confirm bookings here (rooms, activities, trainings)
      // await confirmBookingsForCart(payment.cart_id);

      return NextResponse.json({ ok: true, status: "PAID", raw: json });
    }

    // FAILURE (only if explicitly failed)
    if ((code && code.startsWith("100.")) || code?.startsWith("200.")) {
      await markPaymentFailed(checkoutId);
      return NextResponse.json({ ok: false, status: "FAILED", raw: json });
    }

    // Otherwise → still pending
    return NextResponse.json({ ok: false, status: "PENDING", raw: json });
  } catch (err) {
    console.error("payments/status error:", err);
    return NextResponse.json(
      { error:  "Internal error" },
      { status: 500 }
    );
  }
}
