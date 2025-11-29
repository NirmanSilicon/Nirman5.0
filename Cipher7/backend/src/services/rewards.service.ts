/**
 * Rewards Service
 * Handles badge and reward logic
 */

import { db } from "../db/index.js";
import { userBadges, userRewards, userContributions, giftCardRedemptions } from "../db/schema/rewards.js";
import { symptomReports } from "../db/schema/symptoms.js";
import { eq, and, desc, sql } from "drizzle-orm";
import type { NewUserBadge, NewUserReward, NewUserContribution } from "../db/schema/rewards.js";

/**
 * Award points for a verified symptom report
 * Prevents duplicate awards for the same report
 */
export async function awardPointsForVerifiedReport(userId: string, reportId: string) {
  // Check if points were already awarded for this report
  const existingReward = await db
    .select()
    .from(userRewards)
    .where(
      and(
        eq(userRewards.userId, userId),
        eq(userRewards.source, "symptom_report"),
        eq(userRewards.sourceId, reportId)
      )
    )
    .limit(1);

  if (existingReward.length > 0) {
    console.log(`[Rewards] Points already awarded for report ${reportId} to user ${userId}`);
    return existingReward[0]; // Return existing reward
  }

  // Award 5 points for verified report
  const points = 5;

  console.log(`[Rewards] Awarding ${points} points to user ${userId} for verified report ${reportId}`);

  const [reward] = await db
    .insert(userRewards)
    .values({
      userId,
      rewardType: "points",
      points,
      reason: "Verified symptom report",
      source: "symptom_report",
      sourceId: reportId,
    })
    .returning();

  console.log(`[Rewards] Successfully awarded ${points} points. Reward ID: ${reward.id}`);

  // Update user contributions
  await updateUserContributions(userId);

  // Log updated points
  const [updatedContribution] = await db
    .select()
    .from(userContributions)
    .where(eq(userContributions.userId, userId))
    .limit(1);
  
  console.log(`[Rewards] User ${userId} now has ${updatedContribution?.totalPoints || 0} total points`);

  return reward;
}

/**
 * Award badge to user
 */
export async function awardBadge(
  userId: string,
  badgeType: string,
  badgeName: string,
  description?: string,
  icon?: string
) {
  const [badge] = await db
    .insert(userBadges)
    .values({
      userId,
      badgeType,
      badgeName,
      description,
      icon,
    })
    .returning();

  // Update contributions
  await updateUserContributions(userId);

  return badge;
}

/**
 * Check and award badges based on contribution stats
 */
export async function checkAndAwardBadges(userId: string) {
  const [contribution] = await db
    .select()
    .from(userContributions)
    .where(eq(userContributions.userId, userId))
    .limit(1);

  if (!contribution) return;

  const badgesAwarded = [];

  // First Contribution Badge
  if (contribution.totalReports === 1) {
    const existing = await db
      .select()
      .from(userBadges)
      .where(
        and(
          eq(userBadges.userId, userId),
          eq(userBadges.badgeType, "first_contribution")
        )
      )
      .limit(1);

    if (existing.length === 0) {
      const badge = await awardBadge(
        userId,
        "first_contribution",
        "First Contribution",
        "Submitted your first symptom report",
        "🎯"
      );
      badgesAwarded.push(badge);
    }
  }

  // Verified Contributor Badge (5 verified reports)
  if (contribution.verifiedReports >= 5) {
    const existing = await db
      .select()
      .from(userBadges)
      .where(
        and(
          eq(userBadges.userId, userId),
          eq(userBadges.badgeType, "verified_contributor")
        )
      )
      .limit(1);

    if (existing.length === 0) {
      const badge = await awardBadge(
        userId,
        "verified_contributor",
        "Verified Contributor",
        "5 verified symptom reports",
        "✅"
      );
      badgesAwarded.push(badge);
    }
  }

  // Community Hero Badge (25 verified reports)
  if (contribution.verifiedReports >= 25) {
    const existing = await db
      .select()
      .from(userBadges)
      .where(
        and(
          eq(userBadges.userId, userId),
          eq(userBadges.badgeType, "community_hero")
        )
      )
      .limit(1);

    if (existing.length === 0) {
      const badge = await awardBadge(
        userId,
        "community_hero",
        "Community Hero",
        "25 verified symptom reports",
        "🏆"
      );
      badgesAwarded.push(badge);
    }
  }

  // Early Adopter Badge (first 1000 users)
  // This would need to be checked separately based on user registration date

  return badgesAwarded;
}

/**
 * Update user contribution stats
 */
export async function updateUserContributions(userId: string) {
  // Count reports
  const totalReportsResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(symptomReports)
    .where(eq(symptomReports.userId, userId));
  const totalReports = Number(totalReportsResult[0]?.count || 0);

  // Count verified reports
  const verifiedReportsResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(symptomReports)
    .where(
      and(
        eq(symptomReports.userId, userId),
        eq(symptomReports.isVerified, true)
      )
    );
  const verifiedReports = Number(verifiedReportsResult[0]?.count || 0);

  // Count points (sum all points, including negative ones from redemptions)
  const pointsResult = await db
    .select({ total: sql<number>`coalesce(sum(${userRewards.points}), 0)` })
    .from(userRewards)
    .where(eq(userRewards.userId, userId));

  const totalPoints = Number(pointsResult[0]?.total || 0);
  
  console.log(`[Rewards] Updated contributions for user ${userId}: ${totalPoints} points, ${verifiedReports} verified reports`);

  // Count badges
  const badgesResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(userBadges)
    .where(eq(userBadges.userId, userId));
  const badgesCount = Number(badgesResult[0]?.count || 0);

  // Update or create contribution record
  const [existing] = await db
    .select()
    .from(userContributions)
    .where(eq(userContributions.userId, userId))
    .limit(1);

  if (existing) {
    await db
      .update(userContributions)
      .set({
        totalReports,
        verifiedReports,
        totalPoints,
        badgesCount,
        updatedAt: new Date(),
      })
      .where(eq(userContributions.userId, userId));
  } else {
    await db.insert(userContributions).values({
      userId,
      totalReports,
      verifiedReports,
      totalPoints,
      badgesCount,
    });
  }
}

/**
 * Get user rewards and badges
 * Always recalculates contributions to ensure data is fresh
 */
export async function getUserRewards(userId: string) {
  // Always update contributions to ensure fresh data
  await updateUserContributions(userId);
  
  const [contribution] = await db
    .select()
    .from(userContributions)
    .where(eq(userContributions.userId, userId))
    .limit(1);

  // If no contribution record exists, create one
  if (!contribution) {
    await updateUserContributions(userId);
    const [newContribution] = await db
      .select()
      .from(userContributions)
      .where(eq(userContributions.userId, userId))
      .limit(1);
    
    const badges = await db
      .select()
      .from(userBadges)
      .where(eq(userBadges.userId, userId))
      .orderBy(desc(userBadges.earnedAt));

    const rewards = await db
      .select()
      .from(userRewards)
      .where(eq(userRewards.userId, userId))
      .orderBy(desc(userRewards.earnedAt))
      .limit(20);

    return {
      contribution: newContribution || null,
      badges,
      recentRewards: rewards,
    };
  }

  const badges = await db
    .select()
    .from(userBadges)
    .where(eq(userBadges.userId, userId))
    .orderBy(desc(userBadges.earnedAt));

  const rewards = await db
    .select()
    .from(userRewards)
    .where(eq(userRewards.userId, userId))
    .orderBy(desc(userRewards.earnedAt))
    .limit(20);

  console.log(`[Rewards] getUserRewards for user ${userId}: ${contribution.totalPoints} points, ${contribution.verifiedReports} verified reports`);

  return {
    contribution: contribution || null,
    badges,
    recentRewards: rewards,
  };
}

/**
 * Redeem points for gift card
 */
export async function redeemGiftCard(userId: string, giftCardType: "flipkart" | "amazon") {
  const POINTS_REQUIRED = 200;
  const GIFT_CARD_VALUE = 200; // Rs. 200

  // Get user's current points
  const [contribution] = await db
    .select()
    .from(userContributions)
    .where(eq(userContributions.userId, userId))
    .limit(1);

  if (!contribution || contribution.totalPoints < POINTS_REQUIRED) {
    throw new Error(`Insufficient points. You need ${POINTS_REQUIRED} points to redeem a gift card. Current points: ${contribution?.totalPoints || 0}`);
  }

  // Deduct points by creating a negative reward entry
  await db.insert(userRewards).values({
    userId,
    rewardType: "points",
    points: -POINTS_REQUIRED,
    reason: `Redeemed for ${giftCardType} gift card (Rs. ${GIFT_CARD_VALUE})`,
    source: "gift_card_redemption",
  });

  // Generate gift card code (in production, this would be from a gift card service)
  const giftCardCode = `${giftCardType.toUpperCase()}-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

  // Create redemption record
  const [redemption] = await db
    .insert(giftCardRedemptions)
    .values({
      userId,
      giftCardType,
      pointsUsed: POINTS_REQUIRED,
      giftCardCode,
      giftCardValue: GIFT_CARD_VALUE,
      status: "pending", // Will be processed by admin
    })
    .returning();

  // Update user contributions
  await updateUserContributions(userId);

  return redemption;
}

