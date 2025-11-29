/**
 * Alert Service
 * Handles email alerts for outbreaks and health risks
 */

import { db } from "../db/index.js";
import { users } from "../db/schema/users.js";
import { diseases } from "../db/schema/diseases.js";
import { symptomReports } from "../db/schema/symptoms.js";
import { diseaseOutbreaks } from "../db/schema/diseases.js";
import { userRiskScores } from "../db/schema/analytics.js";
import { eq, and, gte } from "drizzle-orm";
import { sendEmail } from "./email.service.js";

export interface AlertTrigger {
  type: "outbreak" | "risk_score" | "prevention";
  severity: "low" | "medium" | "high";
  message: string;
  data: any;
}

/**
 * Send alert for outbreak in user's area
 */
export async function sendOutbreakAlert(
  userId: string,
  outbreak: {
    diseaseName: string;
    state: string;
    district?: string;
    caseCount: number;
    riskLevel: string;
  }
) {
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);

  if (!user || !user.email) {
    return;
  }

  const subject = `⚠️ Disease Outbreak Alert: ${outbreak.diseaseName} in ${outbreak.state}`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Inter, Arial, sans-serif; line-height: 1.6; color: #1a1a1a; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #4D9AFF 0%, #1B7BFF 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; }
        .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
        .alert { background: #FFF5F5; border-left: 4px solid #FF4F4F; padding: 15px; margin: 20px 0; border-radius: 4px; }
        .button { display: inline-block; background: #1B7BFF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 10px 0; }
        .footer { background: #f5f7fa; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 12px 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>⚠️ Outbreak Alert</h1>
          <p>PathoGen Health Monitoring</p>
        </div>
        <div class="content">
          <div class="alert">
            <h2>${outbreak.diseaseName} Outbreak Detected</h2>
            <p><strong>Location:</strong> ${outbreak.state}${outbreak.district ? `, ${outbreak.district}` : ""}</p>
            <p><strong>Cases:</strong> ${outbreak.caseCount.toLocaleString("en-IN")}</p>
            <p><strong>Risk Level:</strong> <span style="color: #FF4F4F; font-weight: bold;">${outbreak.riskLevel.toUpperCase()}</span></p>
          </div>
          
          <h3>Prevention Measures:</h3>
          <ul>
            <li>Practice good hygiene and wash hands frequently</li>
            <li>Avoid crowded places if possible</li>
            <li>Wear masks in public spaces</li>
            <li>Monitor your health and symptoms</li>
            <li>Seek medical attention if you experience symptoms</li>
          </ul>
          
          <p><a href="${process.env.FRONTEND_URL || "http://localhost:3000"}/dashboard" class="button">View Dashboard</a></p>
        </div>
        <div class="footer">
          <p>This is an automated alert from PathoGen Public Health Monitoring Platform.</p>
          <p>You can manage your alert preferences in your account settings.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await sendEmail(user.email, subject, html);
    console.log(`✅ Outbreak alert sent to ${user.email}`);
  } catch (error) {
    console.error(`❌ Failed to send outbreak alert to ${user.email}:`, error);
  }
}

/**
 * Send alert for high risk score
 */
export async function sendRiskScoreAlert(
  userId: string,
  riskScore: {
    score: number;
    riskLevel: string;
    recommendations: string[];
  }
) {
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);

  if (!user || !user.email) {
    return;
  }

  const subject = `⚠️ Your Health Risk Score: ${riskScore.score}/100`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Inter, Arial, sans-serif; line-height: 1.6; color: #1a1a1a; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #4D9AFF 0%, #1B7BFF 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
        .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
        .score { font-size: 48px; font-weight: bold; text-align: center; margin: 20px 0; }
        .recommendations { background: #F0F7FF; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .button { display: inline-block; background: #1B7BFF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 10px 0; }
        .footer { background: #f5f7fa; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 12px 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Health Risk Alert</h1>
          <p>Your Personalized Risk Assessment</p>
        </div>
        <div class="content">
          <div class="score" style="color: ${riskScore.riskLevel === "high" ? "#FF4F4F" : riskScore.riskLevel === "medium" ? "#FFB800" : "#38C684"};">
            ${riskScore.score}/100
          </div>
          <p style="text-align: center; font-weight: bold; color: ${riskScore.riskLevel === "high" ? "#FF4F4F" : riskScore.riskLevel === "medium" ? "#FFB800" : "#38C684"};">
            ${riskScore.riskLevel.toUpperCase()} RISK
          </p>
          
          <div class="recommendations">
            <h3>Recommendations:</h3>
            <ul>
              ${riskScore.recommendations.map((rec) => `<li>${rec}</li>`).join("")}
            </ul>
          </div>
          
          <p><a href="${process.env.FRONTEND_URL || "http://localhost:3000"}/dashboard" class="button">View Full Dashboard</a></p>
        </div>
        <div class="footer">
          <p>This is an automated alert from PathoGen Public Health Monitoring Platform.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await sendEmail(user.email, subject, html);
    console.log(`✅ Risk score alert sent to ${user.email}`);
  } catch (error) {
    console.error(`❌ Failed to send risk score alert to ${user.email}:`, error);
  }
}

/**
 * Check and send alerts for all users
 */
export async function checkAndSendAlerts() {
  console.log("🔔 Checking for alerts to send...");

  // Get all verified users
  const users = await db
    .select()
    .from(users)
    .where(eq(users.isVerified, true))
    .limit(1000); // Process in batches

  for (const user of users) {
    try {
      // 1. Check for outbreaks in user's area
      const [userReport] = await db
        .select()
        .from(symptomReports)
        .where(eq(symptomReports.userId, user.id))
        .orderBy(desc(symptomReports.createdAt))
        .limit(1);

      if (userReport?.location?.state) {
        const highRiskOutbreaks = await db
          .select()
          .from(diseaseOutbreaks)
          .where(
            and(
              eq(diseaseOutbreaks.state, userReport.location.state),
              eq(diseaseOutbreaks.riskLevel, "high"),
              gte(diseaseOutbreaks.reportedDate, new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) // Last 7 days
            )
          )
          .limit(5);

        for (const outbreak of highRiskOutbreaks) {
          // Get disease name
          const disease = await db
            .select()
            .from(diseases)
            .where(eq(diseases.id, outbreak.diseaseId))
            .limit(1);

          if (disease[0]) {
            await sendOutbreakAlert(user.id, {
              diseaseName: disease[0].name,
              state: outbreak.state,
              district: outbreak.district || undefined,
              caseCount: outbreak.caseCount,
              riskLevel: outbreak.riskLevel,
            });
          }
        }
      }

      // 2. Check for high risk scores
      const [latestScore] = await db
        .select()
        .from(userRiskScores)
        .where(eq(userRiskScores.userId, user.id))
        .orderBy(desc(userRiskScores.calculatedAt))
        .limit(1);

      if (latestScore && latestScore.score >= 60 && latestScore.riskLevel === "high") {
        // Only send if calculated in last 24 hours and not already sent
        const scoreAge = Date.now() - new Date(latestScore.calculatedAt).getTime();
        if (scoreAge < 24 * 60 * 60 * 1000) {
          await sendRiskScoreAlert(user.id, {
            score: latestScore.score,
            riskLevel: latestScore.riskLevel,
            recommendations: (latestScore.factors as any)?.recommendations || [],
          });
        }
      }
    } catch (error) {
      console.error(`Error checking alerts for user ${user.id}:`, error);
    }
  }

  console.log(`✅ Alert check complete for ${users.length} users`);
}

