import { type newTraining, type newTrainingBooking } from "@/types/index";
import pool from "../index";

export const bookATraining = async (data: newTrainingBooking) => {
  console.log("data in bookroom: ", data);

  const numberOfBooking = await pool.query<{ total_booked: number }>(
    "SELECT COALESCE(SUM(quantity), 0) AS total_booked FROM training_booking WHERE training_id = $1",
    [data.training_id]
  );

  const capacityOfTheTraining = await pool.query<newTraining>(
    "select * from training where id=$1",
    [data.training_id]
  );

  const totalBooked = numberOfBooking.rows[0].total_booked;
  const capacity = capacityOfTheTraining.rows[0].capacity;
  console.log("totalBooked: ",totalBooked);
  console.log("capacity: ",capacity);
  console.log("ebfueufueffu",  data.quantity);

  if (Number(totalBooked) + Number(data.quantity) > capacity) {
    
    return { result: null, message: "Training is not available", status: 409 };
  } else {
    const result = await pool.query<newTrainingBooking>(
      "insert into training_booking (user_id,training_id,quantity) values ($1,$2,$3) returning * ",
      [
        data.user_id,
        data.training_id,
        data.quantity,
      ]
    );

    return {
      result: result.rows,
      message: "The Training Has Been Booked Succussfully",
      status: 201,
    };
  }
};

export const getAllTrainingsbookings = async () => {
  const result = await pool.query<newTrainingBooking>(
    "select * from training_booking"
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
    "select * from training_booking where id=$1 ",
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

export const deleteTrainingBookingById = async (id: string) => {
  const result = await pool.query<newTrainingBooking>(
    "delete  from training_booking where id=$1 ",
    [id]
  );

  return {
    data: result.rows,
    message: "The Booking has been deleted successfully",
    status: 200,
  };
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
  console.log("Editing booking:", bookingId);

  const bookedQuantityForBooking= await pool.query<{ quantity: number }>("select quantity from training_booking where id=$1"  
    ,[bookingId]
  )
// get the quantity of the booking that you want to edit, totalBooked - this value => the new total booked value, if the total booked and the new quantity is less than the value, then edit the booking, else throw an error
  const numberOfBooking = await pool.query<{ total_booked: number }>(
    `SELECT COALESCE(SUM(quantity), 0) AS total_booked
     FROM training_booking
     WHERE training_id = $1 `,
    [data.training_id]
  );

  const capacityOfTheTraining = await pool.query<newTraining>(
    "SELECT * FROM training WHERE id = $1",
    [data.training_id]
  );

  const totalBooked = Number(numberOfBooking.rows[0].total_booked) -Number(bookedQuantityForBooking.rows[0].quantity);
  const capacity = capacityOfTheTraining.rows[0].capacity;
  console.log("totalBooked excluding this booking:", totalBooked);
  console.log("training capacity:", capacity);
  console.log("requested quantity:", data.quantity);

  if (Number(totalBooked) + Number(data.quantity) > capacity) {
    return {
      result: null,
      message: "training is not available (the limit was exceeded)",
      status: 409,
    };
  }

  const result = await pool.query<newTrainingBooking>(
    `UPDATE training_booking
     SET 
         training_id = COALESCE($1, training_id),
         quantity = COALESCE($2, quantity),
         is_confirmed = COALESCE($3, is_confirmed)
     WHERE id = $4
     RETURNING *;`,
    [
      
      data.training_id,
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

