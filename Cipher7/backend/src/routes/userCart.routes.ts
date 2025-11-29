/**
 * User Cart Routes
 * Handles saving and retrieving medicines from user's cart
 */

import express from "express";
import { db } from "../db/index.js";
import { userCart } from "../db/schema/userCart.js";
import { medicines, medicinePrices } from "../db/schema/medicines.js";
import { eq, and, desc } from "drizzle-orm";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * GET /api/cart
 * Get user's saved medicines
 */
router.get("/", authenticate, async (req, res) => {
  try {
    const userId = (req as any).user.userId;

    const cartItems = await db
      .select({
        id: userCart.id,
        quantity: userCart.quantity,
        createdAt: userCart.createdAt,
        medicine: medicines,
      })
      .from(userCart)
      .innerJoin(medicines, eq(userCart.medicineId, medicines.id))
      .where(eq(userCart.userId, userId))
      .orderBy(desc(userCart.createdAt));

    // Get prices for each medicine
    const cartWithPrices = await Promise.all(
      cartItems.map(async (item) => {
        const prices = await db
          .select()
          .from(medicinePrices)
          .where(
            and(
              eq(medicinePrices.medicineId, item.medicine.id),
              eq(medicinePrices.availability, "available")
            )
          )
          .orderBy(desc(medicinePrices.lastUpdated))
          .limit(5);

        const cheapestPrice = prices.length > 0
          ? prices.reduce((min, p) => 
              parseFloat(p.price) < parseFloat(min.price) ? p : min
            )
          : null;

        return {
          ...item,
          prices: {
            all: prices,
            cheapest: cheapestPrice,
            count: prices.length,
          },
        };
      })
    );

    res.json({
      success: true,
      count: cartWithPrices.length,
      items: cartWithPrices,
    });
  } catch (error: any) {
    console.error("Error fetching cart:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to fetch cart items",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

/**
 * POST /api/cart
 * Add medicine to user's cart
 */
router.post("/", authenticate, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const { medicineId, quantity = 1 } = req.body;

    if (!medicineId) {
      return res.status(400).json({
        error: "Bad Request",
        message: "medicineId is required",
      });
    }

    // Check if medicine exists
    const [medicine] = await db
      .select()
      .from(medicines)
      .where(eq(medicines.id, medicineId))
      .limit(1);

    if (!medicine) {
      return res.status(404).json({
        error: "Not Found",
        message: "Medicine not found",
      });
    }

    // Check if already in cart
    const [existing] = await db
      .select()
      .from(userCart)
      .where(
        and(
          eq(userCart.userId, userId),
          eq(userCart.medicineId, medicineId)
        )
      )
      .limit(1);

    if (existing) {
      // Update quantity
      const [updated] = await db
        .update(userCart)
        .set({
          quantity: existing.quantity + quantity,
          updatedAt: new Date(),
        })
        .where(eq(userCart.id, existing.id))
        .returning();

      return res.json({
        success: true,
        message: "Medicine quantity updated in cart",
        item: updated,
      });
    }

    // Add to cart
    const [newItem] = await db
      .insert(userCart)
      .values({
        userId,
        medicineId,
        quantity,
      })
      .returning();

    res.status(201).json({
      success: true,
      message: "Medicine added to cart",
      item: newItem,
    });
  } catch (error: any) {
    console.error("Error adding to cart:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to add medicine to cart",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

/**
 * DELETE /api/cart/:id
 * Remove medicine from user's cart
 */
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const { id } = req.params;

    const [item] = await db
      .select()
      .from(userCart)
      .where(
        and(
          eq(userCart.id, id),
          eq(userCart.userId, userId)
        )
      )
      .limit(1);

    if (!item) {
      return res.status(404).json({
        error: "Not Found",
        message: "Cart item not found",
      });
    }

    await db.delete(userCart).where(eq(userCart.id, id));

    res.json({
      success: true,
      message: "Medicine removed from cart",
    });
  } catch (error: any) {
    console.error("Error removing from cart:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to remove medicine from cart",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

/**
 * GET /api/cart/check/:medicineId
 * Check if medicine is in user's cart
 */
router.get("/check/:medicineId", authenticate, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const { medicineId } = req.params;

    const [item] = await db
      .select()
      .from(userCart)
      .where(
        and(
          eq(userCart.userId, userId),
          eq(userCart.medicineId, medicineId)
        )
      )
      .limit(1);

    res.json({
      success: true,
      inCart: !!item,
      item: item || null,
    });
  } catch (error: any) {
    console.error("Error checking cart:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to check cart",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

export default router;

