import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key';

export async function GET(request: NextRequest) {
    try {
        const token = cookies().get('auth_token')?.value;

        if (!token) {
            return NextResponse.json(
                { success: false, error: 'Not authenticated' },
                { status: 401 }
            );
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        return NextResponse.json({
            success: true,
            data: decoded
        });

    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Invalid token' },
            { status: 401 }
        );
    }
}
