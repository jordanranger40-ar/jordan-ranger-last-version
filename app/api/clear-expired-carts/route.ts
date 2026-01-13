// /app/api/clear-expired-carts/route.ts
import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/app/models/db/lib/index";
import { removeCartItemByItemId } from "@/app/models/db/lib/services/cart_items";

const JOB_NAME = "clear_expired_carts";
const THREE_HOURS_MS = 3 * 60 * 60 * 1000;

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  const CRON_SECRET = process.env.CRON_SECRET;
  const VERCEL_CRON_SECRET = process.env.VERCEL_CRON_SECRET;

  if (!secret || (secret !== CRON_SECRET && secret !== VERCEL_CRON_SECRET)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const isVercel = secret === VERCEL_CRON_SECRET;
  const client = await pool.connect();

  try {
    console.log(`[clear-expired-carts] Triggered at ${new Date().toISOString()} - mode: ${isVercel ? "vercel" : "manual"}`);
    await client.query("BEGIN");

    // Ensure job row exists (safe to run inside tx)
    await client.query(
      `INSERT INTO system_jobs (name, last_run)
       VALUES ($1, NOW() - INTERVAL '1 day')
       ON CONFLICT (name) DO NOTHING`,
      [JOB_NAME]
    );

    if (!isVercel) {
      // Manual/middleware mode: check last_run and lock row
      const res = await client.query(
        "SELECT last_run FROM system_jobs WHERE name = $1 FOR UPDATE",
        [JOB_NAME]
      );

      const lastRun = res.rows[0]?.last_run ? new Date(res.rows[0].last_run).getTime() : 0;
      const now = Date.now();

      if (now - lastRun < THREE_HOURS_MS) {
        await client.query("ROLLBACK");
        console.log("[clear-expired-carts] Skipped: ran less than 3 hours ago.");
        return NextResponse.json({ message: "Skipped: less than 3 hours since last run" });
      }

      // Reserve the run by updating last_run now (prevents other manual callers racing)
      await client.query("UPDATE system_jobs SET last_run = NOW() WHERE name = $1", [JOB_NAME]);
    } else {
      // Vercel mode: do NOT check last_run before running.
      // We'll update last_run after successful cleanup so manual triggers respect it.
    }

    // ---- Perform cleanup (exact behavior you requested: unpaid expired carts only) ----
    const expiredCarts = await client.query(
      "SELECT * FROM cart WHERE expires_at < NOW() AND is_paid = false"
    );

    if (expiredCarts.rows.length === 0) {
      // nothing to do — rollback and return
      await client.query("ROLLBACK");
      console.log("[clear-expired-carts] No expired unpaid carts found.");
      return NextResponse.json({ message: "No expired carts found." });
    }

    for (const cart of expiredCarts.rows) {
      const cartItems = await client.query(
        "SELECT * FROM cart_items WHERE cart_id = $1",
        [cart.id]
      );

      for (const item of cartItems.rows) {
        if (item.id) {
          // uses your existing function which deletes the booking based on booking_type/booking_id
          await removeCartItemByItemId(item.id, client);
        }
      }

      // delete the cart (cart should be empty now)
      await client.query("DELETE FROM cart WHERE id = $1", [cart.id]);
    }

    // If Vercel mode, update last_run to record we ran
    if (isVercel) {
      await client.query("UPDATE system_jobs SET last_run = NOW() WHERE name = $1", [JOB_NAME]);
    }

    await client.query("COMMIT");
    console.log(`[clear-expired-carts] Deleted ${expiredCarts.rows.length} expired carts.`);

    return NextResponse.json({ message: "Expired carts cleared successfully.", deletedCarts: expiredCarts.rows.length });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("[clear-expired-carts] Error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  } finally {
    client.release();
  }
}
