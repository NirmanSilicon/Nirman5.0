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
        const { title, link, deadline } = body;

        if (!title || !link) {
            return NextResponse.json({ success: false, error: 'Title and link are required' }, { status: 400 });
        }

        await query(
            `INSERT INTO registrations (club_id, title, link, deadline, status) 
       VALUES ($1, $2, $3, $4, 'open')`,
            [decoded.clubId, title, link, deadline || null]
        );

        return NextResponse.json({
            success: true,
            message: 'Registration link added successfully',
        });
    } catch (error) {
        console.error('Error adding registration:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to add registration' },
            { status: 500 }
        );
    }
}
