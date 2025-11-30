import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function POST(request: NextRequest) {
  try {
    const { userId, prescription } = await request.json();

    if (!userId || !prescription) {
      return NextResponse.json(
        { error: "Missing userId or prescription data" },
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
        INSERT INTO user_profiles (firebase_uid, email, prescription_generated)
        VALUES (${userId}, ${`${userId}@temp.com`}, false)
        RETURNING id
      `;
      profileId = newProfile.rows[0].id as number;
    } else {
      profileId = userProfile.rows[0].id as number;
    }

    // Update user profile to mark prescription as generated
    await sql`
      UPDATE user_profiles SET
        prescription_generated = true,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${profileId}
    `;

    // Save prescription to database
    const prescriptionResult = await sql`
      INSERT INTO prescriptions (
        user_id, 
        prescription_id, 
        patient_info, 
        dosha_analysis, 
        dominant_dosha, 
        recommendations, 
        risk_level, 
        hair_health_score, 
        generated_at, 
        valid_until
      ) VALUES (
        ${profileId},
        ${prescription.prescriptionId},
        ${JSON.stringify(prescription.patientInfo)},
        ${JSON.stringify(prescription.doshaAnalysis)},
        ${prescription.dominantDosha},
        ${JSON.stringify(prescription.recommendations)},
        ${prescription.riskLevel},
        ${prescription.hairHealthScore},
        ${prescription.generatedAt},
        ${prescription.validUntil}
      ) RETURNING id
    `;

    // Save test result
    await sql`
      INSERT INTO test_results (user_id, test_type, results, completed_at)
      VALUES (${profileId}, 'prescription_generation', ${JSON.stringify(
      prescription
    )}, CURRENT_TIMESTAMP)
    `;

    return NextResponse.json({
      success: true,
      message: "Prescription saved successfully",
      prescriptionId: prescriptionResult.rows[0].id,
    });
  } catch (error) {
    console.error("Error saving prescription:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

