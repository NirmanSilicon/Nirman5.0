/**
 * Seed Sample Data Script
 * Creates sample disease and outbreak data for testing
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

async function seedSampleData() {
  try {
    console.log("🌱 Seeding sample data...\n");

    // 1. Insert sample diseases
    console.log("📋 Inserting sample diseases...");
    const diseaseIds = await sql`
      INSERT INTO diseases (name, scientific_name, category, description, symptoms, severity, source, is_active)
      VALUES
        ('Dengue', 'Dengue virus', 'Infectious', 'Mosquito-borne viral infection', '["fever", "headache", "muscle pain", "rash"]'::jsonb, 'High', 'ICMR', true),
        ('Malaria', 'Plasmodium', 'Infectious', 'Parasitic disease transmitted by mosquitoes', '["fever", "chills", "sweating", "nausea"]'::jsonb, 'High', 'ICMR', true),
        ('COVID-19', 'SARS-CoV-2', 'Infectious', 'Coronavirus disease', '["fever", "cough", "fatigue", "loss of taste"]'::jsonb, 'High', 'MoHFW', true),
        ('Chikungunya', 'CHIKV', 'Infectious', 'Viral disease transmitted by mosquitoes', '["fever", "joint pain", "muscle pain", "headache"]'::jsonb, 'Medium', 'ICMR', true),
        ('Typhoid', 'Salmonella Typhi', 'Infectious', 'Bacterial infection', '["fever", "abdominal pain", "headache", "constipation"]'::jsonb, 'Medium', 'ICMR', true)
      RETURNING id;
    `;

    console.log(`✅ Inserted ${diseaseIds.length} diseases`);

    // 2. Insert sample outbreaks
    console.log("\n📍 Inserting sample outbreaks...");
    const states = ["Maharashtra", "Delhi", "Karnataka", "Tamil Nadu", "Kerala"];
    const districts = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Kochi"];
    
    for (let i = 0; i < diseaseIds.length; i++) {
      const diseaseId = diseaseIds[i].id;
      const state = states[i];
      const district = districts[i];
      
      await sql`
        INSERT INTO disease_outbreaks (
          disease_id, state, district, city, case_count, active_cases, recovered, deaths,
          risk_level, trend, trend_percentage, reported_date, source
        )
        VALUES (
          ${diseaseId},
          ${state},
          ${district},
          ${district},
          ${Math.floor(Math.random() * 500) + 50},
          ${Math.floor(Math.random() * 200) + 10},
          ${Math.floor(Math.random() * 300) + 20},
          ${Math.floor(Math.random() * 10)},
          ${i % 2 === 0 ? "high" : i % 3 === 0 ? "medium" : "low"},
          ${Math.random() > 0.5 ? "rising" : "stable"},
          ${(Math.random() * 20 - 10).toFixed(2)},
          NOW(),
          'MoHFW'
        );
      `;
    }

    console.log(`✅ Inserted ${diseaseIds.length} outbreaks`);

    // 3. Insert sample infection index data
    console.log("\n📊 Inserting sample infection index data...");
    const weeks = [
      { week: "2024-W45", start: "2024-11-04", end: "2024-11-10" },
      { week: "2024-W46", start: "2024-11-11", end: "2024-11-17" },
      { week: "2024-W47", start: "2024-11-18", end: "2024-11-24" },
    ];

    for (const weekData of weeks) {
      for (const state of states) {
        await sql`
          INSERT INTO infection_index (week, week_start_date, week_end_date, state, index_value, total_reports, disease_count)
          VALUES (
            ${weekData.week},
            ${weekData.start}::timestamp,
            ${weekData.end}::timestamp,
            ${state},
            ${(Math.random() * 50 + 20).toFixed(2)},
            ${Math.floor(Math.random() * 100) + 50},
            ${Math.floor(Math.random() * 5) + 1}
          );
        `;
      }
    }

    console.log(`✅ Inserted ${weeks.length * states.length} infection index records`);

    console.log("\n✅ Sample data seeding complete!");
    console.log("\n📝 You can now:");
    console.log("   - View dashboard data: GET /api/dashboard/stats");
    console.log("   - View trending diseases: GET /api/dashboard/trending-diseases");
    console.log("   - View heatmap: GET /api/dashboard/heatmap-data");

  } catch (error) {
    console.error("❌ Error seeding sample data:", error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

seedSampleData();

