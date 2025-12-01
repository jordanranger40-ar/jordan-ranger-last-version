import {
  ActivityBookingWithDetails,
  type newActivity,
  type newActivityBooking,
  type updateActivityBooking,
} from "../../../../../types/index";
import pool from "../index";
import { createCart, updateCartTotalAmount } from "./cart";
import {
  addNewItem,
  removeCartItemByBookingId,
  editCartItemByBookingId,
} from "./cart_items";
import { Resend } from "resend";

const resend=  new Resend(process.env.RESEND_API_KEY)

export const bookAnActivity = async (data: newActivityBooking) => {
  const client = await pool.connect();
  try {
    const end_time = new Date(data.start_time.getTime() + 60 * 60 * 1000);
    await client.query("BEGIN");
    console.log("data in bookroom: ", data);

    const numberOfBooking = await client.query<{
      total_booked: number;
      price: number;
    }>(
      "SELECT  COALESCE(SUM(quantity), 0) AS total_booked FROM activities_booking WHERE activity_id = $1 AND (start_time, end_time) OVERLAPS ($2, $3)",
      [data.activity_id, data.start_time, end_time]
    );

    const capacityOfTheActivity = await client.query<newActivity>(
      "select * from activities where id=$1",
      [data.activity_id]
    );

    const minimum_quantity = Number(
      capacityOfTheActivity.rows[0].minimum_quantity
    );
    console.log("capacityOfTheActivity.rows[0]: ", data);

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

    if (minimum_quantity > data.quantity) {
      return {
        result: null,
        message: `Quantity should be more than ${minimum_quantity}`,
        status: 500,
      };
    }

    if (Number(totalBooked) + Number(data.quantity) > capacity) {
      return {
        result: null,
        message: "Activity is not available",
        status: 409,
      };
    } else {
      const result = await client.query<newActivityBooking>(
        "insert into activities_booking (user_id,activity_id,start_time,end_time,quantity,price) values ($1,$2,$3,$4,$5,$6) returning * ",
        [
          data.user_id,
          data.activity_id,
          data.start_time,
          end_time,
          data.quantity,
          totalBookingPrice,
        ]
      );

      const cart = await createCart(data.user_id ?? "", client);
      await addNewItem(
        {
          cart_id: cart.id ?? "",
          booking_type: "activity",
          booking_id: result.rows[0].id ?? "",
          price: totalBookingPrice,
        },
        client
      );

      await updateCartTotalAmount(
        {
          id: cart.id,
          total_amount: Number(cart.total_amount) + totalBookingPrice,
        },
        client
      );

      await client.query("COMMIT");

      return {
        result: result.rows,
        message: "The Activity Has Been Booked Succussfully",
        status: 201,
      };
    }
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error in Adding activity booking:", error);
    throw error;
  } finally {
    client.release();
  }
};

export const getAllActivitiesbookings = async () => {
  const result = await pool.query<ActivityBookingWithDetails>(
    `SELECT 
      ab.id AS id,
      ab.start_time,
      ab.end_time,
      ab.created_at,
      ab.quantity,
      ab.price AS booking_price,
      ab.is_confirmed,
      ab.is_deleted,

      u.id AS user_id,
      u.first_name,
      u.last_name,
      u.email,

      a.id AS activity_id,
      a.name_en,
      a.description_en,
      a.name_ar,
      a.description_ar,
      a.card_image,
      a.header_image,
      a.poster_image,
      a.location_type_en,
      a.location_type_ar,
      a.capacity,
      a.price AS activity_price,
      a.slug

    FROM activities_booking ab
    JOIN users u ON ab.user_id = u.id
    JOIN activities a ON ab.activity_id = a.id
    `
  );

  return {
    data: result.rows,
    message: "All Bookings for all activities",
    status: 200,
  };
};

export const getAllbookingsByActivityId = async (id: string) => {
  const result = await pool.query<newActivityBooking>(
    "select * from activities_booking where activity_id=$1",
    [id]
  );
  return {
    data: result.rows,
    message: "All Bookings for this Activity",
    status: 200,
  };
};

export const getActivityBookingById = async (id: string) => {
  const result = await pool.query<ActivityBookingWithDetails>(
    `SELECT 
      ab.id AS id,
      ab.start_time,
      ab.end_time,
      ab.created_at,
      ab.quantity,
      ab.price AS booking_price,
      ab.is_confirmed,
      ab.is_deleted,

      u.id AS user_id,
      u.first_name,
      u.last_name,
      u.email,

      a.id AS activity_id,
      a.name_en,
      a.description_en,
      a.name_ar,
      a.description_ar,
      a.card_image,
      a.header_image,
      a.poster_image,
      a.location_type_en,
      a.location_type_ar,
      a.capacity,
      a.price AS activity_price,
      a.slug

    FROM activities_booking ab
    JOIN users u ON ab.user_id = u.id
    JOIN activities a ON ab.activity_id = a.id
    WHERE ab.is_deleted = false AND ab.id = $1`,
    [id]
  );

  if (result.rowCount === 0) {
    return {
      data: null,
      message: "No booking found with this ID",
      status: 404,
    };
  }

  return {
    data: result.rows[0],
    message: "Booking retrieved successfully",
    status: 200,
  };
};

export const deleteActivityBookingById = async (id: string) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await client.query<newActivityBooking>(
      "delete  from activities_booking where id=$1 returning * ",
      [id]
    );

    const cartDetails = await createCart(result.rows[0].user_id ?? "", client); // get the cart id, note that there is already a cart for this costumer, so we will not create new one
    await removeCartItemByBookingId(result.rows[0].id ?? "", client);
    await updateCartTotalAmount(
      {
        id: cartDetails.id,
        total_amount:
          Number(cartDetails.total_amount) - Number(result.rows[0].price),
      },
      client
    );
    await client.query("COMMIT");

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

export const deleteAllBookingByActivityId = async (id: string) => {
  const result = await pool.query<newActivityBooking>(
    "delete from activities_booking where activity_id=$1 ",
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
    const end_time = new Date(data.start_time.getTime() + 60 * 60 * 1000);
    await client.query("BEGIN");

    // Get current booking quantity
    const quantityOfThisBooking = await client.query<{ quantity: number }>(
      "SELECT quantity FROM activities_booking WHERE id=$1",
      [bookingId]
    );

    // Get total booked quantity excluding this booking
    const numberOfBooking = await client.query<{ total_booked: number }>(
      `SELECT COALESCE(SUM(quantity), 0) AS total_booked
       FROM activities_booking
       WHERE activity_id = $1 AND id <> $2
       AND (start_time, end_time) OVERLAPS ($3, $4)`,
      [data.activity_id, bookingId, data.start_time, end_time]
    );

    // Get activity details including minimum_quantity
    const capacityOfTheActivity = await client.query<newActivity>(
      "SELECT * FROM activities WHERE id = $1",
      [data.activity_id]
    );

    const totalBooked =
      numberOfBooking.rows[0].total_booked -
      quantityOfThisBooking.rows[0].quantity; // total number of booking
    const capacity = capacityOfTheActivity.rows[0].capacity;
    const minimum_quantity = Number(
      capacityOfTheActivity.rows[0].minimum_quantity
    );

    // Check minimum quantity
    if (data.quantity < minimum_quantity) {
      await client.query("ROLLBACK");
      return {
        result: null,
        message: `Quantity should be at least ${minimum_quantity}`,
        status: 400,
      };
    }

    // Check capacity
    if (Number(totalBooked) + Number(data.quantity) > capacity) {
      await client.query("ROLLBACK");
      return {
        result: null,
        message: "Activity is not available at this time",
        status: 409,
      };
    }

    const totalBookingPriceBeforeEditing =
      Number(capacityOfTheActivity.rows[0].price) *
      Number(quantityOfThisBooking.rows[0].quantity);
    const totalBookingPriceAfterEditing =
      Number(capacityOfTheActivity.rows[0].price) * Number(data.quantity);

    // Update booking
    const result = await client.query<newActivityBooking>(
      `UPDATE activities_booking
       SET start_time = COALESCE($1, start_time),
           end_time = $2,
           activity_id = COALESCE($3, activity_id),
           quantity = COALESCE($4, quantity),
           is_confirmed = COALESCE($5, is_confirmed)
       WHERE id = $6
       RETURNING *;`,
      [
        data.start_time,
        end_time,
        data.activity_id,
        data.quantity,
        data.is_confirmed,
        bookingId,
      ]
    );

    // Update cart
    const cart = await createCart(result.rows[0].user_id ?? "", client);
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
    console.error("Error editing activity booking:", error);
    throw error;
  } finally {
    client.release();
  }
};

export const checkAvailableActivities = async (
  id: string,
  date: { start_time: Date }
) => {
  const client = await pool.connect();

  try {
    const end_time = new Date(
      new Date(date.start_time).getTime() + 60 * 60 * 1000 
    );

    await client.query("BEGIN");

    // CHECK IF ACTIVITY IS DISABLED
    const checkDisabled = await client.query(
      `SELECT *
       FROM booking_disabled_dates
       WHERE type = 'activity'
         AND ref_id = $1
         AND start_date <= $3
         AND end_date >= $2`,
      [id, date.start_time, end_time]
    );

    if (checkDisabled.rows.length > 0) {
      await client.query("ROLLBACK");
      return {
        data: null,
        message: "Activity is disabled for this date",
        status: 409,
      };
    }

    //  CHECK ACTIVITY CAPACITY
    const activityCapacity = await client.query<{ capacity: number }>(
      "SELECT capacity FROM activities WHERE id = $1",
      [id]
    );

    if (!activityCapacity.rows.length) {
      await client.query("ROLLBACK");
      return {
        data: null,
        message: "Activity not found",
        status: 404,
      };
    }

    if (activityCapacity.rows[0].capacity === 0) {
      await client.query("ROLLBACK");
      return {
        data: null,
        message: "Activity is not available",
        status: 409,
      };
    }

    //  CHECK BOOKINGS OVERLAP
    const numberOfBooking = await client.query<{
      total_booked: number;
    }>(
      `SELECT COALESCE(SUM(quantity), 0) AS total_booked
       FROM activities_booking
       WHERE activity_id = $1
         AND (start_time, end_time) OVERLAPS ($2, $3)`,
      [id, date.start_time, end_time]
    );

    const totalBooking = numberOfBooking.rows[0].total_booked;
    const remaining = activityCapacity.rows[0].capacity - totalBooking;

    if (remaining <= 0) {
      await client.query("ROLLBACK");
      return {
        data: null,
        message: "Activity is fully booked",
        status: 409,
      };
    }

    // SUCCESS
    await client.query("COMMIT");

    return {
      data: remaining,
      message: "Number of available quantity",
      status: 200,
    };
  } catch (error) {
    console.error("Error checking activity availability:", error);
    await client.query("ROLLBACK");

    return {
      data: null,
      message: "Error checking activity availability",
      status: 500,
    };
  } finally {
    client.release();
  }
};


export const getActivityBookingByDate = async (
  start_date: Date | null,
  end_date: Date | null
) => {
  try {
    const result = await pool.query<ActivityBookingWithDetails>(
      `SELECT 
  ab.id AS id,
  ab.start_time,
  ab.end_time,
  ab.created_at,
  ab.quantity,
  ab.price AS booking_price,
  ab.is_confirmed,
  ab.is_deleted,

  u.id AS user_id,
  u.first_name,
  u.last_name,
  u.email,

  a.id AS activity_id,
  a.name_en,
  a.description_en,
  a.name_ar,
  a.description_ar,
  a.card_image,
  a.header_image,
  a.poster_image,
  a.location_type_en,
  a.location_type_ar,
  a.capacity,
  a.price AS activity_price,
  a.slug

FROM activities_booking ab
JOIN users u ON ab.user_id = u.id
JOIN activities a ON ab.activity_id = a.id

WHERE
  (
    $1::date IS NULL AND $2::date IS NULL 
    AND ab.start_time >= CURRENT_DATE
  )
  OR
  (
    ($1::date IS NOT NULL AND $2::date IS NOT NULL)
    AND ab.start_time <= $2::date
    AND ab.end_time >= $1::date
  )
ORDER BY ab.start_time ASC;
`,
      [
        start_date ? start_date.toISOString().split("T")[0] : null,
        end_date ? end_date.toISOString().split("T")[0] : null,
      ]
    );
    return { data: result.rows, message: "Booking In This Range" };
  } catch (error) {
    console.log("getting error: ", error);

    return { data: [], message: "Error In Getting Booking In This Range" };
  }
};

export const updateBookingStatus = async (
  is_confirmed: boolean,
  id: string
) => {
  const result = await pool.query(
    `UPDATE activities_booking
     SET is_confirmed = COALESCE($1, is_confirmed)
     WHERE id = $2
     RETURNING *`,
    [is_confirmed, id]
  );

 
  if (result.rows[0].is_confirmed) {
    const bookingDetails = await pool.query<ActivityBookingWithDetails>(
     `SELECT 
      ab.id AS id,
      ab.start_time,
      ab.end_time,
      ab.created_at,
      ab.quantity,
      ab.price AS booking_price,
      ab.is_confirmed,
      ab.is_deleted,

      u.id AS user_id,
      u.first_name,
      u.last_name,
      u.email,

      a.id AS activity_id,
      a.name_en,
      a.description_en,
      a.name_ar,
      a.description_ar,
      a.card_image,
      a.header_image,
      a.poster_image,
      a.location_type_en,
      a.location_type_ar,
      a.capacity,
      a.price AS activity_price,
      a.slug

    FROM activities_booking ab
    JOIN users u ON ab.user_id = u.id
    JOIN activities a ON ab.activity_id = a.id
    WHERE ab.is_deleted = false AND ab.id = $1`,
      [id]
    );

    const booking = bookingDetails.rows[0];

 
    const formatDate = (value: string | Date) =>
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
          <p><b>Booking Type:</b> Activity</p>
          <p><b>Activity Type:</b> ${booking.location_type_en}</p>
          <p><b>Activity Name:</b> ${booking.name_en}</p>
          <p><b>Start:</b> ${formatDate(booking.start_time)}</p>
          <p><b>End:</b> ${formatDate(booking.end_time)}</p>
          <p><b>Total Price:</b> ${booking.booking_price} JOD</p>

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


export const getUserUpcomingActivityBookings = async (user_id: string) => {
  const now = new Date();

  const result = await pool.query<ActivityBookingWithDetails>(`
    SELECT 
      ab.id AS id,
      ab.start_time,
      ab.end_time,
      ab.created_at,
      ab.quantity,
      ab.price AS booking_price,
      ab.is_confirmed,
      ab.is_deleted,

      u.id AS user_id,
      u.first_name,
      u.last_name,
      u.email,

      a.id AS activity_id,
      a.name_en,
      a.description_en,
      a.name_ar,
      a.description_ar,
      a.card_image,
      a.header_image,
      a.poster_image,
      a.location_type_en,
      a.location_type_ar,
      a.capacity,
      a.price AS activity_price,
      a.slug
    FROM activities_booking ab
    JOIN users u ON ab.user_id = u.id
    JOIN activities a ON ab.activity_id = a.id
    WHERE ab.is_deleted = false
      AND ab.user_id = $1
      AND ab.start_time > $2
    ORDER BY ab.start_time ASC
  `, [user_id, now]);

  return {
    data: result.rows,
    message: "Upcoming activity bookings for the user",
    status: 200,
  };
};

