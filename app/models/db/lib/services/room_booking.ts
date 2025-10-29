import { type newBooking, type newRoom } from "@/types/index";
import pool from "../index";
import {createCart} from "./cart"

export const bookARoom = async (data: newBooking) => {
    console.log("data in bookroom: ",data);
    
  const availableRooms = await pool.query<newRoom>(
    "select * from rooms where rooms.id not in (select room_id from room_booking where start_time< $1 and end_time> $2 )",
    [data.end_time, data.start_time]
  );
 console.log("data in availableRooms: ",availableRooms.rows);
  const isAvailable = availableRooms.rows.filter((room, index) => {
    return room.id === data.room_id;
  });

  if (isAvailable.length === 0) {
    return { result: null, message: "Room is not available", status: 409 };
  } else {
    const result = await pool.query<newBooking>(
      "insert into room_booking (user_id,room_id,start_time,end_time) values ($1,$2,$3,$4) returning * ",
      [data.user_id, data.room_id, data.start_time, data.end_time]
    );

    const cart_id= (await createCart(data.user_id)).id



    return {
      result: result.rows,
      message: "The Room Has Been Booked Succussfully",
      status: 201,
    };
  }
};

export const getAllRoomsbookings = async () => {
  const result = await pool.query<newBooking>("select * from room_booking");

  return {
    data: result.rows,
    message: "All Bookings for all rooms",
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
  const result = await pool.query<newBooking>(
    "select * from room_booking where id=$1 ",
    [id]
  );

 if(result.rows.length===0){
 return {
    data: result.rows,
    message: "No Booking with this id",
    status: 409,
  };
 }else {
     return {
    data: result.rows,
    message: "The Booking for this id",
    status: 200,
  };
 }
};

export const deleteBookingById = async (id: string) => {
  const result = await pool.query<newBooking>(
    "delete  from room_booking where id=$1 ",
    [id]
  );

  return {
    data: result.rows,
    message: "The Booking has been deleted successfully",
    status: 200,
  };
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

export const editBookingById = async (data: newBooking,bookingId:string) => {  // this function can be used if the user want to change the room, and if he want to keep it and change the time only
  
  console.log("1");
  
    const availableRoom = await pool.query<newBooking>(
    "select * from room_booking where room_id=$1 and id<>$2 and start_time<$3 and end_time>$4",
    [data.room_id,bookingId, data.end_time, data.start_time]
  );
  console.log("2");

  if (availableRoom.rows.length === 0) {
    const result = await pool.query<newBooking>(
      "UPDATE room_booking SET start_time = COALESCE($1, start_time), end_time = COALESCE($2, end_time), room_id = COALESCE($3, room_id), is_confirmed = COALESCE($4, is_confirmed) WHERE id = $5 RETURNING *;",
      [data.start_time, data.end_time, data.room_id, data.is_confirmed, bookingId]
    );
      console.log("3");

    return {
      result: result.rows,
      message: "Your Booking Has Been Updated Successfully",
      status: 201,
    };
    
  } else {
     console.log("eq2");
    return {
        
      result: null,
      message: "Room is not available at this time",
      status: 409,
    };
  }
};
