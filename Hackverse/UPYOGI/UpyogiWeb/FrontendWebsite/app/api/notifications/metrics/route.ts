import { NextRequest, NextResponse } from "next/server";
import {
  queueLength,
  delayedLength,
  deadLetterLength,
} from "@/lib/notification-queue";
import { verifyFirebaseIdToken } from "@/lib/firebase-admin";

export async function GET(req: NextRequest) {
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

    const q = await queueLength();
    const d = await delayedLength();
    const dlq = await deadLetterLength();
    return NextResponse.json({ queue: q, delayed: d, deadLetter: dlq });
  } catch (err) {
    console.error("Error getting notification metrics:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
