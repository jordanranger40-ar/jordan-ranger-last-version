import { NextResponse } from "next/server";
import jwt, { Secret } from "jsonwebtoken";
import { type tokenPayload } from "../consulting/route";
import { addNewService, getAllServices } from "@/app/models/db/lib/services/services";

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
      }else {
        const body = await request.json();
        const result= await addNewService(body)
         return NextResponse.json(
            {
              data: result,
              message: "The Service has been added successfully",
            },
            { status: 201 }
          );
      }
    }
  } catch (error) {
    return NextResponse.json(
      { data: error, message: "Error in adding The Service" },
      { status: 500 }
    );
  }
};


export const GET= async ()=>{

try {
    const result= await getAllServices()
    return NextResponse.json(
            {
              data: result,
              message: "All Services",
            },
            { status: 200 }
          );
} catch (error) {
     return NextResponse.json(
      { data: error, message: "Error in getting The Services" },
      { status: 500 }
    );
}

}