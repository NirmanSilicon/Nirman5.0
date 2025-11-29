import crypto from "crypto";

/**
 * Generate a random 6-digit OTP code
 */
export function generateOTP(): string {
  // Generate a random 6-digit number
  const otp = crypto.randomInt(100000, 999999).toString();
  return otp;
}

/**
 * Calculate OTP expiration time (default: 10 minutes)
 */
export function getOTPExpiration(minutes: number = 10): Date {
  const expiration = new Date();
  expiration.setMinutes(expiration.getMinutes() + minutes);
  return expiration;
}

/**
 * Check if OTP is expired
 */
export function isOTPExpired(expiresAt: Date): boolean {
  return new Date() > expiresAt;
}

