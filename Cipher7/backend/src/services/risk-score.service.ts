/**
 * Health Risk Score Service
 * Calculates individual health risk scores (0-100)
 */

import { db } from "../db/index.js";
import { userRiskScores, infectionIndex } from "../db/schema/analytics.js";
import { diseaseOutbreaks } from "../db/schema/diseases.js";
import { symptomReports } from "../db/schema/symptoms.js";
import { eq, and, gte, desc, sql } from "drizzle-orm";

export interface RiskScoreFactors {
  locationRisk: number; // 0-30 (based on nearby outbreaks)
  regionalIndex: number; // 0-25 (based on infection index)
  symptomHistory: number; // 0-25 (based on user's recent symptoms)
  outbreakProximity: number; // 0-20 (based on distance to outbreaks)
}

export interface RiskScoreResult {
  score: number; // 0-100
  riskLevel: "low" | "medium" | "high";
  factors: RiskScoreFactors;
  breakdown: {
    location: string;
    nearbyOutbreaks: number;
    regionalIndex: number;
    userReports: number;
  };
  recommendations: string[];
}

/**
 * Calculate health risk score for a user
 */
export async function calculateHealthRiskScore(
  userId: string,
  userLocation?: { state?: string; district?: string; city?: string }
): Promise<RiskScoreResult> {
  let factors: RiskScoreFactors = {
    locationRisk: 0,
    regionalIndex: 0,
    symptomHistory: 0,
    outbreakProximity: 0,
  };

  let breakdown = {
    location: "Unknown",
    nearbyOutbreaks: 0,
    regionalIndex: 0,
    userReports: 0,
  };

  // 1. Location Risk (0-30 points)
  if (userLocation?.state) {
    breakdown.location = userLocation.state;
    
    // Count high-risk outbreaks in user's state
    const highRiskOutbreaks = await db
      .select({ count: sql<number>`count(*)` })
      .from(diseaseOutbreaks)
      .where(
        and(
          eq(diseaseOutbreaks.state, userLocation.state),
          eq(diseaseOutbreaks.riskLevel, "high")
        )
      );

    const outbreakCount = Number(highRiskOutbreaks[0]?.count || 0);
    breakdown.nearbyOutbreaks = outbreakCount;

    // Calculate location risk (more outbreaks = higher risk)
    factors.locationRisk = Math.min(outbreakCount * 3, 30);
    factors.outbreakProximity = Math.min(outbreakCount * 2, 20);

    // If district/city specified, increase proximity risk
    if (userLocation.district) {
      const districtOutbreaks = await db
        .select({ count: sql<number>`count(*)` })
        .from(diseaseOutbreaks)
        .where(
          and(
            eq(diseaseOutbreaks.state, userLocation.state),
            eq(diseaseOutbreaks.district, userLocation.district),
            eq(diseaseOutbreaks.riskLevel, "high")
          )
        );

      const districtCount = Number(districtOutbreaks[0]?.count || 0);
      if (districtCount > 0) {
        factors.outbreakProximity += Math.min(districtCount * 3, 10);
      }
    }
  }

  // 2. Regional Infection Index (0-25 points)
  if (userLocation?.state) {
    const recentIndex = await db
      .select()
      .from(infectionIndex)
      .where(eq(infectionIndex.state, userLocation.state))
      .orderBy(desc(infectionIndex.weekStartDate))
      .limit(1);

    if (recentIndex[0]) {
      const indexValue = parseFloat(recentIndex[0].indexValue.toString());
      breakdown.regionalIndex = indexValue;
      // Infection index is 0-100, scale to 0-25
      factors.regionalIndex = (indexValue / 100) * 25;
    }
  }

  // 3. User's Symptom History (0-25 points)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const recentReports = await db
    .select({ count: sql<number>`count(*)` })
    .from(symptomReports)
    .where(
      and(
        eq(symptomReports.userId, userId),
        gte(symptomReports.createdAt, sevenDaysAgo)
      )
    );

  const reportCount = Number(recentReports[0]?.count || 0);
  breakdown.userReports = reportCount;

  // More recent symptoms = higher risk
  if (reportCount > 0) {
    // Check severity of recent reports
    const reports = await db
      .select()
      .from(symptomReports)
      .where(
        and(
          eq(symptomReports.userId, userId),
          gte(symptomReports.createdAt, sevenDaysAgo)
        )
      )
      .limit(10);

    const severeCount = reports.filter((r) => r.severity === "Severe").length;
    const moderateCount = reports.filter((r) => r.severity === "Moderate").length;

    // Weighted calculation: Severe = 5 points, Moderate = 2 points, Mild = 1 point
    factors.symptomHistory = Math.min(
      severeCount * 5 + moderateCount * 2 + (reportCount - severeCount - moderateCount) * 1,
      25
    );
  }

  // Calculate total score
  const totalScore = Math.round(
    factors.locationRisk +
    factors.regionalIndex +
    factors.symptomHistory +
    factors.outbreakProximity
  );

  // Determine risk level
  let riskLevel: "low" | "medium" | "high";
  if (totalScore >= 70) {
    riskLevel = "high";
  } else if (totalScore >= 40) {
    riskLevel = "medium";
  } else {
    riskLevel = "low";
  }

  // Generate recommendations
  const recommendations = generateRecommendations(totalScore, riskLevel, breakdown);

  // Store or update risk score in database
  const week = getCurrentWeek();
  const existing = await db
    .select()
    .from(userRiskScores)
    .where(
      and(
        eq(userRiskScores.userId, userId),
        eq(userRiskScores.week, week)
      )
    )
    .limit(1);

  const scoreData = {
    userId,
    score: totalScore,
    riskLevel,
    factors,
    week,
  };

  if (existing[0]) {
    await db
      .update(userRiskScores)
      .set({
        score: totalScore,
        riskLevel,
        factors,
        calculatedAt: new Date(),
      })
      .where(eq(userRiskScores.id, existing[0].id));
  } else {
    await db.insert(userRiskScores).values(scoreData);
  }

  return {
    score: totalScore,
    riskLevel,
    factors,
    breakdown,
    recommendations,
  };
}

/**
 * Generate health recommendations based on risk score
 */
function generateRecommendations(
  score: number,
  riskLevel: string,
  breakdown: any
): string[] {
  const recommendations: string[] = [];

  if (riskLevel === "high") {
    recommendations.push("⚠️ High risk detected. Consider consulting a healthcare professional.");
    recommendations.push("🔒 Practice strict hygiene and social distancing.");
    recommendations.push("🏥 Monitor symptoms closely and seek medical attention if needed.");
  } else if (riskLevel === "medium") {
    recommendations.push("⚠️ Moderate risk. Stay vigilant about your health.");
    recommendations.push("🧼 Maintain good hygiene practices.");
    recommendations.push("📍 Consider limiting travel to high-risk areas.");
  } else {
    recommendations.push("✅ Low risk level. Continue maintaining good health practices.");
    recommendations.push("💪 Stay informed about local health updates.");
  }

  if (breakdown.nearbyOutbreaks > 5) {
    recommendations.push(`📍 ${breakdown.nearbyOutbreaks} high-risk outbreaks detected in your area.`);
  }

  if (breakdown.userReports > 0) {
    recommendations.push("🏥 You've reported symptoms recently. Monitor your health closely.");
  }

  return recommendations;
}

/**
 * Get current week identifier (format: YYYY-W##)
 */
function getCurrentWeek(): string {
  const date = new Date();
  const year = date.getFullYear();
  const weekNumber = getWeekNumber(date);
  return `${year}-W${weekNumber.toString().padStart(2, "0")}`;
}

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

