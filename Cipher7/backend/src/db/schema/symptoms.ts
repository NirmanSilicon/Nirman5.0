import { pgTable, uuid, varchar, text, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { users } from "./users.js";

/**
 * Available symptoms that can be selected when reporting
 * Managed by admins
 */
export const symptoms = pgTable("symptoms", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  category: varchar("category", { length: 100 }), // Respiratory, Digestive, Neurological, etc.
  description: text("description"),
  isActive: boolean("is_active").default(true).notNull(),
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Symptom reports submitted by citizens
 */
export const symptomReports = pgTable("symptom_reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  email: varchar("email", { length: 255 }).notNull(), // For anonymous reports
  symptoms: jsonb("symptoms").notNull(), // Array of symptom strings
  duration: integer("duration_days").notNull(), // Duration in days (1-30)
  severity: varchar("severity", { length: 20 }).notNull(), // Mild, Moderate, Severe
  location: jsonb("location").notNull(), // { state, district, city, coordinates }
  description: text("description"), // Optional description
  imageUrl: text("image_url"), // Optional image attachment
  isVerified: boolean("is_verified").default(false).notNull(),
  verifiedBy: uuid("verified_by").references(() => users.id), // Admin who verified
  verifiedAt: timestamp("verified_at"),
  status: varchar("status", { length: 20 }).default("pending").notNull(), // pending, verified, rejected
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Symptom = typeof symptoms.$inferSelect;
export type NewSymptom = typeof symptoms.$inferInsert;
export type SymptomReport = typeof symptomReports.$inferSelect;
export type NewSymptomReport = typeof symptomReports.$inferInsert;
