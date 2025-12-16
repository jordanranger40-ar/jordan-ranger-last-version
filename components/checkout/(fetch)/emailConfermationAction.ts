"use server";
import { Resend } from "resend";
import { EmailData } from "@/types/index";

const resend = new Resend(process.env.RESEND_API_KEY ?? "");

// escape user-provided values for safe HTML
function escapeHtml(str: string | number | undefined) {
  if (str === undefined || str === null) return "";
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// Force Jordan time = UTC + 3 hours
function toJordanTime(date: Date) {
  return new Date(date.getTime() + 3 * 60 * 60 * 1000);
}

export async function emailConfermationAction(data: EmailData) {
  const adminEmail = process.env.EMAIL_ADMIN ?? "";
  const from = process.env.EMAIL_FROM ?? "";
  const siteBase = process.env.NEXT_PUBLIC_APP_URL ?? "";

  // ---------- RECEIVED AT (Jordan +3h) ----------
  const nowUTC = new Date();
  const nowJordan = nowUTC;

  const receivedAtHuman =
    nowJordan.toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }) + " (Jordan Time)";

  // ---------- EXPIRY (Jordan +3h) ----------
  let expiryDisplay = "";
  let expiryIsFuture = false;

  if (data.expireAt) {
    const expiryUTC = new Date(data.expireAt as string);
    const expiryJordan = toJordanTime(expiryUTC);

    if (!Number.isNaN(expiryUTC.getTime())) {
      const humanExpiry =
        expiryJordan.toLocaleString("en-US", {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }) + " (Jordan Time)";

      expiryIsFuture = expiryUTC.getTime() - Date.now() > 0;
      expiryDisplay = humanExpiry;
    } else {
      expiryDisplay = String(data.expireAt);
    }
  } else {
    expiryDisplay = "—";
  }

  // Admin confirm link
  const confirmUrl = `${siteBase.replace(
    /\/$/,
    ""
  )}/admin/dashboard/bookingConfirmation?user_id=${String(data.userId ?? "")}`;

  const escaped = {
    email: escapeHtml(data.email),
    userId: escapeHtml(data.userId),
    amount: escapeHtml(Number(data.amount).toFixed(2) + " JOD"),
    accountName: escapeHtml(data.accountName),
    note: escapeHtml(data.note ?? "None"),
    expireAt: escapeHtml(expiryDisplay),
    receivedAt: escapeHtml(receivedAtHuman),
    confirmUrl: escapeHtml(confirmUrl),
  };

  // ---------- HTML EMAIL ----------
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>New Transfer — Admin Alert</title>

  <style>
    body{
      font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial;
      background:#f5f7f8;
      color:#111827;
      margin:0;
      padding:20px;
    }
    .card{
      max-width:760px;
      margin:0 auto;
      background:#fff;
      border-radius:12px;
      overflow:hidden;
      box-shadow:0 10px 30px rgba(16,24,40,0.06);
    }
    .header{
      padding:18px 24px;
      background:linear-gradient(90deg, rgba(103,110,50,0.06), rgba(103,110,50,0.02));
      border-left:6px solid #676e32;
      display:flex;
      align-items:center;
      gap:12px;
    }
    .title{font-weight:800;color:#24402d;font-size:16px;}
    .meta{color:#6b7280;font-size:13px;margin-top:6px;}
    .body{padding:22px;}
    .label{
      color:#6b7280;
      font-size:13px;
      width:36%;
      vertical-align:top;
      padding:8px 8px;
    }
    .value{
      font-weight:700;
      color:#111827;
      padding:8px 8px;
    }
    .table{
      width:100%;
      border-collapse:collapse;
      margin-top:12px;
    }
    .note{
      background:#fffbeb;
      border:1px solid #fef3c7;
      padding:12px;
      border-radius:8px;
      color:#92400e;
      margin-top:18px;
      line-height:1.5;
    }
    .footer{
      padding:14px 22px;
      background:#fafafa;
      border-top:1px solid #eef2f7;
      font-size:13px;
      color:#6b7280;
      text-align:center;
    }
  </style>
</head>

<body>
  <div class="card">
    <div class="header">
      <div>
        <div class="title">New Transfer Confirmation — Action Required</div>
        <div class="meta">A user reported a bank transfer — confirm or reject before expiry.</div>
      </div>
      <div style="margin-left:auto;text-align:right;">
        <div style="font-size:12px;color:#6b7280">Received</div>
        <div style="font-weight:700">${escaped.receivedAt}</div>
      </div>
    </div>

    <div class="body">
      <div style="font-size:15px;font-weight:700;margin-bottom:10px;">Transfer Details</div>

      <table class="table">
        <tr><td class="label">User Email</td><td class="value">${
          escaped.email
        }</td></tr>
        <tr><td class="label">User ID</td><td class="value">${
          escaped.userId
        }</td></tr>
        <tr><td class="label">Amount</td><td class="value">${
          escaped.amount
        }</td></tr>
        <tr><td class="label">Account (From)</td><td class="value">${
          escaped.accountName
        }</td></tr>
        <tr><td class="label">Note / Ref</td><td class="value">${
          escaped.note
        }</td></tr>
        <tr><td class="label">Expires At</td><td class="value">${
          escaped.expireAt
        }</td></tr>
      </table>

      <!-- FIXED EXPIRY BOX (TABLE - EMAIL SAFE) -->
      <table width="100%" cellpadding="0" cellspacing="0"
        style="margin-top:22px;border:1px solid #f5c6c6;border-radius:10px;background:#fff6f6;">
        <tr>
          <!-- LEFT -->
          <td style="padding:14px;">
            <div style="font-weight:800;font-size:13px;color:#9b1c1c;margin-bottom:6px;">
              Booking Expiry Notice
            </div>

            <div style="font-size:13px;font-weight:700;color:#7f1d1d;margin-bottom:6px;">
              ${escaped.expireAt}
            </div>

            <div style="font-size:12px;color:#7f1d1d;font-weight:600;line-height:1.4;">
              ${
                data.expireAt
                  ? expiryIsFuture
                    ? "Please confirm before the deadline to avoid automatic deletion."
                    : "This booking has already expired and is past the confirmation window."
                  : ""
              }
            </div>
          </td>

          <!-- RIGHT -->
          <td align="right" width="170" style="padding:14px;">
            <a href="${escaped.confirmUrl}" target="_blank"
              style="
                background:silver;
                color:black;
                padding:10px 16px;
                border-radius:8px;
                font-weight:700;
                text-decoration:none;
                border:1px solid rgba(0,0,0,0.08);
                display:inline-block;">
              Confirm Booking
            </a>
          </td>
        </tr>
      </table>

      <div class="note">
        <strong>Reminder:</strong> Review and confirm the booking promptly. Confirming preserves it; ignoring it until expiry will cause automatic deletion.
      </div>
    </div>

    <div class="footer">
      Automated admin alert — contact system support if something looks incorrect.
    </div>
  </div>
</body>
</html>`;

  // ---------- TEXT EMAIL ----------
  const text = `New Transfer Confirmation — Action Required

User Email: ${data.email}
User ID: ${data.userId}
Amount: ${Number(data.amount).toFixed(2)} JOD
Account (from): ${data.accountName}
Note: ${data.note ?? "None"}
Expires At: ${expiryDisplay}

Confirm or open: ${confirmUrl}

IMPORTANT:
This booking will be automatically deleted when it expires if no admin confirmation is submitted.

Received (Jordan Time): ${receivedAtHuman}
`;

  await resend.emails.send({
    from,
    to: adminEmail,
    subject: `Action needed — Transfer confirmation for ${escapeHtml(
      data.email
    )}`,
    html,
    text,
  });
}
