/**
 * Verify Fever Search - Check that irrelevant products are gone
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

async function verifyFeverSearch() {
  try {
    console.log('🔍 Verifying Fever Search Results...\n')

    // Check for specific irrelevant products
    const irrelevantProducts = [
      "Little's Soft Cleansing Baby Wipes",
      "Mamaearth 100% Natural Berry Blast Kids Toothpaste",
      "MultiVitamin, Multimineral & Antioxidant Drops"
    ]

    console.log('📋 Checking if irrelevant products are still in fever search...\n')

    for (const productName of irrelevantProducts) {
      const result = await sql`
        SELECT m.id, m.brand_name, sm.symptom_name
        FROM medicines m
        INNER JOIN medicine_symptom_mappings sm ON m.id = sm.medicine_id
        WHERE m.brand_name = ${productName}
        AND LOWER(sm.symptom_name) = 'fever'
        LIMIT 1
      `
      
      if (result.length > 0) {
        console.log(`   ❌ FOUND: ${productName} is still mapped to fever!`)
      } else {
        console.log(`   ✅ REMOVED: ${productName} is no longer mapped to fever`)
      }
    }

    // Get all fever results
    const allFeverResults = await sql`
      SELECT DISTINCT m.brand_name, m.generic_name, m.category
      FROM medicines m
      INNER JOIN medicine_symptom_mappings sm ON m.id = sm.medicine_id
      WHERE LOWER(sm.symptom_name) = 'fever'
      AND m.is_active = true
      AND m.source = 'Janaushadhi'
      ORDER BY m.brand_name
    `

    console.log(`\n📊 Total medicines in fever search: ${allFeverResults.length}\n`)
    console.log('📋 All medicines mapped to "Fever":\n')
    
    allFeverResults.forEach((m, i) => {
      console.log(`   ${i + 1}. ${m.brand_name}`)
      console.log(`      Type: ${m.generic_name} | Category: ${m.category}\n`)
    })

    console.log('✅ Verification completed!')

  } catch (error) {
    console.error('❌ Verification failed:', error)
    throw error
  } finally {
    await sql.end()
  }
}

verifyFeverSearch()
  .then(() => {
    console.log('\n✅ Process completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Process failed:', error)
    process.exit(1)
  })

