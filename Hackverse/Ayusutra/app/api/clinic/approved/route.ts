import { NextRequest, NextResponse } from 'next/server';
import { getApprovedClinicsWithPhotos, searchClinicsByLocation } from '@/lib/database';

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');

    let clinics;
    
    if (city) {
      // Search clinics by city
      clinics = await searchClinicsByLocation(city);
    } else {
      // Get all approved clinics
      clinics = await getApprovedClinicsWithPhotos();
    }

    return NextResponse.json({
      success: true,
      clinics: clinics,
      count: clinics.length
    });

  } catch (error) {
    console.error('Error fetching approved clinics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
