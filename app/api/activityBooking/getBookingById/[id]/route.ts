import {
  deleteActivityBookingById,
  editActivityBookingById,
  getActivityBookingById,
} from "@/app/models/db/lib/services/activity_booking";
import { NextResponse } from "next/server";

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
      const result = await getActivityBookingById(id);
      return NextResponse.json(
        { data: result.data, message: result.message },
        { status: result.status }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { data: error, message: "Error in getting the booking by id" },
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
      const id = (await params.params).id;
      const result = await deleteActivityBookingById(id);
      return NextResponse.json(
        { data: result.data, message: result.message },
        { status: result.status }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { data: error, message: "Error in deleting the booking by id" },
      { status: 500 }
    );
  }
};

export const PUT = async (
  request: Request,
 params:{
    
    params: Promise<{id:string}> 
}
) => {
  try {
    const authHeader = request.headers.get("authorization")?.split(" ")[1];
    if (!authHeader) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 501 });
    } else {
      const id = (await params.params).id;
      const body = await request.json();
      const result = await editActivityBookingById(body, id);
      return NextResponse.json(
        { data: result.result, message: result.message },
        { status: result.status }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { data: error, message: "Error in updating the booking" },
      { status: 500 }
    );
  }
};
