/**
 * Direct script to set first user as admin
 * Usage: node packages/backend/scripts/set-admin-direct.js
 */

import postgres from 'postgres'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

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
  
  return `postgresql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`
}

const sql = postgres(getConnectionString())

async function setFirstUserAsAdmin() {
  try {
    console.log('🔍 Looking for users...\n')
    
    // Get all users
    const allUsers = await sql`
      SELECT email, name, role 
      FROM users 
      ORDER BY created_at ASC
    `

    if (allUsers.length === 0) {
      console.log('❌ No users found in database')
      console.log('\n💡 Please register a user first at: http://localhost:3000/register')
      await sql.end()
      process.exit(1)
    }

    console.log(`📋 Found ${allUsers.length} user(s):\n`)
    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} (${user.name || 'N/A'}) - Role: ${user.role}`)
    })

    // Set first user as admin
    const firstUser = allUsers[0]
    
    if (firstUser.role === 'admin') {
      console.log(`\n✅ User "${firstUser.email}" is already an admin`)
      await sql.end()
      process.exit(0)
    }

    // Update first user role to admin
    const [updatedUser] = await sql`
      UPDATE users 
      SET role = 'admin', updated_at = NOW() 
      WHERE email = ${firstUser.email}
      RETURNING id, email, name, role
    `

    console.log(`\n✅ Successfully set user "${updatedUser.email}" as admin`)
    console.log(`   User ID: ${updatedUser.id}`)
    console.log(`   Name: ${updatedUser.name || 'N/A'}`)
    console.log(`   Role: ${updatedUser.role}`)
    console.log('\n🎉 You can now access the admin panel at: http://localhost:3000/admin')
    console.log('   Or click "Admin Panel" in the sidebar after logging in')
    
    await sql.end()
    process.exit(0)
  } catch (error) {
    console.error('❌ Error setting admin:', error)
    await sql.end()
    process.exit(1)
  }
}

setFirstUserAsAdmin()
