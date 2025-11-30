// app/api/notify/whatsapp/route.ts
import { NextResponse } from "next/server";
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromWhatsApp = process.env.TWILIO_WHATSAPP_FROM;

if (!accountSid || !authToken || !fromWhatsApp) {
  console.warn(
    "[Twilio] Missing env vars: TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN / TWILIO_WHATSAPP_FROM"
  );
}

const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

function normalizeToWhatsApp(number: string): string {
  // Basic helper: if user enters "9876543210", assume +91
  let clean = number.trim();
  if (!clean.startsWith("+")) {
    clean = "+91" + clean; // 👈 change default country if needed
  }
  return `whatsapp:${clean}`;
}

export async function POST(req: Request) {
  try {
    if (!client) {
      return NextResponse.json(
        { error: "Twilio not configured on server" },
        { status: 500 }
      );
    }

    const body = await req.json();

    const {
      phone,
      name,
      therapyName,
      clinicName,
      selectedDate,
      selectedTime,
      amount,
      currency,
    } = body;

    if (!phone || !therapyName || !clinicName || !selectedDate || !selectedTime) {
      return NextResponse.json(
        { error: "Missing required fields for WhatsApp notification" },
        { status: 400 }
      );
    }

    const to = normalizeToWhatsApp(phone);

    const text = [
      `🪔 *AyurScan Booking Confirmed*`,
      ``,
      `Namaste ${name || "Guest"},`,
      `Your booking is confirmed for *${therapyName}* at *${clinicName}*.`,
      ``,
      `📅 Date: ${selectedDate}`,
      `⏰ Time: ${selectedTime}`,
      amount
        ? `💰 Amount: ${amount} ${currency || "INR"}`
        : undefined,
      ``,
      `Please arrive 10–15 minutes early. Reply to this message for any changes.`,
      ``,
      `– upyogi Ayurveda`
    ]
      .filter(Boolean)
      .join("\n");

    const message = await client.messages.create({
      from: fromWhatsApp, // e.g. "whatsapp:+14155238886"
      to,
      body: text,
    });

    return NextResponse.json({ success: true, sid: message.sid });
  } catch (err: any) {
    console.error("[Twilio WhatsApp] Error:", err);
    return NextResponse.json(
      {
        error: "Failed to send WhatsApp message",
        detail: err?.message || String(err),
      },
      { status: 500 }
    );
  }
}
