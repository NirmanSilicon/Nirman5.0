import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { sessionId, otp } = await request.json();

    if (!sessionId || !otp) {
      return NextResponse.json(
        { error: 'Session ID and OTP are required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.TWO_FACTOR_API_KEY;
    const baseUrl = process.env.TWO_FACTOR_BASE_URL || 'https://2factor.in/API/V1';

    if (!apiKey) {
      return NextResponse.json(
        { error: 'TwoFactor API key not configured' },
        { status: 500 }
      );
    }

    // Verify OTP using 2Factor API
    const response = await fetch(
      `${baseUrl}/${apiKey}/SMS/VERIFY/${sessionId}/${otp}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();

    if (data.Status === 'Success') {
      return NextResponse.json({
        success: true,
        message: 'OTP verified successfully',
        verified: true,
      });
    } else {
      return NextResponse.json(
        { error: data.Details || 'Invalid OTP' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
