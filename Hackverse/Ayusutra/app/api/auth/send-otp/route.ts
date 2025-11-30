import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber } = await request.json();

    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.TWO_FACTOR_API_KEY;
    const baseUrl = process.env.TWO_FACTOR_BASE_URL || 'https://2factor.in/API/V1';
    const otpTemplate = process.env.TWO_FACTOR_OTP_TEMPLATE_NAME || 'OTP1';

    // Debug logging
    console.log('Environment variables check:');
    console.log('TWO_FACTOR_API_KEY:', apiKey ? 'Set' : 'Not set');
    console.log('TWO_FACTOR_BASE_URL:', baseUrl);
    console.log('TWO_FACTOR_OTP_TEMPLATE_NAME:', otpTemplate);

    if (!apiKey) {
      return NextResponse.json(
        { error: 'TwoFactor API key not configured. Please check your environment variables.' },
        { status: 500 }
      );
    }

    // Format phone number (ensure it starts with +)
    const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;

    // Send OTP using 2Factor API
    const response = await fetch(
      `${baseUrl}/${apiKey}/SMS/${encodeURIComponent(formattedPhone)}/AUTOGEN3/${otpTemplate}`,
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
        message: 'OTP sent successfully',
        sessionId: data.Details, // This contains the session ID for verification
      });
    } else {
      return NextResponse.json(
        { error: data.Details || 'Failed to send OTP' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
