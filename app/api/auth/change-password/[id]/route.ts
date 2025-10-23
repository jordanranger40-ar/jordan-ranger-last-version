import { changePassword } from "@/app/models/db/lib/services/reset-password";
import { NextResponse } from "next/server";

export const PUT = async (
  request: Request,
  params: {
    params: Promise<{ id: string }>;
  }
) => {
  try {
    const { id } = await params.params;
    const body = await request.json();
    const result = await changePassword(id, body.oldPassword, body.newPassword);
    return NextResponse.json(
      { data: result.result, message: result.message },
      { status: result.status }
    );
  } catch (error) {
    return NextResponse.json(
      { data: error, message: "Error in updating the Password" },
      { status: 500 }
    );
  }
};
