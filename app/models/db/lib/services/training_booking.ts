import { TrainingBookingWithDetails, type newTraining, type newTrainingBooking } from "@/types/index";
import pool from "../index";
import { createCart, updateCartTotalAmount } from "./cart";
import {
  addNewItem,
  removeCartItemByBookingId,
  editCartItemByBookingId,
} from "./cart_items";

export const bookATraining = async (data: newTrainingBooking) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    console.log("data in bookroom: ", data);

    const numberOfBooking = await client.query<{ total_booked: number }>(
      "SELECT COALESCE(SUM(quantity), 0) AS total_booked FROM training_booking WHERE training_id = $1",
      [data.training_id]
    );

    const capacityOfTheTraining = await client.query<newTraining>(
      "select * from training where id=$1",
      [data.training_id]
    );

    const totalBooked = numberOfBooking.rows[0].total_booked;
    const capacity = capacityOfTheTraining.rows[0].capacity;
    const trainingPrice = capacityOfTheTraining.rows[0].price;
    const totalBookingPrice = Number(trainingPrice) * Number(data.quantity);
    console.log("totalBooked: ", totalBooked);
    console.log("capacity: ", capacity);
    console.log("ebfueufueffu", data.quantity);
    console.log(
      "totalBookingPrice: ",
      totalBookingPrice,
      typeof totalBookingPrice
    );

    if (Number(totalBooked) + Number(data.quantity) > capacity) {
      await client.query("ROLLBACK");
      return {
        result: null,
        message: "Training is not available",
        status: 409,
      };
    } else {
      const result = await client.query<newTrainingBooking>(
        "insert into training_booking (user_id,training_id,quantity,price) values ($1,$2,$3,$4) returning * ",
        [data.user_id, data.training_id, data.quantity, totalBookingPrice]
      );

      const cart = await createCart(data.user_id, client);
      await addNewItem(
        {
          cart_id: cart.id ?? "",
          booking_type: "training",
          booking_id: result.rows[0].id ?? "",
          price: totalBookingPrice,
        },
        client
      );
      console.log(
        "cart total amount: ",
        cart.total_amount,
        typeof cart.total_amount
      );

      await updateCartTotalAmount(
        {
          id: cart.id,
          total_amount: Number(cart.total_amount) + totalBookingPrice,
        },
        client
      );

      client.query("COMMIT");
      return {
        result: result.rows,
        message: "The Training Has Been Booked Succussfully",
        status: 201,
      };
    }
  } catch (error) {
    await client.query("ROLLBACK");
    console.log("Error In Booking The Activity");
  } finally {
    client.release();
  }
};

export const getAllTrainingsbookings = async () => {
  const result = await pool.query<TrainingBookingWithDetails>(
    `SELECT 
      tb.id AS id,
      tb.training_id,
      tb.is_confirmed,
      tb.is_deleted,
      tb.created_at,
      tb.quantity,
      tb.price,
      u.id AS user_id,
      u.first_name,
      u.last_name,
      u.email,
      t.id AS training_id,
      t.name_en,
      t.description_en,
      t.name_ar,
      t.description_ar,
      t.image,
      t.category_en,
      t.category_ar,
      t.capacity,
      t.price AS training_price,
      t.start_date,
      t.end_date,
      t.slug
    FROM training_booking tb
    JOIN users u ON tb.user_id = u.id
    JOIN training t ON tb.training_id = t.id`,
  );

  return {
    data: result.rows,
    message: "All Bookings for all Trainings",
    status: 200,
  };
};

export const getAllbookingsByTrainingId = async (id: string) => {
  const result = await pool.query<newTrainingBooking>(
    "select * from training_booking where training_id=$1",
    [id]
  );
  return {
    data: result.rows,
    message: "All Bookings for this Training",
    status: 200,
  };
};

export const getTrainingBookingById = async (id: string) => {
  const result = await pool.query<newTrainingBooking>(
    `SELECT 
      tb.id AS id,
      tb.training_id,
      tb.is_confirmed,
      tb.is_deleted,
      tb.created_at,
      tb.quantity,
      tb.price,
      u.id AS user_id,
      u.first_name,
      u.last_name,
      u.email,
      t.id AS training_id,
      t.name_en,
      t.description_en,
      t.name_ar,
      t.description_ar,
      t.image,
      t.category_en,
      t.category_ar,
      t.capacity,
      t.price AS training_price,
      t.start_date,
      t.end_date,
      t.slug
    FROM training_booking tb
    JOIN users u ON tb.user_id = u.id
    JOIN training t ON tb.training_id = t.id
    WHERE tb.is_deleted = false AND tb.id = $1`,
    [id]
  );

  return {
    data: result.rows[0],
    message: "Training booking retrieved successfully",
    status: 200,
  };
};


export const deleteTrainingBookingById = async (id: string) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await client.query<newTrainingBooking>(
      "delete  from training_booking where id=$1 returning * ",
      [id]
    );
    console.log("result.rows[0]: ", result.rows[0]);

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
    await client.query("ROLLBACK");
    console.log("Error In Deleting The Booking");
  } finally {
    client.release();
  }
};

export const deleteAllBookingByTrainingId = async (id: string) => {
  const result = await pool.query<newTrainingBooking>(
    "delete from training_booking where training_id=$1 ",
    [id]
  );

  return {
    data: result.rows,
    message: "All Booking with this id have been deleted successfully",
    status: 200,
  };
};

export const editTrainingBookingById = async (
  data: newTrainingBooking,
  bookingId: string
) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const bookedQuantityForBooking = await client.query<{ quantity: number }>(
      "select quantity from training_booking where id=$1",
      [bookingId]
    );
    // get the quantity of the booking that you want to edit, totalBooked - this value => the new total booked value, if the total booked and the new quantity is less than the value, then edit the booking, else throw an error
    const numberOfBooking = await client.query<{ total_booked: number }>(
      `SELECT COALESCE(SUM(quantity), 0) AS total_booked
     FROM training_booking
     WHERE training_id = $1 `,
      [data.training_id]
    );

    const capacityOfTheTraining = await client.query<newTraining>(
      "SELECT * FROM training WHERE id = $1",
      [data.training_id]
    );

    const totalBooked =
      Number(numberOfBooking.rows[0].total_booked) -
      Number(bookedQuantityForBooking.rows[0].quantity); // total number of booking
    const capacity = capacityOfTheTraining.rows[0].capacity; // capacity of training
    const totalBookingPriceBeforeEditing =
      Number(capacityOfTheTraining.rows[0].price) *
      Number(bookedQuantityForBooking.rows[0].quantity); // total booking price before editing the booking
    const totalBookingPriceAfterEditing =
      Number(capacityOfTheTraining.rows[0].price) * Number(data.quantity); // total booking price after editing the booking

    if (Number(totalBooked) + Number(data.quantity) > capacity) {
      client.query("ROLLBACK");
      return {
        result: null,
        message: "training is not available (the limit was exceeded)",
        status: 409,
      };
    }

    const result = await client.query<newTrainingBooking>(
      `UPDATE training_booking
     SET 
         training_id = COALESCE($1, training_id),
         quantity = COALESCE($2, quantity),
         is_confirmed = COALESCE($3, is_confirmed),
         price = COALESCE($4, price)
     WHERE id = $5
     RETURNING *;`,
      [
        data.training_id,
        data.quantity,
        data.is_confirmed,
        totalBookingPriceAfterEditing,
        bookingId,
      ]
    );

    const cart = await createCart(result.rows[0].user_id, client);
    await editCartItemByBookingId(
      {
        booking_id: result.rows[0].id ?? "",
        newPrice: totalBookingPriceAfterEditing,
      },
      client
    );

    await updateCartTotalAmount(
      {
        id: cart.id,
        total_amount:
          Number(cart.total_amount) -
          totalBookingPriceBeforeEditing +
          totalBookingPriceAfterEditing,
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
    console.log("Error In Updating The Training Booking");
  } finally {
    client.release();
  }
};

export const getQuantityOfATraining= async (id:string)=>{
  
 const result= await pool.query<{total_booked:string}>("SELECT  COALESCE(SUM(quantity), 0) AS total_booked FROM training_booking WHERE training_id = $1",[id])
 
 return result.rows[0]


}

