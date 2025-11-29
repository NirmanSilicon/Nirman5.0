/**
 * Encryption Middleware
 * Automatically encrypts/decrypts sensitive data fields
 */

import { Request, Response, NextFunction } from "express";
import { encrypt, decrypt } from "../utils/encryption.utils.js";

/**
 * Fields that should be encrypted (PII - Personally Identifiable Information)
 */
const ENCRYPTED_FIELDS = {
  user: ["email", "phone", "name"],
  symptomReport: ["email", "description"],
  // Add more as needed
};

/**
 * Middleware to encrypt sensitive data before database operations
 * Use this middleware on routes that handle PII
 */
export function encryptSensitiveData(fields: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.body && typeof req.body === "object") {
        for (const field of fields) {
          if (req.body[field] && typeof req.body[field] === "string") {
            req.body[field] = encrypt(req.body[field]);
          }
        }
      }
      next();
    } catch (error) {
      console.error("Encryption middleware error:", error);
      res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to encrypt sensitive data",
      });
    }
  };
}

/**
 * Middleware to decrypt sensitive data after database operations
 */
export function decryptSensitiveData(fields: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (res.locals.data && typeof res.locals.data === "object") {
        for (const field of fields) {
          if (res.locals.data[field] && typeof res.locals.data[field] === "string") {
            try {
              res.locals.data[field] = decrypt(res.locals.data[field]);
            } catch (error) {
              // If decryption fails, data might not be encrypted (backward compatibility)
              console.warn(`Failed to decrypt field ${field}, assuming unencrypted`);
            }
          }
        }
      }
      next();
    } catch (error) {
      console.error("Decryption middleware error:", error);
      next(error);
    }
  };
}

/**
 * Helper function to encrypt user email
 */
export function encryptEmail(email: string): string {
  try {
    return encrypt(email);
  } catch (error) {
    console.error("Failed to encrypt email:", error);
    throw error;
  }
}

/**
 * Helper function to decrypt user email
 */
export function decryptEmail(encryptedEmail: string): string {
  try {
    return decrypt(encryptedEmail);
  } catch (error) {
    console.error("Failed to decrypt email:", error);
    throw error;
  }
}

