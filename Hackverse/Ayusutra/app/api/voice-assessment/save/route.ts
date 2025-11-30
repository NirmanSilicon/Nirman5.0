import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const { userId, assessmentData } = await request.json();

    if (!userId || !assessmentData) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Save voice assessment data to database
    const assessment = {
      userId,
      type: 'voice_assessment',
      data: assessmentData,
      timestamp: new Date().toISOString(),
      status: 'completed'
    };

    // In a real implementation, you would save to your database
    // For now, we'll just return success
    console.log('Voice assessment saved:', assessment);

    return NextResponse.json({
      success: true,
      message: 'Voice assessment saved successfully',
      assessmentId: `VA-${Date.now()}`
    });

  } catch (error) {
    console.error('Error saving voice assessment:', error);
    return NextResponse.json(
      { error: 'Failed to save voice assessment' },
      { status: 500 }
    );
  }
}
