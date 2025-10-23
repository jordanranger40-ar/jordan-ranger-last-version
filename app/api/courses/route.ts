import { NextResponse } from "next/server";
import jwt, { Secret } from "jsonwebtoken";
import { type tokenPayload } from "../consulting/route";
import { addNewCourse, getAllCourses } from "@/app/models/db/lib/services/courses";

export const POST = async (request: Request) => {
  try {
    const authHeader = request.headers.get("authorization")?.split(" ")[1];
    if (!authHeader) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 500 });
    } else {
      const payload = jwt.verify(
        authHeader,
        process.env.NEXTAUTH_SECRET as Secret
      ) as tokenPayload;
      if (payload.role !== "admin") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 501 });
      } else {
        const body = await request.json();
        const result = await addNewCourse(body);
        return NextResponse.json(
          {
            data: result,
            message: "The course has been added successfully",
          },
          { status: 201 }
        );
      }
    }
  } catch (error) {
    return NextResponse.json(
      { data: error, message: "Error in adding The course" },
      { status: 500 }
    );
  }
};

export const GET = async () => {
  try {
    const result = await getAllCourses();
    return NextResponse.json(
      {
        data: result,
        message: "All Courses",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    
    return NextResponse.json(
      { data: error, message: "Error in getting The Courses" },
      { status: 500 }
    );
  }
};

