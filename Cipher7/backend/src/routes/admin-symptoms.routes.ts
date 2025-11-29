import express from "express";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { symptoms } from "../db/schema/symptoms.js";
import { authenticate, requireAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// Validation schemas
const createSymptomSchema = z.object({
  name: z.string().min(1, "Symptom name is required"),
  category: z.string().optional(),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

/**
 * GET /api/admin/symptoms
 * Get all symptoms (admin only)
 */
router.get("/", authenticate, requireAdmin, async (req, res) => {
  try {
    const allSymptoms = await db.select().from(symptoms).orderBy(symptoms.name);
    
    res.json({
      symptoms: allSymptoms,
    });
  } catch (error) {
    console.error("Get symptoms error:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to fetch symptoms",
    });
  }
});

/**
 * POST /api/admin/symptoms
 * Create a new symptom (admin only)
 */
router.post("/", authenticate, requireAdmin, async (req, res) => {
  try {
    const symptomData = createSymptomSchema.parse(req.body);
    const userId = req.user?.userId;

    // Check if symptom already exists
    const [existing] = await db
      .select()
      .from(symptoms)
      .where(eq(symptoms.name, symptomData.name))
      .limit(1);

    if (existing) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Symptom with this name already exists",
      });
    }

    const [newSymptom] = await db
      .insert(symptoms)
      .values({
        name: symptomData.name,
        category: symptomData.category || null,
        description: symptomData.description || null,
        isActive: symptomData.isActive,
        createdBy: userId || null,
      })
      .returning();

    res.status(201).json({
      message: "Symptom created successfully",
      symptom: newSymptom,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation Error",
        message: error.errors[0].message,
      });
    }

    console.error("Create symptom error:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to create symptom",
    });
  }
});

/**
 * PUT /api/admin/symptoms/:id
 * Update a symptom (admin only)
 */
router.put("/:id", authenticate, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const symptomData = createSymptomSchema.partial().parse(req.body);

    const [updatedSymptom] = await db
      .update(symptoms)
      .set({
        ...symptomData,
        updatedAt: new Date(),
      })
      .where(eq(symptoms.id, id))
      .returning();

    if (!updatedSymptom) {
      return res.status(404).json({
        error: "Not Found",
        message: "Symptom not found",
      });
    }

    res.json({
      message: "Symptom updated successfully",
      symptom: updatedSymptom,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation Error",
        message: error.errors[0].message,
      });
    }

    console.error("Update symptom error:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to update symptom",
    });
  }
});

/**
 * DELETE /api/admin/symptoms/:id
 * Delete a symptom (admin only)
 */
router.delete("/:id", authenticate, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const [deletedSymptom] = await db
      .delete(symptoms)
      .where(eq(symptoms.id, id))
      .returning();

    if (!deletedSymptom) {
      return res.status(404).json({
        error: "Not Found",
        message: "Symptom not found",
      });
    }

    res.json({
      message: "Symptom deleted successfully",
    });
  } catch (error) {
    console.error("Delete symptom error:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to delete symptom",
    });
  }
});

export default router;

