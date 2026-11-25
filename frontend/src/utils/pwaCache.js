/**
 * Deletes runtime caches that may hold user-specific data (e.g. S3 media from
 * chats or orders, and the legacy "api-cache" from older service workers).
 *
 * The Workbox precache (app shell) and the Google Fonts cache are kept, so the
 * app still loads instantly for the next user.
 */
const KEEP_PREFIXES = ["workbox-precache", "google-fonts"];

export const clearPrivateCaches = async () => {
  if (typeof window === "undefined" || !("caches" in window)) return;
  try {
    const names = await caches.keys();
    await Promise.all(
      names
        .filter((name) => !KEEP_PREFIXES.some((prefix) => name.startsWith(prefix)))
        .map((name) => caches.delete(name)),
    );
  } catch {
    // Cache Storage unavailable (private mode, etc.) — nothing to clear.
  }
};
