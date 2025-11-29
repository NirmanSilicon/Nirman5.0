import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        // Verify authentication
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);

        if (!decoded || decoded.role !== 'college_admin') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { clubId, action } = body; // action: 'approve' or 'reject'

        if (!clubId || !['approve', 'reject'].includes(action)) {
            return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
        }

        // Verify club belongs to this college
        const clubCheck = await query(
            'SELECT id FROM clubs WHERE id = $1 AND college_id = $2',
            [clubId, decoded.collegeId]
        );

        if (clubCheck.rows.length === 0) {
            return NextResponse.json({ success: false, error: 'Club not found or access denied' }, { status: 404 });
        }

        const status = action === 'approve' ? 'approved' : 'rejected';

        await query(
            'UPDATE clubs SET status = $1 WHERE id = $2',
            [status, clubId]
        );

        return NextResponse.json({
            success: true,
            message: `Club ${status} successfully`,
        });
    } catch (error) {
        console.error('Error updating club status:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update club status' },
            { status: 500 }
        );
    }
}
