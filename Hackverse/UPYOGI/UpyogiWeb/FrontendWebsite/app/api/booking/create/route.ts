import { NextRequest, NextResponse } from "next/server";
import { createBooking, getUserProfile, getClinicById } from "@/lib/database";
import { verifyFirebaseIdToken } from "@/lib/firebase-admin";
import { enqueueNotification } from "@/lib/notification-queue";

export async function POST(request: NextRequest) {
  try {
    // Verify Authorization header (Bearer Firebase ID token)
    const authHeader =
      request.headers.get("authorization") ||
      request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Missing or invalid Authorization header" },
        { status: 401 }
      );
    }
    const idToken = authHeader.split(" ")[1];
    const decoded = await verifyFirebaseIdToken(idToken);
    if (!decoded) {
      return NextResponse.json(
        { error: "Invalid or expired Firebase ID token" },
        { status: 401 }
      );
    }
    const body = await request.json();
    const {
      // firebase_uid,
      clinicId,
      therapyName,
      selectedDate,
      selectedTime,
      amount,
      currency,
      metadata,
    } = body;

    if (!therapyName || !selectedDate || !selectedTime) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Resolve user id from decoded token
    let userId = null;
    if (decoded && decoded.uid) {
      const user = await getUserProfile(decoded.uid);
      if (user) userId = user.id;
    }

    // Validate clinic exists (optional)
    if (clinicId) {
      const clinic = await getClinicById(clinicId);
      if (!clinic) {
        return NextResponse.json(
          { error: "Clinic not found" },
          { status: 404 }
        );
      }
    }

    // Persist booking
    const booking = await createBooking({
      userId,
      clinicId: clinicId || null,
      therapyName,
      selectedDate,
      selectedTime,
      amount: amount || 0,
      currency: currency || "INR",
      metadata: metadata || {},
    });

    // Enqueue notification job to be processed by background worker
    try {
      const job = {
        type: "booking_confirmation",
        bookingId: booking.id,
        phoneNumber: booking.metadata?.phoneNumber || null,
        userName: booking.metadata?.userName || null,
        therapyName: booking.therapy_name,
        clinicName: clinicId || booking.metadata?.clinicName || "Your Clinic",
        selectedDate: booking.selected_date,
        selectedTime: booking.selected_time,
        amount: booking.amount,
        attempts: 0,
        createdAt: new Date().toISOString(),
      } as const;

      // Try to enqueue into BullMQ if available (provides retries/delays), else fallback to Redis queue
      let enqueued = false;
      try {
        // dynamic import to avoid hard dependency at runtime if not installed
        const mod = await import("@/lib/bull-queue");
        const notificationQueue = mod?.notificationQueue;
        if (notificationQueue && typeof notificationQueue.add === "function") {
          await notificationQueue.add("booking_confirmation", job, {
            attempts: Number(process.env.NOTIFY_MAX_ATTEMPTS || 3),
            backoff: {
              type: "exponential",
              delay: 2000,
            },
          });
          enqueued = true;
        }
      } catch (err) {
        // ignore — fall back to Redis list queue
        // keep the catch minimal so linter doesn't complain about unused vars
      }

      if (!enqueued) {
        const fallback = await enqueueNotification(
          job as unknown as Record<string, unknown>
        );
        if (!fallback) {
          console.error(
            "Failed to enqueue notification job for booking",
            booking.id
          );
        }
      }
    } catch (queueErr) {
      console.error("Failed to enqueue notification job:", queueErr);
    }

    return NextResponse.json({ success: true, booking });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
