import { generateToken } from "@/app/models/db/lib/services/forgot-password";
import { NextResponse } from "next/server";
import { Resend } from "resend";

export const POST = async (request: Request) => {
  try {
    const {email} = await request.json();
    console.log("body: ",email);
    
    const result = await generateToken(email);

    if (!result)
      return NextResponse.json(
        { message: "If that email exists, we sent a reset link." },
        { status: 409 }
      );

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${result}`;

    const resendEmail = new Resend(process.env.RESEND_API_KEY);
    await resendEmail.emails.send({
      from: process.env.Email_from || "onboarding@resend.dev",
      to: email,
      subject: "Reset Password Email",
      html: `<p> Click <a href="${resetUrl}">here<a/> to reset your password. Link expires in 1 hour</p>`,
    });

    return NextResponse.json(

      { data:result, message: "If that email exists, we sent a reset link." },
      { status: 201 }
    );
  } catch (error) {
    console.log("error: ",error);
    
    return NextResponse.json(
      { data: error, message: "Error" },
      { status: 500 }
    );
  }
};
