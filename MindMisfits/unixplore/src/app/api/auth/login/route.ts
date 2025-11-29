import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key';

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { success: false, error: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Check College Admins
        let user = null;
        let role = '';
        let entityId = null; // college_id or club_id

        const collegeAdminResult = await query(
            'SELECT * FROM college_admins WHERE email = $1',
            [email]
        );

        if (collegeAdminResult.rows.length > 0) {
            user = collegeAdminResult.rows[0];
            role = 'college_admin';
            entityId = user.college_id;
        } else {
            // Check Club Admins
            const clubAdminResult = await query(
                'SELECT * FROM club_admins WHERE email = $1',
                [email]
            );

            if (clubAdminResult.rows.length > 0) {
                user = clubAdminResult.rows[0];
                role = 'club_admin';
                entityId = user.club_id;
            }
        }

        if (!user) {
            return NextResponse.json(
                { success: false, error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password_hash);

        if (!isValidPassword) {
            return NextResponse.json(
                { success: false, error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Generate JWT
        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                role,
                entityId
            },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        // Set Cookie
        cookies().set('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 86400, // 1 day
            path: '/',
        });

        return NextResponse.json({
            success: true,
            data: {
                email: user.email,
                role,
                entityId
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
