import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyPassword, generateToken } from '@/lib/auth';
import { collegeLoginSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate input
        const validation = collegeLoginSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { success: false, error: validation.error.errors[0].message },
                { status: 400 }
            );
        }

        const { email, password } = validation.data;

        // Find college admin
        const result = await query(
            `SELECT ca.id, ca.email, ca.password_hash, ca.college_id, c.college_id as college_code, c.name as college_name
       FROM college_admins ca
       JOIN colleges c ON ca.college_id = c.id
       WHERE ca.email = $1 AND c.status = 'active'`,
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

        // Update last login
        await query(
            'UPDATE college_admins SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
            [admin.id]
        );

        // Generate token
        const token = generateToken({
            id: admin.id,
            email: admin.email,
            role: 'college_admin',
            collegeId: admin.college_id,
        });

        return NextResponse.json({
            success: true,
            data: {
                token,
                admin: {
                    email: admin.email,
                    collegeName: admin.college_name,
                    collegeCode: admin.college_code,
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
