import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function PUT(request: NextRequest) {
  try {
    const { userId, profileData } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId' },
        { status: 400 }
      );
    }

    // Update user profile
    await sql`
      UPDATE user_profiles SET
        date_of_birth = ${profileData.date_of_birth || null},
        gender = ${profileData.gender || null},
        height_cm = ${profileData.height_cm ? parseInt(profileData.height_cm) : null},
        weight_kg = ${profileData.weight_kg ? parseInt(profileData.weight_kg) : null},
        activity_level = ${profileData.activity_level || null},
        health_goals = ${profileData.health_goals || []},
        medical_conditions = ${profileData.medical_conditions || []},
        medications = ${JSON.stringify(profileData.medications ? [profileData.medications] : [])},
        allergies = ${profileData.allergies || []},
        dietary_preferences = ${profileData.dietary_preferences || []},
        sleep_pattern = ${profileData.sleep_pattern || null},
        stress_level = ${profileData.stress_level ? parseInt(profileData.stress_level) : null},
        updated_at = CURRENT_TIMESTAMP
      WHERE firebase_uid = ${userId}
    `;

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully'
    });

  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
