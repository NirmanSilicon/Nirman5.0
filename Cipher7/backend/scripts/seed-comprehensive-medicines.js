/**
 * Comprehensive Medicine Data Seeding Script
 * Large-scale medicine dataset with proper structure for frontend
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

// Comprehensive medicine data - expanded dataset
const medicineData = [
  // ========== FEVER & PAIN RELIEF ==========
  {
    genericName: 'Paracetamol',
    brandNames: [
      { name: 'Paracetamol 500mg', source: 'Janaushadhi', price: 2.50, packaging: '10 Tablets', manufacturer: 'BPPI' },
      { name: 'Crocin', source: 'DavaIndia', price: 15.00, packaging: '10 Tablets', manufacturer: 'GSK' },
      { name: 'Calpol 500', source: 'DavaIndia', price: 18.00, packaging: '10 Tablets', manufacturer: 'GlaxoSmithKline' },
      { name: 'Dolo 500', source: 'DavaIndia', price: 12.00, packaging: '10 Tablets', manufacturer: 'Micro Labs' },
    ],
    symptoms: ['Fever', 'Headache', 'Body Ache', 'Pain'],
    diseases: ['Common Cold', 'Flu', 'Viral Fever', 'Dengue', 'Malaria'],
    category: 'Antipyretic',
    form: 'Tablet',
    strength: '500mg',
    indications: 'Fever, mild to moderate pain',
    isPrescriptionRequired: false,
  },
  {
    genericName: 'Ibuprofen',
    brandNames: [
      { name: 'Ibuprofen 400mg', source: 'Janaushadhi', price: 3.50, packaging: '10 Tablets', manufacturer: 'BPPI' },
      { name: 'Brufen', source: 'DavaIndia', price: 25.00, packaging: '10 Tablets', manufacturer: 'Abbott' },
      { name: 'Ibugesic', source: 'DavaIndia', price: 22.00, packaging: '10 Tablets', manufacturer: 'Cipla' },
    ],
    symptoms: ['Fever', 'Body Ache', 'Pain', 'Inflammation'],
    diseases: ['Arthritis', 'Muscle Pain', 'Headache', 'Joint Pain'],
    category: 'NSAID',
    form: 'Tablet',
    strength: '400mg',
    indications: 'Pain, inflammation, fever',
    isPrescriptionRequired: false,
  },
  {
    genericName: 'Diclofenac',
    brandNames: [
      { name: 'Diclofenac 50mg', source: 'Janaushadhi', price: 4.00, packaging: '10 Tablets', manufacturer: 'BPPI' },
      { name: 'Voveran', source: 'DavaIndia', price: 32.00, packaging: '10 Tablets', manufacturer: 'Novartis' },
      { name: 'Dynapar', source: 'DavaIndia', price: 28.00, packaging: '10 Tablets', manufacturer: 'Alkem' },
    ],
    symptoms: ['Body Ache', 'Pain', 'Inflammation', 'Joint Pain'],
    diseases: ['Arthritis', 'Muscle Pain', 'Joint Pain', 'Back Pain'],
    category: 'NSAID',
    form: 'Tablet',
    strength: '50mg',
    indications: 'Pain, inflammation',
    isPrescriptionRequired: false,
  },

  // ========== COUGH & COLD ==========
  {
    genericName: 'Cetirizine',
    brandNames: [
      { name: 'Cetirizine 10mg', source: 'Janaushadhi', price: 2.00, packaging: '10 Tablets', manufacturer: 'BPPI' },
      { name: 'Cetriz', source: 'DavaIndia', price: 12.00, packaging: '10 Tablets', manufacturer: 'Dr. Reddy\'s' },
      { name: 'Zyrtec', source: 'DavaIndia', price: 45.00, packaging: '10 Tablets', manufacturer: 'UCB' },
      { name: 'Alerid', source: 'DavaIndia', price: 15.00, packaging: '10 Tablets', manufacturer: 'Cipla' },
    ],
    symptoms: ['Runny Nose', 'Sneezing', 'Allergic Rhinitis', 'Itching'],
    diseases: ['Common Cold', 'Allergies', 'Hay Fever', 'Urticaria'],
    category: 'Antihistamine',
    form: 'Tablet',
    strength: '10mg',
    indications: 'Allergic rhinitis, urticaria',
    isPrescriptionRequired: false,
  },
  {
    genericName: 'Levocetirizine',
    brandNames: [
      { name: 'Levocetirizine 5mg', source: 'Janaushadhi', price: 2.50, packaging: '10 Tablets', manufacturer: 'BPPI' },
      { name: 'Xyzal', source: 'DavaIndia', price: 55.00, packaging: '10 Tablets', manufacturer: 'UCB' },
      { name: 'Levocet', source: 'DavaIndia', price: 28.00, packaging: '10 Tablets', manufacturer: 'Cipla' },
    ],
    symptoms: ['Runny Nose', 'Sneezing', 'Allergic Rhinitis'],
    diseases: ['Allergies', 'Common Cold', 'Hay Fever'],
    category: 'Antihistamine',
    form: 'Tablet',
    strength: '5mg',
    indications: 'Allergic rhinitis, urticaria',
    isPrescriptionRequired: false,
  },
  {
    genericName: 'Dextromethorphan',
    brandNames: [
      { name: 'Dextromethorphan Syrup', source: 'Janaushadhi', price: 35.00, packaging: '100ml', manufacturer: 'BPPI' },
      { name: 'Benadryl DR', source: 'DavaIndia', price: 85.00, packaging: '100ml', manufacturer: 'Johnson & Johnson' },
      { name: 'TusQ-DX', source: 'DavaIndia', price: 75.00, packaging: '100ml', manufacturer: 'Cipla' },
    ],
    symptoms: ['Cough', 'Dry Cough'],
    diseases: ['Common Cold', 'Bronchitis', 'Upper Respiratory Infection'],
    category: 'Antitussive',
    form: 'Syrup',
    strength: '15mg/5ml',
    indications: 'Dry cough',
    isPrescriptionRequired: false,
  },
  {
    genericName: 'Guaifenesin',
    brandNames: [
      { name: 'Guaifenesin Syrup', source: 'Janaushadhi', price: 40.00, packaging: '100ml', manufacturer: 'BPPI' },
      { name: 'Mucinex', source: 'DavaIndia', price: 120.00, packaging: '100ml', manufacturer: 'Reckitt Benckiser' },
      { name: 'Cheston', source: 'DavaIndia', price: 95.00, packaging: '100ml', manufacturer: 'Cipla' },
    ],
    symptoms: ['Cough', 'Chest Congestion', 'Phlegm'],
    diseases: ['Common Cold', 'Bronchitis', 'Respiratory Infection'],
    category: 'Expectorant',
    form: 'Syrup',
    strength: '100mg/5ml',
    indications: 'Productive cough, chest congestion',
    isPrescriptionRequired: false,
  },
  {
    genericName: 'Phenylephrine',
    brandNames: [
      { name: 'Phenylephrine 5mg', source: 'Janaushadhi', price: 3.00, packaging: '10 Tablets', manufacturer: 'BPPI' },
      { name: 'Sinarest', source: 'DavaIndia', price: 28.00, packaging: '10 Tablets', manufacturer: 'Centaur' },
      { name: 'D Cold', source: 'DavaIndia', price: 25.00, packaging: '10 Tablets', manufacturer: 'Cipla' },
    ],
    symptoms: ['Runny Nose', 'Nasal Congestion'],
    diseases: ['Common Cold', 'Sinusitis', 'Allergic Rhinitis'],
    category: 'Decongestant',
    form: 'Tablet',
    strength: '5mg',
    indications: 'Nasal congestion',
    isPrescriptionRequired: false,
  },

  // ========== SORE THROAT & INFECTIONS ==========
  {
    genericName: 'Amoxicillin',
    brandNames: [
      { name: 'Amoxicillin 500mg', source: 'Janaushadhi', price: 8.50, packaging: '10 Capsules', manufacturer: 'BPPI' },
      { name: 'Amoxil', source: 'DavaIndia', price: 65.00, packaging: '10 Capsules', manufacturer: 'GSK' },
      { name: 'Mox 500', source: 'DavaIndia', price: 55.00, packaging: '10 Capsules', manufacturer: 'Cipla' },
      { name: 'Amoxyclav', source: 'DavaIndia', price: 85.00, packaging: '10 Tablets', manufacturer: 'Alkem' },
    ],
    symptoms: ['Sore Throat', 'Fever', 'Cough'],
    diseases: ['Bacterial Infection', 'Tonsillitis', 'Bronchitis', 'Pneumonia', 'UTI'],
    category: 'Antibiotic',
    form: 'Capsule',
    strength: '500mg',
    indications: 'Bacterial infections',
    isPrescriptionRequired: true,
  },
  {
    genericName: 'Azithromycin',
    brandNames: [
      { name: 'Azithromycin 500mg', source: 'Janaushadhi', price: 12.00, packaging: '3 Tablets', manufacturer: 'BPPI' },
      { name: 'Azithral', source: 'DavaIndia', price: 95.00, packaging: '3 Tablets', manufacturer: 'Alembic' },
      { name: 'Zithromax', source: 'DavaIndia', price: 180.00, packaging: '3 Tablets', manufacturer: 'Pfizer' },
      { name: 'Azee', source: 'DavaIndia', price: 85.00, packaging: '3 Tablets', manufacturer: 'Cipla' },
    ],
    symptoms: ['Sore Throat', 'Cough', 'Fever'],
    diseases: ['Bacterial Infection', 'Pneumonia', 'Bronchitis', 'Tonsillitis'],
    category: 'Antibiotic',
    form: 'Tablet',
    strength: '500mg',
    indications: 'Bacterial infections, respiratory tract infections',
    isPrescriptionRequired: true,
  },
  {
    genericName: 'Cefixime',
    brandNames: [
      { name: 'Cefixime 200mg', source: 'Janaushadhi', price: 12.50, packaging: '10 Tablets', manufacturer: 'BPPI' },
      { name: 'Cefspan', source: 'DavaIndia', price: 95.00, packaging: '10 Tablets', manufacturer: 'Ranbaxy' },
      { name: 'Taxim-O', source: 'DavaIndia', price: 88.00, packaging: '10 Tablets', manufacturer: 'Alkem' },
    ],
    symptoms: ['Sore Throat', 'Fever', 'Cough'],
    diseases: ['Bacterial Infection', 'Respiratory Infection', 'UTI'],
    category: 'Antibiotic',
    form: 'Tablet',
    strength: '200mg',
    indications: 'Bacterial infections',
    isPrescriptionRequired: true,
  },
  {
    genericName: 'Ciprofloxacin',
    brandNames: [
      { name: 'Ciprofloxacin 500mg', source: 'Janaushadhi', price: 10.00, packaging: '10 Tablets', manufacturer: 'BPPI' },
      { name: 'Cifran', source: 'DavaIndia', price: 75.00, packaging: '10 Tablets', manufacturer: 'Ranbaxy' },
      { name: 'Ciprobid', source: 'DavaIndia', price: 68.00, packaging: '10 Tablets', manufacturer: 'Cipla' },
    ],
    symptoms: ['Fever', 'Diarrhea', 'Urinary Symptoms', 'Burning Sensation'],
    diseases: ['UTI', 'Gastroenteritis', 'Bacterial Infection', 'Typhoid'],
    category: 'Antibiotic',
    form: 'Tablet',
    strength: '500mg',
    indications: 'Bacterial infections',
    isPrescriptionRequired: true,
  },

  // ========== DIGESTIVE ISSUES ==========
  {
    genericName: 'Omeprazole',
    brandNames: [
      { name: 'Omeprazole 20mg', source: 'Janaushadhi', price: 4.50, packaging: '10 Capsules', manufacturer: 'BPPI' },
      { name: 'Omez', source: 'DavaIndia', price: 35.00, packaging: '10 Capsules', manufacturer: 'Dr. Reddy\'s' },
      { name: 'Losec', source: 'DavaIndia', price: 120.00, packaging: '10 Capsules', manufacturer: 'AstraZeneca' },
      { name: 'Ocid', source: 'DavaIndia', price: 42.00, packaging: '10 Capsules', manufacturer: 'Cipla' },
    ],
    symptoms: ['Acidity', 'Heartburn', 'Stomach Pain'],
    diseases: ['GERD', 'Peptic Ulcer', 'Gastritis', 'Acid Reflux'],
    category: 'PPI',
    form: 'Capsule',
    strength: '20mg',
    indications: 'Acid reflux, peptic ulcer',
    isPrescriptionRequired: false,
  },
  {
    genericName: 'Pantoprazole',
    brandNames: [
      { name: 'Pantoprazole 40mg', source: 'Janaushadhi', price: 5.00, packaging: '10 Tablets', manufacturer: 'BPPI' },
      { name: 'Pantocid', source: 'DavaIndia', price: 42.00, packaging: '10 Tablets', manufacturer: 'Sun Pharma' },
      { name: 'Pantodac', source: 'DavaIndia', price: 48.00, packaging: '10 Tablets', manufacturer: 'Zydus' },
    ],
    symptoms: ['Acidity', 'Heartburn'],
    diseases: ['GERD', 'Peptic Ulcer', 'Gastritis'],
    category: 'PPI',
    form: 'Tablet',
    strength: '40mg',
    indications: 'Acid reflux, peptic ulcer',
    isPrescriptionRequired: false,
  },
  {
    genericName: 'Domperidone',
    brandNames: [
      { name: 'Domperidone 10mg', source: 'Janaushadhi', price: 3.00, packaging: '10 Tablets', manufacturer: 'BPPI' },
      { name: 'Domstal', source: 'DavaIndia', price: 22.00, packaging: '10 Tablets', manufacturer: 'Torrent' },
      { name: 'Domperon', source: 'DavaIndia', price: 25.00, packaging: '10 Tablets', manufacturer: 'Janssen' },
    ],
    symptoms: ['Nausea', 'Vomiting', 'Indigestion'],
    diseases: ['Gastritis', 'Indigestion', 'Gastroesophageal Reflux'],
    category: 'Antiemetic',
    form: 'Tablet',
    strength: '10mg',
    indications: 'Nausea, vomiting',
    isPrescriptionRequired: false,
  },
  {
    genericName: 'Loperamide',
    brandNames: [
      { name: 'Loperamide 2mg', source: 'Janaushadhi', price: 2.50, packaging: '10 Tablets', manufacturer: 'BPPI' },
      { name: 'Imodium', source: 'DavaIndia', price: 28.00, packaging: '10 Tablets', manufacturer: 'Janssen' },
      { name: 'Lopamide', source: 'DavaIndia', price: 18.00, packaging: '10 Tablets', manufacturer: 'Cipla' },
    ],
    symptoms: ['Diarrhea'],
    diseases: ['Gastroenteritis', 'Traveler\'s Diarrhea', 'IBS'],
    category: 'Antidiarrheal',
    form: 'Tablet',
    strength: '2mg',
    indications: 'Diarrhea',
    isPrescriptionRequired: false,
  },
  {
    genericName: 'Metronidazole',
    brandNames: [
      { name: 'Metronidazole 400mg', source: 'Janaushadhi', price: 6.00, packaging: '10 Tablets', manufacturer: 'BPPI' },
      { name: 'Flagyl', source: 'DavaIndia', price: 48.00, packaging: '10 Tablets', manufacturer: 'Sanofi' },
      { name: 'Metrogyl', source: 'DavaIndia', price: 42.00, packaging: '10 Tablets', manufacturer: 'J.B. Chemicals' },
    ],
    symptoms: ['Diarrhea', 'Stomach Pain', 'Abdominal Cramps'],
    diseases: ['Gastroenteritis', 'Amoebiasis', 'Giardiasis', 'Bacterial Infection'],
    category: 'Antibiotic',
    form: 'Tablet',
    strength: '400mg',
    indications: 'Bacterial and protozoal infections',
    isPrescriptionRequired: true,
  },
  {
    genericName: 'Ranitidine',
    brandNames: [
      { name: 'Ranitidine 150mg', source: 'Janaushadhi', price: 3.50, packaging: '10 Tablets', manufacturer: 'BPPI' },
      { name: 'Zinetac', source: 'DavaIndia', price: 28.00, packaging: '10 Tablets', manufacturer: 'GSK' },
      { name: 'Rantac', source: 'DavaIndia', price: 22.00, packaging: '10 Tablets', manufacturer: 'J.B. Chemicals' },
    ],
    symptoms: ['Acidity', 'Heartburn'],
    diseases: ['GERD', 'Peptic Ulcer', 'Gastritis'],
    category: 'H2 Blocker',
    form: 'Tablet',
    strength: '150mg',
    indications: 'Acid reflux, peptic ulcer',
    isPrescriptionRequired: false,
  },

  // ========== RESPIRATORY ISSUES ==========
  {
    genericName: 'Salbutamol',
    brandNames: [
      { name: 'Salbutamol Inhaler', source: 'Janaushadhi', price: 45.00, packaging: '200 Doses', manufacturer: 'BPPI' },
      { name: 'Asthalin', source: 'DavaIndia', price: 125.00, packaging: '200 Doses', manufacturer: 'Cipla' },
      { name: 'Ventolin', source: 'DavaIndia', price: 180.00, packaging: '200 Doses', manufacturer: 'GSK' },
      { name: 'Asthavent', source: 'DavaIndia', price: 95.00, packaging: '200 Doses', manufacturer: 'Lupin' },
    ],
    symptoms: ['Difficulty Breathing', 'Wheezing', 'Chest Tightness', 'Shortness of Breath'],
    diseases: ['Asthma', 'COPD', 'Bronchitis', 'Bronchospasm'],
    category: 'Bronchodilator',
    form: 'Inhaler',
    strength: '100mcg',
    indications: 'Asthma, bronchospasm',
    isPrescriptionRequired: true,
  },
  {
    genericName: 'Montelukast',
    brandNames: [
      { name: 'Montelukast 10mg', source: 'Janaushadhi', price: 5.50, packaging: '10 Tablets', manufacturer: 'BPPI' },
      { name: 'Montair', source: 'DavaIndia', price: 65.00, packaging: '10 Tablets', manufacturer: 'Cipla' },
      { name: 'Montek', source: 'DavaIndia', price: 58.00, packaging: '10 Tablets', manufacturer: 'Sun Pharma' },
    ],
    symptoms: ['Difficulty Breathing', 'Wheezing', 'Cough'],
    diseases: ['Asthma', 'Allergic Rhinitis', 'Bronchitis'],
    category: 'Leukotriene Receptor Antagonist',
    form: 'Tablet',
    strength: '10mg',
    indications: 'Asthma, allergic rhinitis',
    isPrescriptionRequired: true,
  },

  // ========== HEADACHE & NEUROLOGICAL ==========
  {
    genericName: 'Sumatriptan',
    brandNames: [
      { name: 'Sumatriptan 50mg', source: 'Janaushadhi', price: 25.00, packaging: '1 Tablet', manufacturer: 'BPPI' },
      { name: 'Suminat', source: 'DavaIndia', price: 95.00, packaging: '1 Tablet', manufacturer: 'Sun Pharma' },
      { name: 'Imigran', source: 'DavaIndia', price: 120.00, packaging: '1 Tablet', manufacturer: 'GSK' },
    ],
    symptoms: ['Headache', 'Migraine', 'Severe Headache'],
    diseases: ['Migraine', 'Cluster Headache'],
    category: 'Triptan',
    form: 'Tablet',
    strength: '50mg',
    indications: 'Migraine attacks',
    isPrescriptionRequired: true,
  },

  // ========== LOSS OF TASTE/SMELL ==========
  {
    genericName: 'Zinc Sulfate',
    brandNames: [
      { name: 'Zinc Sulfate 20mg', source: 'Janaushadhi', price: 3.50, packaging: '10 Tablets', manufacturer: 'BPPI' },
      { name: 'Zinconia', source: 'DavaIndia', price: 28.00, packaging: '10 Tablets', manufacturer: 'Torrent' },
      { name: 'Zevit', source: 'DavaIndia', price: 35.00, packaging: '10 Tablets', manufacturer: 'Cipla' },
    ],
    symptoms: ['Loss of Taste', 'Loss of Smell', 'Weakness'],
    diseases: ['Common Cold', 'COVID-19', 'Viral Infection', 'Zinc Deficiency'],
    category: 'Mineral Supplement',
    form: 'Tablet',
    strength: '20mg',
    indications: 'Zinc deficiency, immune support',
    isPrescriptionRequired: false,
  },

  // ========== CHEST PAIN & CARDIOVASCULAR ==========
  {
    genericName: 'Aspirin',
    brandNames: [
      { name: 'Aspirin 75mg', source: 'Janaushadhi', price: 2.00, packaging: '10 Tablets', manufacturer: 'BPPI' },
      { name: 'Ecosprin', source: 'DavaIndia', price: 12.00, packaging: '10 Tablets', manufacturer: 'USV' },
      { name: 'Disprin', source: 'DavaIndia', price: 15.00, packaging: '10 Tablets', manufacturer: 'Reckitt Benckiser' },
    ],
    symptoms: ['Chest Pain', 'Fever', 'Pain'],
    diseases: ['Heart Disease', 'Fever', 'Cardiovascular Disease'],
    category: 'Antiplatelet',
    form: 'Tablet',
    strength: '75mg',
    indications: 'Cardiovascular protection, fever',
    isPrescriptionRequired: false,
  },
  {
    genericName: 'Atorvastatin',
    brandNames: [
      { name: 'Atorvastatin 10mg', source: 'Janaushadhi', price: 6.50, packaging: '10 Tablets', manufacturer: 'BPPI' },
      { name: 'Atorva', source: 'DavaIndia', price: 55.00, packaging: '10 Tablets', manufacturer: 'Torrent' },
      { name: 'Lipitor', source: 'DavaIndia', price: 95.00, packaging: '10 Tablets', manufacturer: 'Pfizer' },
    ],
    symptoms: ['Chest Pain'],
    diseases: ['Heart Disease', 'High Cholesterol', 'Cardiovascular Disease'],
    category: 'Statin',
    form: 'Tablet',
    strength: '10mg',
    indications: 'High cholesterol, cardiovascular protection',
    isPrescriptionRequired: true,
  },

  // ========== FATIGUE & VITAMINS ==========
  {
    genericName: 'Multivitamin',
    brandNames: [
      { name: 'Multivitamin Tablets', source: 'Janaushadhi', price: 15.00, packaging: '30 Tablets', manufacturer: 'BPPI' },
      { name: 'Supradyn', source: 'DavaIndia', price: 95.00, packaging: '30 Tablets', manufacturer: 'Bayer' },
      { name: 'Becadexamin', source: 'DavaIndia', price: 75.00, packaging: '30 Tablets', manufacturer: 'GlaxoSmithKline' },
    ],
    symptoms: ['Fatigue', 'Weakness', 'Tiredness'],
    diseases: ['Vitamin Deficiency', 'General Weakness', 'Malnutrition'],
    category: 'Vitamin Supplement',
    form: 'Tablet',
    strength: 'Multivitamin',
    indications: 'Vitamin and mineral deficiency',
    isPrescriptionRequired: false,
  },
  {
    genericName: 'Vitamin D3',
    brandNames: [
      { name: 'Vitamin D3 60000IU', source: 'Janaushadhi', price: 8.00, packaging: '4 Capsules', manufacturer: 'BPPI' },
      { name: 'D Rise', source: 'DavaIndia', price: 45.00, packaging: '4 Capsules', manufacturer: 'Sun Pharma' },
      { name: 'Calcirol', source: 'DavaIndia', price: 55.00, packaging: '4 Capsules', manufacturer: 'Cadila' },
    ],
    symptoms: ['Fatigue', 'Weakness', 'Bone Pain'],
    diseases: ['Vitamin D Deficiency', 'Osteoporosis', 'Rickets'],
    category: 'Vitamin Supplement',
    form: 'Capsule',
    strength: '60000IU',
    indications: 'Vitamin D deficiency',
    isPrescriptionRequired: false,
  },
]

async function seedMedicines() {
  try {
    console.log('🌱 Starting comprehensive medicine data seeding...\n')

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
            ${brand.manufacturer || (brand.source === 'Janaushadhi' ? 'BPPI' : 'Various')},
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

