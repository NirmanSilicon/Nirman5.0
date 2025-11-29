/**
 * Large-scale Medicine Data Seeding Script
 * Seeds medicines from Janaushadhi and DavaIndia with symptom/disease mappings
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

// Comprehensive medicine data with symptoms and diseases
const medicineData = [
  // Fever & Pain Relief
  {
    genericName: 'Paracetamol',
    brandNames: [
      { name: 'Paracetamol 500mg', source: 'Janaushadhi', price: 2.50, packaging: '10 Tablets' },
      { name: 'Crocin', source: 'DavaIndia', price: 15.00, packaging: '10 Tablets' },
      { name: 'Calpol 500', source: 'DavaIndia', price: 18.00, packaging: '10 Tablets' },
    ],
    symptoms: ['Fever', 'Headache', 'Body Ache', 'Pain'],
    diseases: ['Common Cold', 'Flu', 'Viral Fever', 'Dengue'],
    category: 'Antipyretic',
    form: 'Tablet',
    strength: '500mg',
    indications: 'Fever, mild to moderate pain',
    isPrescriptionRequired: false,
  },
  {
    genericName: 'Ibuprofen',
    brandNames: [
      { name: 'Ibuprofen 400mg', source: 'Janaushadhi', price: 3.50, packaging: '10 Tablets' },
      { name: 'Brufen', source: 'DavaIndia', price: 25.00, packaging: '10 Tablets' },
    ],
    symptoms: ['Fever', 'Body Ache', 'Pain', 'Inflammation'],
    diseases: ['Arthritis', 'Muscle Pain', 'Headache'],
    category: 'NSAID',
    form: 'Tablet',
    strength: '400mg',
    indications: 'Pain, inflammation, fever',
    isPrescriptionRequired: false,
  },

  // Cough & Cold
  {
    genericName: 'Cetirizine',
    brandNames: [
      { name: 'Cetirizine 10mg', source: 'Janaushadhi', price: 2.00, packaging: '10 Tablets' },
      { name: 'Cetriz', source: 'DavaIndia', price: 12.00, packaging: '10 Tablets' },
      { name: 'Zyrtec', source: 'DavaIndia', price: 45.00, packaging: '10 Tablets' },
    ],
    symptoms: ['Runny Nose', 'Sneezing', 'Allergic Rhinitis'],
    diseases: ['Common Cold', 'Allergies', 'Hay Fever'],
    category: 'Antihistamine',
    form: 'Tablet',
    strength: '10mg',
    indications: 'Allergic rhinitis, urticaria',
    isPrescriptionRequired: false,
  },
  {
    genericName: 'Dextromethorphan',
    brandNames: [
      { name: 'Dextromethorphan Syrup', source: 'Janaushadhi', price: 35.00, packaging: '100ml' },
      { name: 'Benadryl DR', source: 'DavaIndia', price: 85.00, packaging: '100ml' },
    ],
    symptoms: ['Cough', 'Dry Cough'],
    diseases: ['Common Cold', 'Bronchitis'],
    category: 'Antitussive',
    form: 'Syrup',
    strength: '15mg/5ml',
    indications: 'Dry cough',
    isPrescriptionRequired: false,
  },
  {
    genericName: 'Guaifenesin',
    brandNames: [
      { name: 'Guaifenesin Syrup', source: 'Janaushadhi', price: 40.00, packaging: '100ml' },
      { name: 'Mucinex', source: 'DavaIndia', price: 120.00, packaging: '100ml' },
    ],
    symptoms: ['Cough', 'Chest Congestion'],
    diseases: ['Common Cold', 'Bronchitis'],
    category: 'Expectorant',
    form: 'Syrup',
    strength: '100mg/5ml',
    indications: 'Productive cough, chest congestion',
    isPrescriptionRequired: false,
  },
  {
    genericName: 'Phenylephrine',
    brandNames: [
      { name: 'Phenylephrine 5mg', source: 'Janaushadhi', price: 3.00, packaging: '10 Tablets' },
      { name: 'Sinarest', source: 'DavaIndia', price: 28.00, packaging: '10 Tablets' },
    ],
    symptoms: ['Runny Nose', 'Nasal Congestion'],
    diseases: ['Common Cold', 'Sinusitis'],
    category: 'Decongestant',
    form: 'Tablet',
    strength: '5mg',
    indications: 'Nasal congestion',
    isPrescriptionRequired: false,
  },

  // Sore Throat
  {
    genericName: 'Amoxicillin',
    brandNames: [
      { name: 'Amoxicillin 500mg', source: 'Janaushadhi', price: 8.50, packaging: '10 Capsules' },
      { name: 'Amoxil', source: 'DavaIndia', price: 65.00, packaging: '10 Capsules' },
      { name: 'Mox 500', source: 'DavaIndia', price: 55.00, packaging: '10 Capsules' },
    ],
    symptoms: ['Sore Throat', 'Fever', 'Cough'],
    diseases: ['Bacterial Infection', 'Tonsillitis', 'Bronchitis', 'Pneumonia'],
    category: 'Antibiotic',
    form: 'Capsule',
    strength: '500mg',
    indications: 'Bacterial infections',
    isPrescriptionRequired: true,
  },
  {
    genericName: 'Azithromycin',
    brandNames: [
      { name: 'Azithromycin 500mg', source: 'Janaushadhi', price: 12.00, packaging: '3 Tablets' },
      { name: 'Azithral', source: 'DavaIndia', price: 95.00, packaging: '3 Tablets' },
      { name: 'Zithromax', source: 'DavaIndia', price: 180.00, packaging: '3 Tablets' },
    ],
    symptoms: ['Sore Throat', 'Cough', 'Fever'],
    diseases: ['Bacterial Infection', 'Pneumonia', 'Bronchitis'],
    category: 'Antibiotic',
    form: 'Tablet',
    strength: '500mg',
    indications: 'Bacterial infections, respiratory tract infections',
    isPrescriptionRequired: true,
  },

  // Digestive Issues
  {
    genericName: 'Omeprazole',
    brandNames: [
      { name: 'Omeprazole 20mg', source: 'Janaushadhi', price: 4.50, packaging: '10 Capsules' },
      { name: 'Omez', source: 'DavaIndia', price: 35.00, packaging: '10 Capsules' },
      { name: 'Losec', source: 'DavaIndia', price: 120.00, packaging: '10 Capsules' },
    ],
    symptoms: ['Acidity', 'Heartburn', 'Stomach Pain'],
    diseases: ['GERD', 'Peptic Ulcer', 'Gastritis'],
    category: 'PPI',
    form: 'Capsule',
    strength: '20mg',
    indications: 'Acid reflux, peptic ulcer',
    isPrescriptionRequired: false,
  },
  {
    genericName: 'Pantoprazole',
    brandNames: [
      { name: 'Pantoprazole 40mg', source: 'Janaushadhi', price: 5.00, packaging: '10 Tablets' },
      { name: 'Pantocid', source: 'DavaIndia', price: 42.00, packaging: '10 Tablets' },
    ],
    symptoms: ['Acidity', 'Heartburn'],
    diseases: ['GERD', 'Peptic Ulcer'],
    category: 'PPI',
    form: 'Tablet',
    strength: '40mg',
    indications: 'Acid reflux, peptic ulcer',
    isPrescriptionRequired: false,
  },
  {
    genericName: 'Domperidone',
    brandNames: [
      { name: 'Domperidone 10mg', source: 'Janaushadhi', price: 3.00, packaging: '10 Tablets' },
      { name: 'Domstal', source: 'DavaIndia', price: 22.00, packaging: '10 Tablets' },
    ],
    symptoms: ['Nausea', 'Vomiting'],
    diseases: ['Gastritis', 'Indigestion'],
    category: 'Antiemetic',
    form: 'Tablet',
    strength: '10mg',
    indications: 'Nausea, vomiting',
    isPrescriptionRequired: false,
  },
  {
    genericName: 'Loperamide',
    brandNames: [
      { name: 'Loperamide 2mg', source: 'Janaushadhi', price: 2.50, packaging: '10 Tablets' },
      { name: 'Imodium', source: 'DavaIndia', price: 28.00, packaging: '10 Tablets' },
    ],
    symptoms: ['Diarrhea'],
    diseases: ['Gastroenteritis', 'Traveler\'s Diarrhea'],
    category: 'Antidiarrheal',
    form: 'Tablet',
    strength: '2mg',
    indications: 'Diarrhea',
    isPrescriptionRequired: false,
  },
  {
    genericName: 'Metronidazole',
    brandNames: [
      { name: 'Metronidazole 400mg', source: 'Janaushadhi', price: 6.00, packaging: '10 Tablets' },
      { name: 'Flagyl', source: 'DavaIndia', price: 48.00, packaging: '10 Tablets' },
    ],
    symptoms: ['Diarrhea', 'Stomach Pain'],
    diseases: ['Gastroenteritis', 'Amoebiasis', 'Giardiasis'],
    category: 'Antibiotic',
    form: 'Tablet',
    strength: '400mg',
    indications: 'Bacterial and protozoal infections',
    isPrescriptionRequired: true,
  },

  // Respiratory Issues
  {
    genericName: 'Salbutamol',
    brandNames: [
      { name: 'Salbutamol Inhaler', source: 'Janaushadhi', price: 45.00, packaging: '200 Doses' },
      { name: 'Asthalin', source: 'DavaIndia', price: 125.00, packaging: '200 Doses' },
      { name: 'Ventolin', source: 'DavaIndia', price: 180.00, packaging: '200 Doses' },
    ],
    symptoms: ['Difficulty Breathing', 'Wheezing', 'Chest Tightness'],
    diseases: ['Asthma', 'COPD', 'Bronchitis'],
    category: 'Bronchodilator',
    form: 'Inhaler',
    strength: '100mcg',
    indications: 'Asthma, bronchospasm',
    isPrescriptionRequired: true,
  },
  {
    genericName: 'Montelukast',
    brandNames: [
      { name: 'Montelukast 10mg', source: 'Janaushadhi', price: 5.50, packaging: '10 Tablets' },
      { name: 'Montair', source: 'DavaIndia', price: 65.00, packaging: '10 Tablets' },
    ],
    symptoms: ['Difficulty Breathing', 'Wheezing'],
    diseases: ['Asthma', 'Allergic Rhinitis'],
    category: 'Leukotriene Receptor Antagonist',
    form: 'Tablet',
    strength: '10mg',
    indications: 'Asthma, allergic rhinitis',
    isPrescriptionRequired: true,
  },

  // Headache & Neurological
  {
    genericName: 'Sumatriptan',
    brandNames: [
      { name: 'Sumatriptan 50mg', source: 'Janaushadhi', price: 25.00, packaging: '1 Tablet' },
      { name: 'Suminat', source: 'DavaIndia', price: 95.00, packaging: '1 Tablet' },
    ],
    symptoms: ['Headache', 'Migraine'],
    diseases: ['Migraine'],
    category: 'Triptan',
    form: 'Tablet',
    strength: '50mg',
    indications: 'Migraine attacks',
    isPrescriptionRequired: true,
  },

  // Loss of Taste/Smell
  {
    genericName: 'Zinc Sulfate',
    brandNames: [
      { name: 'Zinc Sulfate 20mg', source: 'Janaushadhi', price: 3.50, packaging: '10 Tablets' },
      { name: 'Zinconia', source: 'DavaIndia', price: 28.00, packaging: '10 Tablets' },
    ],
    symptoms: ['Loss of Taste', 'Loss of Smell'],
    diseases: ['Common Cold', 'COVID-19', 'Viral Infection'],
    category: 'Mineral Supplement',
    form: 'Tablet',
    strength: '20mg',
    indications: 'Zinc deficiency, immune support',
    isPrescriptionRequired: false,
  },

  // Chest Pain
  {
    genericName: 'Aspirin',
    brandNames: [
      { name: 'Aspirin 75mg', source: 'Janaushadhi', price: 2.00, packaging: '10 Tablets' },
      { name: 'Ecosprin', source: 'DavaIndia', price: 12.00, packaging: '10 Tablets' },
    ],
    symptoms: ['Chest Pain', 'Fever'],
    diseases: ['Heart Disease', 'Fever'],
    category: 'Antiplatelet',
    form: 'Tablet',
    strength: '75mg',
    indications: 'Cardiovascular protection, fever',
    isPrescriptionRequired: false,
  },
  {
    genericName: 'Atorvastatin',
    brandNames: [
      { name: 'Atorvastatin 10mg', source: 'Janaushadhi', price: 6.50, packaging: '10 Tablets' },
      { name: 'Atorva', source: 'DavaIndia', price: 55.00, packaging: '10 Tablets' },
    ],
    symptoms: ['Chest Pain'],
    diseases: ['Heart Disease', 'High Cholesterol'],
    category: 'Statin',
    form: 'Tablet',
    strength: '10mg',
    indications: 'High cholesterol, cardiovascular protection',
    isPrescriptionRequired: true,
  },

  // Fatigue & General
  {
    genericName: 'Multivitamin',
    brandNames: [
      { name: 'Multivitamin Tablets', source: 'Janaushadhi', price: 15.00, packaging: '30 Tablets' },
      { name: 'Supradyn', source: 'DavaIndia', price: 95.00, packaging: '30 Tablets' },
    ],
    symptoms: ['Fatigue', 'Weakness'],
    diseases: ['Vitamin Deficiency', 'General Weakness'],
    category: 'Vitamin Supplement',
    form: 'Tablet',
    strength: 'Multivitamin',
    indications: 'Vitamin and mineral deficiency',
    isPrescriptionRequired: false,
  },
  {
    genericName: 'Vitamin D3',
    brandNames: [
      { name: 'Vitamin D3 60000IU', source: 'Janaushadhi', price: 8.00, packaging: '4 Capsules' },
      { name: 'D Rise', source: 'DavaIndia', price: 45.00, packaging: '4 Capsules' },
    ],
    symptoms: ['Fatigue', 'Weakness'],
    diseases: ['Vitamin D Deficiency'],
    category: 'Vitamin Supplement',
    form: 'Capsule',
    strength: '60000IU',
    indications: 'Vitamin D deficiency',
    isPrescriptionRequired: false,
  },

  // Additional Common Medicines
  {
    genericName: 'Ciprofloxacin',
    brandNames: [
      { name: 'Ciprofloxacin 500mg', source: 'Janaushadhi', price: 10.00, packaging: '10 Tablets' },
      { name: 'Cifran', source: 'DavaIndia', price: 75.00, packaging: '10 Tablets' },
    ],
    symptoms: ['Fever', 'Diarrhea', 'Urinary Symptoms'],
    diseases: ['UTI', 'Gastroenteritis', 'Bacterial Infection'],
    category: 'Antibiotic',
    form: 'Tablet',
    strength: '500mg',
    indications: 'Bacterial infections',
    isPrescriptionRequired: true,
  },
  {
    genericName: 'Levocetirizine',
    brandNames: [
      { name: 'Levocetirizine 5mg', source: 'Janaushadhi', price: 2.50, packaging: '10 Tablets' },
      { name: 'Xyzal', source: 'DavaIndia', price: 55.00, packaging: '10 Tablets' },
    ],
    symptoms: ['Runny Nose', 'Sneezing', 'Allergic Rhinitis'],
    diseases: ['Allergies', 'Common Cold'],
    category: 'Antihistamine',
    form: 'Tablet',
    strength: '5mg',
    indications: 'Allergic rhinitis, urticaria',
    isPrescriptionRequired: false,
  },
  {
    genericName: 'Ranitidine',
    brandNames: [
      { name: 'Ranitidine 150mg', source: 'Janaushadhi', price: 3.50, packaging: '10 Tablets' },
      { name: 'Zinetac', source: 'DavaIndia', price: 28.00, packaging: '10 Tablets' },
    ],
    symptoms: ['Acidity', 'Heartburn'],
    diseases: ['GERD', 'Peptic Ulcer'],
    category: 'H2 Blocker',
    form: 'Tablet',
    strength: '150mg',
    indications: 'Acid reflux, peptic ulcer',
    isPrescriptionRequired: false,
  },
  {
    genericName: 'Diclofenac',
    brandNames: [
      { name: 'Diclofenac 50mg', source: 'Janaushadhi', price: 4.00, packaging: '10 Tablets' },
      { name: 'Voveran', source: 'DavaIndia', price: 32.00, packaging: '10 Tablets' },
    ],
    symptoms: ['Body Ache', 'Pain', 'Inflammation'],
    diseases: ['Arthritis', 'Muscle Pain', 'Joint Pain'],
    category: 'NSAID',
    form: 'Tablet',
    strength: '50mg',
    indications: 'Pain, inflammation',
    isPrescriptionRequired: false,
  },
  {
    genericName: 'Cefixime',
    brandNames: [
      { name: 'Cefixime 200mg', source: 'Janaushadhi', price: 12.50, packaging: '10 Tablets' },
      { name: 'Cefspan', source: 'DavaIndia', price: 95.00, packaging: '10 Tablets' },
    ],
    symptoms: ['Sore Throat', 'Fever', 'Cough'],
    diseases: ['Bacterial Infection', 'Respiratory Infection'],
    category: 'Antibiotic',
    form: 'Tablet',
    strength: '200mg',
    indications: 'Bacterial infections',
    isPrescriptionRequired: true,
  },
]

async function seedMedicines() {
  try {
    console.log('🌱 Starting medicine data seeding...\n')

    // First, create mapping tables if they don't exist
    console.log('📋 Creating mapping tables...')
    await sql`
      CREATE TABLE IF NOT EXISTS medicine_symptom_mappings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        medicine_id UUID NOT NULL REFERENCES medicines(id) ON DELETE CASCADE,
        symptom_name VARCHAR(255) NOT NULL,
        relevance_score INTEGER DEFAULT 100,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `
    await sql`
      CREATE TABLE IF NOT EXISTS medicine_disease_mappings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        medicine_id UUID NOT NULL REFERENCES medicines(id) ON DELETE CASCADE,
        disease_name VARCHAR(255) NOT NULL,
        relevance_score INTEGER DEFAULT 100,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `
    await sql`
      CREATE INDEX IF NOT EXISTS idx_medicine_symptom_medicine ON medicine_symptom_mappings(medicine_id)
    `
    await sql`
      CREATE INDEX IF NOT EXISTS idx_medicine_symptom_name ON medicine_symptom_mappings(symptom_name)
    `
    await sql`
      CREATE INDEX IF NOT EXISTS idx_medicine_disease_medicine ON medicine_disease_mappings(medicine_id)
    `
    await sql`
      CREATE INDEX IF NOT EXISTS idx_medicine_disease_name ON medicine_disease_mappings(disease_name)
    `
    console.log('✅ Mapping tables created\n')

    let totalMedicines = 0
    let totalPrices = 0
    let totalMappings = 0

    for (const med of medicineData) {
      // Insert each brand as a separate medicine entry
      for (const brand of med.brandNames) {
        const [medicine] = await sql`
          INSERT INTO medicines (
            generic_name, brand_name, manufacturer, composition, form, strength,
            packaging, indications, category, schedule, is_prescription_required,
            source, is_active
          ) VALUES (
            ${med.genericName},
            ${brand.name},
            ${brand.source === 'Janaushadhi' ? 'BPPI' : 'Various'},
            ${JSON.stringify([{ ingredient: med.genericName, dosage: med.strength }])},
            ${med.form},
            ${med.strength},
            ${brand.packaging},
            ${med.indications},
            ${med.category},
            ${med.isPrescriptionRequired ? 'H' : null},
            ${med.isPrescriptionRequired},
            ${brand.source},
            true
          )
          ON CONFLICT DO NOTHING
          RETURNING id
        `

        if (medicine && medicine.id) {
          totalMedicines++

          // Insert price
          await sql`
            INSERT INTO medicine_prices (
              medicine_id, source, price, currency, packaging, availability
            ) VALUES (
              ${medicine.id},
              ${brand.source},
              ${brand.price},
              'INR',
              ${brand.packaging},
              'available'
            )
            ON CONFLICT DO NOTHING
          `
          totalPrices++

          // Insert symptom mappings
          for (const symptom of med.symptoms) {
            await sql`
              INSERT INTO medicine_symptom_mappings (medicine_id, symptom_name, relevance_score)
              VALUES (${medicine.id}, ${symptom}, 100)
              ON CONFLICT DO NOTHING
            `
            totalMappings++
          }

          // Insert disease mappings
          for (const disease of med.diseases) {
            await sql`
              INSERT INTO medicine_disease_mappings (medicine_id, disease_name, relevance_score)
              VALUES (${medicine.id}, ${disease}, 100)
              ON CONFLICT DO NOTHING
            `
            totalMappings++
          }
        }
      }
    }

    console.log('✅ Medicine seeding completed!')
    console.log(`📊 Statistics:`)
    console.log(`   - Medicines inserted: ${totalMedicines}`)
    console.log(`   - Prices inserted: ${totalPrices}`)
    console.log(`   - Mappings created: ${totalMappings}`)
    console.log(`\n🎉 All data seeded successfully!`)

  } catch (error) {
    console.error('❌ Error seeding medicines:', error)
    throw error
  } finally {
    await sql.end()
  }
}

// Run the seeding
seedMedicines()
  .then(() => {
    console.log('\n✅ Seeding process completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Seeding process failed:', error)
    process.exit(1)
  })
