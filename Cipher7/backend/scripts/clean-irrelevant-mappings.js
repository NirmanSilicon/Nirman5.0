/**
 * Clean Irrelevant Symptom/Disease Mappings
 * Removes mappings for non-medical products (baby wipes, toothpaste, etc.)
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

async function cleanMappings() {
  try {
    console.log('🧹 Cleaning Irrelevant Symptom/Disease Mappings...\n')

    // Get all medicines
    const allMedicines = await sql`
      SELECT id, brand_name, generic_name, category
      FROM medicines
      WHERE source = 'Janaushadhi'
      AND is_active = true
    `

    console.log(`📋 Checking ${allMedicines.length} medicines...\n`)

    const nonMedicalKeywords = [
      'baby wipes', 'toothpaste', 'shampoo', 'soap', 'cream', 'lotion', 
      'oil', 'powder', 'wipes', 'sanitizer', 'condom', 'pump', 'braces',
      'supports', 'bandage', 'cotton', 'gauze', 'syringe', 'gloves',
      'mask', 'thermometer', 'monitor', 'device', 'kit', 'pack',
      'mamaearth', 'little\'s', 'softens', 'manual', 'breast pump'
    ]

    const medicineKeywords = [
      'tablet', 'capsule', 'syrup', 'suspension', 'injection', 'drops',
      'paracetamol', 'ibuprofen', 'amoxicillin', 'azithromycin', 'diclofenac',
      'omeprazole', 'pantoprazole', 'metformin', 'cetirizine', 'levocetirizine',
      'doxycycline', 'ciprofloxacin', 'cefixime', 'ranitidine', 'domperidone',
      'ondansetron', 'phenylephrine', 'dextromethorphan', 'guaifenesin',
      'nimesulide', 'aspirin', 'acetaminophen'
    ]

    let removedCount = 0
    let keptCount = 0

    for (const med of allMedicines) {
      const name = (med.brand_name || '').toLowerCase()
      const generic = (med.generic_name || '').toLowerCase()
      const combined = `${name} ${generic}`.toLowerCase()

      // Check if it's a non-medical product
      const isNonMedical = nonMedicalKeywords.some(keyword => combined.includes(keyword))
      const hasMedicineKeyword = medicineKeywords.some(keyword => combined.includes(keyword))

      if (isNonMedical && !hasMedicineKeyword) {
        // This is a non-medical product - remove all symptom/disease mappings
        const deletedSymptoms = await sql`
          DELETE FROM medicine_symptom_mappings
          WHERE medicine_id = ${med.id}
        `
        const deletedDiseases = await sql`
          DELETE FROM medicine_disease_mappings
          WHERE medicine_id = ${med.id}
        `
        removedCount++
        console.log(`   ❌ Removed mappings for: ${med.brand_name} (${med.generic_name})`)
      } else {
        keptCount++
      }
    }

    console.log(`\n📊 Summary:`)
    console.log(`   ✅ Kept mappings for: ${keptCount} medicines`)
    console.log(`   ❌ Removed mappings for: ${removedCount} non-medical products`)
    console.log(`\n✅ Cleaning completed!`)

  } catch (error) {
    console.error('❌ Error cleaning mappings:', error)
    throw error
  } finally {
    await sql.end()
  }
}

cleanMappings()
  .then(() => {
    console.log('\n✅ Process completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Process failed:', error)
    process.exit(1)
  })

