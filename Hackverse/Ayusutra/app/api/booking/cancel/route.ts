import { NextRequest, NextResponse } from "next/server";
import { getBookingById, cancelBooking } from "@/lib/database";
import { verifyFirebaseIdToken } from "@/lib/firebase-admin";

export async function POST(req: NextRequest) {
  try {
    const authHeader =
      req.headers.get("authorization") || req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Missing Authorization" },
        { status: 401 }
      );
    }
    const idToken = authHeader.split(" ")[1];
    const decoded = await verifyFirebaseIdToken(idToken);
    if (!decoded)
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const body = await req.json();
    const { bookingId, reason } = body || {};
    if (!bookingId) {
      return NextResponse.json({ error: "Missing bookingId" }, { status: 400 });
    }

    const booking = await getBookingById(bookingId);
    if (!booking)
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });

    const updated = await cancelBooking(bookingId, reason || "");
    if (!updated)
      return NextResponse.json({ error: "Unable to cancel" }, { status: 500 });

    return NextResponse.json({ success: true, booking: updated });
  } catch (err) {
    console.error("Error cancelling booking:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
