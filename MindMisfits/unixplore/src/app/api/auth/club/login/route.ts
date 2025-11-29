import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyPassword, generateToken } from '@/lib/auth';
import { clubLoginSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate input
        const validation = clubLoginSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { success: false, error: validation.error.errors[0].message },
                { status: 400 }
            );
        }

        const { email, password } = validation.data;

        // Find club admin
        const result = await query(
            `SELECT ca.id, ca.name, ca.email, ca.password_hash, ca.club_id, cl.name as club_name, cl.status
       FROM club_admins ca
       JOIN clubs cl ON ca.club_id = cl.id
       WHERE ca.email = $1`,
            [email]
        );

        if (result.rows.length === 0) {
            return NextResponse.json(
                { success: false, error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        const admin = result.rows[0];

        // Verify password
        const isValid = await verifyPassword(password, admin.password_hash);
        if (!isValid) {
            return NextResponse.json(
                { success: false, error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Check club status
        if (admin.status === 'rejected') {
            return NextResponse.json(
                { success: false, error: 'Your club registration was rejected' },
                { status: 403 }
            );
        }

        // Update last login
        await query(
            'UPDATE club_admins SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
            [admin.id]
        );

        // Generate token
        const token = generateToken({
            id: admin.id,
            email: admin.email,
            role: 'club_admin',
            clubId: admin.club_id,
        });

        return NextResponse.json({
            success: true,
            data: {
                token,
                admin: {
                    name: admin.name,
                    email: admin.email,
                    clubName: admin.club_name,
                    clubStatus: admin.status,
                },
            },
        });
    } catch (error) {
        console.error('Error logging in:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to login' },
            { status: 500 }
        );
    }
}
