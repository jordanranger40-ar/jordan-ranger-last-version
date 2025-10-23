import { resetPassword } from "@/app/models/db/lib/services/reset-password";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const result = await resetPassword(body.token, body.newPassword);
    return NextResponse.json(
      { date: result.result, message: result.message },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { date: error, message: "Error" },
      { status: 500 }
    );
  }
};
