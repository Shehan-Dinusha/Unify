/**
 * Normalizes phone numbers to standard E.164 format (+94771234567).
 * Handles common Sri Lankan formats with/without country codes and spaces.
 * 
 * Supported inputs:
 * - 0771234567 -> +94771234567
 * - 077 123 4567 -> +94771234567
 * - 94771234567 -> +94771234567
 * - +94771234567 -> +94771234567
 * - 0094771234567 -> +94771234567
 * - 771234567 -> +94771234567
 * 
 * @param {string} phone 
 * @returns {string} Normalized phone number
 */
export const normalizePhone = (phone) => {
  if (!phone || typeof phone !== "string") return phone;

  // Remove spaces, dashes, parentheses
  let cleaned = phone.replace(/[\s\-()]/g, "");

  // Convert 0094 prefix to +94
  if (cleaned.startsWith("0094")) {
    cleaned = "+" + cleaned.substring(2);
  }

  // Convert local 0 prefix (e.g., 0771234567) to +94
  if (cleaned.startsWith("0") && cleaned.length === 10) {
    cleaned = "+94" + cleaned.substring(1);
  }

  // Convert 94 prefix without + (e.g., 94771234567) to +94
  if (cleaned.startsWith("94") && cleaned.length === 11) {
    cleaned = "+" + cleaned;
  }

  // Convert raw 9-digit numbers (e.g., 771234567) to +94
  if (/^\d{9}$/.test(cleaned)) {
    cleaned = "+94" + cleaned;
  }

  return cleaned;
};
