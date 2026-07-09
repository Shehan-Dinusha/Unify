import { getFileUrl, deleteFile } from "../services/s3.service.js";
import logger from "./logger.js";

/**
 * Resolves verification document URLs from S3.
 *
 * @param {string} key - The S3 key from the database.
 * @returns {Promise<string>} The resolved pre-signed URL.
 */
export const resolveVerificationUrl = async (key) => {
  if (!key) return null;

  // If it's already a full HTTP URL, return it
  if (key.startsWith("http")) return key;

  try {
    // Generate pre-signed URL valid for 1 hour
    return await getFileUrl(key, 3600);
  } catch (error) {
    logger.error(`Error resolving verification URL for key: ${key}`, error);
    return null;
  }
};

/**
 * Deletes a verification document from S3.
 *
 * @param {string} key - The S3 key.
 */
export const deleteVerificationFile = async (key) => {
  if (!key) return;

  try {
    // Assume all keys are now S3 keys
    await deleteFile(key);
  } catch (error) {
    logger.error(`Error deleting verification file: ${key}`, error);
  }
};
