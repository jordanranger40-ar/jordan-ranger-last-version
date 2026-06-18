import { PoolClient } from "pg";
import pool from "..";
import { type newCartItem } from "@/types/index";
import { updateCartTotalAmount, getCartById } from "./cart";

export const addNewItem = async (data: newCartItem, client?: PoolClient) => {
  const db = client ?? pool;

  const result = await db.query<newCartItem>(
    "insert into cart_items (cart_id, booking_type, booking_id,price) values ($1,$2,$3,$4) returning *",
    [data.cart_id, data.booking_type, data.booking_id, data.price],
  );

  return result.rows[0];
};

export const removeCartItemByItemId = async (
  item_id: string,
  client?: PoolClient,
) => {
  const db = client ?? (await pool.connect());
  const isStandalone = !client;

  try {
    if (isStandalone) await db.query("BEGIN");

    const itemDetails = await db.query<newCartItem>(
      "SELECT * FROM cart_items WHERE id = $1",
      [item_id],
    );

    if (itemDetails.rows.length === 0) {
      if (isStandalone) await db.query("ROLLBACK");
      return { success: false, message: "Item Not Found", status: 404 };
    }

    const bookingId = itemDetails.rows[0].booking_id;
    const bookingType = itemDetails.rows[0].booking_type;
    const cartId = itemDetails.rows[0].cart_id;

    if (bookingType === "activity") {
      await db.query("DELETE FROM activities_booking WHERE id = $1", [bookingId]);
    } else if (bookingType === "training") {
      await db.query("DELETE FROM training_booking WHERE id = $1", [bookingId]);
    } else if (bookingType === "room") {
      await db.query("DELETE FROM room_booking WHERE id = $1", [bookingId]);
    }

    await db.query("DELETE FROM cart_items WHERE id = $1", [item_id]);

    const totalResult = await db.query<{ total: number }>(
      "SELECT COALESCE(SUM(price), 0) AS total FROM cart_items WHERE cart_id = $1",
      [cartId],
    );

    const newTotal = Number(totalResult.rows[0].total);

    if (newTotal <= 0) {
      await db.query("DELETE FROM cart WHERE id = $1", [cartId]);
    } else {
      await db.query("UPDATE cart SET total_amount = $1 WHERE id = $2", [
        newTotal,
        cartId,
      ]);
    }

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

export const removeCartItemByItemIdSafe = async (
  item_id: string,
  client?: PoolClient,
) => {
  const db = client ?? (await pool.connect());
  const isStandalone = !client; // true if no client passed

  try {
    if (isStandalone) await db.query("BEGIN");

    // Lock cart_item row to avoid races
    const itemRes = await db.query(
      "SELECT * FROM cart_items WHERE id = $1 FOR UPDATE",
      [item_id],
    );

    if (itemRes.rows.length === 0) {
      if (isStandalone) await db.query("ROLLBACK");
      return { success: false, message: "Item Not Found", status: 409 };
    }

    const item = itemRes.rows[0];
    const bookingId: string | null = item.booking_id;
    const bookingType: string | null = item.booking_type;
    const cartId: string = item.cart_id;

    // Safety: do not remove items from a paid cart
    const cartRes = await db.query("SELECT is_paid FROM cart WHERE id = $1", [
      cartId,
    ]);
    if (cartRes.rows[0]?.is_paid) {
      if (isStandalone) await db.query("ROLLBACK");
      return {
        success: false,
        message: "Cannot remove item from a paid cart",
        status: 409,
      };
    }

    // If there's a booking, check its confirmation status before deleting
    if (bookingId && bookingType) {
      let bookingTable: string | null = null;
      if (bookingType === "activity") bookingTable = "activities_booking";
      else if (bookingType === "training") bookingTable = "training_booking";
      else if (bookingType === "room") bookingTable = "room_booking";

      if (bookingTable) {
        const bookingRes = await db.query(
          `SELECT is_confirmed FROM ${bookingTable} WHERE id = $1 FOR UPDATE`,
          [bookingId],
        );

        if (bookingRes.rows.length > 0) {
          const isConfirmed = !!bookingRes.rows[0].is_confirmed;
          if (isConfirmed) {
            if (isStandalone) await db.query("ROLLBACK");
            return {
              success: false,
              message: "Cannot delete confirmed booking",
              status: 409,
            };
          }

          // booking exists and is not confirmed -> delete it
          await db.query(`DELETE FROM ${bookingTable} WHERE id = $1`, [
            bookingId,
          ]);
        } // else: booking row missing — continue and just remove cart_item
      }
    }

    // Remove the cart_item
    await db.query("DELETE FROM cart_items WHERE id = $1", [item_id]);

    // Recalculate and update cart total
    const totalResult = await db.query<{ total: number }>(
      "SELECT COALESCE(SUM(price),0) AS total FROM cart_items WHERE cart_id = $1",
      [cartId],
    );

    await db.query("UPDATE cart SET total_amount = $1 WHERE id = $2", [
      totalResult.rows[0].total,
      cartId,
    ]);

    if (isStandalone) await db.query("COMMIT");

    return { success: true, message: "Item deleted successfully", status: 200 };
  } catch (error) {
    console.error("Error removing cart item (safe):", error);
    if (isStandalone) await db.query("ROLLBACK");
    return { success: false, message: "Error deleting item", status: 500 };
  } finally {
    if (isStandalone) db.release();
  }
};

export const clearCart = async (cart_id: string) => {
  await pool.query("DELETE FROM cart_items WHERE cart_id = $1", [cart_id]);
  return { message: "Cart cleared Successfully", status: 200 };
}; // remove all items from the cart

export const removeCartItemByBookingId = async (
  booking_id: string,
  client?: PoolClient,
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
      [booking_id],
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

    console.log("cart total:", cart_details.total_amount);
    console.log("item price:", item_price);
    console.log(
      "new total:",
      Number(cart_details.total_amount) - Number(item_price),
    );
    //  Update total cart amount
    await updateCartTotalAmount(
      {
        id: cart_id,
        total_amount: Number(cart_details.total_amount) - Number(item_price),
      },
      localClient,
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

export const removeCartItemsByBookingIds = async (
  bookingIds: string[],
  client: PoolClient,
) => {
  if (bookingIds.length === 0) return;

  // Get all affected cart items
  const itemDetails = await client.query<{
    item_price: number;
    cart_id: string;
  }>(
    `SELECT price AS item_price, cart_id 
     FROM cart_items 
     WHERE booking_id = ANY($1)`,
    [bookingIds],
  );

  if (itemDetails.rows.length === 0) return;

  // Group by cart to update totals correctly
  const cartUpdates = new Map<string, number>();

  for (const row of itemDetails.rows) {
    const current = cartUpdates.get(row.cart_id) || 0;
    cartUpdates.set(row.cart_id, current + Number(row.item_price));
  }

  // Delete all items
  await client.query(`DELETE FROM cart_items WHERE booking_id = ANY($1)`, [
    bookingIds,
  ]);

  // Update each cart total
  for (const [cartId, deductedAmount] of cartUpdates.entries()) {
    await client.query(
      `UPDATE cart
       SET total_amount = total_amount - $1 
       WHERE id = $2`,
      [deductedAmount, cartId],
    );
  }
}; // this is used for more than one booking

export const editCartItemByBookingId = async (
  data: { booking_id: string; newPrice: number },
  client?: PoolClient,
) => {
  const db = client ?? pool;
  const result = await db.query<newCartItem>(
    "update cart_items set price= coalesce($2, price) where booking_id=$1 returning *",
    [data.booking_id, data.newPrice],
  );

  return {
    data: result,
    message: "item was updated successfully",
    status: 201,
  };
};
