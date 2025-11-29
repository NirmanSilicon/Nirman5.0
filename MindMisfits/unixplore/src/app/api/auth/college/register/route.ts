import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { generateCollegeId } from '@/lib/db/utils';
import { hashPassword } from '@/lib/auth';
import { collegeRegistrationSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate input
        const validation = collegeRegistrationSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { success: false, error: validation.error.errors[0].message },
                { status: 400 }
            );
        }

        const data = validation.data;

        // Check if admin email already exists
        const existingAdmin = await query(
            'SELECT id FROM college_admins WHERE email = $1',
            [data.adminEmail]
        );

        if (existingAdmin.rows.length > 0) {
            return NextResponse.json(
                { success: false, error: 'Admin email already registered' },
                { status: 400 }
            );
        }

        // Generate unique college ID
        const collegeId = await generateCollegeId();

        // Hash password
        const passwordHash = await hashPassword(data.adminPassword);

        // Start transaction
        const client = await query('BEGIN', []);

        try {
            // Insert college
            const collegeResult = await query(
                `INSERT INTO colleges (college_id, name, location, city, state, official_website, official_email)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id`,
                [
                    collegeId,
                    data.name,
                    data.location,
                    data.city || null,
                    data.state || null,
                    data.officialWebsite || null,
                    data.officialEmail,
                ]
            );

            const newCollegeId = collegeResult.rows[0].id;

            // Insert college admin
            await query(
                `INSERT INTO college_admins (college_id, email, password_hash)
         VALUES ($1, $2, $3)`,
                [newCollegeId, data.adminEmail, passwordHash]
            );

            await query('COMMIT', []);

            return NextResponse.json({
                success: true,
                data: {
                    collegeId: collegeId,
                    message: 'College registered successfully',
                },
            });
        } catch (error) {
            await query('ROLLBACK', []);
            throw error;
        }
    } catch (error) {
        console.error('Error registering college:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to register college' },
            { status: 500 }
        );
    }
}
