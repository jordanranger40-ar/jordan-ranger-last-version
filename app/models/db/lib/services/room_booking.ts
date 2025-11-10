import { RoomBookingWithDetails, type newBooking, type newRoom } from "@/types/index";
import pool from "../index";
import { createCart, updateCartTotalAmount } from "./cart";
import {
  addNewItem,
  removeCartItemByBookingId,
  editCartItemByBookingId,
} from "./cart_items";

export const bookARoom = async (data: newBooking) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Check availability
    const availableRoom = await client.query<newRoom>(
      `SELECT * FROM rooms 
     WHERE id = $1 AND id NOT IN (
       SELECT room_id FROM room_booking 
       WHERE (start_time, end_time) OVERLAPS ($2, $3)
     )`,
      [data.room_id, data.start_time, data.end_time]
    );

    if (availableRoom.rows.length === 0) {
      await client.query("ROLLBACK");
      return { result: null, message: "Room is not available", status: 409 };
    }
    // Calculate number of days (difference between start and end)
    const startDate = new Date(data.start_time);
    const endDate = new Date(data.end_time);
    // calculate the difference
    const diffInMs = endDate.getTime() - startDate.getTime();
    // convert to days
    const days = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
    // find Price per days
    const pricePerDay = Number(availableRoom.rows[0].price);
    // find the total price
    const totalPrice = pricePerDay * days;

    // Insert booking
    const result = await client.query<newBooking>(
      `INSERT INTO room_booking (user_id, room_id, start_time, end_time, price) 
     VALUES ($1, $2, $3, $4,$5) RETURNING *`,
      [
        data.user_id,
        data.room_id,
        data.start_time,
        data.end_time,
        Number(totalPrice),
      ]
    );

    // Add to cart
    const cart = await createCart(data.user_id, client);
    await addNewItem(
      {
        cart_id: cart.id ?? "",
        booking_type: "room",
        booking_id: result.rows[0].id ?? "",
        price: Number(totalPrice),
      },
      client
    );
    // update total cart total amount
    await updateCartTotalAmount(
      {
        id: cart.id,
        total_amount: Number(cart.total_amount) + Number(totalPrice),
      },
      client
    );

    await client.query("COMMIT");

    return {
      result: result.rows,
      message: "The Room Has Been Booked Successfully",
      status: 201,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    console.log(error);

    console.log("Error In Booking The Room ");
  } finally {
    client.release();
  }
};

export const getAllRoomsBookings = async () => {
  const result = await pool.query(`
    SELECT 
      rb.id AS id,
      rb.start_time,
      rb.end_time,
      rb.created_at,
      rb.is_confirmed,
      rb.is_deleted,
      u.id AS user_id,
      u.first_name,
      u.last_name,
      u.email,
      r.id AS room_id,
      r.name_en,
      r.description_en,
      r.name_ar,
      r.description_ar,
      r.cover_image,
      r.price,
      r.room_images,
      r.room_type_en,
      r.room_type_ar,
      r.slug
    FROM room_booking rb
    JOIN users u ON rb.user_id = u.id
    JOIN rooms r ON rb.room_id = r.id
    WHERE rb.is_deleted = false
  `);

  return {
    data: result.rows,
    message: "All Bookings with user and room details",
    status: 200,
  };
};

export const getAllbookingsByRoomId = async (id: string) => {
  const result = await pool.query<newBooking>(
    "select * from room_booking where room_id=$1",
    [id]
  );
  return {
    data: result.rows,
    message: "All Bookings for this room",
    status: 200,
  };
};

export const getBookingById = async (id: string) => {
  const result = await pool.query<RoomBookingWithDetails>(
    `SELECT 
      rb.id AS id,
      rb.start_time,
      rb.end_time,
      rb.created_at,
      rb.is_confirmed,
      rb.is_deleted,
      u.id AS user_id,
      u.first_name,
      u.last_name,
      u.email,
      r.id AS room_id,
      r.name_en,
      r.description_en,
      r.name_ar,
      r.description_ar,
      r.cover_image,
      r.price,
      r.room_images,
      r.room_type_en,
      r.room_type_ar,
      r.slug,
      rb.price as booking_price
    FROM room_booking rb
    JOIN users u ON rb.user_id = u.id
    JOIN rooms r ON rb.room_id = r.id
    WHERE rb.is_deleted = false AND rb.id = $1`,
    [id]
  );

  return {
    data: result.rows[0],
    message: "Booking retrieved successfully",
    status: 200,
  };
};


export const deleteBookingById = async (id: string) => {
  const client = await pool.connect();
  try {
    client.query("BEGIN");
    const result = await client.query<newBooking>(
      "delete  from room_booking where id=$1 returning * ",
      [id]
    );

    const cartDetails = await createCart(result.rows[0].user_id, client); // get the cart id, note that there is already a cart for this costumer, so we will not create new one
    await removeCartItemByBookingId(result.rows[0].id ?? "", client);
    await updateCartTotalAmount(
      {
        id: cartDetails.id,
        total_amount:
          Number(cartDetails.total_amount) - Number(result.rows[0].price),
      },
      client
    );

    client.query("COMMIT");
    return {
      data: result.rows,
      message: "The Booking has been deleted successfully",
      status: 200,
    };
  } catch (error) {
    client.query("ROLLBACK");
  } finally {
    client.release();
  }
};

export const deleteAllBookingByRoomId = async (id: string) => {
  const result = await pool.query<newBooking>(
    "delete from room_booking where room_id=$1 ",
    [id]
  );

  return {
    data: result.rows,
    message: "All Booking with this id have been deleted successfully",
    status: 200,
  };
};

export const editBookingById = async (data: newBooking, bookingId: string) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const availableRoom = await client.query<newBooking>(
      `SELECT * FROM room_booking 
     WHERE room_id = $1 
       AND id <> $2 
       AND (start_time, end_time) OVERLAPS ($3, $4)`,
      [data.room_id, bookingId, data.start_time, data.end_time]
    );

    if (availableRoom.rows.length > 0) {
      await client.query("ROLLBACK");
      return {
        result: null,
        message: "Room is not available at this time",
        status: 409,
      };
    }
    // get the old booking
    const oldBooking = await client.query<newBooking>(
      "SELECT * FROM room_booking WHERE id = $1",
      [bookingId]
    );

    const newRoomInfo = await client.query<newRoom>(
      "select * from rooms where id=$1",
      [data.room_id]
    );

    // find the old price
    const oldPrice = Number(oldBooking.rows[0].price);
    // Calculate number of days (difference between start and end)
    const startDate = new Date(data.start_time);
    const endDate = new Date(data.end_time);
    // calculate the difference
    const diffInMs = endDate.getTime() - startDate.getTime();
    // convert to days
    const days = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
    // find Price per days
    const pricePerDay = Number(newRoomInfo.rows[0].price);
    // find the total price
    const totalPrice = pricePerDay * days;

    // Update booking
    const result = await client.query<newBooking>(
      `UPDATE room_booking 
     SET start_time = COALESCE($1, start_time), 
         end_time = COALESCE($2, end_time), 
         room_id = COALESCE($3, room_id), 
         is_confirmed = COALESCE($4, is_confirmed),
         price= COALESCE($5, price)
     WHERE id = $6
     RETURNING *`,
      [
        data.start_time,
        data.end_time,
        data.room_id,
        data.is_confirmed,
        totalPrice,
        bookingId,
      ]
    );
    const cart = await createCart(oldBooking.rows[0].user_id, client);
    await editCartItemByBookingId(
      {
        booking_id: result.rows[0].id ?? "",
        newPrice: Number(totalPrice),
      },
      client
    );
    // update total cart total amount
    await updateCartTotalAmount(
      {
        id: cart.id,
        total_amount: Number(cart.total_amount) - oldPrice + Number(totalPrice),
      },
      client
    );

    await client.query("COMMIT");
    return {
      result: result.rows,
      message: "Your Booking Has Been Updated Successfully",
      status: 201,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    console.log("Error In Updating The Booking");
  } finally {
    client.release();
  }
};
