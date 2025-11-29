import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { incrementViews, trackEvent } from '@/lib/db/utils';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        console.log('API Request for College ID:', params.id);
        let queryText = `SELECT 
        id,
        college_id,
        name,
        location,
        city,
        state,
        official_website,
        official_email,
        created_at
      FROM colleges
      WHERE status = 'active' AND `;

        const queryParams = [];

        if (params.id.startsWith('CLG-')) {
            queryText += `college_id = $1`;
            queryParams.push(params.id);
        } else {
            const id = parseInt(params.id);
            if (isNaN(id)) {
                return NextResponse.json(
                    { success: false, error: 'Invalid college ID' },
                    { status: 400 }
                );
            }
            queryText += `id = $1`;
            queryParams.push(id);
        }

        // Get college details
        const collegeResult = await query(queryText, queryParams);

        if (collegeResult.rows.length === 0) {
            return NextResponse.json(
                { success: false, error: 'College not found' },
                { status: 404 }
            );
        }

        const college = collegeResult.rows[0];

        // Get clubs for this college
        const clubsResult = await query(
            `SELECT 
        cl.id,
        cl.name,
        cl.slug,
        cl.description,
        cat.name as category_name,
        cat.slug as category_slug,
        cat.color as category_color
      FROM clubs cl
      JOIN categories cat ON cl.category_id = cat.id
      WHERE cl.college_id = $1 AND cl.status = 'approved'
      ORDER BY cl.name ASC`,
            [college.id]
        );

        // Track view
        await incrementViews('colleges', college.id);
        await trackEvent('college', college.id, 'view');

        return NextResponse.json({
            success: true,
            data: {
                ...college,
                clubs: clubsResult.rows,
            },
        });
    } catch (error) {
        console.error('Error fetching college:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch college details' },
            { status: 500 }
        );
    }
}
