import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

// Initialize Twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID?.replace(/'/g, ''), // Remove quotes if present
  process.env.TWILIO_AUTH_TOKEN?.replace(/'/g, '')   // Remove quotes if present
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phoneNumber } = body;

    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Format phone number (ensure it starts with +91 for India)
    let formattedPhone = phoneNumber;
    if (!phoneNumber.startsWith('+')) {
      if (phoneNumber.startsWith('91')) {
        formattedPhone = '+' + phoneNumber;
      } else if (phoneNumber.startsWith('0')) {
        formattedPhone = '+91' + phoneNumber.substring(1);
      } else {
        formattedPhone = '+91' + phoneNumber;
      }
    }

    // Test message
    const testMessage = `🧪 *Test Message from AyurSutra*

Hello! This is a test message to verify WhatsApp integration.

If you receive this message, your WhatsApp notifications are working correctly!

✅ Twilio Configuration: OK
✅ WhatsApp API: OK
✅ Message Delivery: OK

You will receive booking confirmations at this number.

Namaste 🙏
AyurSutra Team`;

    // Send WhatsApp message using Twilio
    const messageResponse = await client.messages.create({
      body: testMessage,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${formattedPhone}`
    });

    console.log('Test WhatsApp message sent successfully:', messageResponse.sid);

    return NextResponse.json({
      success: true,
      messageId: messageResponse.sid,
      formattedPhone,
      message: 'Test WhatsApp message sent successfully'
    });

  } catch (error) {
    console.error('Error sending test WhatsApp message:', error);
    
    // Handle specific Twilio errors
    if (error instanceof Error) {
      if (error.message.includes('not a valid WhatsApp number')) {
        return NextResponse.json(
          { error: 'Invalid WhatsApp number format' },
          { status: 400 }
        );
      }
      
      if (error.message.includes('not authorized')) {
        return NextResponse.json(
          { error: 'WhatsApp service not authorized. Please check your Twilio configuration.' },
          { status: 403 }
        );
      }

      if (error.message.includes('Account SID')) {
        return NextResponse.json(
          { error: 'Invalid Twilio Account SID. Please check your environment variables.' },
          { status: 401 }
        );
      }

      if (error.message.includes('Auth Token')) {
        return NextResponse.json(
          { error: 'Invalid Twilio Auth Token. Please check your environment variables.' },
          { status: 401 }
        );
      }
    }

    return NextResponse.json(
      { 
        error: 'Failed to send test WhatsApp message',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Handle preflight requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
