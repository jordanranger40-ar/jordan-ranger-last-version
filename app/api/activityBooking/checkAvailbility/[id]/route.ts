import { checkAvailableActivities } from "@/app/models/db/lib/services/activity_booking";
import { NextResponse } from "next/server";

export const POST = async (
  request: Request,
  params: {
    params: Promise<{ id: string }>;
  }
) => {
  try {
    const id = (await params.params).id;
    const body = await request.json();
    const result = await checkAvailableActivities(id, body);
    return NextResponse.json(
      { data: result?.data, message: result?.message },
      { status: result?.status }
    );
  } catch (error) {
    console.log("errocwdwwwwr: ",error);
    
    return NextResponse.json(
      { data: null, message: "Error In Checking The Availability" },
      { status: 500 }
    );
  }
};
