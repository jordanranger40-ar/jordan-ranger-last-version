
import {type newCart, type cartWithItems} from "@/types/index"
import pool from ".."

export const createCart = async (user_id:string)=>{

 const isCartExisted= await pool.query<newCart>(
    "select * from cart where user_id=$1 and is_paid=false"
    ,[user_id])

    if (isCartExisted.rows.length > 0) return isCartExisted.rows[0];

    const createNewCart= await pool.query<newCart>("insert into cart (user_id) values ($1) returning *"
        ,[user_id]
    )

    return createNewCart.rows[0]

}

export const getCartByUserId= async (userId:string)=>{
    pool.query<cartWithItems>("select * from cart inner join "
        ,[userId])
}

