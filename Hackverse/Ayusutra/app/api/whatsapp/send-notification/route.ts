import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

// Initialize Twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID?.replace(/'/g, ''), // Remove quotes if present
  process.env.TWILIO_AUTH_TOKEN?.replace(/'/g, '')   // Remove quotes if present
);

export async function POST(request: NextRequest) {
  try {
    // Log environment variables for debugging (without exposing sensitive data)
    console.log('Twilio Config Check:', {
      hasAccountSid: !!process.env.TWILIO_ACCOUNT_SID,
      hasAuthToken: !!process.env.TWILIO_AUTH_TOKEN,
      hasWhatsappNumber: !!process.env.TWILIO_WHATSAPP_NUMBER,
      whatsappNumber: process.env.TWILIO_WHATSAPP_NUMBER
    });

    const body = await request.json();
    const { 
      phoneNumber, 
      userName, 
      therapyName, 
      clinicName, 
      selectedDate, 
      selectedTime,
      amount 
    } = body;

    // Debug: Log the received phone number
    console.log('Received booking data:', {
      phoneNumber,
      userName,
      therapyName,
      clinicName,
      selectedDate,
      selectedTime,
      amount
    });

    // Validate required fields
    if (!phoneNumber || !userName || !therapyName || !clinicName || !selectedDate || !selectedTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
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

    // Format date for display
    const bookingDate = new Date(selectedDate);
    const formattedDate = bookingDate.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Create WhatsApp message
    const message = `🎉 *Booking Confirmed!*

Hello ${userName},

Your Ayurvedic treatment booking has been successfully confirmed!

📋 *Booking Details:*
• Treatment: ${therapyName}
• Clinic: ${clinicName}
• Date: ${formattedDate}
• Time: ${selectedTime}
• Amount: ${amount}

📱 *Your Treatment Module is Ready!*
• Access your personalized module at: /user/module
• Complete pre-procedure instructions step by step
• Track your progress and get reminders
• Follow post-procedure care guidelines

📝 *Pre-procedure Instructions:*
• Check your treatment module for detailed steps
• Complete all pre-procedure requirements
• Arrive 15 minutes before your appointment
• Bring any required documents or reports

🚗 *Location & Contact:*
• Clinic: ${clinicName}
• Contact: +91 98765 43210
• Please call if you need to reschedule

We look forward to providing you with authentic Ayurvedic healing!

Namaste 🙏
AyurSutra Team

---
*This is an automated message. Please do not reply to this number.*`;

    // Send both WhatsApp and SMS messages using Twilio
    console.log('Sending notifications:', {
      whatsapp: {
        from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
        to: `whatsapp:${formattedPhone}`,
        messageLength: message.length
      },
      sms: {
        from: '+19787319968',
        to: formattedPhone,
        messageLength: message.length
      }
    });

    // Send WhatsApp message
    const whatsappResponse = await client.messages.create({
      body: message,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`, // Your Twilio WhatsApp number
      to: `whatsapp:${formattedPhone}`
    });

    console.log('WhatsApp message sent successfully:', whatsappResponse.sid);

    // Try to send SMS message (may fail on trial accounts)
    let smsResponse = null;
    let smsError = null;
    
    try {
      smsResponse = await client.messages.create({
        body: message,
        from: '+19787319968', // Your Twilio SMS number
        to: formattedPhone
      });
      console.log('SMS message sent successfully:', smsResponse.sid);
    } catch (smsErr) {
      console.log('SMS sending failed (likely trial account limitation):', smsErr.message);
      smsError = smsErr.message;
    }

    return NextResponse.json({
      success: true,
      whatsappMessageId: whatsappResponse.sid,
      smsMessageId: smsResponse?.sid || null,
      smsError: smsError || null,
      message: smsResponse 
        ? 'Both WhatsApp and SMS notifications sent successfully'
        : 'WhatsApp notification sent successfully (SMS failed - trial account limitation)'
    });

  } catch (error) {
    console.error('Error sending notifications:', error);
    
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
    }

    return NextResponse.json(
      { error: 'Failed to send WhatsApp notification' },
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
