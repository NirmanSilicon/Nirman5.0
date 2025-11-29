import { pgTable, uuid, varchar, text, timestamp, integer, decimal, jsonb, boolean } from "drizzle-orm/pg-core";

/**
 * Disease/outbreak data from various sources (ICMR, MoHFW, VRDL)
 */
export const diseases = pgTable("diseases", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  scientificName: varchar("scientific_name", { length: 255 }),
  category: varchar("category", { length: 100 }), // Infectious, Non-infectious, etc.
  description: text("description"),
  symptoms: jsonb("symptoms").notNull(), // Array of common symptoms
  severity: varchar("severity", { length: 20 }), // Low, Medium, High
  source: varchar("source", { length: 100 }), // ICMR, MoHFW, VRDL, User Reports
  sourceUrl: text("source_url"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Regional disease outbreak data
 */
export const diseaseOutbreaks = pgTable("disease_outbreaks", {
  id: uuid("id").primaryKey().defaultRandom(),
  diseaseId: uuid("disease_id").references(() => diseases.id).notNull(),
  state: varchar("state", { length: 100 }).notNull(),
  district: varchar("district", { length: 100 }),
  city: varchar("city", { length: 100 }),
  caseCount: integer("case_count").default(0).notNull(),
  activeCases: integer("active_cases").default(0).notNull(),
  recovered: integer("recovered").default(0),
  deaths: integer("deaths").default(0),
  riskLevel: varchar("risk_level", { length: 20 }).notNull(), // low, medium, high
  trend: varchar("trend", { length: 20 }), // rising, stable, falling
  trendPercentage: decimal("trend_percentage", { precision: 5, scale: 2 }), // +12.5, -5.2, etc.
  reportedDate: timestamp("reported_date").notNull(),
  source: varchar("source", { length: 100 }), // ICMR, MoHFW, VRDL, Aggregated
  metadata: jsonb("metadata"), // Additional data
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Disease = typeof diseases.$inferSelect;
export type NewDisease = typeof diseases.$inferInsert;
export type DiseaseOutbreak = typeof diseaseOutbreaks.$inferSelect;
export type NewDiseaseOutbreak = typeof diseaseOutbreaks.$inferInsert;

