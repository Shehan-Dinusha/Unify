import { getFileUrl, getPublicUrl } from "../services/s3.service.js";

const PUBLIC_PREFIXES = ["posts", "lost-and-found"];

const s3UrlPattern = /https?:\/\/[^/]+\.amazonaws\.com\/(.+)/;

export const resolveAssetUrl = async (value) => {
  if (!value) return value;

  let path = value;
  if (typeof value === "object" && value !== null) {
    if (value.url) path = value.url;
    else return path;
  }

  if (typeof path !== "string") return path;

  if (path.includes("X-Amz-Signature")) return path;

  const s3Match = path.match(s3UrlPattern);
  if (s3Match) {
    path = s3Match[1];
  }

  if (!path.startsWith("http") && !path.startsWith("/")) {
    const folder = path.split("/")[0];
    if (PUBLIC_PREFIXES.includes(folder)) {
      return getPublicUrl(path);
    }
    try {
      return await getFileUrl(path);
    } catch {
      return path;
    }
  }

  return path;
};
