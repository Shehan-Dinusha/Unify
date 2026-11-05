/*
* Orchestrates the Lost & Found item-matching pipeline using:
 *   1. TF-IDF cosine similarity on (title + description) text
 *   2. Overlap-coefficient location similarity on location strings
 *   3. Exponential-decay time relevance based on item dates
 *
 * Composite scoring formula (weights tunable via constants below):
 *
 *   finalScore = TEXT_WEIGHT  × textSimilarity
 *              + LOC_WEIGHT   × locationSimilarity
 *              + TIME_WEIGHT  × timeRelevance
 *
 * After scoring, the top MAX_MATCHES results that exceed MATCH_THRESHOLD
 * receive match notifications
 * Public exports:
 *   scoreCandidates(item)     — scores EVERY candidate (unfiltered, for debugging)
 *   findMatches(item)         — pure scoring, returns ranked array (no side effects)
 *   runMatchingEngine(item)   — scoring + notifications (fire-and-forget safe)
 */

import { Op } from "sequelize";
import { LostAndFound } from "../modules/index.js";
import { computeTextSimilarities } from "./tfidf.service.js";
import { notifyMatch } from "./notification.service.js";
import logger from "../utils/logger.js";



const MATCH_THRESHOLD = 0.5;

/** Maximum notifications sent per matching run */
const MAX_MATCHES = 3;

/**
 * Scoring weights — must sum to 1.0
 *
 * TEXT:  0.65 — title + description are the strongest signal
 * LOC:   0.20 — location narrows the search area significantly
 * TIME:  0.15 — recency adds confidence but is less reliable
 */
const TEXT_WEIGHT = 0.65;
const LOC_WEIGHT  = 0.20;
const TIME_WEIGHT = 0.15;

// ── Sub-scorers ───────────────────────────────────────────────────────────────

/**
 * Compute location similarity between two location strings.
 *
 * Strategy:
 *  1. Tokenise both strings using a 2-char minimum (shorter than text so that
 *     common place abbreviations like "B2", "F3" still survive filtering).
 *  2. Compute the overlap coefficient (|A∩B| / min(|A|,|B|)) over the token
 *     sets, so a more specific location still matches a general one.
 *  3. Partial overlap bonus: if any single token from one side appears as a
 *     substring of any token in the other side, award half credit per pair.
 *  4. Fallback: direct substring check when tokenisation yields nothing.
 *
 * @param {string|null} locA
 * @param {string|null} locB
 * @returns {number} Score in [0, 1]
 */
export const computeLocationSimilarity = (locA, locB) => {
  if (!locA || !locB) return 0;

  // Use a lower minimum token length (2) for locations so short labels
  // like "B2" or "Lab" are not discarded by the standard 3-char filter.
  const tokenizeLoc = (str) =>
    str
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((t) => t.length >= 2);

  const tokensA = tokenizeLoc(locA);
  const tokensB = tokenizeLoc(locB);

  // Fallback: if tokenisation yields nothing (e.g. single-character input)
  // fall back to direct string comparison.
  if (tokensA.length === 0 || tokensB.length === 0) {
    const a = locA.toLowerCase().trim();
    const b = locB.toLowerCase().trim();
    if (a === b) return 1.0;
    if (a.includes(b) || b.includes(a)) return 0.6;
    return 0;
  }

  const setA = new Set(tokensA);
  const setB = new Set(tokensB);

  // ── Exact overlap score ─────────────────────────────────────────────────
  // Overlap coefficient instead of Jaccard. Different students describe the
  // same place with different detail, e.g.
  //   "Main Library" ↔ "Library 2nd floor" → 0.5  (Jaccard gave 0.25)
  //   "Library"      ↔ "Library, 1st Floor" → 1.0 (Jaccard gave 0.33)
  const intersection = [...setA].filter((t) => setB.has(t)).length;
  const minSize = Math.min(setA.size, setB.size);
  const overlapScore = minSize === 0 ? 0 : intersection / minSize;

  // ── Partial-overlap bonus ───────────────────────────────────────────────
  // Award partial credit when a token from A is a prefix/substring of a
  // token in B (or vice versa). This handles cases like:
  //   "Lib" ↔ "Library" → one token fully contains the other.
  let partialMatches = 0;
  for (const a of setA) {
    for (const b of setB) {
      if (a !== b && (a.includes(b) || b.includes(a))) {
        partialMatches += 1;
        break; // count each token in A at most once
      }
    }
  }
  // Normalise partial bonus against the larger set size so it stays in [0,1]
  const partialBonus = partialMatches / Math.max(setA.size, setB.size);

  // Blend: exact match dominates, partial adds up to 40% of the remainder
  const blended = overlapScore + (1 - overlapScore) * partialBonus * 0.4;

  return Math.min(1, blended);
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
export const computeTimeRelevance = (dateA, dateB) => {
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
 * Score EVERY candidate for a given Lost & Found item (no threshold filter).
 *
 * Useful for debugging: it shows exactly why a candidate did or did not
 * reach MATCH_THRESHOLD.
 *
 * @param {Object} item - Sequelize LostAndFound model instance (or plain object
 *                        with id, userId, type, title, description, location, date)
 * @returns {Promise<Array<{
 *   item: Object,
 *   score: number,
 *   breakdown: { textScore: number, locScore: number, timeScore: number }
 * }>>} Descending-sorted array of ALL candidates
 */
export const scoreCandidates = async (item) => {
  const oppositeType = item.type === "Lost" ? "Found" : "Lost";

  // Fetch every active post once. The opposing-type posts from other users
  // are the candidates; everything else is used only as background corpus
  // for IDF so the TF-IDF weights don't collapse when there is only one
  // candidate (in a 2-document corpus every shared word gets the LOWEST IDF).
  const activeItems = await LostAndFound.findAll({
    where: {
      status: "Active",
      ...(item.id ? { id: { [Op.ne]: item.id } } : {}),
    },
    attributes: ["id", "userId", "type", "title", "description", "location", "date", "images"],
  });

  const candidates = activeItems.filter(
    (c) => c.type === oppositeType && c.userId !== item.userId
  );
  const backgroundDocs = activeItems
    .filter((c) => !candidates.includes(c))
    .map((c) => ({ title: c.title, description: c.description }));

  if (candidates.length === 0) return [];

  // ── Step 1: TF-IDF text similarity ───────────────────────────────────────
  const textScores = computeTextSimilarities(
    { title: item.title, description: item.description },
    candidates.map((c) => ({
      id: c.id,
      title: c.title,
      description: c.description,
    })),
    backgroundDocs
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

  return scored.sort((a, b) => b.score - a.score);
};

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
  const scored = await scoreCandidates(item);
  return scored.filter((s) => s.score >= MATCH_THRESHOLD);
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
    // ── Step 1: Log what item just triggered the engine ───────────────────────
    logger.info(`[Matcher] ========== START ==========`);
    logger.info(`[Matcher] Item #${newItem.id} | Type: ${newItem.type} | Title: "${newItem.title}" | UserId: ${newItem.userId}`);
    logger.info(`[Matcher] Location: "${newItem.location}" | Date: ${newItem.date} | THRESHOLD: ${MATCH_THRESHOLD}`);

    // ── Step 2: Score every candidate (single DB query) ──────────────────────
    const scored = await scoreCandidates(newItem);

    if (scored.length === 0) {
      logger.info(`[Matcher] No candidates found - skipping scoring. Done.`);
      return;
    }

    // Log the REAL per-candidate breakdown (text + location + time), so it is
    // obvious why a candidate did or did not pass the threshold.
    logger.info(`[Matcher] Per-candidate scores (threshold=${MATCH_THRESHOLD}):`);
    scored.forEach((s) => {
      const mark = s.score >= MATCH_THRESHOLD ? "ABOVE" : "below";
      logger.info(
        `[Matcher]   #${s.item.id} "${s.item.title}" (userId=${s.item.userId}): ` +
        `score=${s.score} [${mark}] | text=${s.breakdown.textScore} | ` +
        `loc=${s.breakdown.locScore} | time=${s.breakdown.timeScore}`
      );
    });

    const matches = scored.filter((s) => s.score >= MATCH_THRESHOLD);
    logger.info(`[Matcher] Matches above threshold: ${matches.length}`);

    if (matches.length === 0) {
      logger.info(`[Matcher] No matches above threshold (${MATCH_THRESHOLD}). Done.`);
      return;
    }

    // ── Step 3: Notify both parties, each in its own try-catch ───────────────
    const topMatches = matches.slice(0, MAX_MATCHES);

    for (const { item: matchedItem, score } of topMatches) {
      const lostItemId  = newItem.type === "Lost"  ? newItem.id : matchedItem.id;
      const foundItemId = newItem.type === "Found" ? newItem.id : matchedItem.id;

      const matchedItemThumbnail =
        Array.isArray(matchedItem.images) && matchedItem.images.length > 0
          ? matchedItem.images[0] : null;
      const newItemThumbnail =
        Array.isArray(newItem.images) && newItem.images.length > 0
          ? newItem.images[0] : null;

      // Notify the creator of the NEW item
      logger.info(`[Matcher] Notifying userId=${newItem.userId} | pair lost=${lostItemId} found=${foundItemId}`);
      try {
        const n1 = await notifyMatch({
          userId:     newItem.userId,
          matchTitle: matchedItem.title,
          lostItemId,
          foundItemId,
          score,
          image:      matchedItemThumbnail,
          targetItemId: matchedItem.id, // open the matched post, not their own
        });
        logger.info(`[Matcher]   → userId=${newItem.userId}: ${n1 ? `CREATED (notifId=${n1.id})` : "SKIPPED (duplicate dedupeKey)"}`);
      } catch (e) {
        logger.error(`[Matcher]   → userId=${newItem.userId} FAILED: ${e.message}`);
      }

      // Notify the owner of the EXISTING matched item
      logger.info(`[Matcher] Notifying userId=${matchedItem.userId} | pair lost=${lostItemId} found=${foundItemId}`);
      try {
        const n2 = await notifyMatch({
          userId:     matchedItem.userId,
          matchTitle: newItem.title,
          lostItemId,
          foundItemId,
          score,
          image:      newItemThumbnail,
          targetItemId: newItem.id, // open the new post, not their own
        });
        logger.info(`[Matcher]   → userId=${matchedItem.userId}: ${n2 ? `CREATED (notifId=${n2.id})` : "SKIPPED (duplicate dedupeKey)"}`);
      } catch (e) {
        logger.error(`[Matcher]   → userId=${matchedItem.userId} FAILED: ${e.message}`);
      }
    }

    logger.info(`[Matcher] ========== DONE for item #${newItem.id} ==========`);
    logger.info(`[Matcher] Notifications dispatched for item #${newItem.id}`);
  } catch (err) {
    logger.error(`[Matcher] FATAL ERROR for item #${newItem.id}: ${err.message}`);
    logger.error(err.stack);
  }
};
