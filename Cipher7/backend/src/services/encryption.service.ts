/**
 * Encryption Service
 * High-level service for encrypting/decrypting sensitive data
 * DPDP Act 2023 Compliance
 */

import { encrypt, decrypt, encryptObject, decryptObject } from "../utils/encryption.utils.js";

/**
 * Encrypt user PII (Personally Identifiable Information)
 */
export interface UserPII {
  email?: string;
  phone?: string;
  name?: string;
}

export function encryptUserPII(pii: UserPII): UserPII {
  const encrypted: UserPII = {};
  
  if (pii.email) encrypted.email = encrypt(pii.email);
  if (pii.phone) encrypted.phone = encrypt(pii.phone);
  if (pii.name) encrypted.name = encrypt(pii.name);
  
  return encrypted;
}

export function decryptUserPII(encryptedPII: UserPII): UserPII {
  const decrypted: UserPII = {};
  
  if (encryptedPII.email) {
    try {
      decrypted.email = decrypt(encryptedPII.email);
    } catch (error) {
      // If decryption fails, might be unencrypted (backward compatibility)
      decrypted.email = encryptedPII.email;
    }
  }
  
  if (encryptedPII.phone) {
    try {
      decrypted.phone = decrypt(encryptedPII.phone);
    } catch (error) {
      decrypted.phone = encryptedPII.phone;
    }
  }
  
  if (encryptedPII.name) {
    try {
      decrypted.name = decrypt(encryptedPII.name);
    } catch (error) {
      decrypted.name = encryptedPII.name;
    }
  }
  
  return decrypted;
}

/**
 * Encrypt symptom report sensitive data
 */
export interface SymptomReportSensitiveData {
  email?: string;
  description?: string;
  location?: {
    coordinates?: {
      latitude?: number;
      longitude?: number;
    };
  };
}

export function encryptSymptomReportData(data: SymptomReportSensitiveData): SymptomReportSensitiveData {
  const encrypted = { ...data };
  
  if (data.email) encrypted.email = encrypt(data.email);
  if (data.description) encrypted.description = encrypt(data.description);
  
  // Encrypt location coordinates if present
  if (data.location?.coordinates) {
    encrypted.location = {
      ...data.location,
      coordinates: data.location.coordinates ? encryptObject(data.location.coordinates) : undefined,
    };
  }
  
  return encrypted;
}

export function decryptSymptomReportData(encryptedData: SymptomReportSensitiveData): SymptomReportSensitiveData {
  const decrypted = { ...encryptedData };
  
  if (encryptedData.email) {
    try {
      decrypted.email = decrypt(encryptedData.email);
    } catch (error) {
      decrypted.email = encryptedData.email;
    }
  }
  
  if (encryptedData.description) {
    try {
      decrypted.description = decrypt(encryptedData.description);
    } catch (error) {
      decrypted.description = encryptedData.description;
    }
  }
  
  if (encryptedData.location?.coordinates) {
    try {
      decrypted.location = {
        ...encryptedData.location,
        coordinates: decryptObject(encryptedData.location.coordinates as any),
      };
    } catch (error) {
      // If decryption fails, might be unencrypted
      decrypted.location = encryptedData.location;
    }
  }
  
  return decrypted;
}

