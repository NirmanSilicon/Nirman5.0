import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
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

        const collegeId = decoded.collegeId;

        // Get stats with cast to int
        const stats = await query(
            `SELECT
        (SELECT COUNT(*) FROM clubs WHERE college_id = $1 AND status = 'approved')::int as approved_clubs,
        (SELECT COUNT(*) FROM clubs WHERE college_id = $1 AND status = 'pending')::int as pending_clubs,
        (SELECT COALESCE(views, 0) FROM analytics WHERE entity_type = 'college' AND entity_id = $1)::int as total_views`,
            [collegeId]
        );

        // Get pending clubs list
        const pendingClubs = await query(
            `SELECT c.id, c.name, c.email, c.created_at, ca.name as admin_name
       FROM clubs c
       JOIN club_admins ca ON c.id = ca.club_id
       WHERE c.college_id = $1 AND c.status = 'pending'
       ORDER BY c.created_at DESC`,
            [collegeId]
        );

        return NextResponse.json({
            success: true,
            data: {
                stats: stats.rows[0] || { approved_clubs: 0, pending_clubs: 0, total_views: 0 },
                pendingClubs: pendingClubs.rows,
            },
        });
    } catch (error) {
        console.error('Error fetching college stats:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch stats' },
            { status: 500 }
        );
    }
}