import { NextRequest, NextResponse } from "next/server";
import { listDeadLetters } from "@/lib/notification-queue";
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
    const limit = Number(body?.limit || 50);

    const items = await listDeadLetters(limit);
    return NextResponse.json({ items });
  } catch (err) {
    console.error("Error listing DLQ items:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
