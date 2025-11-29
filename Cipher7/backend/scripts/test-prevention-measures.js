/**
 * Test script to check prevention measures fetching
 * Run with: cd packages/backend && node scripts/test-prevention-measures.js
 */

import { db } from "../src/db/index.js";
import { diseaseOutbreaks, diseases } from "../src/db/schema/diseases.js";
import { diseasePrevention } from "../src/db/schema/prevention.js";
import { eq, and, sql, desc, inArray, or } from "drizzle-orm";

async function testPreventionMeasures() {
  const state = "Odisha";
  const district = "Khordha"; // Try different variations

  console.log(`\n🔍 Testing Prevention Measures for ${district}, ${state}\n`);

  try {
    // Step 1: Get trending diseases (like email service does)
    console.log("📊 Step 1: Get trending diseases");
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const trendingDiseases = await db
      .select({
        diseaseId: diseaseOutbreaks.diseaseId,
        diseaseName: sql<string>`MAX(${diseases.name})`,
        caseCount: sql<number>`sum(${diseaseOutbreaks.caseCount})`,
      })
      .from(diseaseOutbreaks)
      .leftJoin(diseases, eq(diseaseOutbreaks.diseaseId, diseases.id))
      .where(
        and(
          eq(diseaseOutbreaks.state, state),
          sql`LOWER(${diseaseOutbreaks.district}) = LOWER(${district})`,
          sql`${diseaseOutbreaks.reportedDate} >= ${thirtyDaysAgo}`
        )
      )
      .groupBy(diseaseOutbreaks.diseaseId)
      .orderBy(desc(sql<number>`sum(${diseaseOutbreaks.caseCount})`))
      .limit(5);

    console.log(`Found ${trendingDiseases.length} trending diseases:`);
    trendingDiseases.forEach((d, i) => {
      console.log(`  ${i + 1}. ${d.diseaseName} (ID: ${d.diseaseId}, Cases: ${d.caseCount})`);
    });

    if (trendingDiseases.length === 0) {
      console.log("⚠️ No trending diseases found. Cannot test prevention measures.");
      process.exit(0);
    }

    const diseaseIds = trendingDiseases.map(d => d.diseaseId);

    // Step 2: Get district diseases (like email service does)
    console.log(`\n📊 Step 2: Get district diseases for disease IDs: ${diseaseIds.join(", ")}`);
    const districtDiseases = await db
      .selectDistinct({ 
        diseaseId: diseaseOutbreaks.diseaseId,
        diseaseName: diseases.name 
      })
      .from(diseaseOutbreaks)
      .innerJoin(diseases, eq(diseaseOutbreaks.diseaseId, diseases.id))
      .where(
        and(
          eq(diseaseOutbreaks.state, state),
          sql`LOWER(${diseaseOutbreaks.district}) = LOWER(${district})`,
          eq(diseases.isActive, true),
          inArray(diseaseOutbreaks.diseaseId, diseaseIds)
        )
      )
      .limit(20);

    console.log(`Found ${districtDiseases.length} district diseases:`);
    districtDiseases.forEach((d, i) => {
      console.log(`  ${i + 1}. ${d.diseaseName} (ID: ${d.diseaseId})`);
    });

    if (districtDiseases.length === 0) {
      console.log("⚠️ No district diseases found. This might be why prevention measures aren't showing.");
      process.exit(0);
    }

    const activeDiseaseIds = districtDiseases.map(d => d.diseaseId);

    // Step 3: Get prevention measures (like email service does)
    console.log(`\n📊 Step 3: Get prevention measures for disease IDs: ${activeDiseaseIds.join(", ")}`);
    
    // Test with case-insensitive district matching
    const preventionMeasures = await db
      .select()
      .from(diseasePrevention)
      .where(
        and(
          inArray(diseasePrevention.diseaseId, activeDiseaseIds),
          eq(diseasePrevention.isActive, true),
          or(
            // District-specific (case-insensitive)
            and(
              eq(diseasePrevention.state, state),
              sql`LOWER(${diseasePrevention.district}) = LOWER(${district})`
            ),
            // State-specific
            and(
              eq(diseasePrevention.state, state),
              sql`${diseasePrevention.district} IS NULL`
            ),
            // General (no state/district)
            and(
              sql`${diseasePrevention.state} IS NULL`,
              sql`${diseasePrevention.district} IS NULL`
            )
          )
        )
      )
      .orderBy(
        sql`CASE 
          WHEN ${diseasePrevention.district} IS NOT NULL THEN 1
          WHEN ${diseasePrevention.state} IS NOT NULL THEN 2
          ELSE 3
        END`,
        desc(diseasePrevention.priority)
      );

    console.log(`\nFound ${preventionMeasures.length} prevention measures total`);
    
    if (preventionMeasures.length === 0) {
      console.log("⚠️ NO PREVENTION MEASURES FOUND!");
      console.log("   This explains why the email shows the generic message.");
      console.log("\n   Checking if prevention measures exist in database at all...");
      
      // Check if any prevention measures exist for these diseases (any location)
      const anyMeasures = await db
        .select()
        .from(diseasePrevention)
        .where(
          and(
            inArray(diseasePrevention.diseaseId, activeDiseaseIds),
            eq(diseasePrevention.isActive, true)
          )
        )
        .limit(10);
      
      console.log(`   Found ${anyMeasures.length} prevention measures for these diseases (any location)`);
      if (anyMeasures.length > 0) {
        console.log("   Sample measures:");
        anyMeasures.slice(0, 3).forEach((pm, i) => {
          console.log(`     ${i + 1}. ${pm.title} (Disease ID: ${pm.diseaseId}, State: ${pm.state || "NULL"}, District: ${pm.district || "NULL"})`);
        });
        console.log("\n   ⚠️ Issue: Prevention measures exist but don't match the location filter!");
        console.log("   The measures might be for a different state/district or are general measures.");
      } else {
        console.log("   ⚠️ No prevention measures exist in database for these diseases at all!");
        console.log("   You may need to add prevention measures to the database.");
      }
    } else {
      console.log("\n✅ Prevention measures found:");
      preventionMeasures.forEach((pm, i) => {
        const diseaseName = districtDiseases.find(d => d.diseaseId === pm.diseaseId)?.diseaseName || "Unknown";
        console.log(`  ${i + 1}. ${pm.title}`);
        console.log(`     Disease: ${diseaseName} (ID: ${pm.diseaseId})`);
        console.log(`     Location: ${pm.state || "General"} / ${pm.district || "General"}`);
        console.log(`     Priority: ${pm.priority}`);
      });

      // Group by disease
      const grouped = {};
      districtDiseases.forEach(disease => {
        grouped[disease.diseaseName] = preventionMeasures
          .filter(pm => pm.diseaseId === disease.diseaseId);
      });

      console.log("\n📊 Grouped by disease:");
      Object.entries(grouped).forEach(([diseaseName, measures]) => {
        console.log(`  ${diseaseName}: ${measures.length} measures`);
      });
    }

    console.log("\n✅ Test completed!\n");

  } catch (error) {
    console.error("❌ Test error:", error);
  } finally {
    process.exit(0);
  }
}

testPreventionMeasures();

