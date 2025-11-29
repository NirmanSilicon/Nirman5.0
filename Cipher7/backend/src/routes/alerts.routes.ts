/**
 * Alerts Routes
 * Handles alert checking and sending (admin/manual trigger)
 */

import express from "express";
import { authenticate, requireAdmin } from "../middleware/auth.middleware.js";
import { checkAndSendAlerts } from "../services/alert.service.js";

const router = express.Router();

/**
 * POST /api/alerts/check
 * Manually trigger alert checking and sending (admin only)
 */
router.post("/check", authenticate, requireAdmin, async (req, res) => {
  try {
    // Run alert check in background (don't block response)
    checkAndSendAlerts().catch((error) => {
      console.error("Error in background alert check:", error);
    });

    res.json({
      success: true,
      message: "Alert check initiated. Alerts will be sent to eligible users.",
    });
  } catch (error: any) {
    console.error("Error initiating alert check:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to initiate alert check",
      details: error.message,
    });
  }
});

export default router;

