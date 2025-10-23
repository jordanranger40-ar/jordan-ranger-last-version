import { NextResponse } from "next/server";
import jwt, { Secret } from "jsonwebtoken";
import { tokenPayload } from "../../../consulting/route";
import { editUser, removeUser } from "@/app/models/db/lib/services/users";

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
        process.env.NEXTAUTH_SECRET as Secret
      ) as tokenPayload;
      if (payload.role !== "admin") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 501 });
      } else {
        const { id } = await params.params;
        const body = await request.json();
        const result = await editUser(id, body);
        if (result === null) {
          return NextResponse.json(
            {
              data: result,
              message: `No user with this id: ${id}`,
            },
            { status: 409 }
          );
        } else {
          return NextResponse.json(
            {
              data: result,
              message: "The User role has been updated successfully",
            },
            { status: 201 }
          );
        }
      }
    }
  } catch (error) {
    console.log("error: ",error);
    
    return NextResponse.json(
      { data: error, message: "Error in updating the user role" },
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
      return NextResponse.json({ message: "Unauthenticated" }, { status: 500 });
    } else {
      const payload = jwt.verify(
        authHeader,
        process.env.NEXTAUTH_SECRET as Secret
      ) as tokenPayload;
      if (payload.role !== "admin") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 501 });
      } else {
        const { id } = await params.params;
        const result = await removeUser(id);

        if (result === null) {
          return NextResponse.json(
            {
              data: result,
              message: `No user with this id: ${id}`,
            },
            { status: 409 }
          );
        } else {
          return NextResponse.json(
            {
              data: result,
              message: "The user has been deleted successfully",
            },
            { status: 201 }
          );
        }
      }
    }
  } catch (error) {
    return NextResponse.json(
      { data: error, message: "Error in deleting The user" },
      { status: 500 }
    );
  }
};
