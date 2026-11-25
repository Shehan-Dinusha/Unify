import { lazy } from "react";

const RELOAD_FLAG = "chunk-reload-attempted";

/**
 * React.lazy wrapper that recovers from stale chunk errors.
 *
 * After a deploy, old hashed chunks are removed from the server. A tab that is
 * still running the previous build will fail to import them. In that case we
 * reload the page once to pick up the new build instead of showing an error.
 */
const lazyWithRetry = (importer) =>
  lazy(async () => {
    try {
      const module = await importer();
      try {
        sessionStorage.removeItem(RELOAD_FLAG);
      } catch {
        // sessionStorage unavailable — ignore
      }
      return module;
    } catch (error) {
      let alreadyReloaded = false;
      try {
        alreadyReloaded = sessionStorage.getItem(RELOAD_FLAG) === "1";
        if (!alreadyReloaded) sessionStorage.setItem(RELOAD_FLAG, "1");
      } catch {
        alreadyReloaded = true;
      }

      if (!alreadyReloaded) {
        window.location.reload();
        // Keep Suspense pending while the page reloads.
        return new Promise(() => {});
      }
      throw error;
    }
  });

export default lazyWithRetry;
