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
  const result = await pool.query<cartWithItems>(
    "SELECT * FROM cart  where user_id= $1 ",
    [userId]
  );
  return { data: result.rows, message: "All Cart Details", status: 200 };
};

export const getCartItemsByUserId = async (userId: string) => {
  const cartDetials = await pool.query<newCart>(
    "SELECT * FROM cart WHERE user_id= $1",
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
  const db = client ?? pool;
  const result = await db.query<newCart>(
    "update cart set total_amount= coalesce($2,total_amount) where id=$1",
    [data.id, data.total_amount]
  );
  return { data: result, message: "Cart Updated Successfully", status: 201 };
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
        "SELECT * FROM cart WHERE expires_at < NOW()"
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
