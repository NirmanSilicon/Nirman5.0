/**
 * Medicines Schema
 * Stores medicine information including brand names, generic names,
 * alternatives, and pricing from various sources
 */

import { pgTable, uuid, varchar, text, timestamp, decimal, jsonb, boolean, integer } from "drizzle-orm/pg-core";

/**
 * Medicine catalog - stores generic and brand medicine information
 */
export const medicines = pgTable("medicines", {
  id: uuid("id").primaryKey().defaultRandom(),
  genericName: varchar("generic_name", { length: 255 }).notNull(), // Active ingredient
  brandName: varchar("brand_name", { length: 255 }).notNull(), // Brand name
  manufacturer: varchar("manufacturer", { length: 255 }),
  composition: jsonb("composition").notNull(), // Array of active ingredients with dosages
  form: varchar("form", { length: 50 }), // Tablet, Capsule, Syrup, Injection, etc.
  strength: varchar("strength", { length: 100 }), // e.g., "500mg", "10mg/5ml"
  packaging: varchar("packaging", { length: 100 }), // e.g., "10 Tablets", "60ml Bottle"
  indications: text("indications"), // What it's used for
  category: varchar("category", { length: 100 }), // Antibiotic, Antipyretic, etc.
  schedule: varchar("schedule", { length: 20 }), // H, H1, X, etc. (drug scheduling in India)
  isPrescriptionRequired: boolean("is_prescription_required").default(false).notNull(),
  source: varchar("source", { length: 100 }), // DavaIndia, Janaushadhi, User Submitted
  sourceUrl: text("source_url"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Medicine pricing from different sources
 */
export const medicinePrices = pgTable("medicine_prices", {
  id: uuid("id").primaryKey().defaultRandom(),
  medicineId: uuid("medicine_id").references(() => medicines.id).notNull(),
  source: varchar("source", { length: 100 }).notNull(), // DavaIndia, Janaushadhi, Local Pharmacy
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("INR").notNull(),
  packaging: varchar("packaging", { length: 100 }), // Packaging for this price
  availability: varchar("availability", { length: 50 }).default("available"), // available, out_of_stock, discontinued
  location: jsonb("location"), // { state, city, district } for location-based pricing
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
  sourceUrl: text("source_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * Medicine alternatives/substitutes
 * Links medicines that can be substituted for each other
 */
export const medicineAlternatives = pgTable("medicine_alternatives", {
  id: uuid("id").primaryKey().defaultRandom(),
  medicineId: uuid("medicine_id").references(() => medicines.id).notNull(),
  alternativeId: uuid("alternative_id").references(() => medicines.id).notNull(),
  similarity: decimal("similarity", { precision: 5, scale: 2 }), // 0-100 similarity score
  reason: text("reason"), // Why this is an alternative
  isVerified: boolean("is_verified").default(false).notNull(), // Verified by medical professional
  verifiedBy: uuid("verified_by"), // User ID of verifier
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * Janaushadhi (PMBJP) store information
 */
export const janaushadhiStores = pgTable("janaushadhi_stores", {
  id: uuid("id").primaryKey().defaultRandom(),
  storeName: varchar("store_name", { length: 255 }).notNull(),
  storeCode: varchar("store_code", { length: 50 }), // PMBJP store code
  address: text("address").notNull(),
  state: varchar("state", { length: 100 }).notNull(),
  district: varchar("district", { length: 100 }),
  city: varchar("city", { length: 100 }),
  pincode: varchar("pincode", { length: 10 }),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 255 }),
  operatingHours: jsonb("operating_hours"), // { day: hours } format
  isActive: boolean("is_active").default(true).notNull(),
  sourceUrl: text("source_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Medicine = typeof medicines.$inferSelect;
export type NewMedicine = typeof medicines.$inferInsert;
export type MedicinePrice = typeof medicinePrices.$inferSelect;
export type NewMedicinePrice = typeof medicinePrices.$inferInsert;
export type MedicineAlternative = typeof medicineAlternatives.$inferSelect;
export type NewMedicineAlternative = typeof medicineAlternatives.$inferInsert;
export type JanaushadhiStore = typeof janaushadhiStores.$inferSelect;
export type NewJanaushadhiStore = typeof janaushadhiStores.$inferInsert;

