import { Request, Response, NextFunction } from "express";
import { verifyToken, extractTokenFromHeader, JWTPayload } from "../utils/jwt.utils.js";

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

/**
 * Middleware to authenticate requests using JWT token
 */
export function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "No authentication token provided",
      });
    }

    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({
      error: "Unauthorized",
      message: error instanceof Error ? error.message : "Invalid token",
    });
  }
}

/**
 * Middleware to check if user has admin role
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Authentication required",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      error: "Forbidden",
      message: "Admin access required",
    });
  }

  next();
}

