import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function POST(request: NextRequest) {
  try {
    const { userId, responses } = await request.json();

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
      // Create new profile (use a safe temporary email format)
      const newProfile = await sql`
        INSERT INTO user_profiles (firebase_uid, email, test1_completed)
        VALUES (${userId}, ${`${userId}@temp.com`}, false)
        RETURNING id
      `;
      profileId = newProfile.rows[0].id as number;
    } else {
      profileId = userProfile.rows[0].id as number;
    }

    // Update user profile with test responses
    // Helper to format JS array to Postgres array literal
    const toPgArray = (arr: any) =>
      Array.isArray(arr)
        ? `{${arr
            .map((v: any) => '"' + String(v).replace(/"/g, '"') + '"')
            .join(",")}}`
        : "{}";

    await sql`
      UPDATE user_profiles SET
        date_of_birth = ${responses.date_of_birth || null},
        gender = ${responses.gender || null},
        height_cm = ${
          responses.height_cm ? parseInt(responses.height_cm) : null
        },
        weight_kg = ${
          responses.weight_kg ? parseInt(responses.weight_kg) : null
        },
        activity_level = ${responses.activity_level || null},
        health_goals = ${toPgArray(responses.health_goals)},
        medical_conditions = ${toPgArray(responses.medical_conditions)},
        medications = ${toPgArray(responses.medications)},
        allergies = ${toPgArray(responses.allergies)},
        dietary_preferences = ${toPgArray(responses.dietary_preferences)},
        sleep_pattern = ${responses.sleep_pattern || null},
        stress_level = ${
          responses.stress_level ? parseInt(responses.stress_level) : null
        },
        test1_completed = true,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${profileId}
    `;

    // Save detailed responses for future reference
    const testResult = await sql`
      INSERT INTO test_results (user_id, test_type, results, completed_at)
      VALUES (${profileId}, 'gamified', ${JSON.stringify(
      responses
    )}, CURRENT_TIMESTAMP)
      RETURNING id
    `;

    return NextResponse.json({
      success: true,
      message: "Test 1 responses saved successfully",
      testResultId: testResult.rows[0].id,
    });
  } catch (error) {
    console.error("Error saving test 1 responses:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
