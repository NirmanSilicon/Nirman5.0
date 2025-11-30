import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { sql } from '@vercel/postgres';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find clinic by email
    const result = await sql`
      SELECT 
        clinic_id,
        email,
        password_hash,
        status,
        clinic_name,
        owner_name,
        phone_number
      FROM clinics 
      WHERE email = ${email}
    `;

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const clinic = result.rows[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, clinic.password_hash);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Allow login for all statuses (pending, approved, rejected)
    // The dashboard will handle showing appropriate content based on status

    // Return clinic info (without password hash)
    const clinicInfo = {
      clinic_id: clinic.clinic_id,
      email: clinic.email,
      status: clinic.status,
      clinic_name: clinic.clinic_name,
      owner_name: clinic.owner_name,
      phone_number: clinic.phone_number
    };

    return NextResponse.json({
      success: true,
      clinic: clinicInfo,
      message: 'Login successful'
    });

  } catch (error) {
    console.error('Error during clinic login:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
