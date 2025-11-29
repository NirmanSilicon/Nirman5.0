import express from "express";
import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { db } from "../db/index.js";
import { medicines, medicinePrices } from "../db/schema/medicines.js";
import { authenticate, requireAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// Validation schemas
const createMedicineSchema = z.object({
  genericName: z.string().min(1, "Generic name is required"),
  brandName: z.string().min(1, "Brand name is required"),
  manufacturer: z.string().optional(),
  composition: z.array(z.object({
    ingredient: z.string(),
    dosage: z.string(),
  })).min(1, "At least one composition is required"),
  form: z.string().optional(), // Tablet, Capsule, etc.
  strength: z.string().optional(),
  packaging: z.string().optional(),
  indications: z.string().optional(),
  category: z.string().optional(),
  schedule: z.string().optional(),
  isPrescriptionRequired: z.boolean().default(false),
  source: z.enum(["Janaushadhi", "DavaIndia", "Manual"]),
  sourceUrl: z.string().url().optional(),
});

const addPriceSchema = z.object({
  source: z.enum(["Janaushadhi", "DavaIndia", "Local Pharmacy"]),
  price: z.number().positive("Price must be positive"),
  currency: z.string().default("INR"),
  packaging: z.string().optional(),
  availability: z.enum(["available", "out_of_stock", "discontinued"]).default("available"),
  location: z.object({
    state: z.string().optional(),
    city: z.string().optional(),
    district: z.string().optional(),
  }).optional(),
  sourceUrl: z.string().url().optional(),
});

/**
 * GET /api/admin/medicines
 * Get all medicines with prices (admin only)
 */
router.get("/", authenticate, requireAdmin, async (req, res) => {
  try {
    const allMedicines = await db.select().from(medicines).orderBy(desc(medicines.createdAt));
    
    // Get prices for each medicine
    const medicinesWithPrices = await Promise.all(
      allMedicines.map(async (medicine) => {
        const prices = await db
          .select()
          .from(medicinePrices)
          .where(eq(medicinePrices.medicineId, medicine.id))
          .orderBy(desc(medicinePrices.lastUpdated));
        
        return {
          ...medicine,
          prices: prices || [],
        };
      })
    );
    
    res.json({
      success: true,
      count: medicinesWithPrices.length,
      medicines: medicinesWithPrices || [],
    });
  } catch (error: any) {
    console.error("Get medicines error:", error);
    
    // Check if it's a table doesn't exist error
    if (error.message?.includes("does not exist") || error.message?.includes("relation")) {
      return res.status(500).json({
        error: "Database Error",
        message: "Medicines table not found. Please run the database migration script.",
        details: error.message,
      });
    }
    
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to fetch medicines",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

/**
 * POST /api/admin/medicines
 * Create a new medicine (admin only)
 */
router.post("/", authenticate, requireAdmin, async (req, res) => {
  try {
    const medicineData = createMedicineSchema.parse(req.body);

    const [newMedicine] = await db
      .insert(medicines)
      .values({
        genericName: medicineData.genericName,
        brandName: medicineData.brandName,
        manufacturer: medicineData.manufacturer || null,
        composition: medicineData.composition,
        form: medicineData.form || null,
        strength: medicineData.strength || null,
        packaging: medicineData.packaging || null,
        indications: medicineData.indications || null,
        category: medicineData.category || null,
        schedule: medicineData.schedule || null,
        isPrescriptionRequired: medicineData.isPrescriptionRequired,
        source: medicineData.source,
        sourceUrl: medicineData.sourceUrl || null,
        isActive: true,
      })
      .returning();

    res.status(201).json({
      message: "Medicine created successfully",
      medicine: newMedicine,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation Error",
        message: error.errors[0].message,
      });
    }

    console.error("Create medicine error:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to create medicine",
    });
  }
});

/**
 * PUT /api/admin/medicines/:id
 * Update a medicine (admin only)
 */
router.put("/:id", authenticate, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const medicineData = createMedicineSchema.partial().parse(req.body);

    const [updatedMedicine] = await db
      .update(medicines)
      .set({
        ...medicineData,
        updatedAt: new Date(),
      })
      .where(eq(medicines.id, id))
      .returning();

    if (!updatedMedicine) {
      return res.status(404).json({
        error: "Not Found",
        message: "Medicine not found",
      });
    }

    res.json({
      message: "Medicine updated successfully",
      medicine: updatedMedicine,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation Error",
        message: error.errors[0].message,
      });
    }

    console.error("Update medicine error:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to update medicine",
    });
  }
});

/**
 * DELETE /api/admin/medicines/:id
 * Delete a medicine (admin only)
 */
router.delete("/:id", authenticate, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const [deletedMedicine] = await db
      .delete(medicines)
      .where(eq(medicines.id, id))
      .returning();

    if (!deletedMedicine) {
      return res.status(404).json({
        error: "Not Found",
        message: "Medicine not found",
      });
    }

    res.json({
      message: "Medicine deleted successfully",
    });
  } catch (error) {
    console.error("Delete medicine error:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to delete medicine",
    });
  }
});

/**
 * POST /api/admin/medicines/:id/prices
 * Add price for a medicine (admin only)
 */
router.post("/:id/prices", authenticate, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const priceData = addPriceSchema.parse(req.body);

    // Check if medicine exists
    const [medicine] = await db.select().from(medicines).where(eq(medicines.id, id)).limit(1);
    if (!medicine) {
      return res.status(404).json({
        error: "Not Found",
        message: "Medicine not found",
      });
    }

    const [newPrice] = await db
      .insert(medicinePrices)
      .values({
        medicineId: id,
        source: priceData.source,
        price: priceData.price.toString(),
        currency: priceData.currency,
        packaging: priceData.packaging || null,
        availability: priceData.availability,
        location: priceData.location || null,
        sourceUrl: priceData.sourceUrl || null,
      })
      .returning();

    res.status(201).json({
      message: "Price added successfully",
      price: newPrice,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation Error",
        message: error.errors[0].message,
      });
    }

    console.error("Add price error:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to add price",
    });
  }
});

/**
 * PUT /api/admin/medicines/:id/prices/:priceId
 * Update a price for a medicine (admin only)
 */
router.put("/:id/prices/:priceId", authenticate, requireAdmin, async (req, res) => {
  try {
    const { id, priceId } = req.params;
    const priceData = addPriceSchema.partial().parse(req.body);

    // Check if medicine exists
    const [medicine] = await db.select().from(medicines).where(eq(medicines.id, id)).limit(1);
    if (!medicine) {
      return res.status(404).json({
        error: "Not Found",
        message: "Medicine not found",
      });
    }

    // Check if price exists and belongs to this medicine
    const [existingPrice] = await db
      .select()
      .from(medicinePrices)
      .where(eq(medicinePrices.id, priceId))
      .limit(1);

    if (!existingPrice || existingPrice.medicineId !== id) {
      return res.status(404).json({
        error: "Not Found",
        message: "Price not found",
      });
    }

    const [updatedPrice] = await db
      .update(medicinePrices)
      .set({
        ...(priceData.source && { source: priceData.source }),
        ...(priceData.price !== undefined && { price: priceData.price.toString() }),
        ...(priceData.currency && { currency: priceData.currency }),
        ...(priceData.packaging !== undefined && { packaging: priceData.packaging || null }),
        ...(priceData.availability && { availability: priceData.availability }),
        ...(priceData.location !== undefined && { location: priceData.location || null }),
        ...(priceData.sourceUrl !== undefined && { sourceUrl: priceData.sourceUrl || null }),
        lastUpdated: new Date(),
      })
      .where(eq(medicinePrices.id, priceId))
      .returning();

    res.json({
      message: "Price updated successfully",
      price: updatedPrice,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation Error",
        message: error.errors[0].message,
      });
    }

    console.error("Update price error:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to update price",
    });
  }
});

/**
 * DELETE /api/admin/medicines/:id/prices/:priceId
 * Delete a price for a medicine (admin only)
 */
router.delete("/:id/prices/:priceId", authenticate, requireAdmin, async (req, res) => {
  try {
    const { id, priceId } = req.params;

    // Check if medicine exists
    const [medicine] = await db.select().from(medicines).where(eq(medicines.id, id)).limit(1);
    if (!medicine) {
      return res.status(404).json({
        error: "Not Found",
        message: "Medicine not found",
      });
    }

    // Check if price exists and belongs to this medicine
    const [existingPrice] = await db
      .select()
      .from(medicinePrices)
      .where(eq(medicinePrices.id, priceId))
      .limit(1);

    if (!existingPrice || existingPrice.medicineId !== id) {
      return res.status(404).json({
        error: "Not Found",
        message: "Price not found",
      });
    }

    await db.delete(medicinePrices).where(eq(medicinePrices.id, priceId));

    res.json({
      message: "Price deleted successfully",
    });
  } catch (error) {
    console.error("Delete price error:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to delete price",
    });
  }
});

export default router;

