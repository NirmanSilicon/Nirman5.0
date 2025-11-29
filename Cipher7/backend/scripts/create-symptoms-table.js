/**
 * Script to create symptoms table
 * Usage: node packages/backend/scripts/create-symptoms-table.js
 */

import postgres from 'postgres'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') })

// Get database connection
function getConnectionString() {
  const dbHost = process.env.DB_HOST || 'localhost'
  const dbPort = process.env.DB_PORT || '5432'
  const dbName = process.env.DB_NAME || 'pathogen'
  const dbUser = process.env.DB_USER || 'postgres'
  const dbPassword = process.env.DB_PASSWORD || ''
  
  if (!dbPassword) {
    throw new Error('DB_PASSWORD environment variable is required')
  }
  
  return `postgresql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`
}

const sql = postgres(getConnectionString())

async function createSymptomsTable() {
  try {
    console.log('📋 Creating symptoms table...\n')
    
    // Create symptoms table
    await sql`
      CREATE TABLE IF NOT EXISTS symptoms (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL UNIQUE,
        category VARCHAR(100),
        description TEXT,
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_by UUID REFERENCES users(id),
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `
    console.log('   ✅ symptoms table created')

    // Create indexes
    console.log('📋 Creating indexes...')
    await sql`CREATE INDEX IF NOT EXISTS idx_symptoms_name ON symptoms(name)`
    await sql`CREATE INDEX IF NOT EXISTS idx_symptoms_category ON symptoms(category)`
    await sql`CREATE INDEX IF NOT EXISTS idx_symptoms_is_active ON symptoms(is_active)`
    console.log('   ✅ Indexes created')

    // Insert default symptoms
    console.log('📋 Inserting default symptoms...')
    await sql`
      INSERT INTO symptoms (name, category, description, is_active) VALUES
      ('Fever', 'General', 'Elevated body temperature', true),
      ('Cough', 'Respiratory', 'Persistent coughing', true),
      ('Headache', 'Neurological', 'Pain in the head', true),
      ('Fatigue', 'General', 'Feeling tired or weak', true),
      ('Body Ache', 'Musculoskeletal', 'Pain in muscles or joints', true),
      ('Sore Throat', 'Respiratory', 'Pain or irritation in the throat', true),
      ('Runny Nose', 'Respiratory', 'Excessive nasal discharge', true),
      ('Nausea', 'Digestive', 'Feeling of sickness with inclination to vomit', true),
      ('Diarrhea', 'Digestive', 'Loose or watery stools', true),
      ('Vomiting', 'Digestive', 'Forceful expulsion of stomach contents', true),
      ('Difficulty Breathing', 'Respiratory', 'Shortness of breath or labored breathing', true),
      ('Chest Pain', 'Cardiovascular', 'Pain or discomfort in the chest area', true),
      ('Loss of Taste', 'General', 'Inability to taste food', true),
      ('Loss of Smell', 'General', 'Inability to smell', true)
      ON CONFLICT (name) DO NOTHING
    `
    console.log('   ✅ Default symptoms inserted')

    // Verify
    const count = await sql`SELECT COUNT(*) as count FROM symptoms`
    console.log(`\n✅ Success! Created symptoms table with ${count[0].count} symptoms`)
    
    await sql.end()
    process.exit(0)
  } catch (error) {
    console.error('❌ Error creating symptoms table:', error)
    await sql.end()
    process.exit(1)
  }
}

createSymptomsTable()

