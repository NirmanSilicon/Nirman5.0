/**
 * Test script to check Khorda district diseases
 * Run with: node packages/backend/scripts/test-khorda-district.js
 */

import { db } from "../src/db/index.js";
import { diseaseOutbreaks, diseases } from "../src/db/schema/diseases.js";
import { eq, and, sql, desc, gte, lte } from "drizzle-orm";

async function testKhordaDistrict() {
  const state = "Odisha";
  const district = "Khordha"; // Note: might be "Khordha" or "Khorda" in database

  console.log(`\n🔍 Testing Khorda/Khordha district in ${state}\n`);

  try {
    // Test 1: Check all diseases in Khordha/Khorda (no date filter) - like Prevention Measures API
    console.log("📊 Test 1: All diseases in district (no date filter)");
    const allDiseases = await db
      .selectDistinct({
        diseaseId: diseaseOutbreaks.diseaseId,
        diseaseName: diseases.name,
        district: diseaseOutbreaks.district,
        state: diseaseOutbreaks.state,
      })
      .from(diseaseOutbreaks)
      .innerJoin(diseases, eq(diseaseOutbreaks.diseaseId, diseases.id))
      .where(
        and(
          eq(diseaseOutbreaks.state, state),
          sql`LOWER(${diseaseOutbreaks.district}) LIKE LOWER(${'%' + district + '%'})`
        )
      )
      .limit(20);

    console.log(`Found ${allDiseases.length} diseases (any date):`);
    allDiseases.forEach((d, i) => {
      console.log(`  ${i + 1}. ${d.diseaseName} (District: ${d.district})`);
    });

    // Test 2: Check diseases in last 30 days
    console.log("\n📊 Test 2: Diseases in last 30 days");
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const diseases30d = await db
      .select({
        diseaseId: diseaseOutbreaks.diseaseId,
        diseaseName: diseases.name,
        caseCount: sql<number>`sum(${diseaseOutbreaks.caseCount})`,
        district: diseaseOutbreaks.district,
        reportedDate: diseaseOutbreaks.reportedDate,
      })
      .from(diseaseOutbreaks)
      .innerJoin(diseases, eq(diseaseOutbreaks.diseaseId, diseases.id))
      .where(
        and(
          eq(diseaseOutbreaks.state, state),
          sql`LOWER(${diseaseOutbreaks.district}) LIKE LOWER(${'%' + district + '%'})`,
          gte(diseaseOutbreaks.reportedDate, thirtyDaysAgo)
        )
      )
      .groupBy(diseaseOutbreaks.diseaseId, diseases.name, diseaseOutbreaks.district, diseaseOutbreaks.reportedDate)
      .orderBy(desc(sql<number>`sum(${diseaseOutbreaks.caseCount})`))
      .limit(20);

    console.log(`Found ${diseases30d.length} diseases in last 30 days:`);
    diseases30d.forEach((d, i) => {
      console.log(`  ${i + 1}. ${d.diseaseName} - ${d.caseCount} cases (District: ${d.district}, Date: ${d.reportedDate})`);
    });

    // Test 3: Check current window (today's window)
    console.log("\n📊 Test 3: Diseases in current 7-day window (email logic)");
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

    console.log(`Current window: ${windowIndex + 1}/5 (${windowStartDate.toISOString().split('T')[0]} to ${windowEndDate.toISOString().split('T')[0]})`);

    const diseasesWindow = await db
      .select({
        diseaseId: diseaseOutbreaks.diseaseId,
        diseaseName: diseases.name,
        caseCount: sql<number>`sum(${diseaseOutbreaks.caseCount})`,
        district: diseaseOutbreaks.district,
        reportedDate: diseaseOutbreaks.reportedDate,
      })
      .from(diseaseOutbreaks)
      .innerJoin(diseases, eq(diseaseOutbreaks.diseaseId, diseases.id))
      .where(
        and(
          eq(diseaseOutbreaks.state, state),
          sql`LOWER(${diseaseOutbreaks.district}) LIKE LOWER(${'%' + district + '%'})`,
          gte(diseaseOutbreaks.reportedDate, windowStartDate),
          lte(diseaseOutbreaks.reportedDate, windowEndDate)
        )
      )
      .groupBy(diseaseOutbreaks.diseaseId, diseases.name, diseaseOutbreaks.district, diseaseOutbreaks.reportedDate)
      .orderBy(desc(sql<number>`sum(${diseaseOutbreaks.caseCount})`))
      .limit(20);

    console.log(`Found ${diseasesWindow.length} diseases in current window:`);
    if (diseasesWindow.length === 0) {
      console.log("  ⚠️ NO DISEASES FOUND IN CURRENT WINDOW!");
      console.log("  This explains why email shows no diseases.");
    } else {
      diseasesWindow.forEach((d, i) => {
        console.log(`  ${i + 1}. ${d.diseaseName} - ${d.caseCount} cases (Date: ${d.reportedDate})`);
      });
    }

    // Test 4: Check exact district name match
    console.log("\n📊 Test 4: Check exact district name variations");
    const districtVariations = await db
      .selectDistinct({ district: diseaseOutbreaks.district })
      .from(diseaseOutbreaks)
      .where(
        and(
          eq(diseaseOutbreaks.state, state),
          sql`LOWER(${diseaseOutbreaks.district}) LIKE LOWER(${'%khord%'})`
        )
      );

    console.log(`District name variations found:`);
    districtVariations.forEach((d, i) => {
      console.log(`  ${i + 1}. "${d.district}"`);
    });

    console.log("\n✅ Test completed!\n");

  } catch (error) {
    console.error("❌ Test error:", error);
  } finally {
    process.exit(0);
  }
}

testKhordaDistrict();

