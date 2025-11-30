import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const clinicId = url.searchParams.get("clinic_id");
    const limit = parseInt(url.searchParams.get("limit") || "50", 10);

    if (!clinicId) {
      return NextResponse.json({ error: "Missing clinic_id" }, { status: 400 });
    }

    const result = await sql`
      SELECT * FROM bookings WHERE clinic_id = ${clinicId} ORDER BY created_at DESC LIMIT ${limit}
    `;

    return NextResponse.json({ bookings: result.rows });
  } catch (error) {
    console.error("Error listing clinic bookings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
