import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const ALGORITHM = "aes-256-cbc";
// Must be 32 bytes (256 bits)
const ENCRYPTION_KEY = process.env.CHAT_ENCRYPTION_KEY; 

// Helper to get a valid 32-byte key or null if not configured properly
const getKey = () => {
  if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 64) {
    // Expecting a 64-character hex string representing 32 bytes
    return null;
  }
  return Buffer.from(ENCRYPTION_KEY, "hex");
};

/**
 * Encrypts a plain text string.
 * Format: iv:encryptedData
 * @param {string} text - The plain text to encrypt.
 * @returns {string|null} - The encrypted string, or null if input is null. Returns plain text if encryption fails (e.g. key missing).
 */
export const encryptText = (text) => {
  if (!text) return text;
  
  const key = getKey();
  if (!key) {
    // If no key is set or invalid, return plain text (fallback)
    console.warn("WARNING: CHAT_ENCRYPTION_KEY is missing or invalid. Storing as plain text.");
    return text;
  }

  try {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    
    return `${iv.toString("hex")}:${encrypted}`;
  } catch (error) {
    console.error("Encryption error:", error);
    return text; // Fallback to plain text on error
  }
};

/**
 * Decrypts an encrypted string.
 * @param {string} text - The encrypted string in format iv:encryptedData
 * @returns {string|null} - The decrypted plain text.
 */
export const decryptText = (text) => {
  if (!text) return text;

  // Check if it matches the expected format (iv:encryptedData)
  // IV is 16 bytes (32 hex characters)
  const parts = text.split(":");
  if (parts.length !== 2 || parts[0].length !== 32) {
    // Not encrypted or format mismatch, return as plain text (supports existing messages)
    return text;
  }

  const key = getKey();
  if (!key) {
    // Can't decrypt without a key. Return as is, or maybe placeholder?
    // Returning as is will just show the encrypted string to the user.
    return text;
  }

  try {
    const iv = Buffer.from(parts[0], "hex");
    const encryptedText = parts[1];
    
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");
    
    return decrypted;
  } catch (error) {
    // Decryption failed (e.g. wrong key, bad data).
    // Return the original so we don't crash, though it might be gibberish.
    console.error("Decryption error:", error);
    return text;
  }
};
