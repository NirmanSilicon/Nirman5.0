/**
 * Encryption Utilities
 * AES-256 encryption for sensitive data (DPDP Act 2023 compliance)
 */

import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16; // For GCM, this is 12, but 16 works too
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const KEY_LENGTH = 32; // 256 bits

/**
 * Get encryption key from environment
 */
function getEncryptionKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) {
    throw new Error(
      "ENCRYPTION_KEY is not set in environment variables. Please set it in .env file."
    );
  }

  // Convert hex string to buffer, or use the string directly
  if (key.length === 64) {
    // Assume hex format
    return Buffer.from(key, "hex");
  }

  // Derive a 32-byte key from the string using PBKDF2
  return crypto.pbkdf2Sync(key, "pathogen-salt", 100000, KEY_LENGTH, "sha512");
}

/**
 * Encrypt sensitive data using AES-256-GCM
 * @param text - Plain text to encrypt
 * @returns Encrypted data as base64 string (format: iv:tag:encrypted)
 */
export function encrypt(text: string): string {
  try {
    const key = getEncryptionKey();
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    let encrypted = cipher.update(text, "utf8", "base64");
    encrypted += cipher.final("base64");
    const tag = cipher.getAuthTag();

    // Return format: iv:tag:encrypted (all base64)
    return `${iv.toString("base64")}:${tag.toString("base64")}:${encrypted}`;
  } catch (error) {
    console.error("Encryption error:", error);
    throw new Error("Failed to encrypt data");
  }
}

/**
 * Decrypt sensitive data using AES-256-GCM
 * @param encryptedData - Encrypted data in format: iv:tag:encrypted
 * @returns Decrypted plain text
 */
export function decrypt(encryptedData: string): string {
  try {
    const key = getEncryptionKey();
    const parts = encryptedData.split(":");
    
    if (parts.length !== 3) {
      throw new Error("Invalid encrypted data format");
    }

    const [ivBase64, tagBase64, encrypted] = parts;
    const iv = Buffer.from(ivBase64, "base64");
    const tag = Buffer.from(tagBase64, "base64");

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);

    let decrypted = decipher.update(encrypted, "base64", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    console.error("Decryption error:", error);
    throw new Error("Failed to decrypt data. Data may be corrupted or key is incorrect.");
  }
}

/**
 * Encrypt object (converts to JSON first)
 */
export function encryptObject<T>(obj: T): string {
  return encrypt(JSON.stringify(obj));
}

/**
 * Decrypt and parse object
 */
export function decryptObject<T>(encryptedData: string): T {
  const decrypted = decrypt(encryptedData);
  return JSON.parse(decrypted) as T;
}

/**
 * Hash sensitive data (one-way, for searching/comparison)
 * Uses SHA-256 for consistent hashing
 */
export function hashSensitiveData(data: string): string {
  return crypto.createHash("sha256").update(data).digest("hex");
}

/**
 * Verify if data matches hash
 */
export function verifyHash(data: string, hash: string): boolean {
  const dataHash = hashSensitiveData(data);
  return crypto.timingSafeEqual(Buffer.from(dataHash), Buffer.from(hash));
}

