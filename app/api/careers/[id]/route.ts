import { NextResponse } from "next/server";
import { type tokenPayload } from "../../consulting/route";
import jwt, { Secret } from "jsonwebtoken";
import { deleteApplications, getApplicationById } from "@/app/models/db/lib/services/careers";


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
        const result = await deleteApplications(id);

        if (result === null) {
          return NextResponse.json(
            {
              data: result,
              message: `No Application with this id: ${id}`,
            },
            { status: 409 }
          );
        } else {
          return NextResponse.json(
            {
              data: result,
              message: "The Application has been deleted successfully",
            },
            { status: 201 }
          );
        }
      }
    }
  } catch (error) {
    return NextResponse.json(
      { data: error, message: "Error in deleting The Client" },
      { status: 500 }
    );
  }
};


export const GET = async (request: Request,params:{
    params:Promise<{id:string}>
}) => {
  try {
    const authHeader = request.headers.get("authorization")?.split(" ")[1];
    console.log("authHeader: ", authHeader);
    if (!authHeader) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 501 });
    } else {
      const payload = jwt.verify(
        authHeader,
        process.env.NEXTAUTH_SECRET as Secret
      ) as tokenPayload;
      console.log("payload: ", payload.role);
      if (payload.role !== "admin") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 501 });
      } else {

        const id= (await params.params).id
        const result = await getApplicationById(id);
        return NextResponse.json(
          { data: result, message: "Application" },
          { status: 201 }
        );
      }
    }
  } catch (error) {
    return NextResponse.json(
      { data: error, message: "Error in getting the Application" },
      { status: 500 }
    );
  }
};