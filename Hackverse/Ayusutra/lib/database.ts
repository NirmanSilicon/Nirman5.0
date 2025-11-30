import { sql } from "@vercel/postgres";
import { Client } from "pg";

// For Vercel Postgres (recommended for production)
export const db = sql;

// For direct PostgreSQL connection (if needed)
export const createConnection = () => {
  return new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });
};

// Database initialization and table creation
export async function initializeDatabase() {
  try {
    // Create user_profiles table
    await sql`
      CREATE TABLE IF NOT EXISTS user_profiles (
        id SERIAL PRIMARY KEY,
        firebase_uid VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) NOT NULL,
        full_name VARCHAR(255),
        phone VARCHAR(20),
        date_of_birth DATE,
        gender VARCHAR(20),
        height_cm INTEGER,
        weight_kg INTEGER,
        activity_level VARCHAR(50),
        health_goals TEXT[],
        medical_conditions TEXT[],
        medications TEXT[],
        allergies TEXT[],
        dietary_preferences TEXT[],
        lifestyle_habits TEXT[],
        sleep_pattern VARCHAR(100),
        stress_level INTEGER CHECK (stress_level >= 1 AND stress_level <= 10),
        dosha_type VARCHAR(50),
        test1_completed BOOLEAN DEFAULT FALSE,
        test2_completed BOOLEAN DEFAULT FALSE,
        onboarding_completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create test_questions table
    await sql`
      CREATE TABLE IF NOT EXISTS test_questions (
        id SERIAL PRIMARY KEY,
        test_type VARCHAR(50) NOT NULL, -- 'gamified' or 'tongue_analysis'
        category VARCHAR(100) NOT NULL, -- 'physical', 'mental', 'lifestyle', etc.
        question_text TEXT NOT NULL,
        question_type VARCHAR(50) NOT NULL, -- 'multiple_choice', 'scale', 'text', 'image'
        options JSONB, -- For multiple choice options
        order_index INTEGER NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create test_responses table
    await sql`
      CREATE TABLE IF NOT EXISTS test_responses (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES user_profiles(id) ON DELETE CASCADE,
        question_id INTEGER REFERENCES test_questions(id) ON DELETE CASCADE,
        response_value TEXT,
        response_data JSONB, -- For complex responses (images, arrays, etc.)
        completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, question_id)
      )
    `;

    // Create test_results table
    await sql`
      CREATE TABLE IF NOT EXISTS test_results (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES user_profiles(id) ON DELETE CASCADE,
        test_type VARCHAR(50) NOT NULL,
        results JSONB NOT NULL, -- Store computed results/analysis
        score INTEGER,
        recommendations TEXT[],
        insights TEXT,
        completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create tongue_analysis table (for Test 2)
    await sql`
      CREATE TABLE IF NOT EXISTS tongue_analysis (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES user_profiles(id) ON DELETE CASCADE,
        image_url TEXT NOT NULL,
        analysis_data JSONB, -- AI analysis results
        color_analysis JSONB,
        texture_analysis JSONB,
        coating_analysis JSONB,
        health_indicators TEXT[],
        dosha_indicators JSONB,
        recommendations TEXT[],
        confidence_score FLOAT,
        processed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create clinics table
    await sql`
      CREATE TABLE IF NOT EXISTS clinics (
        id SERIAL PRIMARY KEY,
        clinic_id VARCHAR(50) UNIQUE NOT NULL, -- Custom clinic ID
        clinic_name VARCHAR(255) NOT NULL,
        owner_name VARCHAR(255) NOT NULL,
        phone_number VARCHAR(20) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        address TEXT NOT NULL,
        nearby_city VARCHAR(100) NOT NULL,
        distance VARCHAR(50),
        google_maps_location TEXT,
        photos JSONB, -- Array of photo URLs
        doctors JSONB, -- Array of doctor objects
        services JSONB, -- Array of service objects
        status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected
        admin_notes TEXT,
        default_username VARCHAR(100), -- Auto-generated username
        default_password VARCHAR(100), -- Auto-generated password
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create indexes for better performance
    await sql`CREATE INDEX IF NOT EXISTS idx_user_profiles_firebase_uid ON user_profiles(firebase_uid)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_test_responses_user_id ON test_responses(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_test_questions_test_type ON test_questions(test_type)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_tongue_analysis_user_id ON tongue_analysis(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_clinics_clinic_id ON clinics(clinic_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_clinics_status ON clinics(status)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_clinics_photos ON clinics USING GIN (photos)`;

    // Create bookings table
    await sql`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        booking_id VARCHAR(60) UNIQUE NOT NULL,
        user_id INTEGER REFERENCES user_profiles(id) ON DELETE SET NULL,
        clinic_id VARCHAR(50) REFERENCES clinics(clinic_id) ON DELETE SET NULL,
        therapy_name VARCHAR(255) NOT NULL,
        selected_date DATE NOT NULL,
        selected_time VARCHAR(100) NOT NULL,
        amount NUMERIC(10,2) DEFAULT 0,
        currency VARCHAR(10) DEFAULT 'INR',
        payment_status VARCHAR(50) DEFAULT 'pending', -- pending, completed, failed
        status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, cancelled, completed
        metadata JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`CREATE INDEX IF NOT EXISTS idx_bookings_booking_id ON bookings(booking_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id)`;

    console.log("Database initialized successfully");
    return true;
  } catch (error) {
    console.error("Error initializing database:", error);
    return false;
  }
}

// Helper function to get user profile by Firebase UID
export async function getUserProfile(firebaseUid: string) {
  try {
    const result = await sql`
      SELECT * FROM user_profiles 
      WHERE firebase_uid = ${firebaseUid}
    `;
    return result.rows[0] || null;
  } catch (error) {
    console.error("Error getting user profile:", error);
    return null;
  }
}

// Helper function to create or update user profile
interface UserProfileUpsert {
  firebase_uid: string;
  email: string;
  full_name?: string | null;
  phone?: string | null;
  test1_completed?: boolean;
  test2_completed?: boolean;
  onboarding_completed?: boolean;
}

export async function upsertUserProfile(userData: UserProfileUpsert) {
  try {
    const result = await sql`
      INSERT INTO user_profiles (
        firebase_uid, email, full_name, phone, 
        test1_completed, test2_completed, onboarding_completed
      ) VALUES (
        ${userData.firebase_uid}, ${userData.email}, ${
      userData.full_name || null
    }, 
        ${userData.phone || null}, ${userData.test1_completed || false}, 
        ${userData.test2_completed || false}, ${
      userData.onboarding_completed || false
    }
      )
      ON CONFLICT (firebase_uid) 
      DO UPDATE SET
        email = EXCLUDED.email,
        full_name = EXCLUDED.full_name,
        phone = EXCLUDED.phone,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;
    return result.rows[0];
  } catch (error) {
    console.error("Error upserting user profile:", error);
    return null;
  }
}

// Helper function to create user profile with phone number
export async function createUserProfileWithPhone(userData: {
  firebase_uid: string;
  email: string;
  full_name?: string;
  phone_number: string;
}) {
  try {
    const result = await sql`
      INSERT INTO user_profiles (
        firebase_uid, email, full_name, phone, 
        test1_completed, test2_completed, onboarding_completed
      ) VALUES (
        ${userData.firebase_uid}, ${userData.email}, ${
      userData.full_name || null
    }, 
        ${userData.phone_number}, false, false, false
      )
      ON CONFLICT (firebase_uid) 
      DO UPDATE SET
        email = EXCLUDED.email,
        full_name = EXCLUDED.full_name,
        phone = EXCLUDED.phone,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;
    return result.rows[0];
  } catch (error) {
    console.error("Error creating user profile with phone:", error);
    throw error;
  }
}

// Helper function to update user phone number
export async function updateUserPhone(
  firebaseUid: string,
  phoneNumber: string
) {
  try {
    const result = await sql`
      UPDATE user_profiles 
      SET phone = ${phoneNumber}, updated_at = CURRENT_TIMESTAMP
      WHERE firebase_uid = ${firebaseUid}
      RETURNING *
    `;
    return result.rows[0];
  } catch (error) {
    console.error("Error updating user phone:", error);
    throw error;
  }
}

// Helper function to check if user exists
export async function checkUserExists(firebaseUid: string) {
  try {
    const result = await sql`
      SELECT id, firebase_uid, email, phone FROM user_profiles 
      WHERE firebase_uid = ${firebaseUid}
    `;
    return result.rows[0] || null;
  } catch (error) {
    console.error("Error checking user existence:", error);
    return null;
  }
}

// Helper function to get user status for routing
export async function getUserStatus(firebaseUid: string) {
  try {
    const result = await sql`
      SELECT 
        test1_completed, 
        test2_completed, 
        onboarding_completed,
        CASE 
          WHEN NOT test1_completed THEN '/test1'
          WHEN test1_completed AND NOT test2_completed THEN '/test2'
          WHEN test1_completed AND test2_completed AND NOT onboarding_completed THEN '/dashboard'
          ELSE '/dashboard'
        END as next_step
      FROM user_profiles 
      WHERE firebase_uid = ${firebaseUid}
    `;
    return result.rows[0] || null;
  } catch (error) {
    console.error("Error getting user status:", error);
    return null;
  }
}

// Helper function to generate clinic ID
function generateClinicId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `CLINIC_${timestamp}_${random}`.toUpperCase();
}

// Helper function to generate default credentials
function generateDefaultCredentials(clinicName: string) {
  const username =
    clinicName.toLowerCase().replace(/[^a-z0-9]/g, "") + "_admin";
  const password = Math.random().toString(36).substr(2, 8) + "!";
  return { username, password };
}

// Helper function to create clinic
interface ClinicCreateData {
  clinicName: string;
  ownerName: string;
  phoneNumber: string;
  email?: string | null;
  address: string;
  nearbyCity: string;
  distance?: string | null;
  googleMapsLocation?: string | null;
  photos?: string[];
  doctors?: unknown[];
  services?: unknown[];
}

export async function createClinic(clinicData: ClinicCreateData) {
  try {
    const clinicId = generateClinicId();
    const { username, password } = generateDefaultCredentials(
      clinicData.clinicName
    );

    const result = await sql`
      INSERT INTO clinics (
        clinic_id, clinic_name, owner_name, phone_number, email,
        address, nearby_city, distance, google_maps_location,
        photos, doctors, services, status, default_username, default_password
      ) VALUES (
        ${clinicId}, ${clinicData.clinicName}, ${clinicData.ownerName}, 
        ${clinicData.phoneNumber}, ${clinicData.email || null},
        ${clinicData.address}, ${clinicData.nearbyCity}, ${
      clinicData.distance || null
    },
        ${clinicData.googleMapsLocation || null}, ${JSON.stringify(
      clinicData.photos || []
    )},
        ${JSON.stringify(clinicData.doctors || [])}, ${JSON.stringify(
      clinicData.services || []
    )},
        'pending', ${username}, ${password}
      )
      RETURNING *
    `;
    return result.rows[0];
  } catch (error) {
    console.error("Error creating clinic:", error);
    throw error;
  }
}

// Helper function to get all clinics
export async function getAllClinics() {
  try {
    const result = await sql`
      SELECT * FROM clinics 
      ORDER BY created_at DESC
    `;
    return result.rows;
  } catch (error) {
    console.error("Error getting clinics:", error);
    return [];
  }
}

// Helper function to get clinics by status
export async function getClinicsByStatus(status: string) {
  try {
    const result = await sql`
      SELECT * FROM clinics 
      WHERE status = ${status}
      ORDER BY created_at DESC
    `;
    return result.rows;
  } catch (error) {
    console.error("Error getting clinics by status:", error);
    return [];
  }
}

// Helper function to update clinic status
export async function updateClinicStatus(
  clinicId: string,
  status: string,
  adminNotes?: string
) {
  try {
    const result = await sql`
      UPDATE clinics 
      SET status = ${status}, admin_notes = ${
      adminNotes || null
    }, updated_at = NOW()
      WHERE clinic_id = ${clinicId}
      RETURNING *
    `;
    return result.rows[0];
  } catch (error) {
    console.error("Error updating clinic status:", error);
    throw error;
  }
}

// Helper function to get clinic by ID
export async function getClinicById(clinicId: string) {
  try {
    const result = await sql`
      SELECT * FROM clinics 
      WHERE clinic_id = ${clinicId}
    `;
    const clinic = result.rows[0] || null;

    // Debug logging
    if (clinic) {
      console.log(
        `[getClinicById] ${new Date().toISOString()} - Clinic ${clinicId} status: ${
          clinic.status
        }, updated_at: ${clinic.updated_at}`
      );
    }

    return clinic;
  } catch (error) {
    console.error("Error getting clinic by ID:", error);
    return null;
  }
}

// Helper function to get approved clinics with photos for listing
export async function getApprovedClinicsWithPhotos() {
  try {
    const result = await sql`
      SELECT 
        clinic_id,
        clinic_name,
        owner_name,
        phone_number,
        email,
        address,
        nearby_city,
        distance,
        google_maps_location,
        photos,
        doctors,
        services,
        created_at
      FROM clinics 
      WHERE status = 'approved'
      ORDER BY created_at DESC
    `;
    return result.rows;
  } catch (error) {
    console.error("Error getting approved clinics with photos:", error);
    throw error;
  }
}

// Helper function to search clinics by location with photos
export async function searchClinicsByLocation(city: string) {
  try {
    const result = await sql`
      SELECT 
        clinic_id,
        clinic_name,
        owner_name,
        phone_number,
        address,
        nearby_city,
        distance,
        photos,
        doctors,
        services
      FROM clinics 
      WHERE status = 'approved' 
      AND (nearby_city ILIKE ${`%${city}%`} OR address ILIKE ${`%${city}%`})
      ORDER BY distance ASC NULLS LAST
    `;
    return result.rows;
  } catch (error) {
    console.error("Error searching clinics by location:", error);
    throw error;
  }
}

// Helper function to generate booking ID
function generateBookingId(): string {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).substr(2, 6);
  return `BK_${ts}_${rand}`.toUpperCase();
}

// Create booking
interface BookingCreateData {
  userId?: number | null;
  clinicId?: string | null;
  therapyName: string;
  selectedDate: string; // ISO date string
  selectedTime: string;
  amount?: number;
  currency?: string;
  metadata?: Record<string, unknown>;
}

export async function createBooking(bookingData: BookingCreateData) {
  try {
    const bookingId = generateBookingId();
    const result = await sql`
      INSERT INTO bookings (
        booking_id, user_id, clinic_id, therapy_name, selected_date, selected_time, amount, currency, metadata
      ) VALUES (
        ${bookingId}, ${bookingData.userId || null}, ${
      bookingData.clinicId || null
    }, ${bookingData.therapyName}, ${bookingData.selectedDate}, ${
      bookingData.selectedTime
    }, ${bookingData.amount || 0}, ${
      bookingData.currency || "INR"
    }, ${JSON.stringify(bookingData.metadata || {})}
      ) RETURNING *
    `;
    return result.rows[0];
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
}

// Get booking by booking_id
export async function getBookingById(bookingId: string) {
  try {
    const result = await sql`
      SELECT * FROM bookings WHERE booking_id = ${bookingId}
    `;
    return result.rows[0] || null;
  } catch (error) {
    console.error("Error getting booking by id:", error);
    return null;
  }
}

// Update booking schedule (reschedule)
export async function rescheduleBooking(
  bookingId: string,
  newDate: string,
  newTime: string
) {
  try {
    const result = await sql`
      UPDATE bookings
      SET selected_date = ${newDate}, selected_time = ${newTime}, updated_at = CURRENT_TIMESTAMP
      WHERE booking_id = ${bookingId}
      RETURNING *
    `;
    return result.rows[0] || null;
  } catch (error) {
    console.error("Error rescheduling booking:", error);
    return null;
  }
}

// Cancel booking
export async function cancelBooking(bookingId: string, reason?: string) {
  try {
    const result = await sql`
      UPDATE bookings
      SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP, metadata = jsonb_set(coalesce(metadata, '{}'::jsonb), '{cancel_reason}', ${
        reason || '""'
      })
      WHERE booking_id = ${bookingId}
      RETURNING *
    `;
    return result.rows[0] || null;
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return null;
  }
}

// Update payment status for a booking
export async function updateBookingPaymentStatus(
  bookingId: string,
  paymentStatus: string
) {
  try {
    const result = await sql`
      UPDATE bookings
      SET payment_status = ${paymentStatus}, updated_at = CURRENT_TIMESTAMP
      WHERE booking_id = ${bookingId}
      RETURNING *
    `;
    return result.rows[0] || null;
  } catch (error) {
    console.error("Error updating booking payment status:", error);
    return null;
  }
}

// Get bookings for a clinic
export async function getBookingsByClinic(clinicId: string, limit = 100) {
  try {
    const result = await sql`
      SELECT * FROM bookings WHERE clinic_id = ${clinicId}
      ORDER BY created_at DESC
      LIMIT ${limit}
    `;
    return result.rows || [];
  } catch (error) {
    console.error("Error getting bookings by clinic:", error);
    return [];
  }
}

// Get bookings for a user (by internal user_profiles.id)
export async function getBookingsByUser(userId: number, limit = 100) {
  try {
    const result = await sql`
      SELECT * FROM bookings WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT ${limit}
    `;
    return result.rows || [];
  } catch (error) {
    console.error("Error getting bookings by user:", error);
    return [];
  }
}
