/**
 * AI Models Service
 * Handles AI/ML model operations:
 * - NLP symptom clustering
 * - Time-series anomaly detection
 * - Regional outbreak forecasting
 */

import { db } from "../db/index.js";
import { symptomReports } from "../db/schema/symptoms.js";
import { symptomClusters } from "../db/schema/analytics.js";

/**
 * Cluster symptoms using NLP analysis
 * Groups similar symptom reports together
 */
export async function clusterSymptoms(reports: any[]) {
  // TODO: Implement NLP-based symptom clustering
  // Options: Natural.js, Compromise.js, or Python service
  
  console.log(`🤖 Clustering ${reports.length} symptom reports...`);
  
  // Mock clustering logic
  const clusters: Record<string, any[]> = {};
  
  reports.forEach((report) => {
    const key = report.symptoms?.join("_") || "unknown";
    if (!clusters[key]) {
      clusters[key] = [];
    }
    clusters[key].push(report);
  });
  
  // Store clusters in database
  for (const [symptoms, clusterReports] of Object.entries(clusters)) {
    try {
      const firstReport = clusterReports[0];
      const symptomList = symptoms.split("_").filter(s => s && s !== "unknown");
      const riskLevel = calculateRiskLevel(clusterReports);
      
      await db.insert(symptomClusters).values({
        clusterName: `Cluster_${symptomList.slice(0, 3).join("_").substring(0, 50)}`,
        symptoms: symptomList,
        frequency: clusterReports.length,
        location: firstReport?.location || null,
        confidence: riskLevel === "high" ? 85 : clusterReports.length > 5 ? 70 : 50,
      });
    } catch (error) {
      console.error("Error storing symptom cluster:", error);
    }
  }
  
  return {
    clusters: Object.keys(clusters).length,
    totalReports: reports.length,
  };
}

/**
 * Detect anomalies in time-series data
 * Identifies unusual spikes in disease reports
 * Enhanced statistical anomaly detection
 */
export async function detectAnomalies(timeSeriesData: any[]) {
  console.log(`🔍 Analyzing ${timeSeriesData.length} data points for anomalies...`);
  
  if (!timeSeriesData || timeSeriesData.length === 0) {
    return {
      anomalies: 0,
      data: [],
      message: "No data provided",
    };
  }
  
  // Enhanced statistical anomaly detection
  const anomalies: any[] = [];
  const values = timeSeriesData.map((d) => d.count || d.value || 0);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);
  
  // Calculate moving average for better detection
  const windowSize = Math.min(7, Math.floor(timeSeriesData.length / 3));
  const movingAverages: number[] = [];
  
  for (let i = 0; i < values.length; i++) {
    const start = Math.max(0, i - windowSize);
    const end = Math.min(values.length, i + windowSize + 1);
    const window = values.slice(start, end);
    movingAverages.push(window.reduce((a, b) => a + b, 0) / window.length);
  }
  
  timeSeriesData.forEach((point, index) => {
    const value = point.count || point.value || 0;
    const zScore = stdDev > 0 ? Math.abs((value - mean) / stdDev) : 0;
    const deviationFromMA = movingAverages[index] > 0 
      ? Math.abs((value - movingAverages[index]) / movingAverages[index]) * 100
      : 0;
    
    // Detect anomalies: high z-score OR significant deviation from moving average
    if (zScore > 2 || deviationFromMA > 50) {
      anomalies.push({
        index,
        date: point.date || point.timestamp,
        value,
        zScore: zScore.toFixed(2),
        deviationFromAverage: deviationFromMA.toFixed(2),
        severity: zScore > 3 || deviationFromMA > 100 ? "high" : deviationFromMA > 75 ? "medium" : "low",
        expectedValue: Math.round(mean),
        movingAverage: Math.round(movingAverages[index]),
        recommendation: zScore > 3 ? "Immediate investigation required" : "Monitor closely",
      });
    }
  });
  
  return {
    anomalies: anomalies.length,
    data: anomalies,
    statistics: {
      totalDataPoints: timeSeriesData.length,
      mean: Math.round(mean),
      stdDev: Math.round(stdDev),
      threshold: Math.round(mean + (2 * stdDev)),
    },
    detectedAt: new Date().toISOString(),
  };
}

/**
 * Forecast regional disease outbreaks
 * Predicts future outbreak patterns by region
 * Enhanced mock implementation with realistic forecasting
 */
export async function forecastOutbreaks(historicalData: any[], regions: string[]) {
  console.log(`📈 Forecasting outbreaks for ${regions.length} regions...`);
  
  // Enhanced mock forecasting with trend analysis
  const forecasts = regions.map((region) => {
    // Calculate trend from historical data if available
    let trend = "stable";
    let predictedCases = Math.floor(Math.random() * 500) + 50;
    let confidence = 60 + Math.random() * 30; // 60-90% confidence
    
    if (historicalData && historicalData.length > 0) {
      const regionData = historicalData.filter((d: any) => d.region === region);
      if (regionData.length > 1) {
        const recent = regionData.slice(-3);
        const older = regionData.slice(-6, -3);
        
        const recentAvg = recent.reduce((sum: number, d: any) => sum + (d.cases || 0), 0) / recent.length;
        const olderAvg = older.reduce((sum: number, d: any) => sum + (d.cases || 0), 0) / older.length;
        
        const change = ((recentAvg - olderAvg) / olderAvg) * 100;
        
        if (change > 10) {
          trend = "increasing";
          predictedCases = Math.floor(recentAvg * 1.2);
          confidence = 75 + Math.random() * 15;
        } else if (change < -10) {
          trend = "decreasing";
          predictedCases = Math.floor(recentAvg * 0.8);
          confidence = 75 + Math.random() * 15;
        } else {
          predictedCases = Math.floor(recentAvg);
          confidence = 70 + Math.random() * 20;
        }
      }
    }
    
    // Forecast for next 7, 14, and 30 days
    const forecastDate7 = new Date();
    forecastDate7.setDate(forecastDate7.getDate() + 7);
    
    const forecastDate14 = new Date();
    forecastDate14.setDate(forecastDate14.getDate() + 14);
    
    const forecastDate30 = new Date();
    forecastDate30.setDate(forecastDate30.getDate() + 30);
    
    return {
      region,
      predictedCases,
      confidence: Math.round(confidence),
      trend,
      forecastDate: forecastDate7.toISOString(),
      forecasts: {
        "7days": {
          cases: predictedCases,
          confidence: Math.round(confidence),
          date: forecastDate7.toISOString(),
        },
        "14days": {
          cases: Math.floor(predictedCases * (trend === "increasing" ? 1.3 : trend === "decreasing" ? 0.7 : 1)),
          confidence: Math.round(confidence * 0.9),
          date: forecastDate14.toISOString(),
        },
        "30days": {
          cases: Math.floor(predictedCases * (trend === "increasing" ? 1.6 : trend === "decreasing" ? 0.5 : 1)),
          confidence: Math.round(confidence * 0.8),
          date: forecastDate30.toISOString(),
        },
      },
    };
  });
  
  return {
    forecasts,
    forecastedAt: new Date().toISOString(),
    model: "mock_forecasting_v1",
    accuracy: "Estimated based on historical trends",
  };
}

/**
 * Calculate risk level from symptom reports
 */
function calculateRiskLevel(reports: any[]): "low" | "medium" | "high" {
  // Simple heuristic
  const count = reports.length;
  if (count > 10) return "high";
  if (count > 5) return "medium";
  return "low";
}

/**
 * Process all symptom reports and generate insights
 */
export async function processSymptomReports() {
  try {
    // Fetch recent unprocessed reports
    const reports = await db.select().from(symptomReports).limit(100);
    
    if (reports.length === 0) {
      return { message: "No reports to process" };
    }
    
    // Cluster symptoms
    const clusteringResult = await clusterSymptoms(reports);
    
    // Detect anomalies
    // TODO: Transform reports into time-series format
    // const anomalies = await detectAnomalies(timeSeriesData);
    
    return {
      processed: reports.length,
      clusters: clusteringResult.clusters,
    };
  } catch (error) {
    console.error("Error processing symptom reports:", error);
    throw error;
  }
}

