// app/api/payment/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import { updateBookingPaymentStatus, getBookingById } from "@/lib/database";
import { notifyAdmin } from "@/lib/notification-queue"; // make sure this exists

export async function POST(req: NextRequest) {
  try {
    // Get raw body for Stripe signature verification
    const rawBody = await req.text();

    // Dynamic import so Stripe is only required on the server
    const stripeMod = await import("stripe");
    const Stripe = stripeMod.default || stripeMod;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
      apiVersion: "2022-11-15",
    });

    const sig = req.headers.get("stripe-signature") || "";
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

    let event;
    try {
      event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
    } catch (err) {
      console.error("Stripe webhook signature verification failed:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // ✅ Payment successful
    if (event.type === "payment_intent.succeeded") {
      const pi = event.data.object as any;
      const bookingId = pi.metadata?.booking_id;

      if (bookingId) {
        // 1) Mark booking as paid
        await updateBookingPaymentStatus(bookingId, "completed");

        // 2) Load booking details
        const booking = await getBookingById(bookingId);
        if (booking) {
          // 3) Notify only YOU (admin) via Twilio/WhatsApp
          await notifyAdmin(booking);
        } else {
          console.warn(
            "[Stripe Webhook] booking not found for ID:",
            bookingId
          );
        }
      }
    }

    // (Optional) you can also handle payment_intent.payment_failed etc. here
    // else if (event.type === "payment_intent.payment_failed") { ... }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
