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

async function addEmailNotificationField() {
  try {
    console.log("🔄 Adding email_notifications_enabled field to users table...");

    // Check if column already exists
    const checkColumn = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='users' AND column_name='email_notifications_enabled'
    `;

    if (checkColumn.length > 0) {
      console.log("✅ Column 'email_notifications_enabled' already exists");
      return;
    }

    // Add email_notifications_enabled column
    await sql`
      ALTER TABLE users 
      ADD COLUMN email_notifications_enabled BOOLEAN NOT NULL DEFAULT true
    `;

    console.log("✅ Added 'email_notifications_enabled' column to users table");

    // Create index for better query performance
    await sql`
      CREATE INDEX IF NOT EXISTS idx_users_email_notifications 
      ON users(email_notifications_enabled) 
      WHERE email_notifications_enabled = true
    `;

    console.log("✅ Created index on email_notifications_enabled");

    console.log("\n✅ Migration completed successfully!");
  } catch (error) {
    console.error("❌ Migration error:", error.message);
    throw error;
  } finally {
    await sql.end();
  }
}

addEmailNotificationField()
  .then(() => {
    console.log("✅ Script completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });

