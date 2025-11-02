import { type newCart, type cartWithItems } from "@/types/index";
import pool from "..";
import { PoolClient } from "pg";

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
    "SELECT * FROM cart INNER JOIN cart_items ON cart.id = cart_items.cart_id where user_id= $1 ",
    [userId]
  );
  return { data: result, message: "All Cart Details", status: 200 };
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

export const getCartById= async (cart_id:string)=>{
  const result= await pool.query<newCart>("select * from cart where id= $1 ",[cart_id])
  return result.rows[0]
}
