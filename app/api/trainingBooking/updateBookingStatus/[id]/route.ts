import { updateBookingStatus } from "@/app/models/db/lib/services/training_booking";
import { NextResponse } from "next/server";

export const PUT = async (
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
      const body = await request.json();
      const result = await updateBookingStatus(body, id);

      if (!result)
        return NextResponse.json(
          { data: null, message: "Booking not found" },
          { status: 404 }
        );

      return NextResponse.json(
        { data: result.data, message: result.message },
        { status: result.status }
      );
    }
  } catch (error) {
    console.log("error in update bb: ",error);
    
    return NextResponse.json(
      { data: error, message: "Error In Updating Booking Status" },
      { status: 500 }
    );
  }
};
