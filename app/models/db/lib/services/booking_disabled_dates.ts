import pool from "..";
import { DisableBookingData, GetDisabledDatesParams } from "@/types/index";

export const disableBookingRange = async (data: DisableBookingData) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const bookingTable =
      data.type === "activity" ? "activities_booking" : "room_booking";
    const idColumn = data.type === "activity" ? "activity_id" : "room_id";

    const checkBooking = await client.query(
      `SELECT * FROM ${bookingTable} 
       WHERE is_deleted = false 
         AND start_time <= $2 
         AND end_time >= $1
         AND ${idColumn} = $3`,
      [data.start_date, data.end_date, data.ref_id]
    );

    if (checkBooking.rows.length > 0) {
      await client.query("ROLLBACK");
      return {
        data: null,
        message: `${
          data.type === "activity" ? "Activity" : "Room"
        } is already booked in this range`,
      };
    }

    const checkDisabled = await client.query(
      `SELECT * FROM booking_disabled_dates
       WHERE type = $1
         AND ref_id = $2
         AND start_date <= $4
         AND end_date >= $3`,
      [data.type, data.ref_id, data.start_date, data.end_date]
    );

    if (checkDisabled.rows.length > 0) {
      await client.query("ROLLBACK");
      return {
        data: null,
        message: `${
          data.type === "activity" ? "Activity" : "Room"
        } is already disabled in this range`,
        status:409
      };
    }

    const disableBooking = await client.query(
      `INSERT INTO booking_disabled_dates (type, ref_id, start_date, end_date)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [data.type, data.ref_id, data.start_date, data.end_date]
    );

    await client.query("COMMIT");

    return {
      data: disableBooking.rows[0],
      message: `${
        data.type === "activity" ? "Activity" : "Room"
      } booking disabled successfully`,
      status: 201,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    return { data: null, message: "Error disabling booking" };
  } finally {
    client.release();
  }
};


export const getDisabledDates = async (params: GetDisabledDatesParams) => {
  try {
    const result = await pool.query(
      `SELECT start_date, end_date
       FROM booking_disabled_dates
       WHERE type = $1
         AND ref_id = $2
       ORDER BY start_date ASC`,
      [params.type, params.ref_id]
    );

    return {
      data: result.rows,
      message: "Disabled dates fetched successfully",
      status: 200,
    };
  } catch (error) {
    console.error("Error fetching disabled dates:", error);
    return {
      data: [],
      message: "Error fetching disabled dates",
      status: 500,
    };
  }
};

export const getAllDisabledDates = async () => {
  try {
    const result = await pool.query(`SELECT * from booking_disabled_dates`);

    return {
      data: result.rows,
      message: "Disabled dates fetched successfully",
      status: 200,
    };
  } catch (error) {
    console.error("Error fetching disabled dates:", error);
    return {
      data: [],
      message: "Error fetching disabled dates",
      status: 500,
    };
  }
};

export const getDisabledDateById = async (id: string) => {
  try {
    const result = await pool.query<DisableBookingData>(
      `SELECT *
       FROM booking_disabled_dates
       WHERE id = $1`,
      [id]
    );

    return {
      data: result.rows,
      message: "Disabled dates fetched successfully",
      status: 200,
    };
  } catch (error) {
    console.error("Error fetching disabled dates:", error);
    return {
      data: [],
      message: "Error fetching disabled dates",
      status: 500,
    };
  }
};

export const deleteDisabledDate = async (id: string) => {
  try {
    const result = await pool.query(
      `DELETE FROM booking_disabled_dates
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (result.rowCount === 0) {
      return {
        data: null,
        message: "No disabled date found with this ID",
        status: 404,
      };
    }

    return {
      data: result.rows[0],
      message: "Disabled date deleted successfully",
      status: 200,
    };
  } catch (error) {
    console.error("Error deleting disabled date:", error);
    return {
      data: null,
      message: "Error deleting disabled date",
      status: 500,
    };
  }
};


export const editDisabledBookingRange = async (data: DisableBookingData & { id: string }) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const bookingTable = data.type === "activity" ? "activities_booking" : "room_booking";
    const idColumn = data.type === "activity" ? "activity_id" : "room_id";

    const checkBooking = await client.query(
      `SELECT * FROM ${bookingTable}
       WHERE is_deleted = false
         AND start_time <= $2
         AND end_time >= $1
         AND ${idColumn} = $3`,
      [data.start_date, data.end_date, data.ref_id]
    );

    if (checkBooking.rows.length > 0) {
      await client.query("ROLLBACK");
      return {
        data: null,
        message: `${data.type === "activity" ? "Activity" : "Room"} is already booked in this range`,
        status: 409,
      };
    }

    const checkDisabled = await client.query(
      `SELECT * FROM booking_disabled_dates
       WHERE type = $1
         AND ref_id = $2
         AND id != $5
         AND start_date <= $4
         AND end_date >= $3`,
      [data.type, data.ref_id, data.start_date, data.end_date, data.id]
    );

    if (checkDisabled.rows.length > 0) {
      await client.query("ROLLBACK");
      return {
        data: null,
        message: `${data.type === "activity" ? "Activity" : "Room"} is already disabled in this range`,
        status: 409,
      };
    }

    const updateDisabled = await client.query(
      `UPDATE booking_disabled_dates
       SET start_date = $1, end_date = $2
       WHERE id = $3
       RETURNING *`,
      [data.start_date, data.end_date, data.id]
    );

    await client.query("COMMIT");

    return {
      data: updateDisabled.rows[0],
      message: `${data.type === "activity" ? "Activity" : "Room"} disabled dates updated successfully`,
      status: 200, 
    };
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error editing disabled booking:", error);
    return {
      data: null,
      message: "Error editing disabled booking",
      status: 500, 
    };
  } finally {
    client.release();
  }
};

export const getDisabledDatesByRoomId= async (id:string)=>{
  const result= await pool.query<DisableBookingData>("SELECT * FROM booking_disabled_dates WHERE type='room' AND ref_id=$1",[id])

  return result.rows
}
