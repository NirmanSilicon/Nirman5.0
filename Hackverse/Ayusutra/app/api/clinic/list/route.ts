import { NextRequest, NextResponse } from 'next/server';
import { getAllClinics, getClinicsByStatus } from '@/lib/database';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let clinics;
    if (status) {
      clinics = await getClinicsByStatus(status);
    } else {
      clinics = await getAllClinics();
    }

    return NextResponse.json({
      success: true,
      clinics: clinics
    });

  } catch (error) {
    console.error('Error getting clinics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
