import {
  bookARoom,
  getAllRoomsbookings,
} from "@/app/models/db/lib/services/room_booking";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { tokenPayload } from "@/types/index";

export const POST = async (request: Request) => {
  try {
    const authHeader = request.headers.get("authorization")?.split(" ")[1];
    if (!authHeader) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 501 });
    } else {
      const body = await request.json();
      const result = await bookARoom(body);
      return NextResponse.json(
        { data: result.result, message: result.message },
        { status: result.status }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { data: error, message: " Error In Book The room" },
      { status: 500 }
    );
  }
};

export const GET = async (request: Request) => {
  try {
    const authHeader = request.headers.get("authorization")?.split(" ")[1];
    if (!authHeader) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 501 });
    } else {
      const payload = jwt.verify(
        authHeader,
        process.env.NEXTAUTH_SECRET as string
      ) as tokenPayload;
      console.log("payload: ",payload);
      
      if (payload.role !== "admin") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 501 });
      } else {
        const result = await getAllRoomsbookings();
        return NextResponse.json(
          { data: result.data, message: result.message },
          { status: result.status }
        );
      }
    }
  } catch (error) {
    return NextResponse.json(
      { data: error, message: "Error in getting the bookings" },
      { status: 500 }
    );
  }
};
