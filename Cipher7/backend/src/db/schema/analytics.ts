import { pgTable, uuid, varchar, timestamp, integer, decimal, jsonb } from "drizzle-orm/pg-core";
import { users } from "./users.js";
import { diseases } from "./diseases.js";

/**
 * Weekly infection index for tracking overall health trends
 */
export const infectionIndex = pgTable("infection_index", {
  id: uuid("id").primaryKey().defaultRandom(),
  week: varchar("week", { length: 10 }).notNull(), // Format: "2024-W01"
  weekStartDate: timestamp("week_start_date").notNull(),
  weekEndDate: timestamp("week_end_date").notNull(),
  state: varchar("state", { length: 100 }),
  district: varchar("district", { length: 100 }),
  indexValue: decimal("index_value", { precision: 5, scale: 2 }).notNull(), // 0-100
  totalReports: integer("total_reports").default(0).notNull(),
  diseaseCount: integer("disease_count").default(0).notNull(),
  trendData: jsonb("trend_data"), // Historical trend data
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * User health risk scores
 */
export const userRiskScores = pgTable("user_risk_scores", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  score: integer("score").notNull(), // 0-100
  riskLevel: varchar("risk_level", { length: 20 }).notNull(), // low, medium, high
  factors: jsonb("factors").notNull(), // { location, symptoms, regionalData, etc. }
  calculatedAt: timestamp("calculated_at").defaultNow().notNull(),
  week: varchar("week", { length: 10 }), // Week reference
});

/**
 * Aggregated symptom clusters for AI analysis
 */
export const symptomClusters = pgTable("symptom_clusters", {
  id: uuid("id").primaryKey().defaultRandom(),
  clusterName: varchar("cluster_name", { length: 255 }).notNull(),
  symptoms: jsonb("symptoms").notNull(), // Array of grouped symptoms
  frequency: integer("frequency").default(0).notNull(), // How often this cluster appears
  location: jsonb("location"), // { state, district }
  relatedDisease: uuid("related_disease_id").references(() => diseases.id),
  confidence: decimal("confidence", { precision: 5, scale: 2 }), // 0-100
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * District-level disease tracking with symptoms and date aggregation
 * This table aggregates disease data by district, date, and symptoms
 */
export const districtDiseaseTracking = pgTable("district_disease_tracking", {
  id: uuid("id").primaryKey().defaultRandom(),
  state: varchar("state", { length: 100 }).notNull(),
  district: varchar("district", { length: 100 }).notNull(),
  diseaseId: uuid("disease_id").references(() => diseases.id).notNull(),
  date: timestamp("date").notNull(), // Date of the tracking record
  symptomCount: integer("symptom_count").default(0).notNull(), // Number of symptom reports
  symptoms: jsonb("symptoms").notNull(), // Array of symptom names reported
  caseCount: integer("case_count").default(0).notNull(), // Total cases for this disease in district
  activeCases: integer("active_cases").default(0).notNull(),
  infectionIndex: decimal("infection_index", { precision: 5, scale: 2 }).notNull(), // 0-100 infection index score
  riskLevel: varchar("risk_level", { length: 20 }).notNull(), // low, medium, high
  trend: varchar("trend", { length: 20 }), // rising, stable, falling
  metadata: jsonb("metadata"), // Additional tracking data
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type InfectionIndex = typeof infectionIndex.$inferSelect;
export type NewInfectionIndex = typeof infectionIndex.$inferInsert;
export type UserRiskScore = typeof userRiskScores.$inferSelect;
export type NewUserRiskScore = typeof userRiskScores.$inferInsert;
export type SymptomCluster = typeof symptomClusters.$inferSelect;
export type NewSymptomCluster = typeof symptomClusters.$inferInsert;
export type DistrictDiseaseTracking = typeof districtDiseaseTracking.$inferSelect;
export type NewDistrictDiseaseTracking = typeof districtDiseaseTracking.$inferInsert;

