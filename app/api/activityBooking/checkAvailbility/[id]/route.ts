import { checkAvailableActivities } from "@/app/models/db/lib/services/activity_booking";
import { NextResponse } from "next/server";

export const POST = async (
  request: Request,
  params: { params: Promise<{ id: string }> } // ✅ params is a Promise here
) => {
  try {
    const id = (await params.params).id; // ✅ await the Promise to get id
    const body = await request.json();

    const result = await checkAvailableActivities(id, body);

    return NextResponse.json(
      { data: result?.data ?? null, message: result?.message ?? "" },
      { status: result?.status ?? 200 }
    );
  } catch (error) {
    console.error("Error checking availability:", error);
    return NextResponse.json(
      { data: null, message: "Error In Checking The Availability" },
      { status: 500 }
    );
  }
};
