import { NextResponse } from "next/server";
import Jwt, { Secret } from "jsonwebtoken";
import { type tokenPayload } from "../consulting/route";
import { addNewMember, getAllMembers } from "@/app/models/db/lib/services/outTeam";

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
        const result = await addNewMember(body);
        return NextResponse.json(
          { data: result, message: "The member has been added successfully" },
          { status: 201 }
        );
      }
    }
  } catch (error) {
    return NextResponse.json(
      { data: error, message: "Error in adding the new member" },
      { status: 500 }
    );
  }
};

export const GET = async () => {
  try {
    const result = await getAllMembers();
    return NextResponse.json(
      { data: result, message: "All Clients" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { data: error, message: "Error in getting the client" },
      { status: 500 }
    );
  }
};
