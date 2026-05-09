import { getFileUrl } from "../../services/s3.service.js";

/**
 * Resolve an avatar S3 key to a presigned URL.
 * Returns null if no avatar, returns as-is if already a URL.
 */
export const resolveAvatar = async (avatar) => {
  if (!avatar) return null;
  if (avatar.startsWith("http")) return avatar;
  try {
    return await getFileUrl(avatar);
  } catch {
    return null;
  }
};
