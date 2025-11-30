import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

    // Get user profile
    const userProfile = await sql`
      SELECT id FROM user_profiles WHERE firebase_uid = ${userId}
    `;

    if (userProfile.rows.length === 0) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }

    const profileId = userProfile.rows[0].id;

    // Get latest tongue analysis
    const analysisResult = await sql`
      SELECT 
        dosha_indicators,
        recommendations,
        confidence_score,
        created_at
      FROM tongue_analysis 
      WHERE user_id = ${profileId}
      ORDER BY created_at DESC, id DESC
      LIMIT 1
    `;

    if (analysisResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'No analysis found' },
        { status: 404 }
      );
    }

    const analysis = analysisResult.rows[0];

    return NextResponse.json({
      success: true,
      analysis: {
        dosha_indicators: analysis.dosha_indicators,
        recommendations: analysis.recommendations,
        confidence_score: analysis.confidence_score,
        created_at: analysis.created_at
      }
    });

  } catch (error) {
    console.error('Error fetching user analysis:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
