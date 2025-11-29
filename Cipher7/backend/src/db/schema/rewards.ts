/**
 * Rewards Schema
 * Stores user badges, rewards, and contribution tracking
 */

import { pgTable, uuid, varchar, timestamp, integer, jsonb, boolean } from "drizzle-orm/pg-core";
import { users } from "./users.js";

/**
 * User badges and achievements
 */
export const userBadges = pgTable("user_badges", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  badgeType: varchar("badge_type", { length: 100 }).notNull(), // verified_contributor, early_adopter, community_hero, etc.
  badgeName: varchar("badge_name", { length: 255 }).notNull(),
  description: varchar("description", { length: 500 }),
  icon: varchar("icon", { length: 255 }), // Icon name or URL
  earnedAt: timestamp("earned_at").defaultNow().notNull(),
  metadata: jsonb("metadata"), // Additional badge data
});

/**
 * User rewards and points
 */
export const userRewards = pgTable("user_rewards", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  rewardType: varchar("reward_type", { length: 100 }).notNull(), // points, badge, recognition, etc.
  points: integer("points").default(0).notNull(),
  reason: varchar("reason", { length: 255 }), // Why reward was given
  source: varchar("source", { length: 100 }), // symptom_report, verified_contribution, etc.
  sourceId: uuid("source_id"), // ID of the source (e.g., symptom report ID)
  earnedAt: timestamp("earned_at").defaultNow().notNull(),
  metadata: jsonb("metadata"),
});

/**
 * User contribution stats
 */
export const userContributions = pgTable("user_contributions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  totalReports: integer("total_reports").default(0).notNull(),
  verifiedReports: integer("verified_reports").default(0).notNull(),
  totalPoints: integer("total_points").default(0).notNull(),
  badgesCount: integer("badges_count").default(0).notNull(),
  lastContributionAt: timestamp("last_contribution_at"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Gift card redemptions
 */
export const giftCardRedemptions = pgTable("gift_card_redemptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  giftCardType: varchar("gift_card_type", { length: 50 }).notNull(), // flipkart, amazon
  pointsUsed: integer("points_used").notNull(),
  giftCardCode: varchar("gift_card_code", { length: 255 }), // Generated or provided gift card code
  giftCardValue: integer("gift_card_value").notNull(), // Value in rupees (200)
  status: varchar("status", { length: 20 }).default("pending").notNull(), // pending, processed, delivered, cancelled
  processedAt: timestamp("processed_at"),
  deliveredAt: timestamp("delivered_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  metadata: jsonb("metadata"), // Additional data
});

export type UserBadge = typeof userBadges.$inferSelect;
export type NewUserBadge = typeof userBadges.$inferInsert;
export type UserReward = typeof userRewards.$inferSelect;
export type NewUserReward = typeof userRewards.$inferInsert;
export type UserContribution = typeof userContributions.$inferSelect;
export type NewUserContribution = typeof userContributions.$inferInsert;
export type GiftCardRedemption = typeof giftCardRedemptions.$inferSelect;
export type NewGiftCardRedemption = typeof giftCardRedemptions.$inferInsert;

