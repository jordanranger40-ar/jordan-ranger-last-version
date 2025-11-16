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

export const removeCartItemByItemId = async (item_id: string) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const itemDetails = await client.query<newCartItem>(
      "select * from cart_items where id=$1",
      [item_id]
    );

    if (itemDetails.rows.length === 0) {
      await client.query("ROLLBACK");
      return { success: false, message: "Item Not Found" };
    }

    const bookingId = itemDetails.rows[0].booking_id;
    const bookingType = itemDetails.rows[0].booking_type;
    const cartId = itemDetails.rows[0].cart_id;

    if (bookingType === "activities") {
      // if item type= activity, then clear the activity booking
      await client.query("delete from activities_booking where id=$1", [
        bookingId,
      ]);
    } else if (bookingType === "training") {
      // if item type= training, then clear the training booking
      await client.query("delete from training_booking where id=$1", [
        bookingId,
      ]);
    } else if (bookingType === "room") {
      // if item type= room, then clear the room booking
      await client.query("delete from room_booking where id=$1", [bookingId]);
    }

    await client.query("DELETE FROM cart_items WHERE id = $1", [item_id]); // get the total amount of the items that in the cart_items table
    const totalResult = await client.query<{ total: number }>(
      "SELECT COALESCE(SUM(total_price), 0) AS total FROM cart_items WHERE cart_id = $1",
      [cartId]
    );

    const newTotal = totalResult.rows[0].total;

    await client.query("UPDATE carts SET total_amount = $1 WHERE id = $2", [
      //update the total amount
      newTotal,
      cartId,
    ]);
    await client.query("COMMIT");

    return { success: true, message: "The Item Was Deleted Successfully" };
  } catch (error) {
    
    console.error("Error removing cart item:", error);
    await client.query("ROLLBACK");
    return { success: false, message: "Error In Deleteing The Item" };
  } finally {
    client.release();
  }
}; // remove one item from the cart

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
