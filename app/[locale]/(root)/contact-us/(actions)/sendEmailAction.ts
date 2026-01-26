"use server";

import { createContactSchema } from "@/components/contactUs/schema/emailSchema";
import { z } from "zod";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type ContactFormValues = z.infer<ReturnType<typeof createContactSchema>>;

export const sendEmailAction = async (data: ContactFormValues) => {
  try {
    await resend.emails.send({
      from: process.env.Email_From!,
      to: process.env.EMAIL_ADMIN!,
      subject: `[Contact Form] ${data.subject}`,
      html: `
        <h3>New Message from ${data.name}</h3>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message}</p>
      `,
    });

    return { success: true, message: "Email Sent Successfully" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error In Sending The Email" };
  }
};