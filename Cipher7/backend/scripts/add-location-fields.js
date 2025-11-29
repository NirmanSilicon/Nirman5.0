/**
 * Add location fields to users table
 * Run with: node scripts/add-location-fields.js
 */

import postgres from "postgres";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, "..", ".env") });

// Support both connection string and individual parameters (same as drizzle.config.ts)
function getConnectionString() {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  // Build from individual parameters for local database
  const dbHost = process.env.DB_HOST || "localhost";
  const dbPort = process.env.DB_PORT || "5432";
  const dbName = process.env.DB_NAME || "pathogen";
  const dbUser = process.env.DB_USER || "postgres";
  const dbPassword = process.env.DB_PASSWORD || "";

  if (!dbPassword) {
    throw new Error(
      "Either DATABASE_URL or DB_PASSWORD must be set in environment variables"
    );
  }

  return `postgresql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;
}

const DATABASE_URL = getConnectionString();
const sql = postgres(DATABASE_URL);

async function addLocationFields() {
  try {
    console.log("🔄 Adding location fields to users table...");

    // Add location columns if they don't exist
    await sql`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
      ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8),
      ADD COLUMN IF NOT EXISTS address TEXT,
      ADD COLUMN IF NOT EXISTS state VARCHAR(100),
      ADD COLUMN IF NOT EXISTS district VARCHAR(100),
      ADD COLUMN IF NOT EXISTS city VARCHAR(100),
      ADD COLUMN IF NOT EXISTS pincode VARCHAR(10);
    `;

    console.log("✅ Location fields added successfully!");
    console.log("\n📋 Added fields:");
    console.log("   - latitude (DECIMAL)");
    console.log("   - longitude (DECIMAL)");
    console.log("   - address (TEXT)");
    console.log("   - state (VARCHAR)");
    console.log("   - district (VARCHAR)");
    console.log("   - city (VARCHAR)");
    console.log("   - pincode (VARCHAR)");
  } catch (error) {
    console.error("❌ Error adding location fields:", error.message);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

addLocationFields();

