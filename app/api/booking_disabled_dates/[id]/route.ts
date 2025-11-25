import { NextResponse } from "next/server";
import Jwt, { Secret } from "jsonwebtoken";
import { tokenPayload } from "@/types/index";
import {
  deleteDisabledDate,
  editDisabledBookingRange,
} from "@/app/models/db/lib/services/booking_disabled_dates";
import { DisableBookingData } from "@/types/index";

export const DELETE = async (
  request: Request,
  params: {
    params: Promise<{ id: string }>;
  }
) => {
  try {
    const authHeader = request.headers.get("authorization")?.split(" ")[1];

    if (!authHeader) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 500 });
    } else {
      const payload = Jwt.verify(
        authHeader,
        process.env.NEXTAUTH_SECRET as Secret
      ) as tokenPayload;
      if (payload.role !== "admin") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 501 });
      } else {
        const { id } = await params.params;
        const result = await deleteDisabledDate(id);
        return NextResponse.json(
          { data: result.data, message: result.message },
          { status: result.status }
        );
      }
    }
  } catch (error) {
    return NextResponse.json(
      { data: error, message: "Error deleting disabled date" },
      { status: 500 }
    );
  }
};

export const PUT = async (
  request: Request,
  params: {
    params: Promise<{ id: string }>;
  }
) => {
  try {
    const authHeader = request.headers.get("authorization")?.split(" ")[1];
    if (!authHeader) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    const payload = Jwt.verify(
      authHeader,
      process.env.NEXTAUTH_SECRET as Secret
    ) as tokenPayload;
    if (payload.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params.params;
    const body: DisableBookingData = await request.json();

    const dataToUpdate = { ...body, id };

    const result = await editDisabledBookingRange(dataToUpdate);

    if (!result.data) {
      return NextResponse.json(
        {
          data: null,
          message: result.message,
          status: result.status 
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        data: result.data,
        message: result.message,
        status: result.status
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating disabled booking:", error);
    return NextResponse.json(
      { data: null, message: "Error updating disabled booking",status: 500 },
      { status: 500 }
    );
  }
};
