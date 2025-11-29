import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);

        if (!decoded || decoded.role !== 'club_admin') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { title, content } = body;

        if (!title || !content) {
            return NextResponse.json({ success: false, error: 'Title and content are required' }, { status: 400 });
        }

        await query(
            'INSERT INTO announcements (club_id, title, content, published) VALUES ($1, $2, $3, true)',
            [decoded.clubId, title, content]
        );

        return NextResponse.json({
            success: true,
            message: 'Announcement posted successfully',
        });
    } catch (error) {
        console.error('Error posting announcement:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to post announcement' },
            { status: 500 }
        );
    }
}
