import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function POST(request: NextRequest) {
  try {
    const { userId, responses, testType } = await request.json();

    if (!userId || !responses) {
      return NextResponse.json(
        { error: "Missing userId or responses" },
        { status: 400 }
      );
    }

    // First, get or create user profile
    const userProfile = await sql`
      SELECT id FROM user_profiles WHERE firebase_uid = ${userId}
    `;

    let profileId: number;
    if (userProfile.rows.length === 0) {
      // Create new profile
      const newProfile = await sql`
        INSERT INTO user_profiles (firebase_uid, email, test3_completed)
        VALUES (${userId}, ${`${userId}@temp.com`}, false)
        RETURNING id
      `;
      profileId = newProfile.rows[0].id as number;
    } else {
      profileId = userProfile.rows[0].id as number;
    }

    // Update user profile to mark test3 as completed
    await sql`
      UPDATE user_profiles SET
        test3_completed = true,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${profileId}
    `;

    // Save detailed responses for future reference
    const testResult = await sql`
      INSERT INTO test_results (user_id, test_type, results, completed_at)
      VALUES (${profileId}, ${testType || 'hair_fall_assessment'}, ${JSON.stringify(
      responses
    )}, CURRENT_TIMESTAMP)
      RETURNING id
    `;

    return NextResponse.json({
      success: true,
      message: "Hair fall assessment saved successfully",
      testResultId: testResult.rows[0].id,
    });
  } catch (error) {
    console.error("Error saving hair fall assessment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
