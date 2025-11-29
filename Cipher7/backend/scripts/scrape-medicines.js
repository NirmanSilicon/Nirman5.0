/**
 * Medicine Scraper Script
 * Scrapes medicine data from Janaushadhi website
 * and populates the database with only Janaushadhi medicines
 */

import dotenv from 'dotenv'
import postgres from 'postgres'
import puppeteer from 'puppeteer'
import * as cheerio from 'cheerio'

dotenv.config()

const sql = postgres({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'pathogen',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
})

// Medicine category to symptom/disease mapping - STRICT MAPPING ONLY
// Only map medicines that are ACTUALLY used for these symptoms/diseases
const categoryMappings = {
  'Antibiotics': {
    symptoms: ['Infection', 'Bacterial Infection'],
    diseases: ['Bacterial Infection', 'Pneumonia', 'Bronchitis', 'Urinary Tract Infection', 'Skin Infection']
  },
  'Fever and Pain': {
    symptoms: ['Fever', 'Headache', 'Body Ache', 'Pain', 'Joint Pain', 'Muscle Pain'],
    diseases: ['Common Cold', 'Flu', 'Viral Fever', 'Dengue', 'Malaria', 'Arthritis', 'Fever']
  },
  'Cold and Cough': {
    symptoms: ['Cough', 'Cold', 'Runny Nose', 'Sneezing', 'Sore Throat', 'Congestion'],
    diseases: ['Common Cold', 'Flu', 'Bronchitis', 'Sinusitis', 'Allergic Rhinitis']
  },
  'Stomach Care': {
    symptoms: ['Nausea', 'Vomiting', 'Diarrhea', 'Stomach Pain', 'Acidity', 'Indigestion', 'Heartburn'],
    diseases: ['Gastritis', 'GERD', 'Peptic Ulcer', 'Irritable Bowel Syndrome', 'Diarrhea']
  },
  'Diabetes': {
    symptoms: ['High Blood Sugar'],
    diseases: ['Diabetes', 'Type 2 Diabetes', 'Type 1 Diabetes', 'Prediabetes']
  },
  'BP care': {
    symptoms: ['High Blood Pressure'],
    diseases: ['Hypertension', 'High Blood Pressure', 'Cardiovascular Disease']
  },
  'Skin Care': {
    symptoms: ['Itching', 'Rash', 'Dry Skin', 'Acne', 'Skin Irritation'],
    diseases: ['Dermatitis', 'Eczema', 'Psoriasis', 'Acne', 'Skin Infection']
  },
  'Vitamins and Nutrition': {
    symptoms: ['Weakness', 'Fatigue', 'Vitamin Deficiency'],
    diseases: ['Vitamin Deficiency', 'Anemia', 'Malnutrition', 'Osteoporosis']
  },
  'Eye and Ear': {
    symptoms: ['Eye Irritation', 'Ear Pain', 'Eye Redness', 'Ear Itching'],
    diseases: ['Conjunctivitis', 'Ear Infection', 'Dry Eyes']
  },
  'Neuro Care': {
    symptoms: ['Headache', 'Dizziness', 'Seizures', 'Tremors'],
    diseases: ['Epilepsy', 'Migraine', 'Parkinson\'s Disease', 'Anxiety']
  },
  'Thyroid': {
    symptoms: ['Fatigue', 'Weight Gain', 'Weight Loss'],
    diseases: ['Hypothyroidism', 'Hyperthyroidism', 'Thyroid Disorder']
  },
  'Urology': {
    symptoms: ['Frequent Urination', 'Painful Urination'],
    diseases: ['Urinary Tract Infection', 'Kidney Stones', 'Prostate Problems']
  },
  'Baby Care': {
    // REMOVED Fever, Cough, Cold - baby care products are not medicines for these
    symptoms: ['Colic', 'Teething Pain'],
    diseases: ['Infant Colic', 'Teething']
  },
  'First Aid': {
    symptoms: ['Pain', 'Bleeding', 'Burns', 'Wounds'],
    diseases: ['Injury', 'Burns', 'Wounds']
  },
  'Beauty Care': {
    // No medical symptoms/diseases
    symptoms: [],
    diseases: []
  },
  'Feminine Care': {
    symptoms: ['Vaginal Itching', 'Vaginal Discharge'],
    diseases: ['Vaginal Infection']
  },
  'Oral Care': {
    symptoms: ['Tooth Pain', 'Gum Pain'],
    diseases: ['Dental Problems', 'Gum Disease']
  },
  'Hair Care': {
    // No medical symptoms/diseases
    symptoms: [],
    diseases: []
  }
}

/**
 * Extract generic name from medicine name
 */
function extractGenericName(medicineName) {
  // Common patterns: "Paracetamol 500mg", "Ibuprofen 400mg", etc.
  const genericPatterns = [
    /^([A-Za-z]+(?:\s+[A-Za-z]+)*)\s*\d+/i, // "Paracetamol 500"
    /^([A-Za-z]+(?:\s+[A-Za-z]+)*)\s*\(/i, // "Paracetamol (500mg)"
    /^([A-Za-z]+(?:\s+[A-Za-z]+)*)\s*Tablet/i, // "Paracetamol Tablet"
    /^([A-Za-z]+(?:\s+[A-Za-z]+)*)\s*Capsule/i, // "Paracetamol Capsule"
  ]

  for (const pattern of genericPatterns) {
    const match = medicineName.match(pattern)
    if (match && match[1]) {
      return match[1].trim()
    }
  }

  // If no pattern matches, return first word as generic name
  return medicineName.split(/\s+/)[0]
}

/**
 * Extract strength from medicine name
 */
function extractStrength(medicineName, description = '') {
  const strengthPatterns = [
    /(\d+(?:\.\d+)?\s*(?:mg|g|ml|mcg|IU|%))/gi,
    /(\d+(?:\.\d+)?\s*(?:mg|g|ml|mcg|IU|%)\s*\/\s*\d+(?:\.\d+)?\s*(?:mg|g|ml|mcg|IU|%))/gi,
  ]

  const combinedText = `${medicineName} ${description}`
  for (const pattern of strengthPatterns) {
    const matches = combinedText.match(pattern)
    if (matches && matches.length > 0) {
      return matches[0].trim()
    }
  }

  return null
}

/**
 * Extract form from medicine name or description
 */
function extractForm(medicineName, description = '') {
  const forms = ['Tablet', 'Capsule', 'Syrup', 'Injection', 'Cream', 'Ointment', 'Gel', 'Drops', 'Spray', 'Powder', 'Suspension']
  const combinedText = `${medicineName} ${description}`.toLowerCase()

  for (const form of forms) {
    if (combinedText.includes(form.toLowerCase())) {
      return form
    }
  }

  return 'Tablet' // Default
}

/**
 * Get symptoms and diseases based on category and medicine name
 * STRICT MAPPING - Only map actual medicines, not baby care products, beauty products, etc.
 */
function getSymptomsAndDiseases(category, medicineName, description = '') {
  const combinedText = `${medicineName} ${description}`.toLowerCase()
  
  // Skip mapping for non-medical products
  const nonMedicalKeywords = [
    'baby wipes', 'toothpaste', 'shampoo', 'soap', 'cream', 'lotion', 
    'oil', 'powder', 'wipes', 'sanitizer', 'condom', 'pump', 'braces',
    'supports', 'bandage', 'cotton', 'gauze', 'syringe', 'gloves',
    'mask', 'thermometer', 'monitor', 'device', 'kit', 'pack'
  ]
  
  // If it's a non-medical product, return empty mappings
  if (nonMedicalKeywords.some(keyword => combinedText.includes(keyword))) {
    // Only allow if it's actually a medicine (check for active ingredients)
    const medicineKeywords = [
      'tablet', 'capsule', 'syrup', 'suspension', 'injection', 'drops',
      'paracetamol', 'ibuprofen', 'amoxicillin', 'azithromycin', 'diclofenac',
      'omeprazole', 'pantoprazole', 'metformin', 'cetirizine', 'levocetirizine',
      'doxycycline', 'ciprofloxacin', 'amoxicillin', 'cefixime', 'ranitidine'
    ]
    
    if (!medicineKeywords.some(keyword => combinedText.includes(keyword))) {
      return { symptoms: [], diseases: [] }
    }
  }

  const baseMapping = categoryMappings[category] || {
    symptoms: [],
    diseases: []
  }

  const additionalSymptoms = []
  const additionalDiseases = []

  // Add specific mappings based on medicine name patterns - STRICT MATCHING
  if (combinedText.includes('paracetamol') || combinedText.includes('acetaminophen')) {
    additionalSymptoms.push('Fever', 'Pain', 'Headache', 'Body Ache')
    additionalDiseases.push('Common Cold', 'Flu', 'Viral Fever', 'Fever')
  }
  if (combinedText.includes('ibuprofen')) {
    additionalSymptoms.push('Pain', 'Inflammation', 'Fever', 'Headache', 'Body Ache')
    additionalDiseases.push('Arthritis', 'Muscle Pain', 'Fever')
  }
  if (combinedText.includes('diclofenac')) {
    additionalSymptoms.push('Pain', 'Inflammation', 'Joint Pain', 'Body Ache')
    additionalDiseases.push('Arthritis', 'Muscle Pain', 'Joint Pain')
  }
  if (combinedText.includes('nimesulide')) {
    additionalSymptoms.push('Pain', 'Fever', 'Inflammation')
    additionalDiseases.push('Fever', 'Pain')
  }
  if (combinedText.includes('cetirizine') || combinedText.includes('levocetirizine')) {
    additionalSymptoms.push('Sneezing', 'Runny Nose', 'Itching', 'Allergic Rhinitis')
    additionalDiseases.push('Allergies', 'Hay Fever', 'Urticaria', 'Allergic Rhinitis')
  }
  if (combinedText.includes('amoxicillin') || combinedText.includes('azithromycin') || combinedText.includes('doxycycline')) {
    additionalSymptoms.push('Infection', 'Fever')
    additionalDiseases.push('Bacterial Infection', 'Pneumonia', 'Bronchitis', 'Fever')
  }
  if (combinedText.includes('omeprazole') || combinedText.includes('pantoprazole')) {
    additionalSymptoms.push('Acidity', 'Heartburn', 'Stomach Pain')
    additionalDiseases.push('GERD', 'Gastritis', 'Peptic Ulcer')
  }
  if (combinedText.includes('metformin')) {
    additionalSymptoms.push('High Blood Sugar')
    additionalDiseases.push('Diabetes', 'Type 2 Diabetes')
  }
  if (combinedText.includes('domperidone')) {
    additionalSymptoms.push('Nausea', 'Vomiting')
    additionalDiseases.push('Nausea', 'Vomiting')
  }
  if (combinedText.includes('ondansetron')) {
    additionalSymptoms.push('Nausea', 'Vomiting')
    additionalDiseases.push('Nausea', 'Vomiting')
  }
  if (combinedText.includes('phenylephrine') || combinedText.includes('pseudoephedrine')) {
    additionalSymptoms.push('Nasal Congestion', 'Runny Nose', 'Cold')
    additionalDiseases.push('Common Cold', 'Nasal Congestion')
  }
  if (combinedText.includes('dextromethorphan') || combinedText.includes('guaifenesin')) {
    additionalSymptoms.push('Cough')
    additionalDiseases.push('Cough', 'Bronchitis')
  }
  if (combinedText.includes('calcium') || combinedText.includes('vitamin d') || combinedText.includes('vitamin b')) {
    // Only if it's a medicine, not a supplement
    if (combinedText.includes('tablet') || combinedText.includes('capsule') || combinedText.includes('syrup')) {
      additionalSymptoms.push('Vitamin Deficiency', 'Weakness')
      additionalDiseases.push('Vitamin Deficiency', 'Osteoporosis')
    }
  }

  // Combine base mapping with specific medicine mappings
  const finalSymptoms = [...new Set([...baseMapping.symptoms, ...additionalSymptoms])]
  const finalDiseases = [...new Set([...baseMapping.diseases, ...additionalDiseases])]

  return {
    symptoms: finalSymptoms,
    diseases: finalDiseases
  }
}

/**
 * Scrape Janaushadhi website
 */
async function scrapeJanaushadhi() {
  console.log('🔍 Starting Janaushadhi scraping...')
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  try {
    const page = await browser.newPage()
    await page.setViewport({ width: 1920, height: 1080 })
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')

    const medicines = []
    const seenMedicines = new Set() // Track seen medicines to prevent duplicates
    const categories = [
      'antibiotics',
      'fever-and-pain',
      'cold-and-cough',
      'stomach-care',
      'diabetes',
      'bp-care',
      'skin-care',
      'vitamins-and-nutrition',
      'eye-and-ear',
      'neuro-care',
      'thyroid',
      'urology',
      'baby-care',
      'first-aid'
    ]

    for (const category of categories) {
      console.log(`  📂 Scraping category: ${category}`)
      let pageNum = 1
      let hasMore = true

      while (hasMore) {
        try {
          const url = `https://janaushadhivitran.com/collections/${category}?page=${pageNum}`
          console.log(`    📄 Fetching page ${pageNum}...`)
          
          await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 })
          await page.waitForTimeout(2000) // Wait for dynamic content

          const content = await page.content()
          const $ = cheerio.load(content)

          // Find product cards - try multiple selectors
          let productCards = $('.product-card, .product-item, [class*="product"]')
          
          // If no products found, try more specific selectors
          if (productCards.length === 0) {
            productCards = $('article, .grid-item, .collection-item, [data-product-id], [data-product-handle]')
          }
          
          // Try finding by product links
          if (productCards.length === 0) {
            productCards = $('a[href*="/products/"], a[href*="/collections/"]').parent()
          }
          
          // Debug: log page structure
          if (productCards.length === 0) {
            console.log(`    ⚠️  No products found on page ${pageNum}. Checking page structure...`)
            const pageTitle = $('title').text()
            const hasProducts = $('body').text().toLowerCase().includes('rs.') || $('body').text().toLowerCase().includes('price')
            console.log(`    📄 Page title: ${pageTitle}, Has price text: ${hasProducts}`)
          }
          
          if (productCards.length === 0) {
            hasMore = false
            break
          }

          productCards.each((i, elem) => {
            try {
              const $elem = $(elem)
              
              // Extract medicine name - try multiple selectors
              let name = $elem.find('h1, h2, h3, h4, h5, .product-title, [class*="title"], [class*="name"]').first().text().trim()
              
              // If not found, try link text
              if (!name || name.length < 3) {
                name = $elem.find('a').first().text().trim()
              }
              
              // If still not found, try data attributes
              if (!name || name.length < 3) {
                name = $elem.attr('data-product-title') || $elem.attr('data-title') || $elem.attr('title') || ''
              }
              
              // If still not found, try first text node
              if (!name || name.length < 3) {
                const textNodes = $elem.contents().filter(function() {
                  return this.nodeType === 3 && $(this).text().trim().length > 0
                })
                if (textNodes.length > 0) {
                  name = $(textNodes[0]).text().trim()
                }
              }

              if (!name || name.length < 3) return

              // Clean the name - remove "Jan Aushadhi Vitran" prefix/suffix
              name = name
                .replace(/^Jan\s*Aushadhi\s*Vitran\s*/i, '')
                .replace(/\s*Jan\s*Aushadhi\s*Vitran\s*$/i, '')
                .replace(/^Jan\s*Aushadhi\s*/i, '')
                .replace(/\s*Jan\s*Aushadhi\s*$/i, '')
                .trim()

              if (!name || name.length < 3) return

              // Extract price - try multiple selectors
              let priceText = $elem.find('.price, [class*="price"], .regular-price, [data-price]').first().text().trim()
              
              // If not found, try data attributes
              if (!priceText || !priceText.match(/Rs?\.?\s*(\d+(?:\.\d+)?)/i)) {
                priceText = $elem.attr('data-price') || $elem.find('[data-price]').attr('data-price') || priceText
              }
              
              // Search in all text if still not found
              if (!priceText || !priceText.match(/Rs?\.?\s*(\d+(?:\.\d+)?)/i)) {
                const allText = $elem.text()
                const priceMatch = allText.match(/Rs?\.?\s*(\d+(?:\.\d+)?)/i)
                if (priceMatch) {
                  priceText = priceMatch[0]
                }
              }
              
              const priceMatch = priceText.match(/Rs?\.?\s*(\d+(?:\.\d+)?)/i) || priceText.match(/(\d+(?:\.\d+)?)/)
              const price = priceMatch ? parseFloat(priceMatch[1]) : null

              // Extract description
              const description = $elem.find('.product-description, [class*="description"]').text().trim() ||
                                $elem.find('p').first().text().trim()

              // Extract packaging
              const packagingText = $elem.find('[class*="packaging"], [class*="pack"]').text().trim() ||
                                   description
              const packagingMatch = packagingText.match(/(\d+\s*(?:Tablets?|Capsules?|ml|g|Strip|Bottle|Sachet))/i)
              const packaging = packagingMatch ? packagingMatch[1] : '10 Tablets'

              // Extract additional details
              const details = $elem.find('.product-details, [class*="details"]').text().trim()

              if (name && price) {
                const genericName = extractGenericName(name)
                const strength = extractStrength(name, description)
                const form = extractForm(name, description)
                const categoryName = category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
                
                // Create a unique key for deduplication (generic name + strength + form)
                const uniqueKey = `${genericName.toLowerCase()}_${(strength || 'N/A').toLowerCase()}_${form.toLowerCase()}`
                
                // Skip if we've already seen this medicine
                if (seenMedicines.has(uniqueKey)) {
                  return // Skip duplicate
                }
                seenMedicines.add(uniqueKey)
                
                const { symptoms, diseases } = getSymptomsAndDiseases(categoryName, name, description)

                medicines.push({
                  source: 'Janaushadhi',
                  brandName: name,
                  genericName: genericName,
                  price: price,
                  strength: strength || 'N/A',
                  form: form,
                  packaging: packaging,
                  category: categoryName,
                  description: description || details,
                  symptoms: symptoms,
                  diseases: diseases,
                  manufacturer: 'BPPI',
                  sourceUrl: `https://janaushadhivitran.com/collections/${category}`
                })
              }
            } catch (err) {
              console.error(`    ⚠️  Error parsing product:`, err.message)
            }
          })

          // Check if there's a next page
          const nextButton = $('.pagination a[class*="next"], .next-page, [aria-label*="next"]')
          if (nextButton.length === 0 || pageNum >= 10) { // Limit to 10 pages per category
            hasMore = false
          } else {
            pageNum++
          }

          // Rate limiting
          await page.waitForTimeout(2000)
        } catch (err) {
          console.error(`    ⚠️  Error scraping page ${pageNum}:`, err.message)
          hasMore = false
        }
      }
    }

    console.log(`✅ Janaushadhi scraping completed: ${medicines.length} medicines found`)
    return medicines
  } finally {
    await browser.close()
  }
}


/**
 * Clear existing medicine data and repopulate
 */
async function clearAndSeedMedicines() {
  try {
    console.log('\n🗑️  Clearing existing medicine data...')
    
    // Delete mappings first (due to foreign key constraints)
    await sql`DELETE FROM medicine_symptom_mappings`
    await sql`DELETE FROM medicine_disease_mappings`
    await sql`DELETE FROM medicine_prices`
    await sql`DELETE FROM medicine_alternatives`
    await sql`DELETE FROM medicines`
    
    console.log('✅ Existing data cleared\n')

    // Scrape medicines from Janaushadhi only
    const allMedicines = await scrapeJanaushadhi()
    console.log(`\n📊 Total medicines to insert: ${allMedicines.length}`)

    // Ensure mapping tables exist
    console.log('\n📋 Ensuring mapping tables exist...')
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
    console.log('✅ Mapping tables ready\n')

    // Insert medicines
    console.log('💾 Inserting medicines into database...')
    let totalMedicines = 0
    let totalPrices = 0
    let totalMappings = 0

    for (const med of allMedicines) {
      try {
        // Check if medicine already exists (by generic name + strength + form)
        const existing = await sql`
          SELECT id FROM medicines 
          WHERE LOWER(generic_name) = LOWER(${med.genericName})
          AND LOWER(strength) = LOWER(${med.strength})
          AND LOWER(form) = LOWER(${med.form})
          AND source = ${med.source}
          LIMIT 1
        `
        
        let medicineId
        if (existing && existing.length > 0) {
          // Update existing medicine
          medicineId = existing[0].id
          await sql`
            UPDATE medicines 
            SET brand_name = ${med.brandName},
                packaging = ${med.packaging},
                updated_at = NOW()
            WHERE id = ${medicineId}
          `
        } else {
          // Insert new medicine
          const [medicine] = await sql`
            INSERT INTO medicines (
              generic_name, brand_name, manufacturer, composition, form, strength,
              packaging, indications, category, schedule, is_prescription_required,
              source, source_url, is_active
            ) VALUES (
              ${med.genericName},
              ${med.brandName},
              ${med.manufacturer},
              ${JSON.stringify([{ ingredient: med.genericName, dosage: med.strength }])},
              ${med.form},
              ${med.strength},
              ${med.packaging},
              ${med.description || med.category},
              ${med.category},
              NULL,
              false,
              ${med.source},
              ${med.sourceUrl || null},
              true
            )
            RETURNING id
          `
          medicineId = medicine?.id
        }

        if (medicineId) {
          totalMedicines++

          // Insert/Update price (delete old price for this source first)
          if (med.price) {
            await sql`DELETE FROM medicine_prices WHERE medicine_id = ${medicineId} AND source = ${med.source}`
            
            await sql`
              INSERT INTO medicine_prices (
                medicine_id, source, price, currency, packaging, availability, source_url
              ) VALUES (
                ${medicineId},
                ${med.source},
                ${med.price},
                'INR',
                ${med.packaging},
                'available',
                ${med.sourceUrl || null}
              )
            `
            totalPrices++
          }

          // Delete existing mappings and insert new ones (to avoid duplicates)
          await sql`DELETE FROM medicine_symptom_mappings WHERE medicine_id = ${medicineId}`
          await sql`DELETE FROM medicine_disease_mappings WHERE medicine_id = ${medicineId}`

          // Insert symptom mappings
          for (const symptom of med.symptoms) {
            await sql`
              INSERT INTO medicine_symptom_mappings (medicine_id, symptom_name, relevance_score)
              VALUES (${medicineId}, ${symptom}, 100)
            `
            totalMappings++
          }

          // Insert disease mappings
          for (const disease of med.diseases) {
            await sql`
              INSERT INTO medicine_disease_mappings (medicine_id, disease_name, relevance_score)
              VALUES (${medicineId}, ${disease}, 100)
            `
            totalMappings++
          }
        }
      } catch (err) {
        console.error(`  ⚠️  Error inserting medicine ${med.brandName}:`, err.message)
      }
    }

    console.log('\n✅ Medicine seeding completed!')
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

// Run the scraper
console.log('🚀 Starting medicine scraper...\n')
clearAndSeedMedicines()
  .then(() => {
    console.log('\n✅ Scraping and seeding process completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Scraping and seeding process failed:', error)
    process.exit(1)
  })

