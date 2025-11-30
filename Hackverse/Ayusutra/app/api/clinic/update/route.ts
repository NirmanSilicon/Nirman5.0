import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(request: NextRequest) {
  try {
    const { clinicId, ...clinicData } = await request.json();

    // Validate required fields
    if (!clinicId) {
      return NextResponse.json(
        { error: 'Clinic ID is required' },
        { status: 400 }
      );
    }

    if (!clinicData.clinicName || !clinicData.ownerName || !clinicData.phoneNumber) {
      return NextResponse.json(
        { error: 'Missing required fields: clinicName, ownerName, and phoneNumber are required' },
        { status: 400 }
      );
    }

    // First, get the existing clinic data to preserve the email
    const existingClinic = await sql`
      SELECT email FROM clinics WHERE clinic_id = ${clinicId}
    `;

    if (existingClinic.rows.length === 0) {
      return NextResponse.json(
        { error: 'Clinic not found' },
        { status: 404 }
      );
    }

    const existingEmail = existingClinic.rows[0].email;

    // Update clinic in database (preserve existing email if not provided)
    const result = await sql`
      UPDATE clinics SET
        clinic_name = ${clinicData.clinicName},
        owner_name = ${clinicData.ownerName},
        phone_number = ${clinicData.phoneNumber},
        email = ${clinicData.email || existingEmail},
        address = ${clinicData.address || null},
        nearby_city = ${clinicData.nearbyCity || null},
        distance = ${clinicData.distance || null},
        google_maps_location = ${clinicData.googleMapsLocation || null},
        photos = ${JSON.stringify(clinicData.photos || [])},
        doctors = ${JSON.stringify(clinicData.doctors || [])},
        services = ${JSON.stringify(clinicData.services || [])},
        updated_at = CURRENT_TIMESTAMP
      WHERE clinic_id = ${clinicId}
      RETURNING *
    `;

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Clinic not found' },
        { status: 404 }
      );
    }

    const updatedClinic = result.rows[0];

    return NextResponse.json({
      success: true,
      clinic: updatedClinic,
      message: 'Clinic information updated successfully'
    });

  } catch (error) {
    console.error('Error updating clinic:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
