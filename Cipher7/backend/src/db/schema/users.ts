import { pgTable, uuid, varchar, timestamp, boolean, text, decimal } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  role: varchar("role", { length: 50 }).default("user").notNull(), // user, admin
  isVerified: boolean("is_verified").default(false).notNull(),
  emailNotificationsEnabled: boolean("email_notifications_enabled").default(true).notNull(),
  // Location fields
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  address: text("address"),
  state: varchar("state", { length: 100 }),
  district: varchar("district", { length: 100 }),
  city: varchar("city", { length: 100 }),
  pincode: varchar("pincode", { length: 10 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

