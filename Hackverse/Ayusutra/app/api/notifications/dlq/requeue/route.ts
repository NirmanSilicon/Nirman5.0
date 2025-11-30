import { NextRequest, NextResponse } from "next/server";
import { requeueDeadLetterByIndex } from "@/lib/notification-queue";
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
    const index = Number(body?.index || 0);

    const res = await requeueDeadLetterByIndex(index);
    return NextResponse.json(res);
  } catch (err) {
    console.error("Error requeueing DLQ item:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
