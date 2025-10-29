import {
  deleteAllBookingByRoomId,
  getAllbookingsByRoomId,
} from "@/app/models/db/lib/services/room_booking";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { tokenPayload } from "@/types/index";


export const GET = async (
  request: Request,
  params: {
    params: Promise<{ id: string }>;
  }
) => {
  try {
    const authHeader = request.headers.get("authorization")?.split(" ")[1];
    if (!authHeader) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 501 });
    } else {
      const id = (await params.params).id;
      const result = await getAllbookingsByRoomId(id);
      return NextResponse.json(
        { data: result.data, message: result.message },
        { status: result.status }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { data: error, message: "Error in getting the booking by room id" },
      { status: 500 }
    );
  }
};

export const DELETE = async (
  request: Request,
  params: {
    params: Promise<{ id: string }>;
  }
) => {
  try {
    const authHeader = request.headers.get("authorization")?.split(" ")[1];
    if (!authHeader) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 501 });
    } else {
      const payload = jwt.verify(
        authHeader,
        process.env.NEXTAUTH_SECRET as string
      ) as tokenPayload;
      if (payload.role !== "admin") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 501 });
      } else {
        const id = (await params.params).id;
        const result = await deleteAllBookingByRoomId(id);
        return NextResponse.json(
          { data: result.data, message: result.message },
          { status: result.status }
        );
      }
    }
  } catch (error) {
    return NextResponse.json(
      { data: error, message: "Error in deleting the bookings by room id" },
      { status: 500 }
    );
  }
};
