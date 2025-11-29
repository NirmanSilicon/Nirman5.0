import { pgTable, uuid, varchar, text, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { diseases } from "./diseases.js";

/**
 * Disease prevention measures and guidelines
 * Links diseases to prevention strategies, recommendations, and best practices
 */
export const diseasePrevention = pgTable("disease_prevention", {
  id: uuid("id").primaryKey().defaultRandom(),
  diseaseId: uuid("disease_id").references(() => diseases.id).notNull(),
  diseaseName: varchar("disease_name", { length: 255 }).notNull(), // Denormalized for easier queries
  state: varchar("state", { length: 100 }), // Optional: state-specific prevention
  district: varchar("district", { length: 100 }), // Optional: district-specific prevention
  title: varchar("title", { length: 255 }).notNull(), // Short title for the prevention measure
  description: text("description"), // Detailed description
  measures: jsonb("measures").notNull(), // Array of prevention measures/guidelines
  category: varchar("category", { length: 100 }), // e.g., "Hygiene", "Vaccination", "Environmental", "Lifestyle"
  priority: varchar("priority", { length: 20 }).default("medium"), // low, medium, high
  source: varchar("source", { length: 100 }), // WHO, ICMR, MoHFW, etc.
  sourceUrl: text("source_url"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type DiseasePrevention = typeof diseasePrevention.$inferSelect;
export type NewDiseasePrevention = typeof diseasePrevention.$inferInsert;

