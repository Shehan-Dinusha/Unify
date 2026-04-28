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
 * @param {string} path 
 * @returns {string}
 */
export const getImageUrl = (path) => {
  if (!path) return "/placeholder-post.jpg";
  if (path.startsWith("http")) return path;
  
  const baseURL = import.meta.env.VITE_API_URL?.replace("/api/v1", "") || "http://localhost:5000";
  return `${baseURL}${path.startsWith("/") ? "" : "/"}${path}`;
};
