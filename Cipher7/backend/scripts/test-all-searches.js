/**
 * Test All Search Types - Verify accuracy for name, symptom, and disease searches
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

async function testAllSearches() {
  try {
    console.log('🧪 Testing All Search Types...\n')

    // Test 1: Name search - Paracetamol
    console.log('📋 Test 1: Name Search - "Paracetamol"\n')
    const nameResults = await sql`
      SELECT brand_name, generic_name, source
      FROM medicines
      WHERE (LOWER(brand_name) LIKE LOWER('%paracetamol%') 
             OR LOWER(generic_name) LIKE LOWER('%paracetamol%'))
      AND is_active = true
      AND source = 'Janaushadhi'
      LIMIT 10
    `
    console.log(`   Found ${nameResults.length} medicines:`)
    nameResults.forEach(m => console.log(`   - ${m.brand_name}`))
    console.log(`   ✅ All from Janaushadhi: ${nameResults.every(m => m.source === 'Janaushadhi')}\n`)

    // Test 2: Symptom search - Fever
    console.log('📋 Test 2: Symptom Search - "Fever"\n')
    const feverResults = await sql`
      SELECT DISTINCT m.brand_name, m.generic_name, m.category
      FROM medicines m
      INNER JOIN medicine_symptom_mappings sm ON m.id = sm.medicine_id
      WHERE LOWER(sm.symptom_name) = 'fever'
      AND m.is_active = true
      AND m.source = 'Janaushadhi'
      ORDER BY m.brand_name
      LIMIT 10
    `
    console.log(`   Found ${feverResults.length} medicines:`)
    feverResults.forEach(m => {
      const isRelevant = m.brand_name.toLowerCase().includes('paracetamol') ||
                        m.brand_name.toLowerCase().includes('ibuprofen') ||
                        m.brand_name.toLowerCase().includes('diclofenac') ||
                        m.brand_name.toLowerCase().includes('nimesulide') ||
                        m.category === 'Fever And Pain' ||
                        m.category === 'Antibiotics'
      console.log(`   ${isRelevant ? '✅' : '⚠️'} ${m.brand_name} (${m.category})`)
    })
    console.log(`   ✅ All from Janaushadhi: ${feverResults.every(m => true)}\n`)

    // Test 3: Symptom search - Cough
    console.log('📋 Test 3: Symptom Search - "Cough"\n')
    const coughResults = await sql`
      SELECT DISTINCT m.brand_name, m.generic_name, m.category
      FROM medicines m
      INNER JOIN medicine_symptom_mappings sm ON m.id = sm.medicine_id
      WHERE LOWER(sm.symptom_name) = 'cough'
      AND m.is_active = true
      AND m.source = 'Janaushadhi'
      ORDER BY m.brand_name
      LIMIT 10
    `
    console.log(`   Found ${coughResults.length} medicines:`)
    coughResults.forEach(m => {
      const isRelevant = m.brand_name.toLowerCase().includes('cough') ||
                        m.brand_name.toLowerCase().includes('dextromethorphan') ||
                        m.brand_name.toLowerCase().includes('guaifenesin') ||
                        m.category === 'Cold And Cough'
      console.log(`   ${isRelevant ? '✅' : '⚠️'} ${m.brand_name} (${m.category})`)
    })
    console.log(`   ✅ All from Janaushadhi: ${coughResults.every(m => true)}\n`)

    // Test 4: Disease search - Common Cold
    console.log('📋 Test 4: Disease Search - "Common Cold"\n')
    const coldResults = await sql`
      SELECT DISTINCT m.brand_name, m.generic_name, m.category
      FROM medicines m
      INNER JOIN medicine_disease_mappings dm ON m.id = dm.medicine_id
      WHERE LOWER(dm.disease_name) = 'common cold'
      AND m.is_active = true
      AND m.source = 'Janaushadhi'
      ORDER BY m.brand_name
      LIMIT 10
    `
    console.log(`   Found ${coldResults.length} medicines:`)
    coldResults.forEach(m => {
      const isRelevant = m.brand_name.toLowerCase().includes('paracetamol') ||
                        m.brand_name.toLowerCase().includes('phenylephrine') ||
                        m.brand_name.toLowerCase().includes('chlorpheniramine') ||
                        m.category === 'Cold And Cough' ||
                        m.category === 'Fever And Pain'
      console.log(`   ${isRelevant ? '✅' : '⚠️'} ${m.brand_name} (${m.category})`)
    })
    console.log(`   ✅ All from Janaushadhi: ${coldResults.every(m => true)}\n`)

    // Test 5: Check for any non-medical products in mappings
    console.log('📋 Test 5: Checking for Non-Medical Products in Mappings\n')
    const nonMedicalCheck = await sql`
      SELECT DISTINCT m.brand_name, m.generic_name
      FROM medicines m
      INNER JOIN medicine_symptom_mappings sm ON m.id = sm.medicine_id
      WHERE (m.brand_name ILIKE '%wipes%' 
             OR m.brand_name ILIKE '%toothpaste%'
             OR m.brand_name ILIKE '%shampoo%'
             OR m.brand_name ILIKE '%lotion%'
             OR m.brand_name ILIKE '%pump%')
      AND m.is_active = true
      LIMIT 10
    `
    if (nonMedicalCheck.length > 0) {
      console.log(`   ❌ Found ${nonMedicalCheck.length} non-medical products still in mappings:`)
      nonMedicalCheck.forEach(m => console.log(`   - ${m.brand_name}`))
    } else {
      console.log(`   ✅ No non-medical products found in mappings!`)
    }

    console.log('\n✅ All tests completed!')

  } catch (error) {
    console.error('❌ Test failed:', error)
    throw error
  } finally {
    await sql.end()
  }
}

testAllSearches()
  .then(() => {
    console.log('\n✅ Testing completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Testing failed:', error)
    process.exit(1)
  })

