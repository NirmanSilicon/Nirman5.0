import express from "express";
import { z } from "zod";
import { eq, desc, and, gte, lte } from "drizzle-orm";
import { db } from "../db/index.js";
import { symptomReports } from "../db/schema/symptoms.js";
import { users } from "../db/schema/users.js";
import { authenticate, requireAdmin } from "../middleware/auth.middleware.js";
import { verifyToken, extractTokenFromHeader } from "../utils/jwt.utils.js";
import { awardPointsForVerifiedReport, checkAndAwardBadges } from "../services/rewards.service.js";

const router = express.Router();

// Validation schemas
const createReportSchema = z.object({
  symptoms: z.array(z.string()).min(1, "At least one symptom is required"),
  duration: z.number().int().min(1).max(30),
  severity: z.enum(["Mild", "Moderate", "Severe"]),
  location: z.object({
    state: z.string(),
    district: z.string().optional(),
    city: z.string().optional(),
    coordinates: z
      .object({
        latitude: z.number().optional(),
        longitude: z.number().optional(),
      })
      .optional(),
  }),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
});

const updateReportStatusSchema = z.object({
  status: z.enum(["pending", "verified", "rejected"]),
});

/**
 * Optional authentication middleware - doesn't fail if no token
 */
function optionalAuthenticate(req: express.Request, res: express.Response, next: express.NextFunction) {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    if (token) {
      const payload = verifyToken(token);
      req.user = payload;
    }
    next();
  } catch (error) {
    // If token is invalid, just continue without user (for anonymous reports)
    next();
  }
}

/**
 * POST /api/symptoms/report
 * Submit a symptom report (can be anonymous or authenticated)
 */
router.post("/report", optionalAuthenticate, async (req, res) => {
  try {
    // If user is authenticated, use their ID and email from profile
    const userId = req.user?.userId || null;
    let email = req.body.email || null;
    
    // If user is authenticated but no email in body, get from user profile
    if (userId && !email) {
      const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      if (user) {
        email = user.email;
      }
    }

    if (!email) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Email is required for symptom reporting",
      });
    }

    const reportData = createReportSchema.parse({
      ...req.body,
      email: undefined, // Remove email from validation
    });

    // Create report
    const [newReport] = await db
      .insert(symptomReports)
      .values({
        userId: userId || null,
        email,
        symptoms: reportData.symptoms,
        duration: reportData.duration,
        severity: reportData.severity,
        location: reportData.location,
        description: reportData.description || null,
        imageUrl: reportData.imageUrl || null,
        status: "pending",
        isVerified: false,
      })
      .returning();

    res.status(201).json({
      message: "Thank you! Your report will be reviewed and contribute to community health.",
      report: {
        id: newReport.id,
        status: newReport.status,
        createdAt: newReport.createdAt,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation Error",
        message: error.errors[0].message,
        details: error.errors,
      });
    }

    console.error("Symptom report error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const isDevelopment = process.env.NODE_ENV === "development";

    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to submit symptom report",
      ...(isDevelopment && { details: errorMessage }),
    });
  }
});

/**
 * GET /api/symptoms/reports
 * Get symptom reports (admin only, or user's own reports)
 */
router.get("/reports", authenticate, async (req, res) => {
  try {
    const isAdmin = req.user?.role === "admin";
    const userId = req.user?.userId;

    let reports;

    if (isAdmin) {
      // Admin can see all reports
      const { status, limit = 50, offset = 0 } = req.query;

      let query = db.select().from(symptomReports).orderBy(desc(symptomReports.createdAt));

      if (status && typeof status === "string") {
        query = query.where(eq(symptomReports.status, status)) as typeof query;
      }

      reports = await query.limit(Number(limit)).offset(Number(offset));
    } else {
      // Users can only see their own reports
      reports = await db
        .select()
        .from(symptomReports)
        .where(eq(symptomReports.userId, userId))
        .orderBy(desc(symptomReports.createdAt))
        .limit(50);
    }

    // If admin, include user information
    if (isAdmin) {
      const reportsWithUsers = await Promise.all(
        reports.map(async (report) => {
          let userInfo = null;
          if (report.userId) {
            const [user] = await db.select({
              id: users.id,
              email: users.email,
              name: users.name,
            }).from(users).where(eq(users.id, report.userId)).limit(1);
            userInfo = user || null;
          }
          
          return {
            id: report.id,
            userId: report.userId,
            email: report.email,
            user: userInfo,
            symptoms: report.symptoms,
            duration: report.duration,
            severity: report.severity,
            location: report.location,
            description: report.description,
            imageUrl: report.imageUrl,
            status: report.status,
            isVerified: report.isVerified,
            createdAt: report.createdAt,
            updatedAt: report.updatedAt,
          };
        })
      );
      
      return res.json({ reports: reportsWithUsers });
    }

    // For regular users, return their own reports
    res.json({
      reports: reports.map((report) => ({
        id: report.id,
        symptoms: report.symptoms,
        duration: report.duration,
        severity: report.severity,
        location: report.location,
        description: report.description,
        imageUrl: report.imageUrl,
        status: report.status,
        isVerified: report.isVerified,
        createdAt: report.createdAt,
        updatedAt: report.updatedAt,
      })),
    });
  } catch (error) {
    console.error("Get reports error:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to retrieve reports",
    });
  }
});

/**
 * PUT /api/symptoms/reports/:id/verify
 * Verify a symptom report (admin only)
 */
router.put("/reports/:id/verify", authenticate, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = updateReportStatusSchema.parse(req.body);

    const [report] = await db.select().from(symptomReports).where(eq(symptomReports.id, id)).limit(1);

    if (!report) {
      return res.status(404).json({
        error: "Not Found",
        message: "Report not found",
      });
    }

    const [updatedReport] = await db
      .update(symptomReports)
      .set({
        status,
        isVerified: status === "verified",
        verifiedBy: req.user?.userId,
        verifiedAt: status === "verified" ? new Date() : null,
        updatedAt: new Date(),
      })
      .where(eq(symptomReports.id, id))
      .returning();

    // Award rewards if verified and user is authenticated
    if (status === "verified" && updatedReport.userId) {
      try {
        console.log(`[Verify Report] Awarding rewards for report ${id} to user ${updatedReport.userId}`);
        await awardPointsForVerifiedReport(updatedReport.userId, id);
        await checkAndAwardBadges(updatedReport.userId);
        console.log(`[Verify Report] Successfully awarded rewards for report ${id}`);
      } catch (error: any) {
        console.error("[Verify Report] Error awarding rewards:", error);
        console.error("[Verify Report] Error details:", error.message, error.stack);
        // Don't fail the verification if rewards fail, but log the error
      }
    } else if (status === "verified" && !updatedReport.userId) {
      console.log(`[Verify Report] Report ${id} verified but no userId - cannot award points (anonymous report)`);
    }

    res.json({
      message: `Report ${status} successfully`,
      report: {
        id: updatedReport.id,
        status: updatedReport.status,
        isVerified: updatedReport.isVerified,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation Error",
        message: error.errors[0].message,
      });
    }

    console.error("Verify report error:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to verify report",
    });
  }
});

/**
 * PUT /api/symptoms/reports/:id
 * Update a symptom report (user can only update their own reports)
 */
router.put("/reports/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    // Check if report exists and belongs to user
    const [report] = await db.select().from(symptomReports).where(eq(symptomReports.id, id)).limit(1);

    if (!report) {
      return res.status(404).json({
        error: "Not Found",
        message: "Report not found",
      });
    }

    // Users can only edit their own reports
    if (report.userId !== userId) {
      return res.status(403).json({
        error: "Forbidden",
        message: "You can only edit your own reports",
      });
    }

    // Only allow editing if report is pending
    if (report.status !== "pending") {
      return res.status(400).json({
        error: "Bad Request",
        message: "Can only edit pending reports",
      });
    }

    const reportData = createReportSchema.partial().parse(req.body);

    const [updatedReport] = await db
      .update(symptomReports)
      .set({
        ...reportData,
        updatedAt: new Date(),
      })
      .where(eq(symptomReports.id, id))
      .returning();

    res.json({
      message: "Report updated successfully",
      report: updatedReport,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation Error",
        message: error.errors[0].message,
      });
    }

    console.error("Update report error:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to update report",
    });
  }
});

/**
 * DELETE /api/symptoms/reports/:id
 * Delete a symptom report (user can only delete their own reports)
 */
router.delete("/reports/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    // Check if report exists and belongs to user
    const [report] = await db.select().from(symptomReports).where(eq(symptomReports.id, id)).limit(1);

    if (!report) {
      return res.status(404).json({
        error: "Not Found",
        message: "Report not found",
      });
    }

    // Users can only delete their own reports
    if (report.userId !== userId) {
      return res.status(403).json({
        error: "Forbidden",
        message: "You can only delete your own reports",
      });
    }

    await db.delete(symptomReports).where(eq(symptomReports.id, id));

    res.json({
      message: "Report deleted successfully",
    });
  } catch (error) {
    console.error("Delete report error:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to delete report",
    });
  }
});

export default router;

