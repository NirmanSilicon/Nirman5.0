/**
 * Script to create Phase 2 database tables
 * Run with: node scripts/create-phase2-tables.js
 */

import postgres from "postgres";
import dotenv from "dotenv";
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
    console.log("📝 Creating Phase 2 tables...\n");

    // Create diseases table
    console.log("1️⃣  Creating diseases table...");
    await sql`
      CREATE TABLE IF NOT EXISTS diseases (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        scientific_name VARCHAR(255),
        category VARCHAR(100),
        description TEXT,
        symptoms JSONB NOT NULL,
        severity VARCHAR(20),
        source VARCHAR(100),
        source_url TEXT,
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `;
    console.log("   ✅ diseases table created\n");

    // Create disease_outbreaks table
    console.log("2️⃣  Creating disease_outbreaks table...");
    await sql`
      CREATE TABLE IF NOT EXISTS disease_outbreaks (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        disease_id UUID REFERENCES diseases(id) ON DELETE CASCADE,
        state VARCHAR(100) NOT NULL,
        district VARCHAR(100),
        city VARCHAR(100),
        case_count INTEGER NOT NULL DEFAULT 0,
        active_cases INTEGER NOT NULL DEFAULT 0,
        recovered INTEGER DEFAULT 0,
        deaths INTEGER DEFAULT 0,
        risk_level VARCHAR(20) NOT NULL,
        trend VARCHAR(20),
        trend_percentage DECIMAL(5, 2),
        reported_date TIMESTAMP NOT NULL,
        source VARCHAR(100),
        metadata JSONB,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `;
    console.log("   ✅ disease_outbreaks table created\n");

    // Create symptom_reports table
    console.log("3️⃣  Creating symptom_reports table...");
    await sql`
      CREATE TABLE IF NOT EXISTS symptom_reports (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE SET NULL,
        email VARCHAR(255) NOT NULL,
        symptoms JSONB NOT NULL,
        duration_days INTEGER NOT NULL,
        severity VARCHAR(20) NOT NULL,
        location JSONB NOT NULL,
        description TEXT,
        image_url TEXT,
        is_verified BOOLEAN NOT NULL DEFAULT false,
        verified_by UUID REFERENCES users(id) ON DELETE SET NULL,
        verified_at TIMESTAMP,
        status VARCHAR(20) NOT NULL DEFAULT 'pending',
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `;
    console.log("   ✅ symptom_reports table created\n");

    // Create infection_index table
    console.log("4️⃣  Creating infection_index table...");
    await sql`
      CREATE TABLE IF NOT EXISTS infection_index (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        week VARCHAR(10) NOT NULL,
        week_start_date TIMESTAMP NOT NULL,
        week_end_date TIMESTAMP NOT NULL,
        state VARCHAR(100),
        district VARCHAR(100),
        index_value DECIMAL(5, 2) NOT NULL,
        total_reports INTEGER NOT NULL DEFAULT 0,
        disease_count INTEGER NOT NULL DEFAULT 0,
        trend_data JSONB,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `;
    console.log("   ✅ infection_index table created\n");

    // Create user_risk_scores table
    console.log("5️⃣  Creating user_risk_scores table...");
    await sql`
      CREATE TABLE IF NOT EXISTS user_risk_scores (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
        score INTEGER NOT NULL,
        risk_level VARCHAR(20) NOT NULL,
        factors JSONB NOT NULL,
        calculated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        week VARCHAR(10)
      )
    `;
    console.log("   ✅ user_risk_scores table created\n");

    // Create symptom_clusters table
    console.log("6️⃣  Creating symptom_clusters table...");
    await sql`
      CREATE TABLE IF NOT EXISTS symptom_clusters (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        cluster_name VARCHAR(255) NOT NULL,
        symptoms JSONB NOT NULL,
        frequency INTEGER NOT NULL DEFAULT 0,
        location JSONB,
        related_disease_id UUID REFERENCES diseases(id) ON DELETE SET NULL,
        confidence DECIMAL(5, 2),
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `;
    console.log("   ✅ symptom_clusters table created\n");

    // Create indexes
    console.log("7️⃣  Creating indexes...");
    await sql`CREATE INDEX IF NOT EXISTS idx_diseases_name ON diseases(name)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_diseases_category ON diseases(category)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_diseases_active ON diseases(is_active)`;
    
    await sql`CREATE INDEX IF NOT EXISTS idx_outbreaks_disease_id ON disease_outbreaks(disease_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_outbreaks_state ON disease_outbreaks(state)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_outbreaks_risk_level ON disease_outbreaks(risk_level)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_outbreaks_reported_date ON disease_outbreaks(reported_date)`;
    
    await sql`CREATE INDEX IF NOT EXISTS idx_symptom_reports_user_id ON symptom_reports(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_symptom_reports_email ON symptom_reports(email)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_symptom_reports_status ON symptom_reports(status)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_symptom_reports_created_at ON symptom_reports(created_at)`;
    
    await sql`CREATE INDEX IF NOT EXISTS idx_infection_index_week ON infection_index(week)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_infection_index_state ON infection_index(state)`;
    
    await sql`CREATE INDEX IF NOT EXISTS idx_user_risk_scores_user_id ON user_risk_scores(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_user_risk_scores_week ON user_risk_scores(week)`;
    
    await sql`CREATE INDEX IF NOT EXISTS idx_symptom_clusters_related_disease ON symptom_clusters(related_disease_id)`;
    
    console.log("   ✅ All indexes created\n");

    // Verify tables exist
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('diseases', 'disease_outbreaks', 'symptom_reports', 'infection_index', 'user_risk_scores', 'symptom_clusters')
      ORDER BY table_name;
    `;

    console.log("📋 Verified Phase 2 tables:");
    tables.forEach((table) => {
      console.log(`   ✅ ${table.table_name}`);
    });

    console.log("\n✅ Phase 2 database tables created successfully!");
    console.log("\n📊 Summary:");
    console.log("   - diseases (disease catalog)");
    console.log("   - disease_outbreaks (regional outbreak data)");
    console.log("   - symptom_reports (citizen submissions)");
    console.log("   - infection_index (weekly trends)");
    console.log("   - user_risk_scores (individual risk assessment)");
    console.log("   - symptom_clusters (AI analysis data)");
  } catch (error) {
    console.error("❌ Error creating tables:", error.message);
    if (error.message.includes("already exists")) {
      console.log("ℹ️  Some tables may already exist. This is okay.");
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

