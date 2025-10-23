import { NextResponse } from "next/server";
import Jwt, { Secret } from "jsonwebtoken";
import { type tokenPayload } from "../consulting/route";
import { addNewTraining, getAllTraining } from "@/app/models/db/lib/services/training";

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

        const result = await addNewTraining(body);
        return NextResponse.json(
          { data: result, message: "The training has been added successfully" },
          { status: 201 }
        );
      }
    }
  } catch (error) {
    return NextResponse.json(
      { data: error, message: "Error in adding the new training" },
      { status: 500 }
    );
  }
};


export const GET = async () => {
  try {
    const result = await getAllTraining();
    return NextResponse.json(
      { data: result, message: "All training" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { data: error, message: "Error in getting the training" },
      { status: 500 }
    );
  }
};