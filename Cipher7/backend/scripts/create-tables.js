/**
 * Script to create database tables directly using postgres client
 * Run with: node scripts/create-tables.js
 */

import postgres from "postgres";
import dotenv from "dotenv";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, "..", ".env") });

// Get connection string
function getConnectionString() {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  const dbHost = process.env.DB_HOST || "localhost";
  const dbPort = process.env.DB_PORT || "5432";
  const dbName = process.env.DB_NAME || "pathogen";
  const dbUser = process.env.DB_USER || "postgres";
  const dbPassword = process.env.DB_PASSWORD || "";

  if (!dbPassword) {
    throw new Error(
      "DB_PASSWORD environment variable is required for local database connection"
    );
  }

  return `postgresql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;
}

async function createTables() {
  const connectionString = getConnectionString();
  console.log("🔗 Connecting to database...");

  const sql = postgres(connectionString, { prepare: false });

  try {
    // Create users table
    console.log("📝 Creating users table...");
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        phone VARCHAR(20),
        role VARCHAR(50) NOT NULL DEFAULT 'user',
        is_verified BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `;
    console.log("   ✅ users table created");

    // Create otp_codes table
    console.log("📝 Creating otp_codes table...");
    await sql`
      CREATE TABLE IF NOT EXISTS otp_codes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) NOT NULL,
        code VARCHAR(6) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        used BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `;
    console.log("   ✅ otp_codes table created");

    // Create indexes
    console.log("📝 Creating indexes...");
    try {
      await sql`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`;
      await sql`CREATE INDEX IF NOT EXISTS idx_otp_codes_email ON otp_codes(email)`;
      await sql`CREATE INDEX IF NOT EXISTS idx_otp_codes_email_used ON otp_codes(email, used)`;
      console.log("   ✅ Indexes created");
    } catch (indexError) {
      console.log("   ⚠️  Some indexes may already exist (this is okay)");
    }

    console.log("✅ Database tables created successfully!");
    console.log("   - users table");
    console.log("   - otp_codes table");
    console.log("   - indexes created");

    // Verify tables exist
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'otp_codes')
      ORDER BY table_name;
    `;

    console.log("\n📋 Verified tables:");
    tables.forEach((table) => {
      console.log(`   ✅ ${table.table_name}`);
    });
  } catch (error) {
    console.error("❌ Error creating tables:", error.message);
    if (error.message.includes("already exists")) {
      console.log("ℹ️  Tables may already exist. This is okay.");
    } else {
      throw error;
    }
  } finally {
    await sql.end();
  }
}

// Run the script
createTables()
  .then(() => {
    console.log("\n✅ Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Failed:", error.message);
    process.exit(1);
  });

