import express from "express";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { users } from "../db/schema/users.js";
import { verifyPassword } from "../utils/password.utils.js";
import { generateToken } from "../utils/jwt.utils.js";

const router = express.Router();

// Admin credentials from environment variables (with defaults)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@pathogen.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@123456";

// Validation schema
const adminLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

/**
 * POST /api/admin/login
 * Admin login with email and password (no OTP)
 * Only allows predefined admin credentials or users with role='admin'
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = adminLoginSchema.parse(req.body);

    // Check if using predefined admin credentials
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Check if admin user exists in database, if not create one
      let [adminUser] = await db.select().from(users).where(eq(users.email, ADMIN_EMAIL)).limit(1);

      if (!adminUser) {
        // Create admin user if doesn't exist
        const { hashPassword } = await import("../utils/password.utils.js");
        const passwordHash = await hashPassword(ADMIN_PASSWORD);
        
        [adminUser] = await db
          .insert(users)
          .values({
            email: ADMIN_EMAIL,
            passwordHash,
            name: "Admin",
            role: "admin",
            isVerified: true,
          })
          .returning();
      } else {
        // Update existing user to admin if not already
        if (adminUser.role !== "admin") {
          [adminUser] = await db
            .update(users)
            .set({ role: "admin", isVerified: true })
            .where(eq(users.email, ADMIN_EMAIL))
            .returning();
        }
      }

      // Generate JWT token
      const token = generateToken({
        userId: adminUser.id,
        email: adminUser.email,
        role: adminUser.role,
      });

      return res.json({
        message: "Admin login successful",
        token,
        user: {
          id: adminUser.id,
          email: adminUser.email,
          name: adminUser.name,
          role: adminUser.role,
          isVerified: adminUser.isVerified,
        },
      });
    }

    // For other users, check database
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (!user) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Invalid email or password",
      });
    }

    // Check if user is admin
    if (user.role !== "admin") {
      return res.status(403).json({
        error: "Forbidden",
        message: "Access denied. Admin privileges required.",
      });
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.passwordHash);

    if (!isValidPassword) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Invalid email or password",
      });
    }

    // Update user as verified if not already
    if (!user.isVerified) {
      await db.update(users).set({ isVerified: true }).where(eq(users.id, user.id));
      user.isVerified = true;
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    res.json({
      message: "Admin login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation Error",
        message: error.errors[0].message,
      });
    }

    console.error("Admin login error:", error);

    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to process admin login",
    });
  }
});

export default router;
