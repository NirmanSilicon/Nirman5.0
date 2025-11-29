/**
 * User Cart Schema
 * Stores user's saved medicines for later viewing
 */

import { pgTable, uuid, varchar, timestamp, integer } from "drizzle-orm/pg-core";
import { users } from "./users.js";
import { medicines } from "./medicines.js";

/**
 * User's saved medicines cart
 */
export const userCart = pgTable("user_cart", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  medicineId: uuid("medicine_id").references(() => medicines.id).notNull(),
  quantity: integer("quantity").default(1).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type UserCart = typeof userCart.$inferSelect;
export type NewUserCart = typeof userCart.$inferInsert;

