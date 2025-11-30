import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { sql } from '@vercel/postgres';

export async function POST(request: NextRequest) {
  try {
    const { email, password, phoneNumber } = await request.json();

    // Validate required fields
    if (!email || !password || !phoneNumber) {
      return NextResponse.json(
        { error: 'Email, password, and phone number are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingClinic = await sql`
      SELECT id FROM clinics WHERE email = ${email}
    `;

    if (existingClinic.rows.length > 0) {
      return NextResponse.json(
        { error: 'A clinic with this email already exists' },
        { status: 409 }
      );
    }

    // Hash the password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Generate clinic ID
    const clinicId = `CLN_${Date.now()}_${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    // Create clinic record
    const result = await sql`
      INSERT INTO clinics (
        clinic_id,
        clinic_name,
        owner_name,
        phone_number,
        email,
        password_hash,
        address,
        nearby_city,
        photos,
        doctors,
        services,
        status
      ) VALUES (
        ${clinicId},
        'Clinic Name (To be updated)',
        'Owner Name (To be updated)',
        ${phoneNumber},
        ${email},
        ${passwordHash},
        'Address (To be updated)',
        'City (To be updated)',
        '[]'::jsonb,
        '[]'::jsonb,
        '[]'::jsonb,
        'pending'
      )
      RETURNING clinic_id, email, status, created_at
    `;

    const newClinic = result.rows[0];

    return NextResponse.json({
      success: true,
      clinic: newClinic,
      message: 'Clinic account created successfully. Please complete your profile.'
    });

  } catch (error) {
    console.error('Error creating clinic account:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
