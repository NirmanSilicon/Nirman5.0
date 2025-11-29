import { NextRequest, NextResponse } from 'next/server';
import { updateClinicStatus } from '@/lib/database';

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('[POST /api/clinic/update-status] Received request body:', body);
    
    const { clinicId, status, adminNotes } = body;

    if (!clinicId || !status) {
      console.log('[POST /api/clinic/update-status] Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields: clinicId and status are required' },
        { status: 400 }
      );
    }

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      console.log('[POST /api/clinic/update-status] Invalid status:', status);
      return NextResponse.json(
        { error: 'Invalid status. Must be pending, approved, or rejected' },
        { status: 400 }
      );
    }

    console.log(`[POST /api/clinic/update-status] Updating clinic ${clinicId} to status: ${status}`);

    // Update clinic status
    const updatedClinic = await updateClinicStatus(clinicId, status, adminNotes);

    if (!updatedClinic) {
      console.log('[POST /api/clinic/update-status] Clinic not found:', clinicId);
      return NextResponse.json(
        { error: 'Clinic not found' },
        { status: 404 }
      );
    }

    // Debug logging
    console.log(`[POST /api/clinic/update-status] Updated clinic ${clinicId} to status: ${updatedClinic.status}, updated_at: ${updatedClinic.updated_at}`);
    
    // Verify the update by querying the database again
    const { getClinicById } = await import('@/lib/database');
    const verifyClinic = await getClinicById(clinicId);
    console.log(`[POST /api/clinic/update-status] Verification - Clinic ${clinicId} status after update: ${verifyClinic?.status}`);

    return NextResponse.json({
      success: true,
      clinic: updatedClinic,
      message: `Clinic ${status} successfully`
    });

  } catch (error) {
    console.error('Error updating clinic status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
