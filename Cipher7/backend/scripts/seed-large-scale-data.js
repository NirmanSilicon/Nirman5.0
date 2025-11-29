/**
 * Large-Scale Data Seeding Script
 * Generates comprehensive mock data for all Phase 2 features
 */

import postgres from "postgres";
import dotenv from "dotenv";
import { mockDiseases, generateMockOutbreaks, indianStates, generateHistoricalOutbreakData } from "../src/data/mock-diseases.js";

dotenv.config();

const sql = postgres({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "pathogen",
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "",
});

async function seedLargeScaleData() {
  try {
    console.log("🌱 Seeding large-scale mock data...\n");

    // 1. Insert all diseases
    console.log("📋 Inserting diseases...");
    const diseaseMap = new Map();
    
    for (const disease of mockDiseases) {
      try {
        // Check if exists
        const [existing] = await sql`
          SELECT id FROM diseases WHERE name = ${disease.name}
        `;
        
        if (existing) {
          diseaseMap.set(disease.name, existing.id);
          console.log(`  ⏭️  Skipped: ${disease.name} (already exists)`);
          continue;
        }
        
        const [inserted] = await sql`
          INSERT INTO diseases (
            name, scientific_name, category, description, symptoms, severity, source, is_active
          )
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
          RETURNING id, name
        `;
        
        diseaseMap.set(disease.name, inserted.id);
        console.log(`  ✅ Inserted: ${disease.name}`);
      } catch (error: any) {
        console.error(`  ❌ Error inserting ${disease.name}:`, error.message);
      }
    }

    console.log(`\n✅ Inserted ${diseaseMap.size} diseases\n`);

    // 2. Insert large-scale outbreaks (multiple per disease, multiple states)
    console.log("📍 Inserting disease outbreaks...");
    let outbreakCount = 0;
    
    for (const disease of mockDiseases) {
      const diseaseId = diseaseMap.get(disease.name);
      if (!diseaseId) continue;
      
      // Generate 5-8 outbreaks per disease across different states
      const outbreaks = generateMockOutbreaks(disease.name, Math.floor(Math.random() * 4) + 5);
      
      for (const outbreak of outbreaks) {
        try {
          await sql`
            INSERT INTO disease_outbreaks (
              disease_id, state, district, city, case_count, active_cases, recovered, deaths,
              risk_level, trend, trend_percentage, reported_date, source, metadata
            )
            VALUES (
              ${diseaseId},
              ${outbreak.state},
              ${outbreak.district},
              ${outbreak.city},
              ${outbreak.caseCount},
              ${outbreak.activeCases},
              ${outbreak.recovered},
              ${outbreak.deaths},
              ${outbreak.riskLevel},
              ${outbreak.trend},
              ${outbreak.trendPercentage?.toString()},
              ${outbreak.reportedDate}::timestamp,
              ${outbreak.source},
              ${JSON.stringify(outbreak.metadata || {})}::jsonb
            )
          `;
          outbreakCount++;
        } catch (error: any) {
          console.error(`  ❌ Error inserting outbreak for ${disease.name} in ${outbreak.state}:`, error.message);
        }
      }
      console.log(`  ✅ ${disease.name}: ${outbreaks.length} outbreaks`);
    }

    console.log(`\n✅ Inserted ${outbreakCount} disease outbreaks\n`);

    // 3. Insert infection index data (12 weeks of data for all states)
    console.log("📊 Inserting infection index data...");
    const weeks = 12;
    let indexCount = 0;
    
    const today = new Date();
    for (let i = weeks - 1; i >= 0; i--) {
      const weekStart = new Date(today);
      weekStart.setDate(weekStart.getDate() - (i * 7) - 7);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      
      const weekNumber = getWeekNumber(weekStart);
      const year = weekStart.getFullYear();
      const week = `${year}-W${weekNumber.toString().padStart(2, "0")}`;
      
      for (const state of indianStates) {
        try {
          await sql`
            INSERT INTO infection_index (
              week, week_start_date, week_end_date, state, index_value, total_reports, disease_count
            )
            VALUES (
              ${week},
              ${weekStart.toISOString()}::timestamp,
              ${weekEnd.toISOString()}::timestamp,
              ${state},
              ${(Math.random() * 50 + 20).toFixed(2)},
              ${Math.floor(Math.random() * 200) + 50},
              ${Math.floor(Math.random() * 5) + 1}
            )
            ON CONFLICT DO NOTHING
          `;
          indexCount++;
        } catch (error: any) {
          // Ignore duplicates
        }
      }
    }

    console.log(`\n✅ Inserted ${indexCount} infection index records\n`);

    // 4. Generate sample symptom reports
    console.log("🏥 Inserting sample symptom reports...");
    let reportCount = 0;
    const sampleSymptoms = [
      ["fever", "headache", "body pain"],
      ["cough", "cold", "sore throat"],
      ["fever", "rash", "joint pain"],
      ["vomiting", "diarrhea", "nausea"],
      ["fever", "muscle pain", "fatigue"],
      ["cough", "fever", "difficulty breathing"],
    ];
    
    for (let i = 0; i < 50; i++) {
      const symptoms = sampleSymptoms[Math.floor(Math.random() * sampleSymptoms.length)];
      const state = indianStates[Math.floor(Math.random() * indianStates.length)];
      const severity = ["Mild", "Moderate", "Severe"][Math.floor(Math.random() * 3)];
      
      const daysAgo = Math.floor(Math.random() * 30);
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - daysAgo);
      
      try {
        await sql`
          INSERT INTO symptom_reports (
            email, symptoms, duration_days, severity, location, description, status, is_verified, created_at
          )
          VALUES (
            ${`user${i}@example.com`},
            ${JSON.stringify(symptoms)}::jsonb,
            ${Math.floor(Math.random() * 10) + 1},
            ${severity},
            ${JSON.stringify({
              state,
              district: `${state} District`,
              city: `${state} City`,
            })}::jsonb,
            ${`Sample symptom report ${i + 1}`},
            ${Math.random() > 0.3 ? "pending" : "verified"},
            ${Math.random() > 0.5},
            ${createdAt.toISOString()}::timestamp
          )
        `;
        reportCount++;
      } catch (error: any) {
        console.error(`  ❌ Error inserting symptom report:`, error.message);
      }
    }

    console.log(`\n✅ Inserted ${reportCount} symptom reports\n`);

    // Summary
    console.log("═══════════════════════════════════════════════════════");
    console.log("✅ Large-Scale Data Seeding Complete!");
    console.log("═══════════════════════════════════════════════════════");
    console.log(`  📋 Diseases: ${diseaseMap.size}`);
    console.log(`  📍 Outbreaks: ${outbreakCount}`);
    console.log(`  📊 Infection Index Records: ${indexCount}`);
    console.log(`  🏥 Symptom Reports: ${reportCount}`);
    console.log("═══════════════════════════════════════════════════════");
    console.log("\n📝 You can now:");
    console.log("   - View dashboard: GET /api/dashboard/stats");
    console.log("   - View trending diseases: GET /api/dashboard/trending-diseases");
    console.log("   - View heatmap: GET /api/dashboard/heatmap-data");
    console.log("   - Import more data: POST /api/data/import/*");

  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

seedLargeScaleData();

