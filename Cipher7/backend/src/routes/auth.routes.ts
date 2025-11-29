import express from "express";
import { z } from "zod";
import { eq, and, desc } from "drizzle-orm";
import { db } from "../db/index.js";
import { users } from "../db/schema/users.js";
import { otpCodes } from "../db/schema/otp.js";
import { hashPassword, verifyPassword } from "../utils/password.utils.js";
import { generateOTP, getOTPExpiration, isOTPExpired } from "../utils/otp.utils.js";
import { sendOTPEmail } from "../services/email.service.js";
import { generateToken } from "../utils/jwt.utils.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

// Validation schemas
const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const sendOTPSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const verifyOTPSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = registerSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (existingUser.length > 0) {
      return res.status(400).json({
        error: "Bad Request",
        message: "User with this email already exists",
      });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        email,
        passwordHash,
        name: name || null,
        role: "user",
        isVerified: false,
      })
      .returning();

    res.status(201).json({
      message: "User registered successfully. Please verify your email with OTP.",
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation Error",
        message: error.errors[0].message,
      });
    }

    console.error("Registration error:", error);
    
    // Provide more detailed error in development
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const isDevelopment = process.env.NODE_ENV === "development";
    
    res.status(500).json({
      error: "Internal Server Error",
      message: isDevelopment 
        ? `Failed to register user: ${errorMessage}` 
        : "Failed to register user",
      ...(isDevelopment && { details: errorMessage, stack: error instanceof Error ? error.stack : undefined }),
    });
  }
});

/**
 * POST /api/auth/send-otp
 * Send OTP to user's email (for login)
 */
router.post("/send-otp", async (req, res) => {
  try {
    const { email } = sendOTPSchema.parse(req.body);

    // Check if user exists
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (!user) {
      // Don't reveal if user exists or not (security best practice)
      return res.json({
        message: "If the email exists, an OTP has been sent",
      });
    }

    // Verify password if provided (for login flow)
    if (req.body.password) {
      const isValidPassword = await verifyPassword(req.body.password, user.passwordHash);
      if (!isValidPassword) {
        return res.status(401).json({
          error: "Unauthorized",
          message: "Invalid email or password",
        });
      }
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = getOTPExpiration(10); // 10 minutes

    // Invalidate previous OTPs for this email
    await db.update(otpCodes).set({ used: true }).where(eq(otpCodes.email, email));

    // Store new OTP
    await db.insert(otpCodes).values({
      email,
      code: otp,
      expiresAt,
      used: false,
    });

    // Send OTP email
    try {
      await sendOTPEmail(email, otp);
    } catch (emailError) {
      console.error("Failed to send OTP email:", emailError);
      return res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to send OTP email. Please check email configuration.",
      });
    }

    res.json({
      message: "OTP sent to your email",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation Error",
        message: error.errors[0].message,
      });
    }

    console.error("Send OTP error:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to send OTP",
    });
  }
});

/**
 * POST /api/auth/login
 * Login with email and password, then send OTP
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    // Check if user exists
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (!user) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Invalid email or password",
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

    // Generate and send OTP
    const otp = generateOTP();
    const expiresAt = getOTPExpiration(10);

    // Invalidate previous OTPs
    await db.update(otpCodes).set({ used: true }).where(eq(otpCodes.email, email));

    // Store new OTP
    await db.insert(otpCodes).values({
      email,
      code: otp,
      expiresAt,
      used: false,
    });

    // Send OTP email
    try {
      await sendOTPEmail(email, otp);
    } catch (emailError) {
      console.error("Failed to send OTP email:", emailError);
      return res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to send OTP email. Please check email configuration.",
      });
    }

    res.json({
      message: "OTP sent to your email. Please verify to complete login.",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation Error",
        message: error.errors[0].message,
      });
    }

    console.error("Login error:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to process login",
    });
  }
});

/**
 * POST /api/auth/verify-otp
 * Verify OTP and complete login
 */
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = verifyOTPSchema.parse(req.body);

    // Find valid OTP
    const [otpRecord] = await db
      .select()
      .from(otpCodes)
      .where(and(eq(otpCodes.email, email), eq(otpCodes.used, false)))
      .orderBy(desc(otpCodes.createdAt))
      .limit(1);

    if (!otpRecord) {
      return res.status(400).json({
        error: "Invalid OTP",
        message: "No valid OTP found for this email",
      });
    }

    // Check if OTP is expired
    if (isOTPExpired(otpRecord.expiresAt)) {
      await db.update(otpCodes).set({ used: true }).where(eq(otpCodes.id, otpRecord.id));
      return res.status(400).json({
        error: "Expired OTP",
        message: "OTP has expired. Please request a new one.",
      });
    }

    // Verify OTP code
    if (otpRecord.code !== otp) {
      return res.status(400).json({
        error: "Invalid OTP",
        message: "Incorrect OTP code",
      });
    }

    // Mark OTP as used
    await db.update(otpCodes).set({ used: true }).where(eq(otpCodes.id, otpRecord.id));

    // Get user
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (!user) {
      return res.status(404).json({
        error: "Not Found",
        message: "User not found",
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
      message: "OTP verified successfully",
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

    console.error("Verify OTP error:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to verify OTP",
    });
  }
});

/**
 * POST /api/auth/resend-otp
 * Resend OTP to user's email
 */
router.post("/resend-otp", async (req, res) => {
  try {
    const { email } = sendOTPSchema.parse(req.body);

    // Check if user exists
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (!user) {
      return res.json({
        message: "If the email exists, an OTP has been sent",
      });
    }

    // Generate new OTP
    const otp = generateOTP();
    const expiresAt = getOTPExpiration(10);

    // Invalidate previous OTPs
    await db.update(otpCodes).set({ used: true }).where(eq(otpCodes.email, email));

    // Store new OTP
    await db.insert(otpCodes).values({
      email,
      code: otp,
      expiresAt,
      used: false,
    });

    // Send OTP email
    try {
      await sendOTPEmail(email, otp);
    } catch (emailError) {
      console.error("Failed to send OTP email:", emailError);
      return res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to send OTP email. Please check email configuration.",
      });
    }

    res.json({
      message: "OTP resent to your email",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation Error",
        message: error.errors[0].message,
      });
    }

    console.error("Resend OTP error:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to resend OTP",
    });
  }
});

const updateProfileSchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  address: z.string().optional(),
  state: z.string().optional(),
  district: z.string().optional(),
  city: z.string().optional(),
  pincode: z.string().optional(),
});

/**
 * PUT /api/auth/email-notifications
 * Update email notification preference (protected)
 */
const updateEmailNotificationSchema = z.object({
  enabled: z.boolean(),
});

router.put("/email-notifications", authenticate, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "User not authenticated",
      });
    }

    const { enabled } = updateEmailNotificationSchema.parse(req.body);

    // Update user's email notification preference
    await db
      .update(users)
      .set({ emailNotificationsEnabled: enabled })
      .where(eq(users.id, req.user.userId));

    res.json({
      message: `Email notifications ${enabled ? "enabled" : "disabled"} successfully`,
      emailNotificationsEnabled: enabled,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation Error",
        message: error.errors[0].message,
      });
    }

    console.error("Update email notification error:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to update email notification preference",
    });
  }
});

/**
 * GET /api/auth/me
 * Get current user information (protected route)
 */
router.get("/me", authenticate, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "User not authenticated",
      });
    }

    const [user] = await db.select().from(users).where(eq(users.id, req.user.userId)).limit(1);

    if (!user) {
      return res.status(404).json({
        error: "Not Found",
        message: "User not found",
      });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
        latitude: user.latitude ? parseFloat(user.latitude) : null,
        longitude: user.longitude ? parseFloat(user.longitude) : null,
        address: user.address,
        state: user.state,
        district: user.district,
        city: user.city,
        pincode: user.pincode,
        emailNotificationsEnabled: user.emailNotificationsEnabled ?? true,
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to get user information",
    });
  }
});

/**
 * PUT /api/auth/profile
 * Update user profile (protected route)
 */
router.put("/profile", authenticate, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "User not authenticated",
      });
    }

    const updateData = updateProfileSchema.parse(req.body);

    // Build update object with only provided fields
    const updateFields: any = {
      updatedAt: new Date(),
    };

    if (updateData.name !== undefined) updateFields.name = updateData.name;
    if (updateData.phone !== undefined) updateFields.phone = updateData.phone;
    if (updateData.latitude !== undefined) updateFields.latitude = updateData.latitude.toString();
    if (updateData.longitude !== undefined) updateFields.longitude = updateData.longitude.toString();
    if (updateData.address !== undefined) updateFields.address = updateData.address;
    if (updateData.state !== undefined) updateFields.state = updateData.state;
    if (updateData.district !== undefined) updateFields.district = updateData.district;
    if (updateData.city !== undefined) updateFields.city = updateData.city;
    if (updateData.pincode !== undefined) updateFields.pincode = updateData.pincode;

    // Update user
    await db
      .update(users)
      .set(updateFields)
      .where(eq(users.id, req.user.userId));

    // Fetch updated user
    const [updatedUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, req.user.userId))
      .limit(1);

    res.json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        phone: updatedUser.phone,
        role: updatedUser.role,
        isVerified: updatedUser.isVerified,
        latitude: updatedUser.latitude ? parseFloat(updatedUser.latitude) : null,
        longitude: updatedUser.longitude ? parseFloat(updatedUser.longitude) : null,
        address: updatedUser.address,
        state: updatedUser.state,
        district: updatedUser.district,
        city: updatedUser.city,
        pincode: updatedUser.pincode,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation Error",
        message: "Invalid profile data",
        details: error.errors,
      });
    }

    console.error("Update profile error:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to update profile",
    });
  }
});

export default router;

