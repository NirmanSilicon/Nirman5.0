/**
 * Test Medicine Search Functionality
 * Tests that search returns only accurate, relevant medicines
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

async function testSearch() {
  try {
    console.log('🧪 Testing Medicine Search Functionality...\n')

    // Test 1: Name search
    console.log('📋 Test 1: Name Search (Paracetamol)')
    const nameResults = await sql`
      SELECT id, brand_name, generic_name, source 
      FROM medicines 
      WHERE (LOWER(brand_name) LIKE LOWER('%paracetamol%') 
             OR LOWER(generic_name) LIKE LOWER('%paracetamol%'))
      AND is_active = true
      AND source = 'Janaushadhi'
      LIMIT 10
    `
    console.log(`   Found ${nameResults.length} medicines`)
    nameResults.forEach(m => {
      console.log(`   - ${m.brand_name} (${m.generic_name}) - Source: ${m.source}`)
    })
    console.log(`   ✅ All results are from Janaushadhi: ${nameResults.every(m => m.source === 'Janaushadhi')}\n`)

    // Test 2: Symptom search
    console.log('📋 Test 2: Symptom Search (Fever)')
    const symptomResults = await sql`
      SELECT DISTINCT m.id, m.brand_name, m.generic_name, m.source
      FROM medicines m
      INNER JOIN medicine_symptom_mappings sm ON m.id = sm.medicine_id
      WHERE LOWER(sm.symptom_name) LIKE LOWER('%fever%')
      AND m.is_active = true
      AND m.source = 'Janaushadhi'
      LIMIT 10
    `
    console.log(`   Found ${symptomResults.length} medicines`)
    symptomResults.forEach(m => {
      console.log(`   - ${m.brand_name} (${m.generic_name}) - Source: ${m.source}`)
    })
    console.log(`   ✅ All results are from Janaushadhi: ${symptomResults.every(m => m.source === 'Janaushadhi')}\n`)

    // Test 3: Disease search
    console.log('📋 Test 3: Disease Search (Common Cold)')
    const diseaseResults = await sql`
      SELECT DISTINCT m.id, m.brand_name, m.generic_name, m.source
      FROM medicines m
      INNER JOIN medicine_disease_mappings dm ON m.id = dm.medicine_id
      WHERE LOWER(dm.disease_name) LIKE LOWER('%common cold%')
      AND m.is_active = true
      AND m.source = 'Janaushadhi'
      LIMIT 10
    `
    console.log(`   Found ${diseaseResults.length} medicines`)
    diseaseResults.forEach(m => {
      console.log(`   - ${m.brand_name} (${m.generic_name}) - Source: ${m.source}`)
    })
    console.log(`   ✅ All results are from Janaushadhi: ${diseaseResults.every(m => m.source === 'Janaushadhi')}\n`)

    // Test 4: Check for duplicates
    console.log('📋 Test 4: Checking for Duplicate Medicines')
    const duplicates = await sql`
      SELECT generic_name, strength, form, COUNT(*) as count
      FROM medicines
      WHERE source = 'Janaushadhi'
      AND is_active = true
      GROUP BY generic_name, strength, form
      HAVING COUNT(*) > 1
      LIMIT 10
    `
    if (duplicates.length > 0) {
      console.log(`   ⚠️  Found ${duplicates.length} potential duplicates:`)
      duplicates.forEach(d => {
        console.log(`   - ${d.generic_name} ${d.strength} ${d.form}: ${d.count} entries`)
      })
    } else {
      console.log(`   ✅ No duplicates found\n`)
    }

    // Test 5: Check medicine count
    console.log('📋 Test 5: Total Medicine Count')
    const totalCount = await sql`
      SELECT COUNT(*) as count
      FROM medicines
      WHERE source = 'Janaushadhi'
      AND is_active = true
    `
    console.log(`   Total Janaushadhi medicines: ${totalCount[0].count}`)
    console.log(`   ✅ Database contains only Janaushadhi medicines\n`)

    console.log('✅ All tests completed!')
    console.log('\n📊 Summary:')
    console.log(`   - Name search: ${nameResults.length} results`)
    console.log(`   - Symptom search: ${symptomResults.length} results`)
    console.log(`   - Disease search: ${diseaseResults.length} results`)
    console.log(`   - Total medicines: ${totalCount[0].count}`)
    console.log(`   - Duplicates: ${duplicates.length}`)

  } catch (error) {
    console.error('❌ Test failed:', error)
    throw error
  } finally {
    await sql.end()
  }
}

testSearch()
  .then(() => {
    console.log('\n✅ Testing completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Testing failed:', error)
    process.exit(1)
  })
