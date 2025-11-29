import express from "express";
import { db } from "../db/index.js";
import { diseaseOutbreaks, diseases } from "../db/schema/diseases.js";
import { symptomReports } from "../db/schema/symptoms.js";
import { infectionIndex, userRiskScores, districtDiseaseTracking } from "../db/schema/analytics.js";
import { diseasePrevention } from "../db/schema/prevention.js";
import { eq, desc, sql, and, gte, lte, or, inArray } from "drizzle-orm";
import { authenticate } from "../middleware/auth.middleware.js";
import { readFile } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

/**
 * GET /api/dashboard/stats
 * Get overall dashboard statistics with district and date filtering
 */
router.get("/stats", async (req, res) => {
  try {
    const { state, district, dateRange } = req.query;
    
    // Calculate date range
    let startDate: Date | null = null;
    if (dateRange && typeof dateRange === "string") {
      const now = new Date();
      switch (dateRange) {
        case "7d":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "30d":
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case "90d":
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case "all":
          startDate = null;
          break;
      }
    } else {
      // Default to last 30 days
      const now = new Date();
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Build conditions for filtering
    const conditions = [];
    if (state && typeof state === "string") {
      conditions.push(eq(diseaseOutbreaks.state, state));
    }
    if (district && typeof district === "string") {
      conditions.push(eq(diseaseOutbreaks.district, district));
    }
    if (startDate) {
      conditions.push(gte(diseaseOutbreaks.reportedDate, startDate));
    }

    // Get active outbreaks count
    let activeOutbreaksQuery = db
      .select({ count: sql<number>`count(*)` })
      .from(diseaseOutbreaks)
      .where(and(eq(diseaseOutbreaks.riskLevel, "high"), ...conditions));

    const activeOutbreaks = await activeOutbreaksQuery;

    // Get recent reports count
    const reportConditions = [];
    if (state && typeof state === "string") {
      reportConditions.push(sql`${symptomReports.location}->>'state' = ${state}`);
    }
    if (district && typeof district === "string") {
      reportConditions.push(sql`${symptomReports.location}->>'district' = ${district}`);
    }
    if (startDate) {
      reportConditions.push(gte(symptomReports.createdAt, startDate));
    }

    let recentReportsQuery = db
      .select({ count: sql<number>`count(*)` })
      .from(symptomReports);
    
    if (reportConditions.length > 0) {
      recentReportsQuery = recentReportsQuery.where(and(...reportConditions)) as typeof recentReportsQuery;
    } else if (startDate) {
      recentReportsQuery = recentReportsQuery.where(gte(symptomReports.createdAt, startDate)) as typeof recentReportsQuery;
    }

    const recentReports = await recentReportsQuery;

    // Get trending diseases count
    let trendingDiseasesQuery = db
      .select({
        diseaseId: diseaseOutbreaks.diseaseId,
        caseCount: sql<number>`sum(${diseaseOutbreaks.caseCount})`,
      })
      .from(diseaseOutbreaks);
    
    if (conditions.length > 0) {
      trendingDiseasesQuery = trendingDiseasesQuery.where(and(...conditions)) as typeof trendingDiseasesQuery;
    }

    const trendingDiseases = await trendingDiseasesQuery
      .groupBy(diseaseOutbreaks.diseaseId)
      .orderBy(desc(sql<number>`sum(${diseaseOutbreaks.caseCount})`))
      .limit(5);

    res.json({
      stats: {
        activeOutbreaks: Number(activeOutbreaks[0]?.count || 0),
        recentReports: Number(recentReports[0]?.count || 0),
        trendingDiseasesCount: trendingDiseases.length,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to retrieve dashboard statistics",
    });
  }
});

/**
 * GET /api/dashboard/trending-diseases
 * Get trending diseases with district and date filtering
 */
router.get("/trending-diseases", async (req, res) => {
  try {
    const { state, district, dateRange, limit = 10 } = req.query;

    // Calculate date range
    let startDate: Date | null = null;
    if (dateRange && typeof dateRange === "string") {
      const now = new Date();
      switch (dateRange) {
        case "7d":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "30d":
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case "90d":
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case "all":
          startDate = null;
          break;
      }
    }

    const conditions = [];
    if (state && typeof state === "string") {
      conditions.push(eq(diseaseOutbreaks.state, state));
    }
    if (district && typeof district === "string") {
      conditions.push(eq(diseaseOutbreaks.district, district));
    }
    if (startDate) {
      conditions.push(gte(diseaseOutbreaks.reportedDate, startDate));
    }

    // If district is specified, aggregate all cases for each disease in that district
    // Otherwise, group by disease and district to show location info
    let selectFields;
    let groupByFields;
    
    if (district && typeof district === "string") {
      // When district is selected, aggregate ALL cases for each disease (group only by diseaseId)
      // This ensures each disease appears only once per district
      selectFields = {
        diseaseId: diseaseOutbreaks.diseaseId,
        diseaseName: sql<string>`MAX(${diseases.name})`, // Use MAX since all will be the same
        caseCount: sql<number>`sum(${diseaseOutbreaks.caseCount})`,
        trend: sql<string>`MAX(${diseaseOutbreaks.trend})`,
        trendPercentage: sql<number>`MAX(${diseaseOutbreaks.trendPercentage})`,
        riskLevel: sql<string>`MAX(${diseaseOutbreaks.riskLevel})`,
        state: sql<string>`MAX(${diseaseOutbreaks.state})`, // Use MAX since all will be the same
        district: sql<string>`MAX(${diseaseOutbreaks.district})`, // Use MAX since all will be the same
      };
      // Group ONLY by diseaseId to ensure one entry per disease
      groupByFields = [
        diseaseOutbreaks.diseaseId,
      ];
    } else {
      // When no district selected, group by disease and district to show location
      selectFields = {
        diseaseId: diseaseOutbreaks.diseaseId,
        diseaseName: diseases.name,
        caseCount: sql<number>`sum(${diseaseOutbreaks.caseCount})`,
        trend: diseaseOutbreaks.trend,
        trendPercentage: diseaseOutbreaks.trendPercentage,
        riskLevel: diseaseOutbreaks.riskLevel,
        state: diseaseOutbreaks.state,
        district: diseaseOutbreaks.district,
      };
      groupByFields = [
        diseaseOutbreaks.diseaseId,
        diseases.name,
        diseaseOutbreaks.trend,
        diseaseOutbreaks.trendPercentage,
        diseaseOutbreaks.riskLevel,
        diseaseOutbreaks.state,
        diseaseOutbreaks.district,
      ];
    }

    let query = db
      .select(selectFields)
      .from(diseaseOutbreaks)
      .leftJoin(diseases, eq(diseaseOutbreaks.diseaseId, diseases.id));

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as typeof query;
    }

    const trending = await query
      .groupBy(...groupByFields)
      .orderBy(desc(sql<number>`sum(${diseaseOutbreaks.caseCount})`))
      .limit(Number(limit) * 2); // Get more to account for any edge cases

    // Additional deduplication by disease NAME (case-insensitive) to ensure no duplicates
    // This handles cases where same disease might have different IDs
    const seenDiseaseNames = new Map<string, typeof trending[0]>();
    for (const item of trending) {
      const diseaseName = typeof item.diseaseName === 'string' 
        ? item.diseaseName 
        : String(item.diseaseName || '');
      
      if (!diseaseName) continue;
      
      const diseaseNameLower = diseaseName.toLowerCase().trim();
      if (!seenDiseaseNames.has(diseaseNameLower)) {
        seenDiseaseNames.set(diseaseNameLower, item);
      } else {
        // If duplicate found (same name), keep the one with higher case count
        const existing = seenDiseaseNames.get(diseaseNameLower)!;
        const existingCases = Number(existing.caseCount) || 0;
        const currentCases = Number(item.caseCount) || 0;
        if (currentCases > existingCases) {
          seenDiseaseNames.set(diseaseNameLower, item);
        }
      }
    }
    
    const uniqueTrending = Array.from(seenDiseaseNames.values());
    // Re-sort by case count after deduplication
    uniqueTrending.sort((a, b) => {
      const aCases = Number(a.caseCount) || 0;
      const bCases = Number(b.caseCount) || 0;
      return bCases - aCases;
    });
    
    // Limit to requested number after deduplication
    const finalTrending = uniqueTrending.slice(0, Number(limit));
    
    // Log for debugging
    if (district && typeof district === "string") {
      console.log(`[Trending Diseases] District: ${district}, Raw results: ${trending.length}, After deduplication: ${finalTrending.length}`);
      const diseaseNames = finalTrending.map(t => {
        const name = typeof t.diseaseName === 'string' ? t.diseaseName : String(t.diseaseName || '');
        return name.toLowerCase().trim();
      });
      const uniqueNames = new Set(diseaseNames);
      if (diseaseNames.length !== uniqueNames.size) {
        console.warn(`[Trending Diseases] WARNING: Still have duplicate names! Total: ${diseaseNames.length}, Unique: ${uniqueNames.size}`);
        console.warn(`[Trending Diseases] Duplicate names:`, diseaseNames.filter((name, idx) => diseaseNames.indexOf(name) !== idx));
      } else {
        console.log(`[Trending Diseases] ✅ All diseases are unique by name`);
      }
    }

    res.json({
      trendingDiseases: finalTrending.map((item) => ({
        disease: {
          id: item.diseaseId,
          name: typeof item.diseaseName === 'string' ? item.diseaseName : String(item.diseaseName || 'Unknown'),
        },
        totalCases: Number(item.caseCount),
        trend: typeof item.trend === 'string' ? item.trend : String(item.trend || 'stable'),
        trendPercentage: item.trendPercentage ? Number(item.trendPercentage) : null,
        riskLevel: typeof item.riskLevel === 'string' ? item.riskLevel : String(item.riskLevel || 'medium'),
        state: typeof item.state === 'string' ? item.state : String(item.state || ''),
        district: typeof item.district === 'string' ? item.district : String(item.district || ''),
      })),
    });
  } catch (error) {
    console.error("Trending diseases error:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to retrieve trending diseases",
    });
  }
});

/**
 * GET /api/dashboard/infection-index
 * Get infection index by state/district with date filtering
 */
router.get("/infection-index", async (req, res) => {
  try {
    const { state, district, dateRange } = req.query;

    // Calculate date range
    let startDate: Date | null = null;
    if (dateRange && typeof dateRange === "string") {
      const now = new Date();
      switch (dateRange) {
        case "7d":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "30d":
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case "90d":
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case "all":
          startDate = null;
          break;
      }
    }

    const conditions = [];
    if (state && typeof state === "string") {
      conditions.push(eq(infectionIndex.state, state));
    }
    if (district && typeof district === "string") {
      conditions.push(eq(infectionIndex.district, district));
    }
    if (startDate) {
      conditions.push(gte(infectionIndex.weekStartDate, startDate));
    }

    let query = db
      .select()
      .from(infectionIndex)
      .orderBy(desc(infectionIndex.weekStartDate));

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as typeof query;
    }

    const indexData = await query.limit(50);

    // If district is specified, get the latest infection index for that district
    if (district && typeof district === "string") {
      const latestDistrictIndex = indexData.find(item => item.district === district);
      if (latestDistrictIndex) {
        return res.json({
          infectionIndex: [{
            district: latestDistrictIndex.district,
            state: latestDistrictIndex.state,
            indexValue: Number(latestDistrictIndex.indexValue),
            totalReports: latestDistrictIndex.totalReports,
            diseaseCount: latestDistrictIndex.diseaseCount,
            week: latestDistrictIndex.week,
          }],
        });
      }
    }

    res.json({
      infectionIndex: indexData.map((item) => ({
        week: item.week,
        weekStartDate: item.weekStartDate,
        weekEndDate: item.weekEndDate,
        indexValue: Number(item.indexValue),
        totalReports: item.totalReports,
        diseaseCount: item.diseaseCount,
        state: item.state,
        district: item.district,
      })),
    });
  } catch (error) {
    console.error("Infection index error:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to retrieve infection index",
    });
  }
});

/**
 * GET /api/dashboard/health-risk-score
 * Get user's health risk score (protected)
 * Calculates and returns current risk score
 */
router.get("/health-risk-score", authenticate, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "User not authenticated",
      });
    }

    // Get user's location from most recent symptom report
    const [userReport] = await db
      .select()
      .from(symptomReports)
      .where(eq(symptomReports.userId, req.user.userId))
      .orderBy(desc(symptomReports.createdAt))
      .limit(1);

    const userLocation = userReport?.location 
      ? {
          state: userReport.location.state,
          district: userReport.location.district,
          city: userReport.location.city,
        }
      : undefined;

    // Calculate or get latest risk score
    const { calculateHealthRiskScore } = await import("../services/risk-score.service.js");
    const riskScore = await calculateHealthRiskScore(req.user.userId, userLocation);

    res.json({
      score: riskScore.score,
      riskLevel: riskScore.riskLevel,
      factors: riskScore.factors,
      breakdown: riskScore.breakdown,
      recommendations: riskScore.recommendations,
      calculatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Health risk score error:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to calculate health risk score",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * GET /api/dashboard/heatmap-data
 * Get data for India heatmap with state-wise infection index scores
 */
router.get("/heatmap-data", async (req, res) => {
  try {
    const { dateRange } = req.query;

    // Calculate date range
    let startDate: Date | null = null;
    if (dateRange && typeof dateRange === "string") {
      const now = new Date();
      switch (dateRange) {
        case "7d":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "30d":
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case "90d":
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case "all":
          startDate = null;
          break;
      }
    }

    // Get latest infection index for each state
    const conditions = [];
    if (startDate) {
      conditions.push(gte(infectionIndex.weekStartDate, startDate));
    }

    let indexQuery = db
      .select({
        state: infectionIndex.state,
        indexValue: sql<number>`max(${infectionIndex.indexValue})`,
        totalReports: sql<number>`sum(${infectionIndex.totalReports})`,
        diseaseCount: sql<number>`sum(${infectionIndex.diseaseCount})`,
      })
      .from(infectionIndex)
      .where(sql`${infectionIndex.state} IS NOT NULL`);

    if (conditions.length > 0) {
      indexQuery = indexQuery.where(and(...conditions)) as typeof indexQuery;
    }

    const stateIndexData = await indexQuery
      .groupBy(infectionIndex.state)
      .orderBy(desc(sql<number>`max(${infectionIndex.indexValue})`));

    // Also get outbreak data for additional context
    const outbreakConditions = [];
    if (startDate) {
      outbreakConditions.push(gte(diseaseOutbreaks.reportedDate, startDate));
    }

    let outbreakQuery = db
      .select({
        state: diseaseOutbreaks.state,
        totalCases: sql<number>`sum(${diseaseOutbreaks.caseCount})`,
        activeCases: sql<number>`sum(${diseaseOutbreaks.activeCases})`,
        outbreakCount: sql<number>`count(*)`,
      })
      .from(diseaseOutbreaks)
      .where(sql`${diseaseOutbreaks.state} IS NOT NULL`);

    if (outbreakConditions.length > 0) {
      outbreakQuery = outbreakQuery.where(and(...outbreakConditions)) as typeof outbreakQuery;
    }

    const outbreakData = await outbreakQuery
      .groupBy(diseaseOutbreaks.state);

    // Combine data by state
    const stateMap = new Map();
    
    // Add infection index data
    stateIndexData.forEach(item => {
      stateMap.set(item.state, {
        state: item.state,
        infectionIndex: Number(item.indexValue),
        totalReports: Number(item.totalReports),
        diseaseCount: Number(item.diseaseCount),
        totalCases: 0,
        activeCases: 0,
        outbreakCount: 0,
      });
    });

    // Add outbreak data
    outbreakData.forEach(item => {
      const existing = stateMap.get(item.state);
      if (existing) {
        existing.totalCases = Number(item.totalCases);
        existing.activeCases = Number(item.activeCases);
        existing.outbreakCount = Number(item.outbreakCount);
      } else {
        stateMap.set(item.state, {
          state: item.state,
          infectionIndex: 0,
          totalReports: 0,
          diseaseCount: 0,
          totalCases: Number(item.totalCases),
          activeCases: Number(item.activeCases),
          outbreakCount: Number(item.outbreakCount),
        });
      }
    });

    const heatmap = Array.from(stateMap.values()).map(item => ({
      state: item.state,
      infectionIndex: item.infectionIndex,
      totalCases: item.totalCases,
      activeCases: item.activeCases,
      outbreakCount: item.outbreakCount,
      // Calculate risk level based on infection index
      riskLevel: item.infectionIndex >= 70 ? 'high' : item.infectionIndex >= 40 ? 'medium' : 'low',
    }));

    res.json({
      heatmap,
    });
  } catch (error) {
    console.error("Heatmap data error:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to retrieve heatmap data",
    });
  }
});

/**
 * Helper function to get districts from location JSON files
 */
async function getDistrictsFromLocationFiles(state: string): Promise<string[]> {
  try {
    // Map state names to file names
    const stateToFileMap: Record<string, string> = {
      "Andhra Pradesh": "AndhraPradesh",
      "Arunachal Pradesh": "ArunachalPradesh",
      "Assam": "Assam",
      "Bihar": "Bihar",
      "Chhattisgarh": "Chhattisgarh",
      "Goa": "Goa",
      "Gujarat": "Gujarat",
      "Haryana": "Haryana",
      "Himachal Pradesh": "HimachalPradesh",
      "Jharkhand": "Jharkhand",
      "Karnataka": "Karnataka",
      "Kerala": "Kerala",
      "Madhya Pradesh": "MadhyaPradesh",
      "Maharashtra": "Maharashtra",
      "Manipur": "Manipur",
      "Meghalaya": "Meghalaya",
      "Mizoram": "Mizoram",
      "Nagaland": "Nagaland",
      "Odisha": "Odisha",
      "Punjab": "Punjab",
      "Rajasthan": "Rajasthan",
      "Sikkim": "Sikkim",
      "Tamil Nadu": "TamilNadu",
      "Telangana": "Telangana",
      "Tripura": "Tripura",
      "Uttar Pradesh": "UttarPradesh",
      "Uttarakhand": "Uttarakhand",
      "West Bengal": "WestBengal",
      "Delhi": "Delhi",
      "Jammu and Kashmir": "JammuAndKashmir",
      "Ladakh": "Ladakh",
      "Puducherry": "Puducherry",
      "Chandigarh": "Chandigarh",
      "Dadra and Nagar Haveli and Daman and Diu": "DadraAndNagarHaveliAndDamanAndDiu",
      "Lakshadweep": "Lakshadweep",
      "Andaman and Nicobar Islands": "AndamanAndNicobarIslands",
    };

    const fileName = stateToFileMap[state];
    if (!fileName) {
      console.log(`No file mapping found for state: ${state}`);
      return [];
    }

    // Path to location JSON files
    // When running with tsx, __dirname is packages/backend/src/routes
    // When compiled, __dirname is packages/backend/dist/routes
    // We need to go to the project root (4 levels up from src/routes, 3 from dist/routes)
    // Try both paths to handle both dev and production
    let projectRoot = join(__dirname, "..", "..", "..", ".."); // 4 levels for src/routes
    let locationFilesPath = join(projectRoot, "locaton json", `${fileName}.js`);
    
    // Check if file exists at this path, if not try 3 levels (for dist/routes)
    if (!existsSync(locationFilesPath)) {
      projectRoot = join(__dirname, "..", "..", ".."); // 3 levels for dist/routes
      locationFilesPath = join(projectRoot, "locaton json", `${fileName}.js`);
    }
    
    console.log(`[Districts] Looking for file: ${locationFilesPath}`);
    console.log(`[Districts] __dirname: ${__dirname}`);
    console.log(`[Districts] Project root: ${projectRoot}`);
    console.log(`[Districts] File exists: ${existsSync(locationFilesPath)}`);
    
    try {
      const fileContent = await readFile(locationFilesPath, "utf-8");
      console.log(`[Districts] Successfully read file ${fileName}.js, content length: ${fileContent.length}`);
      
      // Extract district names using regex
      const districts: string[] = [];
      const districtRegex = /"district":\s*"([^"]+)"/g;
      let match;
      
      while ((match = districtRegex.exec(fileContent)) !== null) {
        districts.push(match[1]);
      }
      
      console.log(`[Districts] Extracted ${districts.length} districts from ${fileName}.js`);
      
      // Remove duplicates and sort
      const uniqueDistricts = [...new Set(districts)].sort();
      console.log(`[Districts] Returning ${uniqueDistricts.length} unique districts`);
      
      return uniqueDistricts;
    } catch (fileError: any) {
      console.error(`[Districts] Error reading file ${fileName}.js at path: ${locationFilesPath}`);
      console.error(`[Districts] Error details:`, fileError.message);
      console.error(`[Districts] Error code:`, fileError.code);
      return [];
    }
  } catch (error: any) {
    console.error(`Error getting districts for ${state}:`, error.message);
    return [];
  }
}

/**
 * GET /api/dashboard/districts
 * Get list of districts for a given state
 * First tries database, then falls back to location JSON files
 */
router.get("/districts", async (req, res) => {
  try {
    const { state } = req.query;

    if (!state || typeof state !== "string") {
      return res.status(400).json({
        error: "Bad Request",
        message: "State parameter is required",
      });
    }

    const districtsSet = new Set<string>();

    // First, try to get districts from database
    try {
      const outbreakDistricts = await db
        .selectDistinct({ district: diseaseOutbreaks.district })
        .from(diseaseOutbreaks)
        .where(and(
          eq(diseaseOutbreaks.state, state),
          sql`${diseaseOutbreaks.district} IS NOT NULL`
        ));

      const reportDistricts = await db
        .selectDistinct()
        .from(symptomReports)
        .where(sql`${symptomReports.location}->>'state' = ${state} AND ${symptomReports.location}->>'district' IS NOT NULL`);

      outbreakDistricts.forEach(item => {
        if (item.district) districtsSet.add(item.district);
      });
      
      reportDistricts.forEach(item => {
        const district = item.location?.district;
        if (district && typeof district === "string") {
          districtsSet.add(district);
        }
      });
    } catch (dbError: any) {
      console.log("Database query failed, will use location files:", dbError.message);
    }

    // If no districts from database, use location JSON files as fallback
    if (districtsSet.size === 0) {
      console.log(`[Districts API] No districts found in database for ${state}, using location files...`);
      const fileDistricts = await getDistrictsFromLocationFiles(state);
      console.log(`[Districts API] Got ${fileDistricts.length} districts from location files for ${state}`);
      if (fileDistricts.length === 0) {
        console.warn(`[Districts API] WARNING: No districts found in location files for ${state}. Check if file exists.`);
      }
      fileDistricts.forEach(district => districtsSet.add(district));
    }

    const districts = Array.from(districtsSet).sort();

    console.log(`[Districts API] Found ${districts.length} districts for ${state}`);
    if (districts.length > 0) {
      console.log(`[Districts API] First 5 districts:`, districts.slice(0, 5));
    }

    res.json({
      state,
      districts,
    });
  } catch (error: any) {
    console.error("Districts error:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to retrieve districts",
      details: error.message,
    });
  }
});

/**
 * GET /api/dashboard/prevention-measures
 * Get prevention measures for diseases in a specific district
 * Query params: state, district
 */
router.get("/prevention-measures", async (req, res) => {
  try {
    const { state, district } = req.query;

    if (!state || !district) {
      return res.status(400).json({
        error: "Bad Request",
        message: "State and district parameters are required",
      });
    }

    // Get diseases that are active in this district
    const districtDiseases = await db
      .selectDistinct({ 
        diseaseId: diseaseOutbreaks.diseaseId,
        diseaseName: diseases.name 
      })
      .from(diseaseOutbreaks)
      .innerJoin(diseases, eq(diseaseOutbreaks.diseaseId, diseases.id))
      .where(
        and(
          eq(diseaseOutbreaks.state, state as string),
          eq(diseaseOutbreaks.district, district as string),
          eq(diseases.isActive, true)
        )
      )
      .limit(20); // Limit to prevent too many results

    if (districtDiseases.length === 0) {
      return res.json({
        state,
        district,
        preventionMeasures: [],
        message: "No active diseases found for this district",
      });
    }

    const diseaseIds = districtDiseases.map(d => d.diseaseId);

    // Get prevention measures for these diseases
    // Priority: district-specific > state-specific > general
    const preventionMeasures = await db
      .select()
      .from(diseasePrevention)
      .where(
        and(
          inArray(diseasePrevention.diseaseId, diseaseIds),
          eq(diseasePrevention.isActive, true),
          or(
            // District-specific
            and(
              eq(diseasePrevention.state, state as string),
              eq(diseasePrevention.district, district as string)
            ),
            // State-specific
            and(
              eq(diseasePrevention.state, state as string),
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
        // Prioritize district-specific, then state-specific, then general
        sql`CASE 
          WHEN ${diseasePrevention.district} IS NOT NULL THEN 1
          WHEN ${diseasePrevention.state} IS NOT NULL THEN 2
          ELSE 3
        END`,
        desc(diseasePrevention.priority)
      );

    // Group by disease for better frontend display
    const groupedMeasures: Record<string, any[]> = {};
    
    districtDiseases.forEach(disease => {
      groupedMeasures[disease.diseaseName] = preventionMeasures
        .filter(pm => pm.diseaseId === disease.diseaseId)
        .map(pm => ({
          id: pm.id,
          title: pm.title,
          description: pm.description,
          measures: pm.measures,
          category: pm.category,
          priority: pm.priority,
          source: pm.source,
          sourceUrl: pm.sourceUrl,
        }));
    });

    res.json({
      state,
      district,
      preventionMeasures: groupedMeasures,
      diseases: districtDiseases.map(d => d.diseaseName),
    });
  } catch (error: any) {
    console.error("Prevention measures error:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to retrieve prevention measures",
      details: error.message,
    });
  }
});

export default router;

