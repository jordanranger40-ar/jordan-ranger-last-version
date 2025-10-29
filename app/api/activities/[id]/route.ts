import {
  deleteActivityById,
  editActivity,
  getActivityById,
} from "@/app/models/db/lib/services/activities";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { tokenPayload } from "@/types/index";

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
      const payload = jwt.verify(
        authHeader,
        process.env.NEXTAUTH_SECRET as string
      ) as tokenPayload;
      if (payload.role !== "admin") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 501 });
      } else {
        console.log("id:wbduhwuidgiwdbhwbhj ");
        const { id } = await params.params;
        const body = await request.json();
        const result = await editActivity(id, body);
        console.log("id: ", id);

        return NextResponse.json(
          { data: result, message: "The Activity was updated successfully" },
          { status: 201 }
        );
      }
    }
  } catch (error) {
    console.log(error);
    
    return NextResponse.json(
      { data: error, message: "Error in updating the Activity" },
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
        const { id } = await params.params;
        const result = await deleteActivityById(id);
        return NextResponse.json(
          { data: result, message: "The Activity was deleted successfully" },
          { status: 200 }
        );
      }
    }
  } catch (error) {
    console.log("error: ", error);

    return NextResponse.json(
      { data: error, message: "Error in deleting the Activity" },
      { status: 500 }
    );
  }
};

export const GET = async (
  _: Request,
  params: {
    params: Promise<{ id: string }>;
  }
) => {
  try {
    const { id } = await params.params;
    const result = await getActivityById(id);
    if (result.length === 0) {
      return NextResponse.json(
        { message: `There is no Activity with this id: ${id} `, data: result },
        { status: 409 }
      );
    } else {
        console.log("result: ",result);
        
      return NextResponse.json(
        { message: `The Activity with ${id} is:`, data: result },
        { status: 200 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Error in getting the Activity", data: error },
      { status: 500 }
    );
  }
};
