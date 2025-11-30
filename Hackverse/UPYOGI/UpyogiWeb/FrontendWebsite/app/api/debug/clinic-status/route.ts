import { NextRequest, NextResponse } from 'next/server';
import { getClinicById, getClinicsByStatus } from '@/lib/database';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clinicId = searchParams.get('clinicId');

    if (!clinicId) {
      return NextResponse.json({ error: 'clinicId is required' }, { status: 400 });
    }

    // Get clinic by ID
    const clinic = await getClinicById(clinicId);
    
    // Get all clinics by status
    const [pending, approved, rejected] = await Promise.all([
      getClinicsByStatus('pending'),
      getClinicsByStatus('approved'),
      getClinicsByStatus('rejected')
    ]);

    // Check if clinic exists in any status
    const inPending = pending.find(c => c.clinic_id === clinicId);
    const inApproved = approved.find(c => c.clinic_id === clinicId);
    const inRejected = rejected.find(c => c.clinic_id === clinicId);

    return NextResponse.json({
      success: true,
      clinicId,
      clinic: clinic,
      status: clinic?.status,
      foundIn: {
        pending: !!inPending,
        approved: !!inApproved,
        rejected: !!inRejected
      },
      counts: {
        pending: pending.length,
        approved: approved.length,
        rejected: rejected.length
      }
    });

  } catch (error) {
    console.error('Error debugging clinic status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
