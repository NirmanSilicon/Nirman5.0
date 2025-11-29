/**
 * Create Phase 4 Tables Script
 * Creates medicine-related tables for Smart Medicine Finder
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

async function createPhase4Tables() {
  try {
    console.log("🗄️  Creating Phase 4 tables (Medicines)...\n");

    // 1. Create medicines table
    console.log("📋 Creating medicines table...");
    await sql`
      CREATE TABLE IF NOT EXISTS medicines (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        generic_name VARCHAR(255) NOT NULL,
        brand_name VARCHAR(255) NOT NULL,
        manufacturer VARCHAR(255),
        composition JSONB NOT NULL,
        form VARCHAR(50),
        strength VARCHAR(100),
        packaging VARCHAR(100),
        indications TEXT,
        category VARCHAR(100),
        schedule VARCHAR(20),
        is_prescription_required BOOLEAN DEFAULT false NOT NULL,
        source VARCHAR(100),
        source_url TEXT,
        is_active BOOLEAN DEFAULT true NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `;
    console.log("  ✅ medicines table created");

    // 2. Create medicine_prices table
    console.log("\n💵 Creating medicine_prices table...");
    await sql`
      CREATE TABLE IF NOT EXISTS medicine_prices (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        medicine_id UUID NOT NULL REFERENCES medicines(id) ON DELETE CASCADE,
        source VARCHAR(100) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        currency VARCHAR(3) DEFAULT 'INR' NOT NULL,
        packaging VARCHAR(100),
        availability VARCHAR(50) DEFAULT 'available',
        location JSONB,
        last_updated TIMESTAMP DEFAULT NOW() NOT NULL,
        source_url TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `;
    console.log("  ✅ medicine_prices table created");

    // 3. Create medicine_alternatives table
    console.log("\n🔄 Creating medicine_alternatives table...");
    await sql`
      CREATE TABLE IF NOT EXISTS medicine_alternatives (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        medicine_id UUID NOT NULL REFERENCES medicines(id) ON DELETE CASCADE,
        alternative_id UUID NOT NULL REFERENCES medicines(id) ON DELETE CASCADE,
        similarity DECIMAL(5, 2),
        reason TEXT,
        is_verified BOOLEAN DEFAULT false NOT NULL,
        verified_by UUID,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        CHECK (medicine_id != alternative_id)
      );
    `;
    console.log("  ✅ medicine_alternatives table created");

    // 4. Create janaushadhi_stores table
    console.log("\n🏥 Creating janaushadhi_stores table...");
    await sql`
      CREATE TABLE IF NOT EXISTS janaushadhi_stores (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        store_name VARCHAR(255) NOT NULL,
        store_code VARCHAR(50),
        address TEXT NOT NULL,
        state VARCHAR(100) NOT NULL,
        district VARCHAR(100),
        city VARCHAR(100),
        pincode VARCHAR(10),
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        phone VARCHAR(20),
        email VARCHAR(255),
        operating_hours JSONB,
        is_active BOOLEAN DEFAULT true NOT NULL,
        source_url TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `;
    console.log("  ✅ janaushadhi_stores table created");

    // 5. Create indexes
    console.log("\n📇 Creating indexes...");
    
    await sql`
      CREATE INDEX IF NOT EXISTS idx_medicines_brand_name ON medicines(brand_name);
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_medicines_generic_name ON medicines(generic_name);
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_medicines_is_active ON medicines(is_active);
    `;
    
    await sql`
      CREATE INDEX IF NOT EXISTS idx_medicine_prices_medicine_id ON medicine_prices(medicine_id);
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_medicine_prices_source ON medicine_prices(source);
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_medicine_prices_availability ON medicine_prices(availability);
    `;
    
    await sql`
      CREATE INDEX IF NOT EXISTS idx_medicine_alternatives_medicine_id ON medicine_alternatives(medicine_id);
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_medicine_alternatives_alternative_id ON medicine_alternatives(alternative_id);
    `;
    
    await sql`
      CREATE INDEX IF NOT EXISTS idx_janaushadhi_stores_state ON janaushadhi_stores(state);
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_janaushadhi_stores_city ON janaushadhi_stores(city);
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_janaushadhi_stores_is_active ON janaushadhi_stores(is_active);
    `;
    
    console.log("  ✅ All indexes created");

    console.log("\n✅ Phase 4 tables created successfully!");
    console.log("\n📝 Tables created:");
    console.log("   - medicines");
    console.log("   - medicine_prices");
    console.log("   - medicine_alternatives");
    console.log("   - janaushadhi_stores");

  } catch (error) {
    console.error("❌ Error creating Phase 4 tables:", error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

createPhase4Tables();

