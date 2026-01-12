import {
  TrainingBookingWithDetails,
  type newTraining,
  type newTrainingBooking,
  type newUser
} from "@/types/index";
import pool from "../index";
import { createCart, updateCartTotalAmount } from "./cart";
import {
  addNewItem,
  removeCartItemByBookingId,
  editCartItemByBookingId,
} from "./cart_items";
import { Resend } from "resend";

const resend=  new Resend(process.env.RESEND_API_KEY)

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
      t.card_image,
      t.post_image,
      t.header_image,
      t.category_en,
      t.category_ar,
      t.capacity,
      t.price AS training_price,
      t.start_date,
      t.end_date,
      t.slug
    FROM training_booking tb
    JOIN users u ON tb.user_id = u.id
    JOIN training t ON tb.training_id = t.id`
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
      t.card_image,
      t.post_image,
      t.header_image,
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

export const getQuantityOfATraining = async (id: string) => {
  const result = await pool.query<{ total_booked: string }>(
    "SELECT  COALESCE(SUM(quantity), 0) AS total_booked FROM training_booking WHERE training_id = $1",
    [id]
  );

  return result.rows[0];
};

export const getTrainingBookingByDate = async (
  start_date: Date | null,
  end_date: Date | null,
  training_id: string | null = null,
  page: number | string = 1
): Promise<{
  data: TrainingBookingWithDetails[];
  meta: { total: number; totalPages: number; page: number; pageSize: number };
  message: string;
}> => {
  const PAGE_SIZE = 15;
  const pageNum = Number(page) > 0 ? Number(page) : 1;
  const offset = (pageNum - 1) * PAGE_SIZE;

  const startDateParam = start_date ? start_date.toISOString().split("T")[0] : null;
  const endDateParam = end_date ? end_date.toISOString().split("T")[0] : null;

  try {
    const result = await pool.query<
      TrainingBookingWithDetails & { total_count?: number }
    >(
      `
      SELECT 
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
        t.card_image,
        t.post_image,
        t.header_image,
        t.category_en,
        t.category_ar,
        t.capacity,
        t.price AS training_price,
        t.start_date,
        t.end_date,
        t.slug,
        COUNT(*) OVER() AS total_count
      FROM training_booking tb
      JOIN users u ON tb.user_id = u.id
      JOIN training t ON tb.training_id = t.id 
      WHERE
        (
          ($1::date IS NULL AND $2::date IS NULL)
          OR (
            ($1::date IS NOT NULL AND $2::date IS NOT NULL)
            AND t.start_date < ($2::date + INTERVAL '1 day')
            AND t.end_date >= $1::date
          )
        )
        AND ($3::uuid IS NULL OR t.id = $3::uuid)
      ORDER BY t.start_date ASC
      LIMIT $4::int
      OFFSET $5::int;
      `,
      [startDateParam, endDateParam, training_id, PAGE_SIZE, offset]
    );

    const total = result.rows.length ? Number(result.rows[0].total_count ?? 0) : 0;
    const totalPages = Math.ceil(total / PAGE_SIZE);

    const data: TrainingBookingWithDetails[] = result.rows.map((r) => {
      const { total_count, ...rest } = r;
      return rest as TrainingBookingWithDetails;
    });

    return {
      data,
      meta: {
        total,
        totalPages,
        page: pageNum,
        pageSize: PAGE_SIZE,
      },
      message: "Booking In This Range",
    };
  } catch (error) {
    console.error("getTrainingBookingByDate error:", error);
    return {
      data: [],
      meta: { total: 0, totalPages: 0, page: pageNum, pageSize: PAGE_SIZE },
      message: "Error In Getting Booking In This Range",
    };
  }
};


export const updateBookingStatus = async (
  is_confirmed: boolean,
  id: string
) => {
  const result = await pool.query(
    `UPDATE training_booking
     SET is_confirmed = COALESCE($1, is_confirmed)
     WHERE id = $2
     RETURNING *`,
    [is_confirmed, id]
  );

 
  if (result.rows[0].is_confirmed) {
    const bookingDetails = await pool.query<TrainingBookingWithDetails>(
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

    const booking = bookingDetails.rows[0];

 
    const formatDate = (value:string | Date) =>
      new Date(value).toLocaleString("en-GB", {
        dateStyle: "medium",
        timeStyle: "short",
      });

    
    await resend.emails.send({
      from: process.env.Email_from || "onboarding@resend.dev",
      to: booking.email,
      subject: "Your Booking Has Been Confirmed ✔️",
      html: `
        <div style="font-family: Arial; line-height: 1.6;">
          <h2>Your Booking is Confirmed 🎉</h2>
          <p>Hello ${booking.first_name},</p>

          <p>Great news! Your booking has been <strong>confirmed</strong>.</p>

          <h3>Booking Details</h3>
          <p><b>Booking Type:</b> Training</p>
          <p><b>Training Type:</b> ${booking.category_en}</p>
          <p><b>Training Name:</b> ${booking.name_en}</p>
          <p><b>Start:</b> ${formatDate(booking.start_date)}</p>
          <p><b>End:</b> ${formatDate(booking.end_date)}</p>
          <p><b>Total Price:</b> ${booking.price} JOD</p>

          <br/>
          <p>Thank you for choosing <b>Jordan Ranger</b>.</p>
          <p>Best regards,<br/>Jordan Ranger Team</p>
        </div>
      `,
    });
  }

  return {
    data: result,
    message: "Booking Has Been Updated Successfully",
    status: 201,
  };
};

export const getUserUpcomingTrainingBookings = async (user_id?: string,email?:string) => {
  const now = new Date();

   let updatedUserId= ''
      if(email && !user_id) {
        const getUserIdByEmail= await pool.query<newUser>("select id from users where email=$1 ",[email])
        updatedUserId=getUserIdByEmail.rows[0].id!
      }else {
        updatedUserId=user_id!
      }

  const result = await pool.query<TrainingBookingWithDetails>(`
    SELECT 
      tb.id AS id,
      tb.training_id,
      tb.is_confirmed,
      tb.is_deleted,
      tb.created_at,
      tb.quantity,
      tb.price AS booking_price,
      
      u.id AS user_id,
      u.first_name,
      u.last_name,
      u.email,
      
      t.id AS training_id,
      t.name_en,
      t.description_en,
      t.name_ar,
      t.description_ar,
      t.card_image,
      t.post_image,
      t.header_image,
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
    WHERE tb.is_deleted = false
      AND tb.user_id = $1
      AND t.start_date > $2
    ORDER BY t.start_date ASC
  `, [updatedUserId, now]);

  return {
    data: result.rows,
    message: "Upcoming training bookings for the user",
    status: 200,
  };
};


export const getTrainingsByType= async (type:string)=>{

  try {
    const result= await pool.query<newTraining>("select * from training where category_en=$1",[type])
    return {
      data: result.rows,
      message:"All Traingins By type",
      status:200
    }
  } catch (error) {
    return {
      data: [],
      message:"All Traingins By type",
      status:200
    }
  }

}
