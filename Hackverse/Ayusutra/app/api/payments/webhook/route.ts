import { NextRequest, NextResponse } from "next/server";
import { updateBookingPaymentStatus, getBookingById } from "@/lib/database";
import { enqueueNotification } from "@/lib/notification-queue";

export async function POST(req: NextRequest) {
  // This endpoint receives Stripe webhooks to update booking payment status
  try {
    const rawBody = await req.text();
    // Dynamic import to avoid requiring stripe types here
    const stripeMod = await import("stripe");
    const Stripe = stripeMod.default || stripeMod;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
      apiVersion: "2022-11-15",
    });
    const sig = req.headers.get("stripe-signature") || "";

    let event;
    try {
      const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || "";
      event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
    } catch (err) {
      console.error("Stripe webhook signature verification failed:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    if (event.type === "payment_intent.succeeded") {
      const pi = event.data.object as any;
      const bookingId = pi.metadata?.booking_id;
      if (bookingId) {
        await updateBookingPaymentStatus(bookingId, "completed");
        // enqueue notification job for payment confirmation
        await enqueueNotification({
          type: "payment_confirmation",
          bookingId,
          amount: pi.amount_received / 100,
          currency: pi.currency,
          createdAt: new Date().toISOString(),
        });
      }
    } else if (event.type === "payment_intent.payment_failed") {
      const pi = event.data.object as any;
      const bookingId = pi.metadata?.booking_id;
      if (bookingId) {
        await updateBookingPaymentStatus(bookingId, "failed");
        await enqueueNotification({
          type: "payment_failed",
          bookingId,
          amount: pi.amount || 0,
          currency: pi.currency,
          createdAt: new Date().toISOString(),
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Error handling webhook:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
