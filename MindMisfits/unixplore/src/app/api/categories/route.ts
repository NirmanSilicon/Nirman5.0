import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
    try {
        const result = await query(
            'SELECT id, name, slug FROM categories ORDER BY name ASC',
            []
        );

        return NextResponse.json({
            success: true,
            data: result.rows,
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch categories' },
            { status: 500 }
        );
    }
}
