/**
 * Test script to check email query logic for Khorda district
 * Run with: cd packages/backend && node scripts/test-email-query.js
 */

import { db } from "../src/db/index.js";
import { diseaseOutbreaks, diseases } from "../src/db/schema/diseases.js";
import { eq, and, sql, desc, gte, lte } from "drizzle-orm";

async function testEmailQuery() {
  const state = "Odisha";
  const district = "Khordha"; // Try exact match first

  console.log(`\n🔍 Testing Email Query Logic for ${district}, ${state}\n`);

  try {
    // Test 1: Check exact district name in database
    console.log("📊 Test 1: Check district name variations");
    const districtVariations = await db
      .selectDistinct({ district: diseaseOutbreaks.district })
      .from(diseaseOutbreaks)
      .where(
        and(
          eq(diseaseOutbreaks.state, state),
          sql`LOWER(${diseaseOutbreaks.district}) LIKE LOWER(${'%khord%'})`
        )
      );

    console.log(`Found district variations:`);
    districtVariations.forEach((d, i) => {
      console.log(`  ${i + 1}. "${d.district}"`);
    });

    if (districtVariations.length === 0) {
      console.log("  ⚠️ No districts found matching 'khord' pattern!");
      console.log("  Checking all districts in Odisha...");
      const allDistricts = await db
        .selectDistinct({ district: diseaseOutbreaks.district })
        .from(diseaseOutbreaks)
        .where(eq(diseaseOutbreaks.state, state))
        .limit(20);
      console.log(`  Found ${allDistricts.length} districts in Odisha:`);
      allDistricts.forEach((d, i) => {
        console.log(`    ${i + 1}. "${d.district}"`);
      });
    }

    // Use the first variation found, or the provided district
    const actualDistrict = districtVariations.length > 0 
      ? districtVariations[0].district 
      : district;

    console.log(`\n📊 Test 2: Using district "${actualDistrict}"`);
    console.log(`Testing with case-insensitive matching...\n`);

    // Test 2: Current window query (like email service)
    const today = new Date();
    const dayOfWeek = today.getDay();
    const windowIndex = dayOfWeek <= 4 ? dayOfWeek : (dayOfWeek - 5);

    let windowStartDate, windowEndDate;
    if (windowIndex === 0) {
      windowEndDate = new Date();
      windowEndDate.setHours(23, 59, 59, 999);
      windowStartDate = new Date();
      windowStartDate.setDate(windowStartDate.getDate() - 6);
      windowStartDate.setHours(0, 0, 0, 0);
    } else if (windowIndex === 4) {
      windowEndDate = new Date();
      windowEndDate.setDate(windowEndDate.getDate() - 28);
      windowEndDate.setHours(23, 59, 59, 999);
      windowStartDate = new Date();
      windowStartDate.setDate(windowStartDate.getDate() - 30);
      windowStartDate.setHours(0, 0, 0, 0);
    } else {
      const endDaysAgo = windowIndex * 7;
      const startDaysAgo = (windowIndex + 1) * 7 - 1;
      windowEndDate = new Date();
      windowEndDate.setDate(windowEndDate.getDate() - endDaysAgo);
      windowEndDate.setHours(23, 59, 59, 999);
      windowStartDate = new Date();
      windowStartDate.setDate(windowStartDate.getDate() - startDaysAgo);
      windowStartDate.setHours(0, 0, 0, 0);
    }

    console.log(`Current window: ${windowIndex + 1}/5`);
    console.log(`Window dates: ${windowStartDate.toISOString().split('T')[0]} to ${windowEndDate.toISOString().split('T')[0]}`);

    // Test with case-insensitive matching (like email service now does)
    const conditions = [
      eq(diseaseOutbreaks.state, state),
      sql`LOWER(${diseaseOutbreaks.district}) = LOWER(${actualDistrict})`,
      gte(diseaseOutbreaks.reportedDate, windowStartDate),
      lte(diseaseOutbreaks.reportedDate, windowEndDate),
    ];

    const selectFields = {
      diseaseId: diseaseOutbreaks.diseaseId,
      diseaseName: sql<string>`MAX(${diseases.name})`,
      caseCount: sql<number>`sum(${diseaseOutbreaks.caseCount})`,
      district: sql<string>`MAX(${diseaseOutbreaks.district})`,
      reportedDate: sql<Date>`MAX(${diseaseOutbreaks.reportedDate})`,
    };

    const windowResults = await db
      .select(selectFields)
      .from(diseaseOutbreaks)
      .leftJoin(diseases, eq(diseaseOutbreaks.diseaseId, diseases.id))
      .where(and(...conditions))
      .groupBy(diseaseOutbreaks.diseaseId)
      .orderBy(desc(sql<number>`sum(${diseaseOutbreaks.caseCount})`))
      .limit(10);

    console.log(`\nWindow query results: ${windowResults.length} diseases`);
    if (windowResults.length === 0) {
      console.log("  ⚠️ NO DISEASES IN CURRENT WINDOW!");
    } else {
      windowResults.forEach((d, i) => {
        console.log(`  ${i + 1}. ${d.diseaseName} - ${d.caseCount} cases (District: ${d.district}, Date: ${d.reportedDate})`);
      });
    }

    // Test 3: Fallback to 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const fallbackConditions = [
      eq(diseaseOutbreaks.state, state),
      sql`LOWER(${diseaseOutbreaks.district}) = LOWER(${actualDistrict})`,
      gte(diseaseOutbreaks.reportedDate, thirtyDaysAgo),
    ];

    const fallbackResults = await db
      .select(selectFields)
      .from(diseaseOutbreaks)
      .leftJoin(diseases, eq(diseaseOutbreaks.diseaseId, diseases.id))
      .where(and(...fallbackConditions))
      .groupBy(diseaseOutbreaks.diseaseId)
      .orderBy(desc(sql<number>`sum(${diseaseOutbreaks.caseCount})`))
      .limit(10);

    console.log(`\n30-day fallback query results: ${fallbackResults.length} diseases`);
    if (fallbackResults.length === 0) {
      console.log("  ⚠️ NO DISEASES IN 30-DAY PERIOD!");
    } else {
      fallbackResults.forEach((d, i) => {
        console.log(`  ${i + 1}. ${d.diseaseName} - ${d.caseCount} cases (District: ${d.district}, Date: ${d.reportedDate})`);
      });
    }

    // Test 4: Prevention Measures API query (no date filter)
    console.log(`\n📊 Test 4: Prevention Measures API query (no date filter)`);
    const preventionQuery = await db
      .selectDistinct({ 
        diseaseId: diseaseOutbreaks.diseaseId,
        diseaseName: diseases.name 
      })
      .from(diseaseOutbreaks)
      .innerJoin(diseases, eq(diseaseOutbreaks.diseaseId, diseases.id))
      .where(
        and(
          eq(diseaseOutbreaks.state, state),
          eq(diseaseOutbreaks.district, actualDistrict), // Exact match (like Prevention Measures API)
          eq(diseases.isActive, true)
        )
      )
      .limit(20);

    console.log(`Prevention Measures query results: ${preventionQuery.length} diseases`);
    if (preventionQuery.length === 0) {
      console.log("  ⚠️ NO DISEASES FOUND!");
      console.log("  This is why Prevention Measures might not show diseases either!");
    } else {
      preventionQuery.forEach((d, i) => {
        console.log(`  ${i + 1}. ${d.diseaseName} (ID: ${d.diseaseId})`);
      });
    }

    console.log("\n✅ Test completed!\n");

  } catch (error) {
    console.error("❌ Test error:", error);
  } finally {
    process.exit(0);
  }
}

testEmailQuery();

