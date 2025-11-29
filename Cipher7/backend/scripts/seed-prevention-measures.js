/**
 * Seed Prevention Measures Script
 * Creates prevention measures data for diseases
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

// Prevention measures for different diseases
const preventionMeasuresData = [
  {
    diseaseName: "Dengue",
    measures: [
      {
        title: "Mosquito Control and Environmental Management",
        description: "Comprehensive mosquito control strategies to prevent dengue transmission by eliminating breeding sites",
        measures: [
          "Remove standing water from containers, flower pots, buckets, and gutters weekly",
          "Cover water storage containers with tight-fitting lids",
          "Clean and scrub containers to remove mosquito eggs before refilling",
          "Dispose of unused containers, tires, and items that can collect water",
          "Use larvicides (temephos) in water storage containers that cannot be emptied",
          "Organize community cleanup drives to remove potential mosquito breeding sites",
          "Ensure proper drainage systems to prevent water accumulation",
          "Keep swimming pools clean and chlorinated"
        ],
        category: "Environmental",
        priority: "high",
        source: "WHO"
      },
      {
        title: "Personal Protection Measures",
        description: "Individual protection strategies to prevent mosquito bites",
        measures: [
          "Apply DEET-based (20-30%) or picaridin-based insect repellents on exposed skin",
          "Reapply repellent every 4-6 hours or as directed",
          "Wear light-colored, long-sleeved shirts and long pants",
          "Use permethrin-treated clothing for additional protection",
          "Sleep under insecticide-treated bed nets, especially during daytime",
          "Install window and door screens to prevent mosquito entry",
          "Use air conditioning when available to keep mosquitoes away",
          "Avoid outdoor activities during peak mosquito hours (early morning and late afternoon)"
        ],
        category: "Hygiene",
        priority: "high",
        source: "ICMR"
      },
      {
        title: "Community Awareness and Early Detection",
        description: "Community-level interventions and early symptom recognition",
        measures: [
          "Educate community about dengue symptoms (fever, severe headache, joint pain)",
          "Seek immediate medical attention if dengue symptoms appear",
          "Avoid self-medication, especially aspirin and NSAIDs",
          "Maintain adequate hydration if infected",
          "Support vector control programs in your area",
          "Report suspected cases to local health authorities"
        ],
        category: "Lifestyle",
        priority: "medium",
        source: "WHO"
      }
    ]
  },
  {
    diseaseName: "Malaria",
    measures: [
      {
        title: "Vector Control and Environmental Management",
        description: "Comprehensive mosquito control strategies to prevent malaria transmission",
        measures: [
          "Sleep under insecticide-treated bed nets (ITNs) every night",
          "Ensure bed nets are properly installed and not torn",
          "Re-treat bed nets with insecticide every 6-12 months",
          "Support indoor residual spraying (IRS) programs in your community",
          "Eliminate all mosquito breeding sites (stagnant water, puddles)",
          "Drain and fill water-logged areas around your home",
          "Use larvicides in water bodies that cannot be drained",
          "Install window and door screens",
          "Use mosquito coils or vaporizers in living areas"
        ],
        category: "Environmental",
        priority: "high",
        source: "WHO"
      },
      {
        title: "Chemoprevention and Medication",
        description: "Medication-based prevention for high-risk individuals and travelers",
        measures: [
          "Take antimalarial prophylaxis if traveling to or living in endemic areas",
          "Start prophylaxis 1-2 weeks before travel and continue 4 weeks after return",
          "Complete full course of preventive medication as prescribed by doctor",
          "Consult healthcare provider before taking antimalarial drugs",
          "Inform doctor about any existing medical conditions or medications",
          "Monitor for side effects and report immediately if any occur",
          "Pregnant women in endemic areas should take preventive medication as recommended"
        ],
        category: "Medical",
        priority: "high",
        source: "ICMR"
      },
      {
        title: "Personal Protection",
        description: "Individual measures to prevent mosquito bites",
        measures: [
          "Wear long-sleeved clothing and long pants, especially in evenings",
          "Use insect repellents containing DEET (20-50%) on exposed skin",
          "Apply repellent to clothing for additional protection",
          "Avoid outdoor activities during peak mosquito hours (dusk to dawn)",
          "Use air conditioning or fans to keep mosquitoes away",
          "Stay in well-screened or air-conditioned rooms"
        ],
        category: "Hygiene",
        priority: "high",
        source: "WHO"
      }
    ]
  },
  {
    diseaseName: "Tuberculosis",
    measures: [
      {
        title: "BCG Vaccination",
        description: "Get vaccinated with BCG vaccine, especially for children and high-risk individuals",
        measures: [
          "Ensure BCG vaccination is given to newborns within first year",
          "Complete BCG vaccination schedule as recommended by healthcare provider",
          "High-risk individuals should consult doctor about BCG vaccination",
          "Keep vaccination records updated",
          "Follow up with healthcare provider for vaccination status"
        ],
        category: "Vaccination",
        priority: "high",
        source: "MoHFW"
      },
      {
        title: "Infection Control and Hygiene",
        description: "Prevent TB transmission through proper hygiene and infection control measures",
        measures: [
          "Cover mouth and nose with tissue or elbow when coughing or sneezing",
          "Dispose of used tissues immediately in a sealed bag",
          "Wash hands frequently with soap and water, especially after coughing",
          "Avoid spitting in public places",
          "Use separate utensils and personal items if living with TB patient",
          "Ensure good ventilation in living spaces",
          "Open windows regularly to allow fresh air circulation"
        ],
        category: "Hygiene",
        priority: "high",
        source: "WHO"
      },
      {
        title: "Early Detection and Treatment",
        description: "Early diagnosis and complete treatment to prevent spread and complications",
        measures: [
          "Get tested if you have persistent cough for more than 2 weeks",
          "Complete full course of TB treatment as prescribed (6-9 months)",
          "Do not stop medication even if symptoms improve",
          "Take medication at the same time every day",
          "Attend all follow-up appointments with healthcare provider",
          "Inform close contacts to get tested if you are diagnosed with TB",
          "Support TB patients to complete their treatment"
        ],
        category: "Medical",
        priority: "high",
        source: "ICMR"
      },
      {
        title: "Nutrition and Immune Support",
        description: "Maintain good nutrition and immune health to prevent TB infection",
        measures: [
          "Eat a balanced diet rich in proteins, vitamins, and minerals",
          "Include foods high in vitamin D (fish, eggs, fortified foods)",
          "Maintain healthy body weight",
          "Avoid excessive alcohol consumption",
          "Quit smoking as it increases TB risk",
          "Manage diabetes and other chronic conditions properly",
          "Get adequate sleep and rest"
        ],
        category: "Lifestyle",
        priority: "medium",
        source: "ICMR"
      }
    ]
  },
  {
    diseaseName: "Chikungunya",
    measures: [
      {
        title: "Mosquito Control and Prevention",
        description: "Comprehensive measures to prevent Aedes mosquito bites and breeding",
        measures: [
          "Eliminate all mosquito breeding sites (containers, flower pots, tires)",
          "Remove standing water from around your home weekly",
          "Cover water storage containers with tight lids",
          "Use mosquito repellents containing DEET (20-30%) or picaridin on exposed skin",
          "Wear light-colored, long-sleeved shirts and long pants",
          "Use mosquito nets while sleeping, especially during daytime",
          "Install window and door screens to prevent mosquito entry",
          "Use mosquito coils or vaporizers in living areas",
          "Avoid outdoor activities during peak mosquito hours (early morning and late afternoon)",
          "Support community-wide mosquito control programs"
        ],
        category: "Environmental",
        priority: "high",
        source: "ICMR"
      },
      {
        title: "Symptom Management and Medical Care",
        description: "Early recognition and proper management of chikungunya symptoms",
        measures: [
          "Recognize symptoms: sudden high fever, severe joint pain, muscle pain, headache, rash",
          "Seek medical attention immediately if symptoms appear",
          "Get adequate rest and maintain hydration",
          "Use acetaminophen for fever and pain (avoid aspirin and NSAIDs initially)",
          "Apply cold compresses to reduce joint swelling",
          "Avoid mosquito bites if infected to prevent further transmission",
          "Follow doctor's advice for pain management and recovery"
        ],
        category: "Medical",
        priority: "medium",
        source: "WHO"
      }
    ]
  },
  {
    diseaseName: "Typhoid",
    measures: [
      {
        title: "Food and Water Safety",
        description: "Comprehensive food and water hygiene practices to prevent typhoid",
        measures: [
          "Drink only boiled, filtered, or treated water",
          "Avoid ice cubes made from untreated water",
          "Wash hands thoroughly with soap before eating and after using toilet",
          "Eat only well-cooked, hot food",
          "Avoid raw fruits and vegetables unless properly washed and peeled",
          "Avoid street food and unhygienic food vendors",
          "Choose restaurants with good hygiene practices",
          "Avoid raw or undercooked seafood",
          "Use bottled water for drinking and brushing teeth when traveling",
          "Practice safe food handling and storage at home"
        ],
        category: "Hygiene",
        priority: "high",
        source: "WHO"
      },
      {
        title: "Vaccination",
        description: "Get vaccinated against typhoid for protection",
        measures: [
          "Get typhoid vaccine before traveling to endemic areas",
          "Two types available: injectable (Vi polysaccharide) and oral (live attenuated)",
          "Complete full vaccination schedule as recommended",
          "Get booster shots every 2-3 years for injectable vaccine",
          "Oral vaccine requires 4 doses taken every other day",
          "Consult healthcare provider to determine best vaccine type for you",
          "Vaccination is especially important for travelers to South Asia"
        ],
        category: "Vaccination",
        priority: "high",
        source: "ICMR"
      },
      {
        title: "Sanitation and Hygiene",
        description: "Maintain proper sanitation to prevent typhoid spread",
        measures: [
          "Use proper toilet facilities and maintain cleanliness",
          "Dispose of waste properly",
          "Avoid contact with infected individuals",
          "Do not share personal items like towels or utensils",
          "Maintain good personal hygiene practices",
          "Support community sanitation improvement programs"
        ],
        category: "Hygiene",
        priority: "medium",
        source: "WHO"
      }
    ]
  },
  {
    diseaseName: "Hepatitis A",
    measures: [
      {
        title: "Hygiene and Sanitation",
        description: "Comprehensive hygiene practices to prevent Hepatitis A transmission",
        measures: [
          "Wash hands thoroughly with soap and water for at least 20 seconds",
          "Wash hands before preparing food, eating, and after using toilet",
          "Avoid contaminated food and water, especially in areas with poor sanitation",
          "Drink only treated or bottled water when traveling",
          "Practice safe food handling and preparation",
          "Cook food thoroughly and avoid raw or undercooked shellfish",
          "Avoid sharing personal items like towels, razors, or eating utensils",
          "Maintain clean living environment and proper waste disposal",
          "Use proper sanitation facilities"
        ],
        category: "Hygiene",
        priority: "high",
        source: "WHO"
      },
      {
        title: "Vaccination",
        description: "Get vaccinated against Hepatitis A for long-term protection",
        measures: [
          "Get Hepatitis A vaccine (two-dose series recommended)",
          "First dose provides protection, second dose (6-12 months later) provides long-term immunity",
          "Vaccination is especially recommended for travelers to endemic areas",
          "Children should receive vaccine as part of routine immunization",
          "High-risk groups (healthcare workers, food handlers) should prioritize vaccination",
          "Consult healthcare provider for vaccination schedule"
        ],
        category: "Vaccination",
        priority: "high",
        source: "WHO"
      }
    ]
  },
  {
    diseaseName: "Influenza",
    measures: [
      {
        title: "Annual Vaccination",
        description: "Get annual flu vaccine to prevent influenza",
        measures: [
          "Get flu vaccine every year before flu season",
          "Vaccination is especially important for high-risk groups",
          "Children, elderly, and pregnant women should prioritize vaccination",
          "Vaccine effectiveness varies each year but still provides protection"
        ],
        category: "Vaccination",
        priority: "high",
        source: "WHO"
      },
      {
        title: "Preventive Practices",
        description: "Daily practices to reduce flu transmission",
        measures: [
          "Wash hands frequently with soap and water",
          "Avoid close contact with sick people",
          "Stay home when you are sick",
          "Cover your mouth and nose when coughing or sneezing",
          "Clean and disinfect frequently touched surfaces"
        ],
        category: "Hygiene",
        priority: "medium",
        source: "WHO"
      }
    ]
  },
  {
    diseaseName: "Diarrhea",
    measures: [
      {
        title: "Water, Sanitation, and Hygiene (WASH)",
        description: "Comprehensive WASH practices to prevent diarrheal diseases",
        measures: [
          "Drink only safe, treated, or boiled water",
          "Use proper sanitation facilities and maintain cleanliness",
          "Wash hands with soap and water for at least 20 seconds",
          "Wash hands after using toilet, before eating, and before preparing food",
          "Practice safe food handling, preparation, and storage",
          "Cook food thoroughly and eat while still hot",
          "Avoid raw or undercooked foods, especially meat and seafood",
          "Wash fruits and vegetables thoroughly before eating",
          "Use clean utensils and serving dishes",
          "Maintain clean kitchen and food preparation areas",
          "Dispose of waste properly and maintain clean environment"
        ],
        category: "Hygiene",
        priority: "high",
        source: "WHO"
      },
      {
        title: "Oral Rehydration and Treatment",
        description: "Proper management to prevent dehydration and complications",
        measures: [
          "Drink oral rehydration solution (ORS) at first sign of diarrhea",
          "Continue breastfeeding for infants (do not stop during diarrhea)",
          "Eat small, frequent, light meals (banana, rice, toast)",
          "Avoid sugary drinks, caffeine, and alcohol which can worsen diarrhea",
          "Stay hydrated with clean water and ORS",
          "Seek medical attention if diarrhea persists more than 2-3 days",
          "Watch for signs of dehydration (dry mouth, decreased urination, dizziness)",
          "Children and elderly are at higher risk - monitor closely",
          "Do not self-medicate with antibiotics without doctor's prescription"
        ],
        category: "Medical",
        priority: "high",
        source: "WHO"
      },
      {
        title: "Food Safety Practices",
        description: "Safe food practices to prevent foodborne diarrhea",
        measures: [
          "Buy food from reputable sources with good hygiene practices",
          "Avoid street food in areas with poor sanitation",
          "Keep raw and cooked foods separate",
          "Refrigerate perishable foods promptly",
          "Reheat food thoroughly before eating",
          "Avoid consuming expired or spoiled food",
          "Use clean water for cooking and washing food"
        ],
        category: "Hygiene",
        priority: "medium",
        source: "WHO"
      }
    ]
  },
  {
    diseaseName: "Cholera",
    measures: [
      {
        title: "Safe Water and Sanitation",
        description: "Critical measures to prevent cholera transmission through contaminated water",
        measures: [
          "Drink only boiled, filtered, or chlorinated water",
          "Use bottled water from trusted sources when available",
          "Avoid ice cubes made from untreated water",
          "Use safe water for cooking, washing dishes, and brushing teeth",
          "Store water in clean, covered containers",
          "Use proper sanitation facilities and maintain cleanliness",
          "Avoid swimming or bathing in potentially contaminated water",
          "Dispose of human waste properly"
        ],
        category: "Hygiene",
        priority: "high",
        source: "WHO"
      },
      {
        title: "Food Safety",
        description: "Safe food handling to prevent cholera infection",
        measures: [
          "Eat only well-cooked, hot food",
          "Avoid raw or undercooked seafood",
          "Wash fruits and vegetables thoroughly with safe water",
          "Avoid street food in areas with poor sanitation",
          "Practice safe food handling and storage",
          "Avoid raw vegetables and salads in high-risk areas",
          "Choose restaurants with good hygiene practices"
        ],
        category: "Hygiene",
        priority: "high",
        source: "WHO"
      },
      {
        title: "Oral Cholera Vaccine",
        description: "Vaccination for protection against cholera",
        measures: [
          "Get oral cholera vaccine (OCV) before traveling to endemic areas",
          "Two doses required, 1-2 weeks apart",
          "Vaccine provides protection for 2-3 years",
          "Consult healthcare provider for vaccination schedule",
          "Vaccination is especially important during outbreaks",
          "Complete full vaccination course for maximum protection"
        ],
        category: "Vaccination",
        priority: "high",
        source: "WHO"
      }
    ]
  },
  {
    diseaseName: "Japanese Encephalitis",
    measures: [
      {
        title: "Vaccination",
        description: "Get vaccinated against Japanese Encephalitis",
        measures: [
          "Get JE vaccine before traveling to endemic areas",
          "Two-dose schedule: Day 0 and Day 28",
          "Booster dose may be required after 1-2 years",
          "Vaccination is especially important for children in endemic areas",
          "Complete full vaccination schedule as recommended",
          "Consult healthcare provider for vaccination requirements",
          "Vaccination provides long-term protection"
        ],
        category: "Vaccination",
        priority: "high",
        source: "ICMR"
      },
      {
        title: "Mosquito Control",
        description: "Prevent mosquito bites that transmit Japanese Encephalitis",
        measures: [
          "Use insect repellents containing DEET (20-30%) or picaridin",
          "Wear light-colored, long-sleeved shirts and long pants",
          "Use mosquito nets while sleeping",
          "Install window and door screens",
          "Eliminate mosquito breeding sites (stagnant water)",
          "Use mosquito coils or vaporizers in living areas",
          "Avoid outdoor activities during peak mosquito hours (dusk and dawn)",
          "Support community-wide mosquito control programs"
        ],
        category: "Environmental",
        priority: "high",
        source: "ICMR"
      },
      {
        title: "Pig and Bird Management",
        description: "Reduce exposure to animals that carry the virus",
        measures: [
          "Avoid close contact with pigs and birds in endemic areas",
          "Keep domestic animals away from living areas",
          "Use proper animal waste management",
          "Support vaccination programs for pigs in endemic areas",
          "Maintain distance from pig farms and bird habitats"
        ],
        category: "Environmental",
        priority: "medium",
        source: "ICMR"
      }
    ]
  },
  {
    diseaseName: "Leptospirosis",
    measures: [
      {
        title: "Avoid Contaminated Water",
        description: "Prevent exposure to water contaminated with animal urine",
        measures: [
          "Avoid swimming or wading in floodwater, ponds, or stagnant water",
          "Wear protective footwear (boots, waders) when working in water",
          "Avoid contact with water that may be contaminated with animal urine",
          "Do not drink water from potentially contaminated sources",
          "Cover cuts and wounds with waterproof bandages before water contact",
          "Shower immediately after exposure to potentially contaminated water",
          "Avoid recreational activities in flood-affected areas"
        ],
        category: "Environmental",
        priority: "high",
        source: "ICMR"
      },
      {
        title: "Animal Contact Prevention",
        description: "Reduce risk from contact with infected animals",
        measures: [
          "Avoid contact with rodents and their urine",
          "Keep food and garbage in sealed containers to prevent rodent access",
          "Control rodent populations around homes and workplaces",
          "Wear gloves when handling animals or animal waste",
          "Wash hands thoroughly after handling animals",
          "Avoid contact with stray or wild animals",
          "Keep pets vaccinated and healthy"
        ],
        category: "Hygiene",
        priority: "high",
        source: "ICMR"
      },
      {
        title: "Occupational Safety",
        description: "Protection for high-risk occupations",
        measures: [
          "Wear protective clothing (boots, gloves, goggles) in high-risk jobs",
          "Farmers, sewer workers, and veterinarians should take extra precautions",
          "Clean and disinfect work equipment regularly",
          "Take breaks and maintain good hygiene at work",
          "Seek medical attention immediately if symptoms develop after exposure",
          "Inform healthcare provider about occupational exposure"
        ],
        category: "Lifestyle",
        priority: "high",
        source: "ICMR"
      }
    ]
  },
  {
    diseaseName: "Scrub Typhus",
    measures: [
      {
        title: "Avoid Mite-Infested Areas",
        description: "Prevent exposure to mites that transmit scrub typhus",
        measures: [
          "Avoid areas with tall grass, bushes, and forest undergrowth",
          "Wear protective clothing (long sleeves, long pants, boots) in rural areas",
          "Tuck pants into socks or boots to prevent mites from crawling up",
          "Use insect repellents containing DEET on exposed skin and clothing",
          "Avoid sitting or lying directly on grass or ground",
          "Use ground sheets or blankets when camping or picnicking",
          "Shower and change clothes immediately after outdoor activities"
        ],
        category: "Environmental",
        priority: "high",
        source: "ICMR"
      },
      {
        title: "Personal Protection",
        description: "Individual protection measures against mite bites",
        measures: [
          "Apply permethrin-treated clothing for additional protection",
          "Inspect body for mites after outdoor activities",
          "Remove attached mites carefully with tweezers",
          "Wash clothes in hot water after outdoor exposure",
          "Keep living areas clean and free of rodents (which carry mites)",
          "Use insect repellents on exposed skin",
          "Avoid walking barefoot in rural or forested areas"
        ],
        category: "Hygiene",
        priority: "high",
        source: "ICMR"
      },
      {
        title: "Early Detection and Treatment",
        description: "Recognize symptoms and seek prompt treatment",
        measures: [
          "Watch for symptoms: fever, headache, body ache, rash, eschar (dark scab)",
          "Seek medical attention immediately if symptoms develop after outdoor exposure",
          "Inform healthcare provider about recent outdoor activities",
          "Complete full course of antibiotics as prescribed",
          "Do not delay treatment as scrub typhus can be serious if untreated"
        ],
        category: "Medical",
        priority: "high",
        source: "ICMR"
      }
    ]
  },
  {
    diseaseName: "Rabies",
    measures: [
      {
        title: "Avoid Animal Bites",
        description: "Prevent contact with potentially rabid animals",
        measures: [
          "Avoid contact with stray dogs, cats, and wild animals",
          "Do not approach or try to pet unfamiliar animals",
          "Keep distance from animals showing unusual behavior (aggressive, disoriented)",
          "Do not disturb animals while they are eating, sleeping, or caring for young",
          "Supervise children around animals",
          "Report stray animals to local authorities",
          "Keep pets on leash in public areas"
        ],
        category: "Lifestyle",
        priority: "high",
        source: "MoHFW"
      },
      {
        title: "Pet Vaccination",
        description: "Vaccinate pets to prevent rabies transmission",
        measures: [
          "Vaccinate dogs and cats against rabies annually",
          "Keep pet vaccination records up to date",
          "Vaccinate pets starting at 3-4 months of age",
          "Follow up with booster shots as recommended by veterinarian",
          "Do not allow unvaccinated pets to roam freely",
          "Report any animal bites from pets to healthcare provider",
          "Support community-wide pet vaccination programs"
        ],
        category: "Vaccination",
        priority: "high",
        source: "MoHFW"
      },
      {
        title: "Post-Exposure Prophylaxis",
        description: "Immediate action after animal bite or scratch",
        measures: [
          "Wash wound immediately with soap and running water for at least 15 minutes",
          "Apply antiseptic or alcohol to the wound",
          "Seek medical attention immediately, even for minor bites",
          "Get rabies vaccination (post-exposure prophylaxis) as soon as possible",
          "Complete full course of rabies vaccine (4-5 doses over 2-4 weeks)",
          "Get rabies immunoglobulin (RIG) if recommended by doctor",
          "Do not delay treatment - rabies is almost always fatal once symptoms appear",
          "Report the incident to local health authorities"
        ],
        category: "Medical",
        priority: "high",
        source: "WHO"
      },
      {
        title: "Pre-Exposure Vaccination",
        description: "Vaccination for high-risk individuals",
        measures: [
          "Get pre-exposure rabies vaccine if you work with animals",
          "Veterinarians, animal handlers, and wildlife workers should be vaccinated",
          "Three-dose schedule: Day 0, Day 7, Day 21 or 28",
          "Booster doses may be required every 2-3 years",
          "Pre-exposure vaccination simplifies post-exposure treatment",
          "Consult healthcare provider for vaccination schedule"
        ],
        category: "Vaccination",
        priority: "medium",
        source: "WHO"
      }
    ]
  }
];

async function seedPreventionMeasures() {
  try {
    console.log("🛡️ Seeding prevention measures data...\n");

    // Create table if it doesn't exist
    console.log("📋 Creating disease_prevention table if it doesn't exist...");
    await sql`
      CREATE TABLE IF NOT EXISTS disease_prevention (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        disease_id UUID NOT NULL REFERENCES diseases(id),
        disease_name VARCHAR(255) NOT NULL,
        state VARCHAR(100),
        district VARCHAR(100),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        measures JSONB NOT NULL,
        category VARCHAR(100),
        priority VARCHAR(20) DEFAULT 'medium',
        source VARCHAR(100),
        source_url TEXT,
        is_active BOOLEAN DEFAULT true NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `;
    console.log("✅ Table created/verified\n");

    // Get all diseases from database
    const diseases = await sql`
      SELECT id, name FROM diseases WHERE is_active = true;
    `;

    if (diseases.length === 0) {
      console.log("⚠️ No diseases found in database. Please run seed-dashboard-data.js first.");
      return;
    }

    console.log(`📋 Found ${diseases.length} diseases in database\n`);

    let totalInserted = 0;

    // Insert prevention measures for each disease
    for (const diseaseData of preventionMeasuresData) {
      const disease = diseases.find(d => d.name === diseaseData.diseaseName);
      
      if (!disease) {
        console.log(`⚠️ Disease "${diseaseData.diseaseName}" not found in database, skipping...`);
        continue;
      }

      console.log(`📝 Inserting prevention measures for ${diseaseData.diseaseName}...`);

      for (const measure of diseaseData.measures) {
        try {
          await sql`
            INSERT INTO disease_prevention (
              disease_id,
              disease_name,
              title,
              description,
              measures,
              category,
              priority,
              source,
              is_active
            ) VALUES (
              ${disease.id},
              ${diseaseData.diseaseName},
              ${measure.title},
              ${measure.description},
              ${JSON.stringify(measure.measures)}::jsonb,
              ${measure.category},
              ${measure.priority},
              ${measure.source},
              true
            )
            ON CONFLICT DO NOTHING;
          `;
          totalInserted++;
        } catch (error) {
          console.error(`❌ Error inserting measure for ${diseaseData.diseaseName}:`, error.message);
        }
      }
    }

    console.log(`\n✅ Prevention measures seeding complete!`);
    console.log(`📊 Summary:`);
    console.log(`   - Total prevention measures inserted: ${totalInserted}`);
    console.log(`   - Diseases covered: ${preventionMeasuresData.length}\n`);

  } catch (error) {
    console.error("❌ Error seeding prevention measures:", error);
    throw error;
  } finally {
    await sql.end();
  }
}

// Run the seeding
seedPreventionMeasures()
  .then(() => {
    console.log("✅ Seeding completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  });

