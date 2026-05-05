import { getFileUrl } from "../services/s3.service.js";

/**
 * Resolves standard avatar URLs.
 * If the provided avatar is an S3 key, it retrieves the pre-signed URL.
 * If it's already an HTTP URL, it returns it directly.
 * If null or broken, provides a fallback UI avatar.
 *
 * @param {string} avatarKey - The avatar key from the database.
 * @param {string} userName - The name of the user for fallback generation.
 * @returns {Promise<string>} The resolved absolute URL.
 */
export const resolveAvatarUrl = async (avatarKey, userName = "User") => {
  const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=2666F1&color=fff`;

  if (!avatarKey) return fallback;
  if (avatarKey.startsWith("http")) return avatarKey;

  try {
    // Generate URL valid for 7 days (604800 seconds) to maximize browser caching for avatars
    return await getFileUrl(avatarKey, 604800);
  } catch (error) {
    return fallback;
  }
};
