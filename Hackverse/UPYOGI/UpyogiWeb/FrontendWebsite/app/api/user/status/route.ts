import { NextRequest, NextResponse } from 'next/server';
import { getUserStatus, getUserProfile } from '@/lib/database';

// Force this API route to always run dynamically
export const dynamic = "force-dynamic";

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

    // Get user status using database function
    const userStatus = await getUserStatus(userId);
    
    if (!userStatus) {
      return NextResponse.json({
        exists: false,
        test1_completed: false,
        test2_completed: false,
        onboarding_completed: false,
        next_step: '/test1'
      });
    }

    // Get full user profile for additional details
    const userProfile = await getUserProfile(userId);

    return NextResponse.json({
      exists: true,
      test1_completed: userStatus.test1_completed,
      test2_completed: userStatus.test2_completed,
      onboarding_completed: userStatus.onboarding_completed,
      next_step: userStatus.next_step,
      profile: userProfile ? {
        id: userProfile.id,
        email: userProfile.email,
        full_name: userProfile.full_name,
        phone: userProfile.phone,
        dosha_type: userProfile.dosha_type,
        created_at: userProfile.created_at
      } : null
    });

  } catch (error) {
    console.error('Error getting user status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
