/**
 * Data Management Routes
 * Handles dataset imports, data pipeline operations, and AI processing
 */

import express from "express";
import { authenticate, requireAdmin } from "../middleware/auth.middleware.js";
import { importICMRData, importMoHFWData, importVRDLData } from "../services/dataset.service.js";
import { fetchGoogleTrends, fetchRedditPosts, fetchTwitterPosts, processScrapedData } from "../services/data-pipeline.service.js";
import { processSymptomReports, detectAnomalies, forecastOutbreaks } from "../services/ai-models.service.js";

const router = express.Router();

/**
 * POST /api/data/import/icmr
 * Import ICMR disease dataset (Admin only)
 */
router.post("/import/icmr", authenticate, requireAdmin, async (req, res) => {
  try {
    const { data } = req.body;
    
    // If data is provided, validate it's an array
    // If not provided, use mock data
    if (data !== undefined && !Array.isArray(data)) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Data must be an array",
      });
    }
    
    const result = await importICMRData(data);
    
    res.json({
      success: true,
      message: data ? "ICMR data imported successfully" : "Mock ICMR data imported successfully",
      ...result,
    });
  } catch (error: any) {
    console.error("Error importing ICMR data:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to import ICMR data",
      details: error.message,
    });
  }
});

/**
 * POST /api/data/import/mohfw
 * Import MoHFW outbreak dataset (Admin only)
 */
router.post("/import/mohfw", authenticate, requireAdmin, async (req, res) => {
  try {
    const { data } = req.body;
    
    // If data is provided, validate it's an array
    // If not provided, use mock data
    if (data !== undefined && !Array.isArray(data)) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Data must be an array",
      });
    }
    
    const result = await importMoHFWData(data);
    
    res.json({
      success: true,
      message: data ? "MoHFW data imported successfully" : "Mock MoHFW data imported successfully",
      ...result,
    });
  } catch (error: any) {
    console.error("Error importing MoHFW data:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to import MoHFW data",
      details: error.message,
    });
  }
});

/**
 * POST /api/data/import/vrdl
 * Import VRDL dataset (Admin only)
 */
router.post("/import/vrdl", authenticate, requireAdmin, async (req, res) => {
  try {
    const { data } = req.body;
    
    // If data is provided, validate it's an array
    // If not provided, use mock data
    if (data !== undefined && !Array.isArray(data)) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Data must be an array",
      });
    }
    
    const result = await importVRDLData(data);
    
    res.json({
      success: true,
      message: data ? "VRDL data imported successfully" : "Mock VRDL data imported successfully",
      ...result,
    });
  } catch (error: any) {
    console.error("Error importing VRDL data:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to import VRDL data",
      details: error.message,
    });
  }
});

/**
 * POST /api/data/pipeline/google-trends
 * Fetch Google Trends data (Admin only)
 */
router.post("/pipeline/google-trends", authenticate, requireAdmin, async (req, res) => {
  try {
    const { keywords, timeframe } = req.body;
    
    if (!keywords || !Array.isArray(keywords)) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Keywords must be an array",
      });
    }
    
    const data = await fetchGoogleTrends(keywords, timeframe);
    const processed = await processScrapedData("google", data);
    
    res.json({
      success: true,
      data: processed,
    });
  } catch (error: any) {
    console.error("Error fetching Google Trends:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to fetch Google Trends data",
      details: error.message,
    });
  }
});

/**
 * POST /api/data/pipeline/reddit
 * Fetch Reddit posts (Admin only)
 */
router.post("/pipeline/reddit", authenticate, requireAdmin, async (req, res) => {
  try {
    const { keywords, limit } = req.body;
    
    if (!keywords || !Array.isArray(keywords)) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Keywords must be an array",
      });
    }
    
    const data = await fetchRedditPosts(keywords, limit || 10);
    const processed = await processScrapedData("reddit", data);
    
    res.json({
      success: true,
      data: processed,
    });
  } catch (error: any) {
    console.error("Error fetching Reddit posts:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to fetch Reddit posts",
      details: error.message,
    });
  }
});

/**
 * POST /api/data/pipeline/twitter
 * Fetch Twitter/X posts (Admin only)
 */
router.post("/pipeline/twitter", authenticate, requireAdmin, async (req, res) => {
  try {
    const { keywords, limit } = req.body;
    
    if (!keywords || !Array.isArray(keywords)) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Keywords must be an array",
      });
    }
    
    const data = await fetchTwitterPosts(keywords, limit || 10);
    const processed = await processScrapedData("twitter", data);
    
    res.json({
      success: true,
      data: processed,
    });
  } catch (error: any) {
    console.error("Error fetching Twitter posts:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to fetch Twitter posts",
      details: error.message,
    });
  }
});

/**
 * POST /api/data/ai/process-symptoms
 * Process symptom reports using AI (Admin only)
 */
router.post("/ai/process-symptoms", authenticate, requireAdmin, async (req, res) => {
  try {
    const result = await processSymptomReports();
    
    res.json({
      success: true,
      message: "Symptom reports processed successfully",
      ...result,
    });
  } catch (error: any) {
    console.error("Error processing symptom reports:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to process symptom reports",
      details: error.message,
    });
  }
});

/**
 * POST /api/data/ai/detect-anomalies
 * Detect anomalies in time-series data (Admin only)
 */
router.post("/ai/detect-anomalies", authenticate, requireAdmin, async (req, res) => {
  try {
    const { timeSeriesData } = req.body;
    
    if (!timeSeriesData || !Array.isArray(timeSeriesData)) {
      return res.status(400).json({
        error: "Bad Request",
        message: "timeSeriesData must be an array",
      });
    }
    
    const result = await detectAnomalies(timeSeriesData);
    
    res.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error("Error detecting anomalies:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to detect anomalies",
      details: error.message,
    });
  }
});

/**
 * POST /api/data/ai/forecast-outbreaks
 * Forecast regional disease outbreaks (Admin only)
 */
router.post("/ai/forecast-outbreaks", authenticate, requireAdmin, async (req, res) => {
  try {
    const { historicalData, regions } = req.body;
    
    if (!regions || !Array.isArray(regions)) {
      return res.status(400).json({
        error: "Bad Request",
        message: "regions must be an array",
      });
    }
    
    const result = await forecastOutbreaks(historicalData || [], regions);
    
    res.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error("Error forecasting outbreaks:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to forecast outbreaks",
      details: error.message,
    });
  }
});

export default router;

