/**
 * Script to list all users in the database
 * Usage: node packages/backend/scripts/list-users.js
 */

import { db } from '../src/db/index.js'
import { users } from '../src/db/schema/users.js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') })

async function listUsers() {
  try {
    console.log('📋 Fetching all users...\n')
    
    const allUsers = await db.select({
      email: users.email,
      name: users.name,
      role: users.role,
      isVerified: users.isVerified,
    }).from(users)

    if (allUsers.length === 0) {
      console.log('❌ No users found in database')
      console.log('\n💡 Register a user first at: http://localhost:3000/register')
      process.exit(0)
    }

    console.log(`✅ Found ${allUsers.length} user(s):\n`)
    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. Email: ${user.email}`)
      console.log(`   Name: ${user.name || 'N/A'}`)
      console.log(`   Role: ${user.role}`)
      console.log(`   Verified: ${user.isVerified ? 'Yes' : 'No'}`)
      console.log('')
    })

    console.log('\n💡 To set a user as admin, run:')
    console.log('   node packages/backend/scripts/set-admin.js <email>')
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Error listing users:', error)
    process.exit(1)
  }
}

listUsers()

