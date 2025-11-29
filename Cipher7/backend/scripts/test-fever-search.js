/**
 * Test Fever Search - Verify only relevant medicines are returned
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

async function testFeverSearch() {
  try {
    console.log('🧪 Testing Fever Search - Verifying Only Relevant Medicines...\n')

    // Test: Search for "fever" symptom
    console.log('📋 Searching for medicines mapped to "Fever" symptom...')
    const feverResults = await sql`
      SELECT DISTINCT 
        m.id, 
        m.brand_name, 
        m.generic_name, 
        m.category,
        sm.symptom_name,
        m.source
      FROM medicines m
      INNER JOIN medicine_symptom_mappings sm ON m.id = sm.medicine_id
      WHERE LOWER(sm.symptom_name) = 'fever'
      AND m.is_active = true
      AND m.source = 'Janaushadhi'
      ORDER BY m.brand_name
      LIMIT 20
    `
    
    console.log(`\n✅ Found ${feverResults.length} medicines mapped to "Fever":\n`)
    
    let relevantCount = 0
    let irrelevantCount = 0
    
    feverResults.forEach((m, i) => {
      const name = m.brand_name.toLowerCase()
      const generic = m.generic_name.toLowerCase()
      
      // Check if it's a relevant medicine for fever
      const isRelevant = 
        name.includes('paracetamol') ||
        name.includes('acetaminophen') ||
        name.includes('ibuprofen') ||
        name.includes('diclofenac') ||
        name.includes('nimesulide') ||
        name.includes('aspirin') ||
        generic.includes('paracetamol') ||
        generic.includes('acetaminophen') ||
        generic.includes('ibuprofen') ||
        generic.includes('diclofenac') ||
        generic.includes('nimesulide') ||
        generic.includes('aspirin') ||
        name.includes('fever') ||
        name.includes('tablet') && (name.includes('500') || name.includes('325'))
      
      // Check if it's irrelevant (baby care products, beauty products, etc.)
      const isIrrelevant = 
        name.includes('wipes') ||
        name.includes('toothpaste') ||
        name.includes('shampoo') ||
        name.includes('soap') ||
        name.includes('cream') && !name.includes('tablet') ||
        name.includes('lotion') ||
        name.includes('oil') && !name.includes('tablet') ||
        name.includes('powder') && !name.includes('tablet') ||
        name.includes('sanitizer') ||
        name.includes('condom') ||
        name.includes('pump') ||
        name.includes('braces') ||
        name.includes('supports') ||
        name.includes('bandage') ||
        name.includes('cotton') ||
        name.includes('gauze') ||
        name.includes('syringe') ||
        name.includes('gloves') ||
        name.includes('mask') ||
        name.includes('thermometer') ||
        name.includes('monitor') ||
        name.includes('device') ||
        name.includes('kit') ||
        name.includes('pack') && !name.includes('tablet')
      
      if (isIrrelevant) {
        irrelevantCount++
        console.log(`   ❌ ${i + 1}. ${m.brand_name} (${m.generic_name}) - Category: ${m.category}`)
        console.log(`      ⚠️  IRRELEVANT: This is not a medicine for fever!`)
      } else if (isRelevant) {
        relevantCount++
        console.log(`   ✅ ${i + 1}. ${m.brand_name} (${m.generic_name}) - Category: ${m.category}`)
      } else {
        // Check category
        if (m.category === 'Fever and Pain' || m.category === 'Antibiotics') {
          relevantCount++
          console.log(`   ✅ ${i + 1}. ${m.brand_name} (${m.generic_name}) - Category: ${m.category}`)
        } else {
          irrelevantCount++
          console.log(`   ⚠️  ${i + 1}. ${m.brand_name} (${m.generic_name}) - Category: ${m.category}`)
          console.log(`      ⚠️  QUESTIONABLE: May not be directly for fever`)
        }
      }
    })
    
    console.log(`\n📊 Summary:`)
    console.log(`   ✅ Relevant medicines: ${relevantCount}`)
    console.log(`   ❌ Irrelevant medicines: ${irrelevantCount}`)
    console.log(`   📈 Accuracy: ${((relevantCount / feverResults.length) * 100).toFixed(1)}%`)
    
    if (irrelevantCount > 0) {
      console.log(`\n⚠️  WARNING: Found ${irrelevantCount} irrelevant medicines in fever search results!`)
      console.log(`   These should be removed from the symptom mappings.`)
    } else {
      console.log(`\n✅ SUCCESS: All medicines in fever search are relevant!`)
    }

  } catch (error) {
    console.error('❌ Test failed:', error)
    throw error
  } finally {
    await sql.end()
  }
}

testFeverSearch()
  .then(() => {
    console.log('\n✅ Testing completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Testing failed:', error)
    process.exit(1)
  })

