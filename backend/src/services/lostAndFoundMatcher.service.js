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
 *  2. Compute Jaccard index over the token sets for an exact-overlap score.
 *  3. Partial overlap bonus: if any single token from one side appears as a
 *     substring of any token in the other side, award half credit per pair.
 *  4. Fallback: direct substring check when tokenisation yields nothing.
 *
 * @param {string|null} locA
 * @param {string|null} locB
 * @returns {number} Score in [0, 1]
 */
const computeLocationSimilarity = (locA, locB) => {
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

  // ── Exact Jaccard score ─────────────────────────────────────────────────
  const intersection = [...setA].filter((t) => setB.has(t)).length;
  const union = new Set([...setA, ...setB]).size;
  const jaccardScore = union === 0 ? 0 : intersection / union;

  // ── Partial-overlap bonus ───────────────────────────────────────────────
  // Award partial credit when a token from A is a prefix/substring of a
  // token in B (or vice versa). This handles cases like:
  //   "Library, 1st Floor" ↔ "Library" → one token fully contains the other.
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
  const blended = jaccardScore + (1 - jaccardScore) * partialBonus * 0.4;

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
    // ── Step 1: Log what item just triggered the engine ───────────────────────
    console.log(`\n[Matcher] ========== START ==========`);
    console.log(`[Matcher] Item #${newItem.id} | Type: ${newItem.type} | Title: "${newItem.title}" | UserId: ${newItem.userId}`);
    console.log(`[Matcher] Location: "${newItem.location}" | Date: ${newItem.date} | THRESHOLD: ${MATCH_THRESHOLD}`);

    // ── Step 2: Show all candidates the DB returned ───────────────────────────
    const oppositeType = newItem.type === "Lost" ? "Found" : "Lost";
    const allCandidates = await LostAndFound.findAll({
      where: {
        type: oppositeType,
        status: "Active",
        userId: { [Op.ne]: newItem.userId },
      },
      attributes: ["id", "userId", "title", "location", "date"],
    });
    console.log(`[Matcher] DB candidates (type=${oppositeType}, status=Active, different user): ${allCandidates.length}`);
    allCandidates.forEach((c) => {
      console.log(`[Matcher]   Candidate #${c.id}: "${c.title}" | loc="${c.location}" | userId=${c.userId}`);
    });

    if (allCandidates.length === 0) {
      console.log(`[Matcher] No candidates found — skipping scoring. Done.\n`);
      return;
    }

    // ── Step 3: Run full scoring and log each score ───────────────────────────
    const matches = await findMatches(newItem);

    // Also log every candidate's raw scores (not just those above threshold)
    // by computing them directly from the candidates we already fetched
    const { computeTextSimilarities: computeScores, tokenize: tok } = await import("./tfidf.service.js");
    const textScoresRaw = computeScores(
      { title: newItem.title, description: newItem.description },
      allCandidates.map((c) => ({ id: c.id, title: c.title, description: "" }))
    );
    const textMap = new Map(textScoresRaw.map((s) => [s.id, s.textScore]));

    console.log(`[Matcher] Per-candidate scores (threshold=${MATCH_THRESHOLD}):`);
    allCandidates.forEach((c) => {
      const textScore = Math.round((textMap.get(c.id) || 0) * 1000) / 1000;
      const final = Math.round((TEXT_WEIGHT * textScore) * 1000) / 1000;
      const aboveThreshold = final >= MATCH_THRESHOLD ? "✓ ABOVE" : "✗ below";
      console.log(`[Matcher]   #${c.id} "${c.title}": textScore=${textScore} → finalMin=${final} (${aboveThreshold} threshold)`);
    });

    console.log(`[Matcher] Matches above threshold: ${matches.length}`);
    matches.forEach((m) => {
      console.log(`[Matcher]   ✓ Match #${m.item.id} "${m.item.title}": score=${m.score} | text=${m.breakdown.textScore} | loc=${m.breakdown.locScore} | time=${m.breakdown.timeScore}`);
    });

    if (matches.length === 0) {
      console.log(`[Matcher] No matches above threshold (${MATCH_THRESHOLD}). Done.\n`);
      return;
    }

    // ── Step 4: Notify both parties, each in its own try-catch ───────────────
    const topMatches = matches.slice(0, MAX_MATCHES);

    for (const { item: matchedItem, score } of topMatches) {
      const lostItemId  = newItem.type === "Lost"  ? newItem.id : matchedItem.id;
      const foundItemId = newItem.type === "Found" ? newItem.id : matchedItem.id;
      const dedupeKey = `match:${lostItemId}:${foundItemId}`;

      const matchedItemThumbnail =
        Array.isArray(matchedItem.images) && matchedItem.images.length > 0
          ? matchedItem.images[0] : null;
      const newItemThumbnail =
        Array.isArray(newItem.images) && newItem.images.length > 0
          ? newItem.images[0] : null;

      // Notify the creator of the NEW item
      console.log(`[Matcher] Notifying userId=${newItem.userId} | dedupeKey="${dedupeKey}"`);
      try {
        const n1 = await notifyMatch({
          userId:     newItem.userId,
          matchTitle: matchedItem.title,
          lostItemId,
          foundItemId,
          score,
          image:      matchedItemThumbnail,
        });
        console.log(`[Matcher]   → userId=${newItem.userId}: ${n1 ? `CREATED (notifId=${n1.id})` : "SKIPPED (duplicate dedupeKey)"}`);
      } catch (e) {
        console.error(`[Matcher]   → userId=${newItem.userId} FAILED:`, e.message);
      }

      // Notify the owner of the EXISTING matched item
      console.log(`[Matcher] Notifying userId=${matchedItem.userId} | dedupeKey="${dedupeKey}"`);
      try {
        const n2 = await notifyMatch({
          userId:     matchedItem.userId,
          matchTitle: newItem.title,
          lostItemId,
          foundItemId,
          score,
          image:      newItemThumbnail,
        });
        console.log(`[Matcher]   → userId=${matchedItem.userId}: ${n2 ? `CREATED (notifId=${n2.id})` : "SKIPPED (duplicate dedupeKey)"}`);
      } catch (e) {
        console.error(`[Matcher]   → userId=${matchedItem.userId} FAILED:`, e.message);
      }
    }

    console.log(`[Matcher] ========== DONE for item #${newItem.id} ==========\n`);
    logger.info(`[Matcher] Notifications dispatched for item #${newItem.id}`);
  } catch (err) {
    console.error(`[Matcher] FATAL ERROR for item #${newItem.id}:`, err.message);
    console.error(err.stack);
    logger.error(`[Matcher] Engine error for item #${newItem.id}: ${err.message}`);
  }
};
