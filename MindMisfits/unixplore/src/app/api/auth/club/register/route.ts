import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { createSlug } from '@/lib/db/utils';
import { hashPassword } from '@/lib/auth';
import { clubRegistrationSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate input
        const validation = clubRegistrationSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { success: false, error: validation.error.errors[0].message },
                { status: 400 }
            );
        }

        const data = validation.data;

        // Check if admin email already exists
        const existingAdmin = await query(
            'SELECT id FROM club_admins WHERE email = $1',
            [data.adminEmail]
        );

        if (existingAdmin.rows.length > 0) {
            return NextResponse.json(
                { success: false, error: 'Admin email already registered' },
                { status: 400 }
            );
        }

        // Find college by ID or name
        let collegeResult;
        if (data.collegeId.match(/^CLG-\d{6}$/i)) {
            collegeResult = await query(
                'SELECT id FROM colleges WHERE college_id = $1 AND status = \'active\'',
                [data.collegeId.toUpperCase()]
            );
        } else {
            collegeResult = await query(
                'SELECT id FROM colleges WHERE name ILIKE $1 AND status = \'active\'',
                [`%${data.collegeId}%`]
            );
        }

        if (collegeResult.rows.length === 0) {
            return NextResponse.json(
                { success: false, error: 'College not found' },
                { status: 404 }
            );
        }

        const collegeId = collegeResult.rows[0].id;

        // Create slug
        const slug = createSlug(data.name);

        // Check if slug already exists for this college
        const existingClub = await query(
            'SELECT id FROM clubs WHERE college_id = $1 AND slug = $2',
            [collegeId, slug]
        );

        if (existingClub.rows.length > 0) {
            return NextResponse.json(
                { success: false, error: 'A club with this name already exists at this college' },
                { status: 400 }
            );
        }

        // Hash password
        const passwordHash = await hashPassword(data.adminPassword);

        // Start transaction
        await query('BEGIN', []);

        try {
            // Insert club (status: pending)
            const clubResult = await query(
                `INSERT INTO clubs (college_id, name, slug, category_id, email, description, status)
         VALUES ($1, $2, $3, $4, $5, $6, 'pending')
         RETURNING id`,
                [collegeId, data.name, slug, data.categoryId, data.email, data.description]
            );

            const newClubId = clubResult.rows[0].id;

            // Insert club admin
            await query(
                `INSERT INTO club_admins (club_id, name, email, password_hash)
         VALUES ($1, $2, $3, $4)`,
                [newClubId, data.adminName, data.adminEmail, passwordHash]
            );

            await query('COMMIT', []);

            return NextResponse.json({
                success: true,
                data: {
                    clubId: newClubId,
                    message: 'Club registration submitted. Awaiting college admin approval.',
                },
            });
        } catch (error) {
            await query('ROLLBACK', []);
            throw error;
        }
    } catch (error) {
        console.error('Error registering club:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to register club' },
            { status: 500 }
        );
    }
}
