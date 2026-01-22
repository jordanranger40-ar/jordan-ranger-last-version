
import { NextResponse } from "next/server";
import Jwt, { Secret } from "jsonwebtoken";
import { type tokenPayload } from "@/types/index";
import { createNewFeature ,getAllFeatures} from "@/app/models/db/lib/services/rooms_features";

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
        const result = await createNewFeature(body);
        return NextResponse.json(
          { data: result, message: "The Feature has been added successfully" },
          { status: 201 }
        );
      }
    }
  } catch (error) {
    return NextResponse.json(
      { data: error, message: "Error in adding the new Feature" },
      { status: 500 }
    );
  }
};


export async function GET() {
  try {
    const features = await getAllFeatures();
    return NextResponse.json(features);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch features" }, { status: 500 });
  }
}