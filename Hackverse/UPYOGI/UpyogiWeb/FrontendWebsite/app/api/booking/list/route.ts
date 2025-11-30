import { NextRequest, NextResponse } from "next/server";
import { getUserProfile } from "@/lib/database";
import { sql } from "@vercel/postgres";
import { verifyFirebaseIdToken } from "@/lib/firebase-admin";

export async function GET(request: NextRequest) {
  try {
    // Verify Authorization header and get user from token
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
    if (!decoded || !decoded.uid) {
      return NextResponse.json(
        { error: "Invalid Firebase ID token" },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "50", 10);

    const user = await getUserProfile(decoded.uid);
    if (!user) return NextResponse.json({ bookings: [] });

    const result = await sql`
      SELECT * FROM bookings WHERE user_id = ${user.id} ORDER BY created_at DESC LIMIT ${limit}
    `;

    return NextResponse.json({ bookings: result.rows });
  } catch (error) {
    console.error("Error listing bookings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
