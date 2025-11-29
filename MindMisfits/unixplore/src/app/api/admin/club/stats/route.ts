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

        if (!decoded || decoded.role !== 'club_admin') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const clubId = decoded.clubId;

        // Get stats with cast to int
        const stats = await query(
            `SELECT
        (SELECT COUNT(*) FROM announcements WHERE club_id = $1 AND published = true)::int as announcement_count,
        (SELECT COUNT(*) FROM registrations WHERE club_id = $1 AND status = 'open')::int as active_registrations,
        (SELECT COALESCE(views, 0) FROM analytics WHERE entity_type = 'club' AND entity_id = $1)::int as total_views`,
            [clubId]
        );

        return NextResponse.json({
            success: true,
            data: stats.rows[0] || { announcement_count: 0, active_registrations: 0, total_views: 0 },
        });
    } catch (error) {
        console.error('Error fetching club stats:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch stats' },
            { status: 500 }
        );
    }
}