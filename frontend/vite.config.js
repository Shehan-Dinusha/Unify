import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import { VitePWA } from "vite-plugin-pwa";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // "prompt": show an "Update available" toast instead of silently
      // reloading the page (which could discard unsaved form input).
      registerType: "prompt",
      // The plugin injects <link rel="manifest"> — don't add one in index.html.
      manifest: {
        id: "/",
        name: "Unify",
        short_name: "Unify",
        description: "Campus marketplace, lost & found, events, and chat",
        lang: "en",
        theme_color: "#0D1A26",
        background_color: "#0D1A26",
        display: "standalone",
        orientation: "portrait",
        scope: "/",
        start_url: "/",
        categories: ["education", "social", "shopping"],
        icons: [
          {
            src: "/icons/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icons/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icons/maskable-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        shortcuts: [
          { name: "News Feed", url: "/news-feed", icons: [{ src: "/icons/pwa-192x192.png", sizes: "192x192" }] },
          { name: "Marketplace", url: "/marketplace", icons: [{ src: "/icons/pwa-192x192.png", sizes: "192x192" }] },
          { name: "Chat", url: "/messages", icons: [{ src: "/icons/pwa-192x192.png", sizes: "192x192" }] },
          { name: "Lost & Found", url: "/lost-and-found", icons: [{ src: "/icons/pwa-192x192.png", sizes: "192x192" }] },
        ],
      },
      workbox: {
        // Precache only the app shell, UI icons and PWA icons. Photos
        // (jpg/webp) should not be downloaded to every device on install.
        globPatterns: ["**/*.{js,css,html,svg,png,woff2}"],
        navigateFallback: "/index.html",
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          // User-uploaded media on S3 (virtual-hosted + regional URLs).
          // NOTE: authenticated API responses are intentionally NOT cached —
          // they contain private data (chat, wallet, orders) that must not
          // persist on shared devices after logout.
          {
            urlPattern: /^https:\/\/[^/]+\.s3[.-]([a-z0-9-]+\.)?amazonaws\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "s3-images",
              expiration: { maxEntries: 150, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "google-fonts",
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,
    port: 5173,
    watch: {
      usePolling: true,
    },
  },
});
