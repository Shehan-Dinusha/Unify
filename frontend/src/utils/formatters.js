/**
 * Formats a date string into a "time ago" format (e.g., "2h ago", "5d ago")
 * @param {string|Date} date 
 * @returns {string}
 */
export const formatTimeAgo = (date) => {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 60) return "just now";

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) return `${diffInWeeks}w ago`;

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths}mo ago`;

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears}y ago`;
};

/**
 * Returns the full image URL based on whether it's an absolute path or relative to API
 * @param {string|object} path 
 * @returns {string}
 */
export const getImageUrl = (path) => {
  if (!path) return "/placeholder-post.jpg";
  
  // Handle JSON object paths (e.g., from ClubEventPost coverImage)
  if (typeof path === "object") {
    if (path.url) path = path.url;
    else if (path.src) path = path.src;
    else return "/placeholder-post.jpg";
  }

  // Fallback if somehow path is still not a string
  if (typeof path !== "string") return "/placeholder-post.jpg";

  if (path.startsWith("http")) return path;
  
  const baseURL = import.meta.env.VITE_API_URL?.replace("/api/v1", "") || "http://localhost:5000";
  return `${baseURL}${path.startsWith("/") ? "" : "/"}${path}`;
};

/**
 * Resolves avatar URLs for display.
 * Since the backend now uses resolveAvatarUrl to provide signed S3 URLs or ui-avatars.com fallbacks,
 * this function primarily ensures that if a raw path is received, it's correctly prefixed,
 * and provides a final fallback if everything else fails.
 * 
 * @param {string} avatar - The avatar URL or path from the backend.
 * @param {string} name - The user's name for fallback generation.
 * @returns {string} The final displayable URL.
 */
export const getAvatarUrl = (avatar, name = 'User') => {
    // If we have no avatar at all, generate a professional UI-Avatar
    if (!avatar) {
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2666F1&color=fff&bold=true`;
    }

    // If it's already a full URL (signed S3 URL, external URL, or ui-avatar from backend), return it
    if (avatar.startsWith('http')) {
        return avatar;
    }

    // Handle legacy relative paths (though backend should resolve these now)
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    return `${apiUrl}${avatar.startsWith('/') ? '' : '/'}${avatar}`;
};
