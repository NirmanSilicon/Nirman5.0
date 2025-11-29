/**
 * Seed Dashboard Data Script
 * Creates comprehensive dummy data for diseases, symptoms, outbreaks, and infection index
 * across multiple states and districts for dashboard testing
 */

import postgres from "postgres";
import dotenv from "dotenv";

dotenv.config();

const sql = postgres({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "pathogen",
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "",
});

// Diseases with their symptoms
const diseasesData = [
  {
    name: "Dengue",
    scientificName: "Dengue virus",
    category: "Infectious",
    description: "Mosquito-borne viral infection causing high fever and severe joint pain",
    symptoms: ["fever", "headache", "muscle pain", "rash", "joint pain", "nausea"],
    severity: "High",
    source: "ICMR"
  },
  {
    name: "Malaria",
    scientificName: "Plasmodium",
    category: "Infectious",
    description: "Parasitic disease transmitted by mosquitoes",
    symptoms: ["fever", "chills", "sweating", "nausea", "headache", "fatigue"],
    severity: "High",
    source: "ICMR"
  },
  {
    name: "Tuberculosis",
    scientificName: "Mycobacterium tuberculosis",
    category: "Infectious",
    description: "Bacterial infection affecting lungs and other organs",
    symptoms: ["persistent cough", "fever", "night sweats", "weight loss", "chest pain", "fatigue", "blood in sputum"],
    severity: "High",
    source: "MoHFW"
  },
  {
    name: "Chikungunya",
    scientificName: "CHIKV",
    category: "Infectious",
    description: "Viral disease transmitted by mosquitoes",
    symptoms: ["fever", "joint pain", "muscle pain", "headache", "rash"],
    severity: "Medium",
    source: "ICMR"
  },
  {
    name: "Typhoid",
    scientificName: "Salmonella Typhi",
    category: "Infectious",
    description: "Bacterial infection",
    symptoms: ["fever", "abdominal pain", "headache", "constipation", "diarrhea", "weakness"],
    severity: "Medium",
    source: "ICMR"
  },
  {
    name: "Influenza",
    scientificName: "Influenza virus",
    category: "Infectious",
    description: "Seasonal flu",
    symptoms: ["fever", "cough", "sore throat", "runny nose", "body ache", "fatigue"],
    severity: "Medium",
    source: "MoHFW"
  },
  {
    name: "Diarrhea",
    scientificName: "Various pathogens",
    category: "Infectious",
    description: "Gastrointestinal infection",
    symptoms: ["diarrhea", "abdominal pain", "nausea", "vomiting", "dehydration", "fever"],
    severity: "Medium",
    source: "ICMR"
  },
  {
    name: "Hepatitis A",
    scientificName: "HAV",
    category: "Infectious",
    description: "Viral liver infection",
    symptoms: ["fever", "fatigue", "nausea", "abdominal pain", "jaundice", "dark urine"],
    severity: "Medium",
    source: "ICMR"
  },
  {
    name: "Cholera",
    scientificName: "Vibrio cholerae",
    category: "Infectious",
    description: "Bacterial infection causing severe diarrhea and dehydration",
    symptoms: ["watery diarrhea", "vomiting", "dehydration", "rapid heart rate", "low blood pressure", "muscle cramps"],
    severity: "High",
    source: "ICMR"
  },
  {
    name: "Japanese Encephalitis",
    scientificName: "JEV",
    category: "Infectious",
    description: "Mosquito-borne viral infection affecting the brain",
    symptoms: ["fever", "headache", "vomiting", "confusion", "seizures", "paralysis"],
    severity: "High",
    source: "ICMR"
  },
  {
    name: "Leptospirosis",
    scientificName: "Leptospira",
    category: "Infectious",
    description: "Bacterial infection spread through contaminated water",
    symptoms: ["fever", "headache", "muscle pain", "chills", "red eyes", "jaundice"],
    severity: "Medium",
    source: "ICMR"
  },
  {
    name: "Scrub Typhus",
    scientificName: "Orientia tsutsugamushi",
    category: "Infectious",
    description: "Bacterial infection transmitted by mites",
    symptoms: ["fever", "headache", "body ache", "rash", "eschar", "lymph node swelling"],
    severity: "Medium",
    source: "ICMR"
  },
  {
    name: "Rabies",
    scientificName: "Rabies virus",
    category: "Infectious",
    description: "Viral infection transmitted through animal bites",
    symptoms: ["fever", "headache", "anxiety", "confusion", "hallucinations", "paralysis", "difficulty swallowing"],
    severity: "High",
    source: "MoHFW"
  }
];

// States and their districts
const stateDistricts = {
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Solapur", "Thane", "Ahmednagar", "Amravati", "Kolhapur"],
  "Karnataka": ["Bengaluru Urban", "Mysuru", "Hubballi", "Mangaluru", "Belagavi", "Kalaburagi", "Davangere", "Ballari", "Vijayapura", "Shivamogga"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Erode", "Vellore", "Thanjavur", "Dindigul"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Gandhinagar", "Junagadh", "Anand", "Bharuch"],
  "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri", "Bardhaman", "Malda", "Nadia", "Hooghly", "North 24 Parganas"],
  "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia", "Darbhanga", "Araria", "Begusarai", "Bhojpur", "Saran"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Kota", "Bikaner", "Ajmer", "Udaipur", "Bhilwara", "Alwar", "Sikar", "Bharatpur"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Agra", "Varanasi", "Allahabad", "Meerut", "Ghaziabad", "Noida", "Bareilly", "Aligarh"],
  "Odisha": ["Khordha", "Cuttack", "Bhubaneswar", "Puri", "Ganjam", "Sambalpur", "Rourkela", "Bargarh", "Bhadrak", "Kendujhar"],
  "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Hazaribagh", "Deoghar", "Dumka", "Giridih", "Chatra", "West Singhbhum"]
};

// Generate random date within last 90 days
function getRandomDate(daysAgo = 90) {
  const now = new Date();
  const daysBack = Math.floor(Math.random() * daysAgo);
  const date = new Date(now);
  date.setDate(date.getDate() - daysBack);
  return date;
}

// Generate random date for last 30 days
function getRecentDate() {
  return getRandomDate(30);
}

async function seedDashboardData() {
  try {
    console.log("🌱 Seeding comprehensive dashboard data...\n");

    // 1. Insert diseases
    console.log("📋 Step 1: Inserting diseases...");
    const diseaseIds = [];
    
    for (const disease of diseasesData) {
      const [result] = await sql`
        INSERT INTO diseases (name, scientific_name, category, description, symptoms, severity, source, is_active)
        VALUES (
          ${disease.name},
          ${disease.scientificName},
          ${disease.category},
          ${disease.description},
          ${JSON.stringify(disease.symptoms)}::jsonb,
          ${disease.severity},
          ${disease.source},
          true
        )
        ON CONFLICT DO NOTHING
        RETURNING id;
      `;
      
      if (result) {
        diseaseIds.push({ id: result.id, name: disease.name });
      } else {
        // Disease already exists, get its ID
        const [existing] = await sql`
          SELECT id FROM diseases WHERE name = ${disease.name} LIMIT 1;
        `;
        if (existing) {
          diseaseIds.push({ id: existing.id, name: disease.name });
        }
      }
    }
    
    console.log(`✅ Inserted/Found ${diseaseIds.length} diseases\n`);

    // 2. Insert disease outbreaks across multiple states and districts
    console.log("📍 Step 2: Inserting disease outbreaks by district...");
    let outbreakCount = 0;
    
    // Define case count ranges based on state (to match infection index)
    // Low states get fewer cases, high states get more cases
    // Odisha (38.4 - Low): fewer cases, Jharkhand (50.1 - Medium): moderate cases
    const stateCaseRanges = {
      "Maharashtra": { min: 300, max: 600 },  // High cases
      "Karnataka": { min: 250, max: 500 },     // High cases
      "Tamil Nadu": { min: 150, max: 300 },   // Medium cases
      "Gujarat": { min: 250, max: 500 },       // High cases
      "West Bengal": { min: 300, max: 600 },  // High cases
      "Bihar": { min: 250, max: 500 },         // High cases
      "Rajasthan": { min: 250, max: 500 },     // High cases
      "Uttar Pradesh": { min: 300, max: 600 }, // High cases
      "Odisha": { min: 30, max: 100 },         // Low cases (matches 38.4 low index)
      "Jharkhand": { min: 100, max: 250 }      // Medium cases (matches 50.1 medium index)
    };
    
    for (const [state, districts] of Object.entries(stateDistricts)) {
      const caseRange = stateCaseRanges[state] || { min: 50, max: 500 };
      
      for (const district of districts) {
        // Each district gets 2-4 disease outbreaks
        const numOutbreaks = Math.floor(Math.random() * 3) + 2;
        const selectedDiseases = diseaseIds
          .sort(() => Math.random() - 0.5)
          .slice(0, numOutbreaks);
        
        for (const disease of selectedDiseases) {
          // Use state-specific case range
          const caseCount = Math.floor(Math.random() * (caseRange.max - caseRange.min)) + caseRange.min;
          const activeCases = Math.floor(caseCount * (0.3 + Math.random() * 0.4));
          const recovered = Math.floor(caseCount * (0.2 + Math.random() * 0.3));
          const deaths = Math.floor(caseCount * 0.01);
          
          const riskLevel = caseCount > 300 ? "high" : caseCount > 150 ? "medium" : "low";
          const trends = ["rising", "stable", "falling"];
          const trend = trends[Math.floor(Math.random() * trends.length)];
          const trendPercentage = (Math.random() * 30 - 15).toFixed(2);
          
          await sql`
            INSERT INTO disease_outbreaks (
              disease_id, state, district, city, case_count, active_cases, recovered, deaths,
              risk_level, trend, trend_percentage, reported_date, source
            )
            VALUES (
              ${disease.id},
              ${state},
              ${district},
              ${district},
              ${caseCount},
              ${activeCases},
              ${recovered},
              ${deaths},
              ${riskLevel},
              ${trend},
              ${trendPercentage}::decimal,
              ${getRecentDate()},
              'MoHFW'
            );
          `;
          outbreakCount++;
        }
      }
    }
    
    console.log(`✅ Inserted ${outbreakCount} disease outbreaks across ${Object.keys(stateDistricts).length} states\n`);

    // 3. Insert symptom reports with location data
    console.log("📝 Step 3: Inserting symptom reports by district...");
    let reportCount = 0;
    const severities = ["Mild", "Moderate", "Severe"];
    
    for (const [state, districts] of Object.entries(stateDistricts)) {
      for (const district of districts) {
        // Each district gets 5-15 symptom reports
        const numReports = Math.floor(Math.random() * 11) + 5;
        
        for (let i = 0; i < numReports; i++) {
          // Random disease symptoms
          const disease = diseasesData[Math.floor(Math.random() * diseasesData.length)];
          const numSymptoms = Math.floor(Math.random() * 3) + 2;
          const symptoms = disease.symptoms
            .sort(() => Math.random() - 0.5)
            .slice(0, numSymptoms);
          
          const duration = Math.floor(Math.random() * 20) + 1;
          const severity = severities[Math.floor(Math.random() * severities.length)];
          
          await sql`
            INSERT INTO symptom_reports (
              email, symptoms, duration_days, severity, location, status, created_at
            )
            VALUES (
              ${`user${reportCount}@example.com`},
              ${JSON.stringify(symptoms)}::jsonb,
              ${duration},
              ${severity},
              ${JSON.stringify({
                state: state,
                district: district,
                city: district,
                coordinates: {
                  latitude: 19.0 + Math.random() * 10,
                  longitude: 72.0 + Math.random() * 10
                }
              })}::jsonb,
              'pending',
              ${getRecentDate()}
            );
          `;
          reportCount++;
        }
      }
    }
    
    console.log(`✅ Inserted ${reportCount} symptom reports\n`);

    // 4. Insert infection index data by district
    console.log("📊 Step 4: Inserting infection index by district...");
    let indexCount = 0;
    
    // Assign infection index ranges to states for better heatmap visualization
    // High (70-100), Medium (40-69), Low (0-39)
    // Specific values: Odisha = 38.4 (Low - Green), Jharkhand = 50.1 (Medium - Orange/Yellow)
    const stateIndexRanges = {
      "Maharashtra": { min: 75, max: 90 },  // High - Red
      "Karnataka": { min: 70, max: 85 },    // High - Red
      "Tamil Nadu": { min: 50, max: 65 },   // Medium - Orange/Yellow
      "Gujarat": { min: 70, max: 85 },      // High - Red
      "West Bengal": { min: 75, max: 90 },  // High - Red
      "Bihar": { min: 70, max: 85 },        // High - Red
      "Rajasthan": { min: 70, max: 85 },    // High - Red
      "Uttar Pradesh": { min: 70, max: 85 }, // High - Red
      "Odisha": { min: 38.0, max: 38.8 },   // Low - Green (target: 38.4)
      "Jharkhand": { min: 49.8, max: 50.4 }  // Medium - Orange/Yellow (target: 50.1)
    };
    
    // Generate data for last 8 weeks
    const weeks = [];
    const now = new Date();
    for (let i = 0; i < 8; i++) {
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - (i * 7) - 7);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      
      const year = weekStart.getFullYear();
      const weekNum = Math.ceil((weekStart - new Date(year, 0, 1)) / (7 * 24 * 60 * 60 * 1000));
      weeks.push({
        week: `${year}-W${weekNum.toString().padStart(2, '0')}`,
        start: weekStart,
        end: weekEnd
      });
    }
    
    for (const [state, districts] of Object.entries(stateDistricts)) {
      // Get the index range for this state
      const range = stateIndexRanges[state] || { min: 30, max: 60 };
      
      for (const district of districts) {
        // Each district gets infection index for last 4 weeks
        const selectedWeeks = weeks.slice(0, 4);
        
        for (const weekData of selectedWeeks) {
          // Generate index value - use specific targets for Odisha and Jharkhand
          let indexValue;
          if (state === "Odisha") {
            // Target: 38.4 (Low - Green)
            indexValue = (38.4 + (Math.random() - 0.5) * 0.5).toFixed(2); // 38.15 - 38.65
          } else if (state === "Jharkhand") {
            // Target: 50.1 (Medium - Orange/Yellow)
            indexValue = (50.1 + (Math.random() - 0.5) * 0.5).toFixed(2); // 49.85 - 50.35
          } else {
            // For other states, use range-based generation
            const baseIndex = range.min + Math.random() * (range.max - range.min);
            const isLowOrMedium = range.max < 70;
            const variation = isLowOrMedium 
              ? (Math.random() - 0.5) * 2  // ±1.0 variation for low/medium states
              : (Math.random() - 0.5) * 5;  // ±2.5 variation for high states
            indexValue = Math.max(0, Math.min(100, baseIndex + variation)).toFixed(2);
          }
          
          // Adjust reports and disease count based on index value
          // Lower index = fewer reports and cases
          const indexNum = parseFloat(indexValue);
          const totalReports = Math.floor(indexNum * 2 + Math.random() * 30);
          const diseaseCount = Math.floor(indexNum / 12) + 1;
          
          await sql`
            INSERT INTO infection_index (
              week, week_start_date, week_end_date, state, district, index_value, total_reports, disease_count
            )
            VALUES (
              ${weekData.week},
              ${weekData.start},
              ${weekData.end},
              ${state},
              ${district},
              ${indexValue}::decimal,
              ${totalReports},
              ${diseaseCount}
            );
          `;
          indexCount++;
        }
      }
    }
    
    console.log(`✅ Inserted ${indexCount} infection index records\n`);

    // 5. Summary
    console.log("✅ Dashboard data seeding complete!\n");
    console.log("📊 Summary:");
    console.log(`   - Diseases: ${diseaseIds.length}`);
    console.log(`   - Disease Outbreaks: ${outbreakCount}`);
    console.log(`   - Symptom Reports: ${reportCount}`);
    console.log(`   - Infection Index Records: ${indexCount}`);
    console.log(`   - States: ${Object.keys(stateDistricts).length}`);
    console.log(`   - Total Districts: ${Object.values(stateDistricts).flat().length}\n`);
    
    console.log("🎯 You can now:");
    console.log("   - Filter by state/district in dashboard");
    console.log("   - View trending diseases by district");
    console.log("   - See infection index scores by district");
    console.log("   - View heatmap data by state\n");

  } catch (error) {
    console.error("❌ Error seeding dashboard data:", error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

seedDashboardData();

