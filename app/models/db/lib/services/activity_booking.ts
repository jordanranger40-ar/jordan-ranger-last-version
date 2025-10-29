import { type newActivity, type newActivityBooking } from "@/types/index";
import pool from "../index";

export const bookAnActivity = async (data: newActivityBooking) => {
  console.log("data in bookroom: ", data);

  const numberOfBooking = await pool.query<{ total_booked: number }>(
    "SELECT COALESCE(SUM(quantity), 0) AS total_booked FROM activities_booking WHERE activity_id = $1 AND (start_time, end_time) OVERLAPS ($2, $3)",
    [data.activity_id, data.start_time, data.end_time]
  );

  const capacityOfTheActivity = await pool.query<newActivity>(
    "select * from activities where id=$1",
    [data.activity_id]
  );

  const totalBooked = numberOfBooking.rows[0].total_booked;
  const capacity = capacityOfTheActivity.rows[0].capacity;
  console.log("totalBooked: ",totalBooked);
  console.log("capacity: ",capacity);
  console.log("ebfueufueffu",  data.quantity);

  if (Number(totalBooked) + Number(data.quantity) > capacity) {
    
    
    return { result: null, message: "Activity is not available", status: 409 };
  } else {
    const result = await pool.query<newActivityBooking>(
      "insert into activities_booking (user_id,activity_id,start_time,end_time,quantity) values ($1,$2,$3,$4,$5) returning * ",
      [
        data.user_id,
        data.activity_id,
        data.start_time,
        data.end_time,
        data.quantity,
      ]
    );

    return {
      result: result.rows,
      message: "The Activity Has Been Booked Succussfully",
      status: 201,
    };
  }
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
  const result = await pool.query<newActivityBooking>(
    "delete  from activity_booking where id=$1 ",
    [id]
  );

  return {
    data: result.rows,
    message: "The Booking has been deleted successfully",
    status: 200,
  };
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
  data: newActivityBooking,
  bookingId: string
) => {
  console.log("Editing booking:", bookingId);

 const quantityOfThisBooking= await pool.query<{ quantity: number }>(
  "select quantity from activities_booking where id=$1"
  ,[bookingId])

  const numberOfBooking = await pool.query<{ total_booked: number }>(
    `SELECT COALESCE(SUM(quantity), 0) AS total_booked
     FROM activities_booking
     WHERE activity_id = $1 AND id <> $2
       AND (start_time, end_time) OVERLAPS ($3, $4)`,
    [data.activity_id, bookingId, data.start_time, data.end_time]
  );

  const capacityOfTheActivity = await pool.query<newActivity>(
    "SELECT * FROM activities WHERE id = $1",
    [data.activity_id]
  );

  const totalBooked = numberOfBooking.rows[0].total_booked - quantityOfThisBooking.rows[0].quantity;
  const capacity = capacityOfTheActivity.rows[0].capacity;
  console.log("quantityOfThisBooking.rows[0].quantity: ",quantityOfThisBooking.rows[0].quantity);
  console.log("totalBooked excluding this booking:", totalBooked);
  console.log("activity capacity:", capacity);
  console.log("requested quantity:", data.quantity);

  if (Number(totalBooked) + Number(data.quantity) > capacity) {
    return {
      result: null,
      message: "Activity is not available at this time",
      status: 409,
    };
  }

  const result = await pool.query<newActivityBooking>(
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

  return {
    result: result.rows,
    message: "Your Booking Has Been Updated Successfully",
    status: 201,
  };
};

