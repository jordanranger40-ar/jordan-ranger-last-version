import { Resend } from "resend";
import logoUrl from "@/public/images/reversed logo.png"
const resend = new Resend(process.env.RESEND_API_KEY);

interface BookingEmailProps {
  email: string;
  name: string;
}

export async function sendBookingConfirmation({
  email,
  name,
}: BookingEmailProps) {

    const myBookingsUrl= `${process.env.NEXT_PUBLIC_APP_URL}/my-bookings`
    const contactEmail= process.env.NEXT_PUBLIC_CONTACT_EMAIL
        const contactPhone= process.env.NEXT_PUBLIC_PHONE_NUMBER1

  await resend.emails.send({
    from: process.env.Email_From??"",
    to: email,
    subject: "Your booking has been confirmed ✅",
    html: `
      <!-- Booking confirmation email (replace placeholders as needed) -->
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f4f6f8;padding:24px 0;font-family:Arial,Helvetica,sans-serif;">
  <tr>
    <td align="center">
      <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 6px 18px rgba(0,0,0,0.06);">


        <!-- Greeting -->
        <tr>
          <td style="padding:12px 40px 8px;text-align:left;">
            <h2 style="margin:0 0 8px;font-size:20px;line-height:1.2;color:#0f172a;">
              Hello ${name},
            </h2>
            <p style="margin:0;font-size:15px;color:#334155;">
              We're pleased to let you know that <strong>your booking has been successfully confirmed</strong>.
            </p>
          </td>
        </tr>

        <!-- CTA -->
        <tr>
          <td style="padding:18px 40px 8px;text-align:left;">
            <p style="margin:0 0 12px;font-size:15px;color:#334155;">
              To view all your bookings, please open <strong>"My Bookings"</strong>.
            </p>

            <a href="${myBookingsUrl}" style="display:inline-block;text-decoration:none;padding:10px 18px;border-radius:8px;background:#0f6fff;color:#ffffff;font-weight:600;font-size:14px;">
              View My Bookings
            </a>
          </td>
        </tr>

        <!-- Support / Contact -->
        <tr>
          <td style="padding:20px 40px 28px;border-top:1px solid #eef2f7;">
            <p style="margin:0 0 6px;font-size:14px;color:#334155;">
              If you have any questions or need help, contact us:
            </p>
            <p style="margin:0;font-size:14px;color:#334155;">
              Email: <a href="mailto:${contactEmail}" style="color:#0f6fff;text-decoration:none;font-weight:600;">${contactEmail}</a>
              <span style="margin:0 8px;color:#94a3b8;">|</span>
              Phone: <a href="tel:${contactPhone}" style="color:#0f6fff;text-decoration:none;font-weight:600;">${contactPhone}</a>
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:12px 24px 20px;text-align:center;font-size:12px;color:#94a3b8;">
            <p style="margin:6px 0;">Thank you for choosing <strong>Jordan Ranger</strong>.</p>
            <p style="margin:0;">&copy; ${new Date().getFullYear()} Jordan Ranger. All rights reserved.</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>

    `,
  });
}
