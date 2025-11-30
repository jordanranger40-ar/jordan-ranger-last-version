import { PoolClient } from "pg";
import pool from "..";
import { type newCartItem } from "@/types/index";
import { updateCartTotalAmount, getCartById } from "./cart";

export const addNewItem = async (data: newCartItem, client?: PoolClient) => {
  const db = client ?? pool;

  const result = await db.query<newCartItem>(
    "insert into cart_items (cart_id, booking_type, booking_id,price) values ($1,$2,$3,$4) returning *",
    [data.cart_id, data.booking_type, data.booking_id, data.price]
  );

  return result.rows[0];
};

export const removeCartItemByItemId = async (item_id: string, client?: PoolClient) => {
  const db = client ?? await pool.connect();
  const isStandalone = !client; // true if no client passed
  try {
    if (isStandalone) await db.query("BEGIN");

    const itemDetails = await db.query<newCartItem>(
      "SELECT * FROM cart_items WHERE id=$1",
      [item_id]
    );

    if (itemDetails.rows.length === 0) {
      if (isStandalone) await db.query("ROLLBACK");
      return { success: false, message: "Item Not Found", status: 409 };
    }

    const bookingId = itemDetails.rows[0].booking_id;
    const bookingType = itemDetails.rows[0].booking_type;
    const cartId = itemDetails.rows[0].cart_id;

    // Delete or restore booking availability
    if (bookingType === "activity") {
      await db.query("DELETE FROM activities_booking WHERE id=$1", [bookingId]);
    } else if (bookingType === "training") {
      await db.query("DELETE FROM training_booking WHERE id=$1", [bookingId]);
    } else if (bookingType === "room") {
      await db.query("DELETE FROM room_booking WHERE id=$1", [bookingId]);
    }

    await db.query("DELETE FROM cart_items WHERE id=$1", [item_id]);

    const totalResult = await db.query<{ total: number }>(
      "SELECT COALESCE(SUM(price),0) AS total FROM cart_items WHERE cart_id=$1",
      [cartId]
    );

    await db.query("UPDATE cart SET total_amount=$1 WHERE id=$2", [
      totalResult.rows[0].total,
      cartId,
    ]);

    if (isStandalone) await db.query("COMMIT");

    return { success: true, message: "Item deleted successfully", status: 200 };
  } catch (error) {
    console.error("Error removing cart item:", error);
    if (isStandalone) await db.query("ROLLBACK");
    return { success: false, message: "Error deleting item", status: 500 };
  } finally {
    if (isStandalone) db.release();
  }
};
 // remove one item from the cart

export const clearCart = async (cart_id: string) => {
  await pool.query("DELETE FROM cart_items WHERE cart_id = $1", [cart_id]);
  return { message: "Cart cleared Successfully", status: 200 };
}; // remove all items from the cart

export const removeCartItemByBookingId = async (
  booking_id: string,
  client?: PoolClient
) => {
  const localClient = client ?? (await pool.connect());
  const shouldManageTransaction = !client;

  try {
    if (shouldManageTransaction) await localClient.query("BEGIN");

    const itemDetails = await localClient.query<{
      item_price: number;
      cart_id: string;
    }>(
      "SELECT price AS item_price, cart_id FROM cart_items WHERE booking_id = $1",
      [booking_id]
    );

    if (itemDetails.rows.length === 0) {
      if (shouldManageTransaction) await localClient.query("ROLLBACK");
      return { message: "Cart item not found", status: 404 };
    }

    const { item_price, cart_id } = itemDetails.rows[0];

    //  Get the cart details
    const cart_details = await getCartById(cart_id);

    //  Delete the item
    await localClient.query("DELETE FROM cart_items WHERE booking_id = $1", [
      booking_id,
    ]);

    //  Update total cart amount
    await updateCartTotalAmount(
      {
        id: cart_id,
        total_amount: Number(cart_details.total_amount) - Number(item_price),
      },
      localClient
    );

    if (shouldManageTransaction) await localClient.query("COMMIT");

    return {
      message: "Item deleted successfully",
      status: 200,
    };
  } catch (error) {
    if (shouldManageTransaction) await localClient.query("ROLLBACK");
    console.error("Error in deleting the item from the cart:", error);
    return { message: "Error in deleting the item", status: 500 };
  } finally {
    if (shouldManageTransaction) localClient.release();
  }
};

export const editCartItemByBookingId = async (
  data: { booking_id: string; newPrice: number },
  client?: PoolClient
) => {
  const db = client ?? pool;
  const result = await db.query<newCartItem>(
    "update cart_items set price= coalesce($2, price) where booking_id=$1 returning *",
    [data.booking_id, data.newPrice]
  );

  return {
    data: result,
    message: "item was updated successfully",
    status: 201,
  };
};
