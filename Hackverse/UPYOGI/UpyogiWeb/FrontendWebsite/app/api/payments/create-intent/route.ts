import { NextRequest, NextResponse } from "next/server";
import { getBookingById } from "@/lib/database";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bookingId } = body || {};
    if (!bookingId)
      return NextResponse.json({ error: "Missing bookingId" }, { status: 400 });

    const booking = await getBookingById(bookingId);
    if (!booking)
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });

    // Dynamic import stripe so it's optional for local dev
    try {
      const stripeMod = await import("stripe");
      const Stripe = stripeMod.default || stripeMod;
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
        apiVersion: "2022-11-15",
      });

      const amount = Math.max(0, Number(booking.amount || 0));
      const currency = String(booking.currency || "INR").toLowerCase();

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency,
        metadata: { booking_id: booking.booking_id },
      });

      return NextResponse.json({ clientSecret: paymentIntent.client_secret });
    } catch (err) {
      console.error("Stripe not configured or failed to create intent:", err);
      return NextResponse.json(
        { error: "Payment provider not configured" },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error("Error creating payment intent:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
