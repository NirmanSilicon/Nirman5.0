import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId parameter' },
        { status: 400 }
      );
    }

    // Get user profile data
    const userProfile = await sql`
      SELECT 
        id,
        firebase_uid,
        email,
        date_of_birth,
        gender,
        height_cm,
        weight_kg,
        activity_level,
        health_goals,
        medical_conditions,
        medications,
        allergies,
        dietary_preferences,
        sleep_pattern,
        stress_level,
        test1_completed,
        test2_completed,
        created_at,
        updated_at
      FROM user_profiles 
      WHERE firebase_uid = ${userId}
    `;

    if (userProfile.rows.length === 0) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }

    const profile = userProfile.rows[0];
    
    // Calculate BMI if height and weight are available
    let bmi = null;
    if (profile.height_cm && profile.weight_kg) {
      const heightInMeters = profile.height_cm / 100;
      bmi = (profile.weight_kg / (heightInMeters * heightInMeters)).toFixed(1);
    }

    // Calculate age if date of birth is available
    let age = null;
    if (profile.date_of_birth) {
      const birthDate = new Date(profile.date_of_birth);
      const today = new Date();
      age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
    }

    return NextResponse.json({
      success: true,
      profile: {
        ...profile,
        bmi,
        age
      }
    });

  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
