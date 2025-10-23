import {
  addNewGategory,
  getAllcategories,
} from "@/app/models/db/lib/services/Accommodation";
import { NextResponse } from "next/server";
import Jwt, { Secret } from "jsonwebtoken";

export type tokenPayload = {
  user_id: string;
  role: string;
  name: string;
};

export const POST = async (request: Request) => {
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
        const body = await request.json();
        const result = await addNewGategory(body);
        return NextResponse.json(
          { data: result, message: "The category has been added successfully" },
          { status: 201 }
        );
      }
    }
  } catch (error) {
    return NextResponse.json(
      { data: error, message: "Error in adding the new category" },
      { status: 500 }
    );
  }
};

export const GET = async () => {
  try {
    const result = await getAllcategories();
    return NextResponse.json(
      { data: result, message: "All categories" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { data: error, message: "Error in getting the categories" },
      { status: 500 }
    );
  }
};
