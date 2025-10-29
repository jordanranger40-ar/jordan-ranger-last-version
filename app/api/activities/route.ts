import {
  addNewActivity,
  getAllActivities,
} from "@/app/models/db/lib/services/activities";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { tokenPayload } from "@/types/index";

export const POST = async (request: Request) => {
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
        const body = await request.json();
        const result = await addNewActivity(body);

        return NextResponse.json(
          { data: result, message: "the Activity has been added successfully" },
          { status: 201 }
        );
      }
    }
  } catch (error) {
    return NextResponse.json(
      { data: error, message: "error in adding the Activity" },
      { status: 500 }
    );
  }
};

export const GET = async () => {
  try {
    const result = await getAllActivities();
    return NextResponse.json(
      { data: result, message: "All Activities" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { data: error, message: "Error in getting the Activities" },
      { status: 500 }
    );
  }
};
