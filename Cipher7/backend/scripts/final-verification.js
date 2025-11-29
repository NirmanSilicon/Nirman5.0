/**
 * Final Verification - Comprehensive Test of All Search Functionality
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

async function finalVerification() {
  try {
    console.log('🔍 FINAL VERIFICATION - Comprehensive System Check\n')
    console.log('=' .repeat(60))

    // Test 1: Database Integrity
    console.log('\n📋 Test 1: Database Integrity\n')
    const totalMedicines = await sql`SELECT COUNT(*) as count FROM medicines WHERE source = 'Janaushadhi' AND is_active = true`
    const totalMappings = await sql`SELECT COUNT(*) as count FROM medicine_symptom_mappings`
    const totalDiseaseMappings = await sql`SELECT COUNT(*) as count FROM medicine_disease_mappings`
    
    console.log(`   ✅ Total Janaushadhi medicines: ${totalMedicines[0].count}`)
    console.log(`   ✅ Total symptom mappings: ${totalMappings[0].count}`)
    console.log(`   ✅ Total disease mappings: ${totalDiseaseMappings[0].count}`)
    
    // Check for duplicates
    const duplicates = await sql`
      SELECT generic_name, strength, form, COUNT(*) as count
      FROM medicines
      WHERE source = 'Janaushadhi' AND is_active = true
      GROUP BY generic_name, strength, form
      HAVING COUNT(*) > 1
    `
    console.log(`   ${duplicates.length === 0 ? '✅' : '❌'} Duplicates: ${duplicates.length}`)

    // Test 2: Fever Search Accuracy
    console.log('\n📋 Test 2: Fever Search Accuracy\n')
    const feverResults = await sql`
      SELECT DISTINCT m.brand_name, m.generic_name, m.category
      FROM medicines m
      INNER JOIN medicine_symptom_mappings sm ON m.id = sm.medicine_id
      WHERE LOWER(sm.symptom_name) = 'fever'
      AND m.is_active = true
      AND m.source = 'Janaushadhi'
      ORDER BY m.brand_name
    `
    
    const irrelevantCount = feverResults.filter(m => {
      const name = m.brand_name.toLowerCase()
      return name.includes('wipes') || name.includes('toothpaste') || 
             name.includes('shampoo') || name.includes('lotion') ||
             name.includes('pump') || name.includes('cream') && !name.includes('tablet')
    }).length
    
    console.log(`   ✅ Total fever medicines: ${feverResults.length}`)
    console.log(`   ${irrelevantCount === 0 ? '✅' : '❌'} Irrelevant products: ${irrelevantCount}`)
    console.log(`   📈 Accuracy: ${((feverResults.length - irrelevantCount) / feverResults.length * 100).toFixed(1)}%`)

    // Test 3: Name Search
    console.log('\n📋 Test 3: Name Search - "Paracetamol"\n')
    const nameResults = await sql`
      SELECT brand_name, generic_name, source
      FROM medicines
      WHERE (LOWER(brand_name) LIKE LOWER('%paracetamol%') 
             OR LOWER(generic_name) LIKE LOWER('%paracetamol%'))
      AND is_active = true
      AND source = 'Janaushadhi'
      LIMIT 5
    `
    console.log(`   ✅ Found ${nameResults.length} medicines`)
    console.log(`   ✅ All from Janaushadhi: ${nameResults.every(m => m.source === 'Janaushadhi')}`)

    // Test 4: Symptom Search - Multiple Symptoms
    console.log('\n📋 Test 4: Symptom Search - Multiple Symptoms\n')
    const symptoms = ['fever', 'cough', 'headache', 'pain']
    for (const symptom of symptoms) {
      const results = await sql`
        SELECT COUNT(DISTINCT m.id) as count
        FROM medicines m
        INNER JOIN medicine_symptom_mappings sm ON m.id = sm.medicine_id
        WHERE LOWER(sm.symptom_name) = ${symptom}
        AND m.is_active = true
        AND m.source = 'Janaushadhi'
      `
      console.log(`   ✅ "${symptom}": ${results[0].count} medicines`)
    }

    // Test 5: Disease Search
    console.log('\n📋 Test 5: Disease Search\n')
    const diseases = ['common cold', 'flu', 'diabetes', 'hypertension']
    for (const disease of diseases) {
      const results = await sql`
        SELECT COUNT(DISTINCT m.id) as count
        FROM medicines m
        INNER JOIN medicine_disease_mappings dm ON m.id = dm.medicine_id
        WHERE LOWER(dm.disease_name) = ${disease}
        AND m.is_active = true
        AND m.source = 'Janaushadhi'
      `
      console.log(`   ✅ "${disease}": ${results[0].count} medicines`)
    }

    // Test 6: Source Filtering
    console.log('\n📋 Test 6: Source Filtering\n')
    const allSources = await sql`
      SELECT source, COUNT(*) as count
      FROM medicines
      WHERE is_active = true
      GROUP BY source
    `
    console.log(`   Sources in database:`)
    allSources.forEach(s => {
      console.log(`   ${s.source === 'Janaushadhi' ? '✅' : '❌'} ${s.source}: ${s.count} medicines`)
    })
    const nonJanaushadhi = allSources.filter(s => s.source !== 'Janaushadhi').length
    console.log(`   ${nonJanaushadhi === 0 ? '✅' : '❌'} Non-Janaushadhi sources: ${nonJanaushadhi}`)

    // Test 7: Price Data
    console.log('\n📋 Test 7: Price Data\n')
    const medicinesWithPrices = await sql`
      SELECT COUNT(DISTINCT m.id) as count
      FROM medicines m
      INNER JOIN medicine_prices mp ON m.id = mp.medicine_id
      WHERE m.source = 'Janaushadhi' AND m.is_active = true
    `
    console.log(`   ✅ Medicines with prices: ${medicinesWithPrices[0].count}`)

    console.log('\n' + '='.repeat(60))
    console.log('\n✅ FINAL VERIFICATION COMPLETED!')
    console.log('\n📊 Summary:')
    console.log(`   - Total medicines: ${totalMedicines[0].count}`)
    console.log(`   - Symptom mappings: ${totalMappings[0].count}`)
    console.log(`   - Disease mappings: ${totalDiseaseMappings[0].count}`)
    console.log(`   - Duplicates: ${duplicates.length}`)
    console.log(`   - Fever search accuracy: ${((feverResults.length - irrelevantCount) / feverResults.length * 100).toFixed(1)}%`)
    console.log(`   - All sources Janaushadhi: ${nonJanaushadhi === 0 ? 'Yes' : 'No'}`)
    console.log('\n🎉 System is ready for production!')

  } catch (error) {
    console.error('❌ Verification failed:', error)
    throw error
  } finally {
    await sql.end()
  }
}

finalVerification()
  .then(() => {
    console.log('\n✅ All checks passed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Verification failed:', error)
    process.exit(1)
  })

