import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/app/models/db/lib/index";
import { removeCartItemByItemId } from "@/app/models/db/lib/services/cart_items";

export async function GET(req: NextRequest) {
  // Check secret
  const cronSecret = process.env.CRON_SECRET;
  const secret = req.nextUrl.searchParams.get("secret");

  if (!secret || secret !== cronSecret) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const client = await pool.connect();

  try {
    console.log("Vercel cron triggered at:", new Date());

    await client.query("BEGIN");

    const expiredCarts = await client.query(
      "SELECT * FROM cart WHERE expires_at < NOW()"
    );

    if (expiredCarts.rows.length === 0) {
      await client.query("ROLLBACK");
      return NextResponse.json({ message: "No expired carts found." });
    }

    for (const cart of expiredCarts.rows) {
      const cartItems = await client.query(
        "SELECT * FROM cart_items WHERE cart_id=$1",
        [cart.id]
      );

      for (const item of cartItems.rows) {
        if (item.id) {
          await removeCartItemByItemId(item.id, client);
        }
      }

      await client.query("DELETE FROM cart WHERE id=$1", [cart.id]);
    }

    await client.query("COMMIT");

    return NextResponse.json({
      message: "Expired carts cleared successfully.",
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error clearing expired carts:", error);
    return NextResponse.json(
      { error: "Error clearing expired carts" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
