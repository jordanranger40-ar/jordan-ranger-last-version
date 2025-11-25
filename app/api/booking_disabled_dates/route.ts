import { disableBookingRange } from "@/app/models/db/lib/services/booking_disabled_dates";
import Jwt, { Secret } from "jsonwebtoken";

import { NextResponse } from "next/server";
import { tokenPayload } from "@/types/index";

export const POST = async (request: Request) => {
  try {
    const authHeader = request.headers.get("authorization")?.split(" ")[1];
    if (!authHeader) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 501 });
    } else {
      const payload = Jwt.verify(
        authHeader,
        process.env.NEXTAUTH_SECRET as Secret
      ) as tokenPayload;
      if (payload.role !== "admin") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 501 });
      } else {
        const body = await request.json();

        const result = await disableBookingRange(body);
        return NextResponse.json(
          { data: result.data, message: result.message },
          { status: result.status }
        );
      }
    }
  } catch (error) {
    console.log("error: ",error);
    
    return NextResponse.json(
      { data: error, message: "Error in adding the new training" },
      { status: 500 }
    );
  }
};


