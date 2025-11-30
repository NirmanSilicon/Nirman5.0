import { NextRequest, NextResponse } from 'next/server';
import { db as sql } from '@/lib/database';

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clinicId = searchParams.get('clinicId');

    if (!clinicId) {
      return NextResponse.json(
        { error: 'Clinic ID is required' },
        { status: 400 }
      );
    }

    // Use the same query structure as the working fresh endpoint
    const result = await sql`
      SELECT 
        clinic_id,
        clinic_name,
        owner_name,
        phone_number,
        email,
        address,
        nearby_city,
        distance,
        google_maps_location,
        photos,
        doctors,
        services,
        status,
        admin_notes,
        updated_at,
        created_at
      FROM clinics 
      WHERE clinic_id = ${clinicId}
    `;

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Clinic not found' },
        { status: 404 }
      );
    }

    const clinic = result.rows[0];
    
    // Additional debug: Check if we got the expected data
    console.log(`[GET /api/clinic/get] Direct query result - status: ${clinic.status}, updated_at: ${clinic.updated_at}`);

    // Debug logging with timestamp
    const currentTime = new Date().toISOString();
    console.log(`[GET /api/clinic/get] ${currentTime} - Clinic ${clinicId} status: ${clinic.status}, updated_at: ${clinic.updated_at}`);

    // Return clinic data without sensitive information
    const clinicData = {
      clinic_id: clinic.clinic_id,
      clinic_name: clinic.clinic_name,
      owner_name: clinic.owner_name,
      phone_number: clinic.phone_number,
      email: clinic.email,
      address: clinic.address,
      nearby_city: clinic.nearby_city,
      distance: clinic.distance,
      google_maps_location: clinic.google_maps_location,
      photos: clinic.photos,
      doctors: clinic.doctors,
      services: clinic.services,
      status: clinic.status,
      admin_notes: clinic.admin_notes,
      created_at: clinic.created_at,
      updated_at: clinic.updated_at
    };

    return NextResponse.json({
      success: true,
      clinic: clinicData
    });

  } catch (error) {
    console.error('Error fetching clinic:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
