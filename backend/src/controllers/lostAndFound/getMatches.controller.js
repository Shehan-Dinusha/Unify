/**
 * getMatches.controller.js
 *
 * On-demand match retrieval for a specific Lost & Found item.
 *
 * Route:  GET /api/v1/lost-and-found/:id/matches
 *
 * Runs the TF-IDF matching engine against the given item and returns the
 * ranked candidate list — enriched with signed S3 image URLs.
 * This endpoint does NOT trigger notifications; it is a pure read operation
 * so users can manually check matches from the item detail view.
 *
 * Access control: Only the item owner can request matches for their item.
 */

import { LostAndFound } from "../../modules/index.js";
import { sendResponse, catchAsync } from "../../utils/response.js";
import { findMatches } from "../../services/lostAndFoundMatcher.service.js";
import { resolveAssetUrl } from "../../utils/assetUrl.util.js";

export const getMatches = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  // ── Fetch the requested item ──────────────────────────────────────────────
  const item = await LostAndFound.findByPk(id);

  if (!item) {
    return sendResponse(res, 404, false, "Item not found.");
  }

  // Only the owner can query matches for their own item
  if (item.userId !== userId) {
    return sendResponse(res, 403, false, "You do not have permission to view matches for this item.");
  }

  // ── Run scoring (no side effects) ─────────────────────────────────────────
  const matches = await findMatches(item);

  // ── Enrich with signed S3 image URLs ─────────────────────────────────────
  const enriched = await Promise.all(
    matches.map(async ({ item: matchedItem, score, breakdown }) => {
      let signedImageUrls = [];

      if (Array.isArray(matchedItem.images) && matchedItem.images.length > 0) {
        signedImageUrls = await Promise.all(
          matchedItem.images.map((key) => resolveAssetUrl(key))
        );
      }

      return {
        id:          matchedItem.id,
        type:        matchedItem.type,
        title:       matchedItem.title,
        description: matchedItem.description,
        location:    matchedItem.location,
        date:        matchedItem.date,
        images:      signedImageUrls,
        // Composite match score (higher = stronger match)
        score,
        // Per-dimension breakdown for transparency / debugging
        breakdown: {
          text:     breakdown.textScore,
          location: breakdown.locScore,
          time:     breakdown.timeScore,
        },
      };
    })
  );

  return sendResponse(res, 200, true, "Matches fetched successfully.", {
    itemId:      item.id,
    itemType:    item.type,
    totalMatches: enriched.length,
    matches:     enriched,
  });
});
