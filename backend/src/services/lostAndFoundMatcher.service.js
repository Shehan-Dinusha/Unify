/**
 * lostAndFoundMatcher.service.js
 *
 * Orchestrates the Lost & Found item-matching pipeline using:
 *   1. TF-IDF cosine similarity on (title + description) text
 *   2. Jaccard-index location similarity on location strings
 *   3. Exponential-decay time relevance based on item dates
 *
 * Composite scoring formula (weights tunable via constants below):
 *
 *   finalScore = TEXT_WEIGHT  × textSimilarity
 *              + LOC_WEIGHT   × locationSimilarity
 *              + TIME_WEIGHT  × timeRelevance
 *
 * After scoring, the top MAX_MATCHES results that exceed MATCH_THRESHOLD
 * receive match notifications to both parties (the new-item author and
 * the existing-item author).
 *
 * Public exports:
 *   findMatches(item)         — pure scoring, returns ranked array (no side effects)
 *   runMatchingEngine(item)   — scoring + notifications (fire-and-forget safe)
 */

import { Op } from "sequelize";
import { LostAndFound } from "../modules/index.js";
import { computeTextSimilarities, tokenize } from "./tfidf.service.js";
import { notifyMatch } from "./notification.service.js";
import logger from "../utils/logger.js";

// ── Tunable Constants ─────────────────────────────────────────────────────────

/** Composite score threshold — items below this are not considered matches */
const MATCH_THRESHOLD = 0.65;

/** Maximum notifications sent per matching run */
const MAX_MATCHES = 3;

/** Scoring weights — must sum to 1.0 */
const TEXT_WEIGHT = 0.70;
const LOC_WEIGHT  = 0.20;
const TIME_WEIGHT = 0.10;

// ── Sub-scorers ───────────────────────────────────────────────────────────────

/**
 * Compute location similarity between two location strings.
 *
 * Strategy:
 *  - Tokenise both strings (reuses the same tokeniser as TF-IDF)
 *  - Compute Jaccard index over the token sets
 *  - Fallback: case-insensitive substring check when one side tokenises to nothing
 *
 * @param {string|null} locA
 * @param {string|null} locB
 * @returns {number} Score in [0, 1]
 */
const computeLocationSimilarity = (locA, locB) => {
  if (!locA || !locB) return 0;

  const tokensA = tokenize(locA);
  const tokensB = tokenize(locB);

  // If tokeniser strips everything (e.g. very short words), fall back to
  // direct string comparison so "Library" still matches "library".
  if (tokensA.length === 0 || tokensB.length === 0) {
    const a = locA.toLowerCase().trim();
    const b = locB.toLowerCase().trim();
    if (a === b) return 1.0;
    if (a.includes(b) || b.includes(a)) return 0.5;
    return 0;
  }

  const setA = new Set(tokensA);
  const setB = new Set(tokensB);
  const intersection = [...setA].filter((t) => setB.has(t)).length;
  const union = new Set([...setA, ...setB]).size;

  return union === 0 ? 0 : intersection / union;
};

/**
 * Compute time-relevance decay score for two item dates.
 *
 * Items that were lost and found close together in time are far more
 * likely to be the same physical item than those weeks apart.
 *
 * @param {string|Date|null} dateA
 * @param {string|Date|null} dateB
 * @returns {number} Score in [0.05, 1.0]
 */
const computeTimeRelevance = (dateA, dateB) => {
  if (!dateA || !dateB) return 0.1; // neutral score when dates are missing

  const msA = new Date(dateA).getTime();
  const msB = new Date(dateB).getTime();

  if (isNaN(msA) || isNaN(msB)) return 0.1;

  const diffDays = Math.abs(msA - msB) / (1000 * 60 * 60 * 24);

  if (diffDays <= 1)  return 1.00;
  if (diffDays <= 3)  return 0.80;
  if (diffDays <= 7)  return 0.60;
  if (diffDays <= 14) return 0.40;
  if (diffDays <= 30) return 0.20;
  return 0.05;
};

// ── Core Matching Logic ───────────────────────────────────────────────────────

/**
 * Find and rank candidate matches for a given Lost & Found item.
 *
 * Pure function — performs DB reads but triggers no notifications.
 * Safe to call from any context (e.g. a GET /matches/:id endpoint).
 *
 * @param {Object} item - Sequelize LostAndFound model instance (or plain object
 *                        with id, userId, type, title, description, location, date)
 * @returns {Promise<Array<{
 *   item: Object,
 *   score: number,
 *   breakdown: { textScore: number, locScore: number, timeScore: number }
 * }>>} Descending-sorted array of matches above MATCH_THRESHOLD
 */
export const findMatches = async (item) => {
  const oppositeType = item.type === "Lost" ? "Found" : "Lost";

  // Fetch all active opposing-type items, excluding the user's own posts
  const candidates = await LostAndFound.findAll({
    where: {
      type: oppositeType,
      status: "Active",
      userId: { [Op.ne]: item.userId },
    },
    attributes: ["id", "userId", "title", "description", "location", "date", "images"],
  });

  if (candidates.length === 0) return [];

  // ── Step 1: TF-IDF text similarity ───────────────────────────────────────
  const textScores = computeTextSimilarities(
    { title: item.title, description: item.description },
    candidates.map((c) => ({
      id: c.id,
      title: c.title,
      description: c.description,
    }))
  );
  const textScoreMap = new Map(textScores.map((s) => [s.id, s.textScore]));

  // ── Step 2: Composite scoring ─────────────────────────────────────────────
  const scored = candidates.map((candidate) => {
    const textScore = textScoreMap.get(candidate.id) || 0;
    const locScore  = computeLocationSimilarity(item.location, candidate.location);
    const timeScore = computeTimeRelevance(item.date, candidate.date);

    const finalScore =
      TEXT_WEIGHT * textScore +
      LOC_WEIGHT  * locScore +
      TIME_WEIGHT * timeScore;

    return {
      item: candidate,
      score: Math.round(finalScore * 1000) / 1000, // 3 d.p.
      breakdown: {
        textScore: Math.round(textScore * 1000) / 1000,
        locScore:  Math.round(locScore  * 1000) / 1000,
        timeScore: Math.round(timeScore * 1000) / 1000,
      },
    };
  });

  // Sort descending; filter below threshold
  return scored
    .filter((s) => s.score >= MATCH_THRESHOLD)
    .sort((a, b) => b.score - a.score);
};

// ── Entry Point (fire-and-forget) ─────────────────────────────────────────────

/**
 * Run the full matching pipeline immediately after a new item is created.
 *
 * Sends match notifications to:
 *  - The author of the NEW item (you just posted; here are potential matches)
 *  - The author of each EXISTING matched item (a new post might be yours)
 *
 * Designed to be awaited without blocking the HTTP response:
 *
 *   createItem.controller.js:
 *     const newItem = await LostAndFound.create({ ... });
 *     sendResponse(res, 201, ...);          // respond immediately
 *     runMatchingEngine(newItem);           // fire-and-forget (no await needed)
 *
 * All errors are caught and logged — this function NEVER propagates exceptions
 * to the caller.
 *
 * @param {Object} newItem - Sequelize LostAndFound instance (just created)
 */
export const runMatchingEngine = async (newItem) => {
  try {
    logger.info(
      `[Matcher] Run started for item #${newItem.id} (${newItem.type}: "${newItem.title}")`
    );

    const matches = await findMatches(newItem);

    if (matches.length === 0) {
      logger.info(`[Matcher] No matches above threshold for item #${newItem.id}`);
      return;
    }

    const topMatches = matches.slice(0, MAX_MATCHES);
    logger.info(
      `[Matcher] ${topMatches.length} match(es) found for item #${newItem.id} ` +
      `(top score: ${topMatches[0].score})`
    );

    // ── Notify both parties for every top match ──────────────────────────────
    await Promise.all(
      topMatches.map(async ({ item: matchedItem, score }) => {
        // Determine which ID is the lost item and which is the found item
        const lostItemId  = newItem.type === "Lost" ? newItem.id : matchedItem.id;
        const foundItemId = newItem.type === "Found" ? newItem.id : matchedItem.id;

        const matchedItemThumbnail =
          Array.isArray(matchedItem.images) && matchedItem.images.length > 0
            ? matchedItem.images[0]
            : null;

        const newItemThumbnail =
          Array.isArray(newItem.images) && newItem.images.length > 0
            ? newItem.images[0]
            : null;

        // Notify the creator of the NEW item about a potential match
        await notifyMatch({
          userId:      newItem.userId,
          matchTitle:  matchedItem.title,
          lostItemId,
          foundItemId,
          score,
          image: matchedItemThumbnail,
        });

        // Notify the owner of the EXISTING matched item about the new post
        await notifyMatch({
          userId:      matchedItem.userId,
          matchTitle:  newItem.title,
          lostItemId,
          foundItemId,
          score,
          image: newItemThumbnail,
        });
      })
    );

    logger.info(`[Matcher] Notifications dispatched for item #${newItem.id}`);
  } catch (err) {
    // Matching errors must NEVER crash or delay the HTTP request lifecycle
    logger.error(`[Matcher] Engine error for item #${newItem.id}: ${err.message}`);
  }
};
