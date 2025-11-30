import { NextRequest, NextResponse } from 'next/server';
import { createClinic } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const clinicData = await request.json();

    // Validate required fields
    if (!clinicData.clinicName || !clinicData.ownerName || !clinicData.phoneNumber) {
      return NextResponse.json(
        { error: 'Missing required fields: clinicName, ownerName, and phoneNumber are required' },
        { status: 400 }
      );
    }

    // Create clinic in database
    const newClinic = await createClinic(clinicData);

    return NextResponse.json({
      success: true,
      clinic: newClinic,
      message: 'Clinic application submitted successfully'
    });

  } catch (error) {
    console.error('Error creating clinic:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
