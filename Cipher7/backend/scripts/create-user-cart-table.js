/**
 * Create user_cart table for saving medicines
 */

import dotenv from 'dotenv'
import postgres from 'postgres'

dotenv.config()

const sql = postgres({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'pathogen',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
})

async function createUserCartTable() {
  try {
    console.log('📋 Creating user_cart table...\n')

    await sql`
      CREATE TABLE IF NOT EXISTS user_cart (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        medicine_id UUID NOT NULL REFERENCES medicines(id) ON DELETE CASCADE,
        quantity INTEGER DEFAULT 1 NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        UNIQUE(user_id, medicine_id)
      )
    `

    await sql`
      CREATE INDEX IF NOT EXISTS idx_user_cart_user_id ON user_cart(user_id)
    `

    await sql`
      CREATE INDEX IF NOT EXISTS idx_user_cart_medicine_id ON user_cart(medicine_id)
    `

    console.log('✅ user_cart table created successfully!')
  } catch (error) {
    console.error('❌ Error creating user_cart table:', error)
    throw error
  } finally {
    await sql.end()
  }
}

createUserCartTable()
  .then(() => {
    console.log('\n✅ Process completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Process failed:', error)
    process.exit(1)
  })

