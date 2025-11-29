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

        if (!decoded || decoded.role !== 'club_admin') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { description, email, phone, website, instagram, linkedin } = body;

        // Build update query dynamically based on provided fields
        const updates: string[] = [];
        const values: any[] = [];
        let paramCount = 1;

        if (description !== undefined) {
            updates.push(`description = $${paramCount++}`);
            values.push(description);
        }
        if (email !== undefined) {
            updates.push(`email = $${paramCount++}`);
            values.push(email);
        }
        if (phone !== undefined) {
            updates.push(`phone = $${paramCount++}`);
            values.push(phone);
        }
        if (website !== undefined) {
            updates.push(`website = $${paramCount++}`);
            values.push(website);
        }
        if (instagram !== undefined) {
            updates.push(`instagram = $${paramCount++}`);
            values.push(instagram);
        }
        if (linkedin !== undefined) {
            updates.push(`linkedin = $${paramCount++}`);
            values.push(linkedin);
        }

        if (updates.length === 0) {
            return NextResponse.json({ success: false, error: 'No fields to update' }, { status: 400 });
        }

        values.push(decoded.clubId);
        const queryStr = `UPDATE clubs SET ${updates.join(', ')} WHERE id = $${paramCount}`;

        await query(queryStr, values);

        return NextResponse.json({
            success: true,
            message: 'Club details updated successfully',
        });
    } catch (error) {
        console.error('Error updating club details:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update details' },
            { status: 500 }
        );
    }
}
