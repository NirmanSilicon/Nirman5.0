import { NextRequest, NextResponse } from 'next/server';
import { createUserProfileWithPhone, updateUserPhone, checkUserExists } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const { firebase_uid, email, full_name, phone_number } = await request.json();

    if (!firebase_uid || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: firebase_uid and email are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await checkUserExists(firebase_uid);

    if (existingUser) {
      // Update existing user with phone number if provided
      if (phone_number) {
        const updatedUser = await updateUserPhone(firebase_uid, phone_number);
        return NextResponse.json({
          success: true,
          user: updatedUser,
          message: 'User profile updated with phone number'
        });
      }
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }

    // Create new user profile with phone number
    const newUser = await createUserProfileWithPhone({
      firebase_uid,
      email,
      full_name,
      phone_number: phone_number || ''
    });

    return NextResponse.json({
      success: true,
      user: newUser
    });

  } catch (error) {
    console.error('Error creating user profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
