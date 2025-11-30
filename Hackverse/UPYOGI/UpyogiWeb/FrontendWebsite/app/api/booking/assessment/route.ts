import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    console.log("Assessment booking API called");
    const body = await request.json();
    console.log("Request body:", body);
    
    const {
      therapyName,
      selectedDate,
      selectedTime,
      amount,
      currency,
      userInfo,
      assessmentData
    } = body;

    if (!therapyName || !selectedDate || !selectedTime) {
      console.log("Missing required fields");
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create a simple booking record for assessment
    const booking = {
      id: `assessment-${Date.now()}`,
      therapyName,
      selectedDate,
      selectedTime,
      amount: amount || 2500,
      currency: currency || "INR",
      userInfo: userInfo || {
        name: "Sradha",
        phone: "+919876543210",
        email: "sradha@example.com"
      },
      assessmentData: assessmentData || {},
      status: "confirmed",
      paymentStatus: "completed",
      createdAt: new Date().toISOString()
    };

    // In a real app, you would save this to a database
    // For now, we'll just return success
    console.log("Assessment booking created:", booking);

    return NextResponse.json({ 
      success: true, 
      booking,
      message: "Assessment booking created successfully"
    });
  } catch (error) {
    console.error("Error creating assessment booking:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
