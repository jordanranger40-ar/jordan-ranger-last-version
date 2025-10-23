import { NextResponse } from "next/server";
import Jwt, { Secret } from "jsonwebtoken";
import { type tokenPayload } from "../consulting/route";
import {
  createNewApplication,
  getAllApplications,
} from "@/app/models/db/lib/services/careers";

export const POST = async (request: Request) => {
  try {
    {
      const body = await request.json();
      const result = await createNewApplication(body);
      return NextResponse.json(
        {
          data: result,
          message: "The Application has been added successfully",
        },
        { status: 201 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { data: error, message: "Error in adding the new Application" },
      { status: 500 }
    );
  }
};

export const GET = async (request: Request) => {
  try {
    const authHeader = request.headers.get("authorization")?.split(" ")[1];
    console.log("authHeader: ", authHeader);
    if (!authHeader) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 501 });
    } else {
      const payload = Jwt.verify(
        authHeader,
        process.env.NEXTAUTH_SECRET as Secret
      ) as tokenPayload;
      console.log("payload: ", payload.role);
      if (payload.role !== "admin") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 501 });
      } else {
        const result = await getAllApplications();
        return NextResponse.json(
          { data: result, message: "All Applications" },
          { status: 201 }
        );
      }
    }
  } catch (error) {
    return NextResponse.json(
      { data: error, message: "Error in getting the Applications" },
      { status: 500 }
    );
  }
};
