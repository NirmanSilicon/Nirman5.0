import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function PATCH(request: NextRequest) {
    try {
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
        const { name, location, website, description } = body;

        // Build update query dynamically
        const updates: string[] = [];
        const values: any[] = [];
        let paramCount = 1;

        if (name !== undefined) {
            updates.push(`name = $${paramCount++}`);
            values.push(name);
        }
        if (location !== undefined) {
            updates.push(`location = $${paramCount++}`);
            values.push(location);
        }
        if (website !== undefined) {
            updates.push(`website = $${paramCount++}`);
            values.push(website);
        }
        if (description !== undefined) {
            updates.push(`description = $${paramCount++}`);
            values.push(description);
        }

        if (updates.length === 0) {
            return NextResponse.json({ success: false, error: 'No fields to update' }, { status: 400 });
        }

        values.push(decoded.collegeId);
        const queryStr = `UPDATE colleges SET ${updates.join(', ')} WHERE id = $${paramCount}`;

        await query(queryStr, values);

        return NextResponse.json({
            success: true,
            message: 'College details updated successfully',
        });
    } catch (error) {
        console.error('Error updating college details:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update details' },
            { status: 500 }
        );
    }
}
