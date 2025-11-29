/**
 * Create Rewards Tables Script
 * Creates all reward-related tables if they don't exist
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

async function createRewardsTables() {
  try {
    console.log("🛡️ Creating rewards tables...\n");

    // Create user_badges table
    console.log("📋 Creating user_badges table...");
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
    console.log("✅ user_badges table created/verified\n");

    // Create user_rewards table
    console.log("📋 Creating user_rewards table...");
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
    console.log("✅ user_rewards table created/verified\n");

    // Create user_contributions table
    console.log("📋 Creating user_contributions table...");
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
    console.log("✅ user_contributions table created/verified\n");

    // Create gift_card_redemptions table
    console.log("📋 Creating gift_card_redemptions table...");
    await sql`
      CREATE TABLE IF NOT EXISTS gift_card_redemptions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        gift_card_type VARCHAR(50) NOT NULL,
        points_used INTEGER NOT NULL,
        gift_card_code VARCHAR(255),
        gift_card_value INTEGER NOT NULL,
        status VARCHAR(20) DEFAULT 'pending' NOT NULL,
        processed_at TIMESTAMP,
        delivered_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
        metadata JSONB
      );
    `;
    console.log("✅ gift_card_redemptions table created/verified\n");

    // Create indexes for better performance
    console.log("📋 Creating indexes...");
    await sql`CREATE INDEX IF NOT EXISTS idx_user_rewards_user_id ON user_rewards(user_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_user_rewards_source ON user_rewards(source, source_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges(user_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_user_contributions_user_id ON user_contributions(user_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_user_contributions_points ON user_contributions(total_points DESC);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_gift_card_redemptions_user_id ON gift_card_redemptions(user_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_gift_card_redemptions_status ON gift_card_redemptions(status);`;
    console.log("✅ Indexes created/verified\n");

    console.log("✅ All rewards tables created successfully!\n");

  } catch (error) {
    console.error("❌ Error creating rewards tables:", error);
    throw error;
  } finally {
    await sql.end();
  }
}

// Run the script
createRewardsTables()
  .then(() => {
    console.log("✅ Script completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });

