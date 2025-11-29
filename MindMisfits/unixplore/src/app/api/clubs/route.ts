import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const collegeId = searchParams.get('collegeId');
        const categoryId = searchParams.get('categoryId');
        const search = searchParams.get('search');

        let sql = `
            SELECT 
                c.id,
                c.name,
                c.slug,
                c.description,
                c.email,
                c.status,
                c.college_id,
                col.name as college_name,
                cat.name as category_name,
                cat.slug as category_slug,
                cat.color as category_color
            FROM clubs c
            JOIN colleges col ON c.college_id = col.id
            LEFT JOIN categories cat ON c.category_id = cat.id
            WHERE c.status = 'approved'
        `;

        const params = [];
        let paramIndex = 1;

        if (collegeId) {
            // Check if it's a numeric ID or string ID (CLG-...)
            if (collegeId.startsWith('CLG-')) {
                sql += ` AND col.college_id = $${paramIndex}`;
                params.push(collegeId);
            } else {
                sql += ` AND c.college_id = $${paramIndex}`;
                params.push(collegeId);
            }
            paramIndex++;
        }

        if (categoryId) {
            sql += ` AND c.category_id = $${paramIndex}`;
            params.push(categoryId);
            paramIndex++;
        }

        if (search) {
            sql += ` AND (c.name ILIKE $${paramIndex} OR c.description ILIKE $${paramIndex})`;
            params.push(`%${search}%`);
            paramIndex++;
        }

        sql += ` ORDER BY c.name ASC`;

        const result = await query(sql, params);

        return NextResponse.json({
            success: true,
            data: result.rows,
        });
    } catch (error) {
        console.error('Error fetching clubs:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch clubs' },
            { status: 500 }
        );
    }
}
