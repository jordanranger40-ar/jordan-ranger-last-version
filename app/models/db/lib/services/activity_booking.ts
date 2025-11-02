import { type newActivity, type newActivityBooking, type updateActivityBooking } from "@/types/index";
import pool from "../index";
import { createCart, updateCartTotalAmount } from "./cart";
import {
  addNewItem,
  removeCartItemByBookingId,
  editCartItemByBookingId,
} from "./cart_items";


export const bookAnActivity = async (data: newActivityBooking) => {
  const client=  await pool.connect()
  try {
  await client.query("BEGIN")
    console.log("data in bookroom: ", data);

  const numberOfBooking = await client.query<{
    total_booked: number;
    price: number;
  }>(
    "SELECT  COALESCE(SUM(quantity), 0) AS total_booked FROM activities_booking WHERE activity_id = $1 AND (start_time, end_time) OVERLAPS ($2, $3)",
    [data.activity_id, data.start_time, data.end_time]
  );

  const capacityOfTheActivity = await client.query<newActivity>(
    "select * from activities where id=$1",
    [data.activity_id]
  );

  const totalBooked = numberOfBooking.rows[0].total_booked;
  const capacity = capacityOfTheActivity.rows[0].capacity;
  const activityPrice = capacityOfTheActivity.rows[0].price;
  const totalBookingPrice = Number(activityPrice) * Number(data.quantity);
  console.log("totalBooked: ", totalBooked);
  console.log("capacity: ", capacity);
  console.log("ebfueufueffu", data.quantity);
  console.log("activityPrice", activityPrice, typeof activityPrice);
  console.log(
    "test: ",
    Number(activityPrice) * Number(data.quantity),
    typeof (Number(activityPrice) * Number(data.quantity))
  );

  if (Number(totalBooked) + Number(data.quantity) > capacity) {
    return { result: null, message: "Activity is not available", status: 409 };
  } else {
    const result = await client.query<newActivityBooking>(
      "insert into activities_booking (user_id,activity_id,start_time,end_time,quantity,price) values ($1,$2,$3,$4,$5,$6) returning * ",
      [
        data.user_id,
        data.activity_id,
        data.start_time,
        data.end_time,
        data.quantity,
        totalBookingPrice,
      ]
    );

    const cart = await createCart(data.user_id,client);
    await addNewItem({
      cart_id: cart.id ?? "",
      booking_type: "activity",
      booking_id: result.rows[0].id ?? "",
      price: totalBookingPrice,
    },client);

    await updateCartTotalAmount({
      id: cart.id,
      total_amount: Number(cart.total_amount) + totalBookingPrice,
    },client);


   await client.query("COMMIT")

    return {
      result: result.rows,
      message: "The Activity Has Been Booked Succussfully",
      status: 201,
    };
  }
  } catch (error) {
    await client.query("ROLLBACK"); // undo changes if something fails
    console.error("Error in Adding activity booking:", error); throw error;

  }finally { client.release(); }
  
};

export const getAllActivitiesbookings = async () => {
  const result = await pool.query<newActivityBooking>(
    "select * from activities_booking"
  );

  return {
    data: result.rows,
    message: "All Bookings for all activities",
    status: 200,
  };
};

export const getAllbookingsByActivityId = async (id: string) => {
  const result = await pool.query<newActivityBooking>(
    "select * from activity_booking where activity_id=$1",
    [id]
  );
  return {
    data: result.rows,
    message: "All Bookings for this Activity",
    status: 200,
  };
};

export const getActivityBookingById = async (id: string) => {
  const result = await pool.query<newActivityBooking>(
    "select * from activity_booking where id=$1 ",
    [id]
  );

  if (result.rows.length === 0) {
    return {
      data: result.rows,
      message: "No Booking with this id",
      status: 409,
    };
  } else {
    return {
      data: result.rows,
      message: "The Booking for this id",
      status: 200,
    };
  }
};

export const deleteActivityBookingById = async (id: string) => {

  const client= await pool.connect()
  try {
    client.query("BEGIN")
     const result = await client.query<newActivityBooking>(
    "delete  from activity_booking where id=$1 returning * ",
    [id]
  );

  const cartDetails = await createCart(result.rows[0].user_id,client); // get the cart id, note that there is already a cart for this costumer, so we will not create new one
  await removeCartItemByBookingId(result.rows[0].id ?? "",client);
  await updateCartTotalAmount({
    id: cartDetails.id,
    total_amount:
      Number(cartDetails.total_amount) - Number(result.rows[0].price),
  },client);
  client.query("COMMIT")

  return {
    data: result.rows,
    message: "The Booking has been deleted successfully",
    status: 200,
  };
  } catch (error) {
    await client.query("ROLLBACK")
    console.log("Error In Deleting The Booking");
    
  } finally {
    client.release()
  }
 
};

export const deleteAllBookingByActivityId = async (id: string) => {
  const result = await pool.query<newActivityBooking>(
    "delete from activity_booking where activity_id=$1 ",
    [id]
  );

  return {
    data: result.rows,
    message: "All Booking with this id have been deleted successfully",
    status: 200,
  };
};

export const editActivityBookingById = async (
  data: updateActivityBooking,
  bookingId: string
) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const quantityOfThisBooking = await client.query<{ quantity: number }>(
      "select quantity from activities_booking where id=$1",
      [bookingId]
    );

    const numberOfBooking = await client.query<{ total_booked: number }>(
      `SELECT COALESCE(SUM(quantity), 0) AS total_booked
     FROM activities_booking
     WHERE activity_id = $1 AND id <> $2
       AND (start_time, end_time) OVERLAPS ($3, $4)`,
      [data.activity_id, bookingId, data.start_time, data.end_time]
    );

    const capacityOfTheActivity = await client.query<newActivity>(
      "SELECT * FROM activities WHERE id = $1",
      [data.activity_id]
    );

    const totalBooked =
      numberOfBooking.rows[0].total_booked -
      quantityOfThisBooking.rows[0].quantity; // total number of booking
    const capacity = capacityOfTheActivity.rows[0].capacity; // capacity of activity
    const totalBookingPriceBeforeEditing =
      Number(capacityOfTheActivity.rows[0].price) *
      Number(quantityOfThisBooking.rows[0].quantity); // total booking price before editing the booking
    const totalBookingPriceAfterEditing =
      Number(capacityOfTheActivity.rows[0].price) * Number(data.quantity); // total booking price after editing the booking

    if (Number(totalBooked) + Number(data.quantity) > capacity) {
       await client.query("ROLLBACK");
      return {
        result: null,
        message: "Activity is not available at this time",
        status: 409,
      };
    }

    const result = await client.query<newActivityBooking>(
      `UPDATE activities_booking
     SET start_time = COALESCE($1, start_time),
         end_time = COALESCE($2, end_time),
         activity_id = COALESCE($3, activity_id),
         quantity = COALESCE($4, quantity),
         is_confirmed = COALESCE($5, is_confirmed)
     WHERE id = $6
     RETURNING *;`,
      [
        data.start_time,
        data.end_time,
        data.activity_id,
        data.quantity,
        data.is_confirmed,
        bookingId,
      ]
    );

    const cart = await createCart(result.rows[0].user_id,client);
    await editCartItemByBookingId({
      booking_id: result.rows[0].id ?? "",
      newPrice: totalBookingPriceAfterEditing,
    },client);

    await updateCartTotalAmount({
      id: cart.id,
      total_amount:
        Number(cart.total_amount) -
        totalBookingPriceBeforeEditing +
        totalBookingPriceAfterEditing,
    },client);
    await client.query("COMMIT");
    return {
      result: result.rows,
      message: "Your Booking Has Been Updated Successfully",
      status: 201,
    };
  } catch (error) {
    await client.query("ROLLBACK"); //  undo changes if something fails
    console.error("Error editing activity booking:", error);
    throw error;
  } finally {
    client.release();
  }
};
