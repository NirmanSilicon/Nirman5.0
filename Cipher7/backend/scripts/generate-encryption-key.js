/**
 * Generate a secure encryption key for AES-256
 * Run with: node scripts/generate-encryption-key.js
 */

import crypto from "crypto";

// Generate a 32-byte (256-bit) random key
const encryptionKey = crypto.randomBytes(32).toString("base64");

console.log("\n✅ Generated Encryption Key:");
console.log("=".repeat(50));
console.log(encryptionKey);
console.log("=".repeat(50));
console.log("\n📝 Add this to your .env file:");
console.log(`ENCRYPTION_KEY=${encryptionKey}\n`);

