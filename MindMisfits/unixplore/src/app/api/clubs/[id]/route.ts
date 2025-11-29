import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { incrementViews, trackEvent } from '@/lib/db/utils';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const clubId = parseInt(params.id);

        if (isNaN(clubId)) {
            return NextResponse.json(
                { success: false, error: 'Invalid club ID' },
                { status: 400 }
            );
        }

        // Get club details
        const clubResult = await query(
            `SELECT 
        cl.id,
        cl.name,
        cl.slug,
        cl.email,
        cl.description,
        cl.about,
        cl.contact_info,
        cl.created_at,
        cat.name as category_name,
        cat.slug as category_slug,
        cat.color as category_color,
        c.id as college_id,
        c.name as college_name,
        c.college_id as college_code
      FROM clubs cl
      JOIN categories cat ON cl.category_id = cat.id
      JOIN colleges c ON cl.college_id = c.id
      WHERE cl.id = $1 AND cl.status = 'approved'`,
            [clubId]
        );

        if (clubResult.rows.length === 0) {
            return NextResponse.json(
                { success: false, error: 'Club not found' },
                { status: 404 }
            );
        }

        const club = clubResult.rows[0];

        // Get announcements
        const announcementsResult = await query(
            `SELECT id, title, content, created_at
       FROM announcements
       WHERE club_id = $1 AND published = true
       ORDER BY created_at DESC
       LIMIT 10`,
            [clubId]
        );

        // Get registrations
        const registrationsResult = await query(
            `SELECT id, title, description, registration_link, start_date, end_date, status, created_at
       FROM registrations
       WHERE club_id = $1
       ORDER BY created_at DESC
       LIMIT 10`,
            [clubId]
        );

        // Track view
        await incrementViews('clubs', clubId);
        await trackEvent('club', clubId, 'view');

        return NextResponse.json({
            success: true,
            data: {
                ...club,
                announcements: announcementsResult.rows,
                registrations: registrationsResult.rows,
            },
        });
    } catch (error) {
        console.error('Error fetching club:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch club details' },
            { status: 500 }
        );
    }
}
