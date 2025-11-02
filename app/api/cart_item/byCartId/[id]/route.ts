import { clearCart } from "@/app/models/db/lib/services/cart_items";
import { NextResponse } from "next/server";

export const DELETE = async (
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
      const id = (await params.params).id;
      const result = await clearCart(id);

      return NextResponse.json(
        { message: result.message },
        { status: result.status }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { data: error, message: "Error in Clearing The Cart By Id" },
      { status: 500 }
    );
  }
};
