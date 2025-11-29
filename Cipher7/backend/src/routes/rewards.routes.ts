/**
 * Rewards Routes
 * Handles user rewards, badges, and contributions
 */

import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { getUserRewards, redeemGiftCard } from "../services/rewards.service.js";
import { db } from "../db/index.js";
import { userContributions, giftCardRedemptions } from "../db/schema/rewards.js";
import { users } from "../db/schema/users.js";
import { eq, desc, sql, and } from "drizzle-orm";

const router = express.Router();

/**
 * GET /api/rewards/me
 * Get current user's rewards, badges, and contributions
 */
router.get("/me", authenticate, async (req, res) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "User not authenticated",
      });
    }

    try {
      const rewards = await getUserRewards(userId);

      res.json({
        success: true,
        ...rewards,
      });
    } catch (dbError: any) {
      // If tables don't exist, return empty structure
      if (dbError.message?.includes("does not exist") || dbError.message?.includes("relation")) {
        console.log("[Rewards] Rewards tables don't exist yet, returning empty structure");
        res.json({
          success: true,
          contribution: {
            userId,
            totalReports: 0,
            verifiedReports: 0,
            totalPoints: 0,
            badgesCount: 0,
          },
          badges: [],
          recentRewards: [],
        });
      } else {
        throw dbError;
      }
    }
  } catch (error: any) {
    console.error("Error fetching user rewards:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to fetch rewards",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

/**
 * GET /api/rewards/leaderboard
 * Get top users by points (leaderboard)
 */
router.get("/leaderboard", authenticate, async (req, res) => {
  try {
    const { limit = 50 } = req.query;

    // Check if tables exist
    try {
      const leaderboard = await db
        .select({
          userId: userContributions.userId,
          totalPoints: userContributions.totalPoints,
          verifiedReports: userContributions.verifiedReports,
          totalReports: userContributions.totalReports,
          badgesCount: userContributions.badgesCount,
          name: users.name,
          email: users.email,
        })
        .from(userContributions)
        .innerJoin(users, eq(userContributions.userId, users.id))
        .orderBy(desc(userContributions.totalPoints))
        .limit(Number(limit));

      // Get current user's rank
      const userId = req.user?.userId;
      let userRank = null;
      if (userId) {
        const [userContribution] = await db
          .select()
          .from(userContributions)
          .where(eq(userContributions.userId, userId))
          .limit(1);

        if (userContribution) {
          const rankResult = await db
            .select({
              rank: sql<number>`COUNT(*) + 1`,
            })
            .from(userContributions)
            .where(sql`${userContributions.totalPoints} > ${userContribution.totalPoints}`);

          userRank = {
            rank: Number(rankResult[0]?.rank || 0) + 1,
            totalPoints: userContribution.totalPoints,
            verifiedReports: userContribution.verifiedReports,
          };
        }
      }

      res.json({
        success: true,
        leaderboard: leaderboard.map((item, index) => ({
          rank: index + 1,
          userId: item.userId,
          name: item.name,
          email: item.email,
          totalPoints: item.totalPoints,
          verifiedReports: item.verifiedReports,
          totalReports: item.totalReports,
          badgesCount: item.badgesCount,
        })),
        userRank,
      });
    } catch (tableError: any) {
      // If tables don't exist, return empty leaderboard
      if (tableError.message?.includes("does not exist") || tableError.message?.includes("relation")) {
        console.log("[Rewards] user_contributions table doesn't exist yet, returning empty leaderboard");
        res.json({
          success: true,
          leaderboard: [],
          userRank: null,
        });
      } else {
        throw tableError;
      }
    }
  } catch (error: any) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to fetch leaderboard",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

/**
 * POST /api/rewards/redeem
 * Redeem points for gift card
 */
router.post("/redeem", authenticate, async (req, res) => {
  try {
    const { giftCardType } = req.body; // "flipkart" or "amazon"
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "User not authenticated",
      });
    }

    if (!giftCardType || !["flipkart", "amazon"].includes(giftCardType)) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Invalid gift card type. Must be 'flipkart' or 'amazon'",
      });
    }

    const redemption = await redeemGiftCard(userId, giftCardType);

    res.json({
      success: true,
      message: "Gift card redemption request submitted successfully",
      redemption: {
        id: redemption.id,
        giftCardType: redemption.giftCardType,
        pointsUsed: redemption.pointsUsed,
        giftCardValue: redemption.giftCardValue,
        status: redemption.status,
      },
    });
  } catch (error: any) {
    console.error("Error redeeming gift card:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: error.message || "Failed to redeem gift card",
      details: error.message,
    });
  }
});

/**
 * GET /api/rewards/redemptions
 * Get user's gift card redemption history
 */
router.get("/redemptions", authenticate, async (req, res) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "User not authenticated",
      });
    }

    // Check if table exists, if not return empty array
    try {
      const redemptions = await db
        .select()
        .from(giftCardRedemptions)
        .where(eq(giftCardRedemptions.userId, userId))
        .orderBy(desc(giftCardRedemptions.createdAt));

      res.json({
        success: true,
        redemptions,
      });
    } catch (tableError: any) {
      // If table doesn't exist, return empty array
      if (tableError.message?.includes("does not exist") || tableError.message?.includes("relation")) {
        console.log("[Rewards] gift_card_redemptions table doesn't exist yet, returning empty array");
        res.json({
          success: true,
          redemptions: [],
        });
      } else {
        throw tableError;
      }
    }
  } catch (error: any) {
    console.error("Error fetching redemptions:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to fetch redemptions",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

export default router;

