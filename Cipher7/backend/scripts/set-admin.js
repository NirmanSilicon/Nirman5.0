/**
 * Script to set a user as admin
 * Usage: node packages/backend/scripts/set-admin.js <email>
 */

import { db } from '../src/db/index.js'
import { users } from '../src/db/schema/users.js'
import { eq } from 'drizzle-orm'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') })

async function setAdmin(email) {
  try {
    console.log(`🔍 Looking for user with email: ${email}`)
    
    // Find user by email
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    if (!user) {
      console.error(`❌ User with email "${email}" not found`)
      console.log('\n💡 Available users:')
      const allUsers = await db.select({ email: users.email, role: users.role }).from(users)
      allUsers.forEach(u => console.log(`   - ${u.email} (${u.role})`))
      process.exit(1)
    }

    if (user.role === 'admin') {
      console.log(`✅ User "${email}" is already an admin`)
      process.exit(0)
    }

    // Update user role to admin
    const [updatedUser] = await db
      .update(users)
      .set({ 
        role: 'admin',
        updatedAt: new Date()
      })
      .where(eq(users.email, email))
      .returning()

    console.log(`✅ Successfully set user "${email}" as admin`)
    console.log(`   User ID: ${updatedUser.id}`)
    console.log(`   Name: ${updatedUser.name || 'N/A'}`)
    console.log(`   Role: ${updatedUser.role}`)
    console.log('\n🎉 You can now access the admin panel at: http://localhost:3000/dashboard/reports')
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Error setting admin:', error)
    process.exit(1)
  }
}

// Get email from command line arguments
const email = process.argv[2]

if (!email) {
  console.error('❌ Please provide an email address')
  console.log('\nUsage: node packages/backend/scripts/set-admin.js <email>')
  console.log('Example: node packages/backend/scripts/set-admin.js admin@example.com')
  process.exit(1)
}

setAdmin(email)

