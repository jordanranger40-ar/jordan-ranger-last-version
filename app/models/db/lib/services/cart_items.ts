import pool from ".."
import {type newCartItem} from "@/types/index"

export const addNewItem= async (data:newCartItem)=>{

    const result= await pool.query<newCartItem>(
    "insert into cart_items (cart_id, booking_type, booking_id) values ($1,$2,$3) returning *",
    [data.cart_id, data.booking_type,data.booking_id])

    return result.rows[0]
}


export const removeCartItem = async (item_id: string) => {
  await pool.query("DELETE FROM cart_items WHERE id = $1", [item_id]);
  return { message: "Item removed from cart" };
};    // remove one item from the cart

export const clearCart = async (cart_id: string) => {
  await pool.query("DELETE FROM cart_items WHERE cart_id = $1", [cart_id]);
  return { message: "Cart cleared" };
};   // remove all items from the cart

