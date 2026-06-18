import { type newCart, type cartWithItems, newCartItem } from "@/types/index";
import pool from "..";
import { PoolClient } from "pg";
import cron from "node-cron";
import { removeCartItemByItemId } from "./cart_items";

export const createCart = async (user_id: string, client?: PoolClient) => {
  const db = client ?? pool;
  const isCartExisted = await db.query<newCart>(
    "select * from cart where user_id=$1 and is_paid=false",
    [user_id]
  );

  if (isCartExisted.rows.length > 0) {
    return isCartExisted.rows[0];
  } else {
    const createNewCart = await db.query<newCart>(
      "insert into cart (user_id) values ($1) returning *",
      [user_id]
    );

    return createNewCart.rows[0];
  }
};

export const getCartByUserId = async (userId: string) => {
  const result = await pool.query<newCart>(
    "SELECT * FROM cart  where user_id= $1 and is_paid=false ",
    [userId]
  );
  return { data: result.rows, message: "All Cart Details", status: 200 };
};

export const getCartItemsByUserId = async (userId: string) => {
  const cartDetials = await pool.query<newCart>(
    "SELECT * FROM cart WHERE user_id= $1 and is_paid=false ",
    [userId]
  );
  if (cartDetials.rowCount === 0) {
    return {
      data: null,
      message: "There is no cart for this user",
      status: 409,
    };
  } else {
    const cartId = cartDetials.rows[0].id;

    const result = await pool.query<newCartItem>(
      "SELECT * FROM cart_items where cart_id=$1 ",
      [cartId]
    );
    return { data: result.rows, message: "All Cart Items", status: 200 };
  }
};

export const updateCartTotalAmount = async (
  data: newCart,
  client?: PoolClient
) => {
  const localClient = client ?? (await pool.connect());
  const shouldRelease = !client;

  try {
    const result = await localClient.query<{
      id: string;
      total_amount: number;
    }>(
      `UPDATE cart
       SET total_amount = COALESCE($2, total_amount)
       WHERE id = $1
       RETURNING id, total_amount`,
      [data.id, data.total_amount]
    );

    if (result.rows.length === 0) {
      return { data: null, message: "Cart Not Found", status: 404 };
    }

    const updatedCart = result.rows[0];
console.log("updatedCart: ",updatedCart);

    if (Number(updatedCart.total_amount) <= 0) {
      console.log("in delete");
      
      await localClient.query(`DELETE FROM cart WHERE id = $1`, [data.id]);

      return {
        data: null,
        message: "Cart Deleted Successfully",
        status: 200,
      };
    }

    return {
      data: updatedCart,
      message: "Cart Updated Successfully",
      status: 200,
    };
  } catch (error) {
    console.error("Error updating cart total amount:", error);
    return { data: null, message: "Error updating cart", status: 500 };
  } finally {
    if (shouldRelease) localClient.release();
  }
};

export const getCartById = async (cart_id: string) => {
  const result = await pool.query<newCart>("select * from cart where id= $1 ", [
    cart_id,
  ]);
  return result.rows[0];
};

export const clearExpiredCart = () => {
  cron.schedule("0 */3 * * *", async () => {
    const client = await pool.connect();
    try {
      console.log("Cron triggered at:", new Date());

      await client.query("BEGIN");

      const expiredCarts = await client.query<newCart>(
        "SELECT * FROM cart WHERE expires_at < NOW() AND is_paid =false"
      );

      if (expiredCarts.rows.length === 0) {
        console.log("No expired carts found.");
        await client.query("ROLLBACK");
        return;
      }

      console.log(`Found ${expiredCarts.rows.length} expired cart(s).`);

      for (const cart of expiredCarts.rows) {
        console.log("Clearing cart:", cart.id);

        const cartItems = await client.query<newCartItem>(
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
      console.log("Expired carts cleared successfully");
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Error clearing expired carts:", error);
    } finally {
      client.release();
    }
  });
};


export const getCartForPayment = async (cartId: string, userId: string) => {
  const result = await pool.query(
    `
    SELECT id, total_amount, currency
    FROM cart
    WHERE id = $1 AND user_id = $2 AND is_paid = false
    `,
    [cartId, userId]
  );

  return result.rows[0];
};


// updating all bookings to confirmed 

export const confirmBookingsForCart = async (cartId: string) => {
  // Transactional: mark related bookings as confirmed
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Get cart items
    const itemsRes = await client.query(
      `SELECT booking_type, booking_id FROM cart_items WHERE cart_id = $1`,
      [cartId]
    );
    const rows = itemsRes.rows;
    if (!rows.length) {
      await client.query("COMMIT");
      return { ok: true, updated: 0 };
    }

    const roomIds: string[] = [];
    const activityIds: string[] = [];
    const trainingIds: string[] = [];

    for (const r of rows) {
      const t = r.booking_type;
      const id = r.booking_id;
      if (t === "room") roomIds.push(id);
      else if (t === "activity") activityIds.push(id);
      else if (t === "training") trainingIds.push(id);
    }

    let totalUpdated = 0;

    if (roomIds.length) {
      const qr = await client.query(
        `UPDATE room_booking SET is_confirmed = true WHERE id = ANY($1::uuid[]) RETURNING id`,
        [roomIds]
      );
      totalUpdated += qr.rowCount!;
    }

    if (activityIds.length) {
      const qr = await client.query(
        `UPDATE activities_booking SET is_confirmed = true WHERE id = ANY($1::uuid[]) RETURNING id`,
        [activityIds]
      );
      totalUpdated += qr.rowCount!;
    }

    if (trainingIds.length) {
      const qr = await client.query(
        `UPDATE training_booking SET is_confirmed = true WHERE id = ANY($1::uuid[]) RETURNING id`,
        [trainingIds]
      );
      totalUpdated += qr.rowCount!;
    }

    // Mark cart as paid & checked_out_at if not already done (defensive)
    await client.query(
      `UPDATE cart SET is_paid = true, checked_out_at = now() WHERE id = $1`,
      [cartId]
    );

    await client.query("COMMIT");
    return { ok: true, updated: totalUpdated };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};


