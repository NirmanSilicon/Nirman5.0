/**
 * Create Phase 5 Tables Script
 * Creates rewards and badges tables
 */

import postgres from "postgres";
import dotenv from "dotenv";

dotenv.config();

const sql = postgres({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "pathogen",
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "",
});

async function createPhase5Tables() {
  try {
    console.log("🗄️  Creating Phase 5 tables (Rewards & Badges)...\n");

    // 1. Create user_badges table
    console.log("🏅 Creating user_badges table...");
    await sql`
      CREATE TABLE IF NOT EXISTS user_badges (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        badge_type VARCHAR(100) NOT NULL,
        badge_name VARCHAR(255) NOT NULL,
        description VARCHAR(500),
        icon VARCHAR(255),
        earned_at TIMESTAMP DEFAULT NOW() NOT NULL,
        metadata JSONB
      );
    `;
    console.log("  ✅ user_badges table created");

    // 2. Create user_rewards table
    console.log("\n🎁 Creating user_rewards table...");
    await sql`
      CREATE TABLE IF NOT EXISTS user_rewards (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        reward_type VARCHAR(100) NOT NULL,
        points INTEGER DEFAULT 0 NOT NULL,
        reason VARCHAR(255),
        source VARCHAR(100),
        source_id UUID,
        earned_at TIMESTAMP DEFAULT NOW() NOT NULL,
        metadata JSONB
      );
    `;
    console.log("  ✅ user_rewards table created");

    // 3. Create user_contributions table
    console.log("\n📊 Creating user_contributions table...");
    await sql`
      CREATE TABLE IF NOT EXISTS user_contributions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        total_reports INTEGER DEFAULT 0 NOT NULL,
        verified_reports INTEGER DEFAULT 0 NOT NULL,
        total_points INTEGER DEFAULT 0 NOT NULL,
        badges_count INTEGER DEFAULT 0 NOT NULL,
        last_contribution_at TIMESTAMP,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
        UNIQUE(user_id)
      );
    `;
    console.log("  ✅ user_contributions table created");

    // 4. Create indexes
    console.log("\n📇 Creating indexes...");
    
    await sql`
      CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges(user_id);
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_user_badges_type ON user_badges(badge_type);
    `;
    
    await sql`
      CREATE INDEX IF NOT EXISTS idx_user_rewards_user_id ON user_rewards(user_id);
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_user_rewards_source ON user_rewards(source);
    `;
    
    await sql`
      CREATE INDEX IF NOT EXISTS idx_user_contributions_user_id ON user_contributions(user_id);
    `;
    
    console.log("  ✅ All indexes created");

    console.log("\n✅ Phase 5 tables created successfully!");
    console.log("\n📝 Tables created:");
    console.log("   - user_badges");
    console.log("   - user_rewards");
    console.log("   - user_contributions");

  } catch (error) {
    console.error("❌ Error creating Phase 5 tables:", error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

createPhase5Tables();

