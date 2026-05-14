/**
 * tfidf.service.js
 *
 * Pure TF-IDF computation engine — zero database dependencies.
 * Implements:
 *   - Tokenization with stop-word removal
 *   - Term Frequency (TF) calculation
 *   - Inverse Document Frequency (IDF) calculation  (smoothed log-IDF)
 *   - TF-IDF vector construction
 *   - Cosine similarity between two TF-IDF vectors
 *
 * This module is completely stateless and safe to unit-test in isolation.
 */

// ── Stop-word list ────────────────────────────────────────────────────────────
// University L&F context: includes generic posting language so it doesn't
// inflate similarity between posts that merely share meta-words.
const STOP_WORDS = new Set([
  // articles / prepositions / conjunctions
  "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for",
  "of", "with", "by", "from", "into", "onto", "upon", "about", "above",
  "below", "under", "over", "after", "before", "between", "through",
  // auxiliaries / pronouns
  "is", "was", "are", "were", "be", "been", "being", "have", "has", "had",
  "do", "does", "did", "will", "would", "could", "should", "may", "might",
  "shall", "can", "i", "my", "me", "we", "our", "you", "your", "it", "its",
  "this", "that", "these", "those", "he", "she", "they", "them", "his",
  "her", "their", "what", "which", "who", "when", "where", "how", "if",
  "as", "not", "no", "so", "up", "out", "than", "then", "there", "here",
  "just", "also", "only", "some", "any", "more", "most", "such", "very",
  // common L&F meta-words (high frequency, low information value)
  "item", "found", "lost", "looking", "please", "contact", "help",
  "anyone", "someone", "saw", "see", "know", "think", "believe", "seem",
  "thing", "stuff", "one", "two", "three", "near", "around", "somewhere",
  "yesterday", "today", "ago", "left", "right",
]);

// ── Tokenizer ─────────────────────────────────────────────────────────────────

/**
 * Tokenize a text string into normalised, filtered tokens.
 *
 * Steps:
 *  1. Lowercase
 *  2. Replace non-alphanumeric characters with spaces
 *  3. Split on whitespace
 *  4. Drop tokens shorter than 3 characters
 *  5. Drop stop words
 *
 * @param {string} text
 * @returns {string[]} Filtered token array
 */
export const tokenize = (text) => {
  if (!text || typeof text !== "string") return [];

  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length >= 3 && !STOP_WORDS.has(token));
};

// ── TF ────────────────────────────────────────────────────────────────────────

/**
 * Compute Term Frequency (TF) for a token array.
 *
 * TF(t, d) = count(t in d) / |d|
 *
 * @param {string[]} tokens
 * @returns {Map<string, number>} term → TF score
 */
export const computeTF = (tokens) => {
  const tf = new Map();
  if (tokens.length === 0) return tf;

  for (const token of tokens) {
    tf.set(token, (tf.get(token) || 0) + 1);
  }

  // Normalise by document length
  for (const [term, count] of tf) {
    tf.set(term, count / tokens.length);
  }

  return tf;
};

// ── IDF ───────────────────────────────────────────────────────────────────────

/**
 * Compute smoothed Inverse Document Frequency (IDF) for a corpus.
 *
 * IDF(t) = log((1 + N) / (1 + df(t))) + 1
 *
 * Smoothing ensures terms that appear in every document still contribute
 * (avoids zero IDF), and "+1" outside prevents negative scores for
 * very common terms.
 *
 * @param {string[][]} corpus - Array of token arrays (one per document)
 * @returns {Map<string, number>} term → IDF score
 */
export const computeIDF = (corpus) => {
  const idf = new Map();
  const N = corpus.length;
  if (N === 0) return idf;

  // Count document frequency for each term
  const df = new Map();
  for (const tokens of corpus) {
    const unique = new Set(tokens);
    for (const token of unique) {
      df.set(token, (df.get(token) || 0) + 1);
    }
  }

  // Compute smoothed IDF
  for (const [term, docFreq] of df) {
    idf.set(term, Math.log((1 + N) / (1 + docFreq)) + 1);
  }

  return idf;
};

// ── TF-IDF Vector ─────────────────────────────────────────────────────────────

/**
 * Build a TF-IDF vector for a document given precomputed TF and IDF maps.
 *
 * @param {Map<string, number>} tf  - Term frequency map for the document
 * @param {Map<string, number>} idf - IDF map for the corpus
 * @returns {Map<string, number>} term → TF-IDF weight
 */
export const buildVector = (tf, idf) => {
  const vector = new Map();
  for (const [term, tfScore] of tf) {
    const idfScore = idf.get(term) || 0;
    if (idfScore > 0) {
      vector.set(term, tfScore * idfScore);
    }
  }
  return vector;
};

// ── Cosine Similarity ─────────────────────────────────────────────────────────

/**
 * Compute cosine similarity between two TF-IDF vectors.
 *
 * cosine(A, B) = (A · B) / (|A| × |B|)
 *
 * @param {Map<string, number>} vecA
 * @param {Map<string, number>} vecB
 * @returns {number} Similarity score in [0, 1]
 */
export const cosineSimilarity = (vecA, vecB) => {
  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (const [term, scoreA] of vecA) {
    dotProduct += scoreA * (vecB.get(term) || 0);
    magnitudeA += scoreA * scoreA;
  }

  for (const [, scoreB] of vecB) {
    magnitudeB += scoreB * scoreB;
  }

  const magnitude = Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB);
  if (magnitude === 0) return 0;

  // Clamp to [0, 1] to handle floating-point precision edge cases
  return Math.min(1, Math.max(0, dotProduct / magnitude));
};

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Compute text-similarity scores between a single query item and a list of
 * candidate items.  Builds a corpus-level IDF so rare domain-specific terms
 * (e.g. "calculus", "lanyard", "macbook") get appropriately boosted.
 *
 * Title is repeated 2× before tokenization to give it stronger influence
 * over the description.  This is the simplest approach that avoids
 * architectural complexity while being easy to tune.
 *
 * @param {{ title: string, description: string }} query
 * @param {{ id: number, title: string, description: string }[]} candidates
 * @returns {{ id: number, textScore: number }[]} Parallel array to `candidates`
 */
export const computeTextSimilarities = (query, candidates) => {
  // Repeat title twice so its tokens appear 2× more frequently than description
  // tokens — this biases the TF score towards the title without changing the
  // underlying math of TF-IDF or cosine similarity.
  const buildText = (title, description) =>
    `${title || ""} ${title || ""} ${description || ""}`;

  const queryTokens = tokenize(buildText(query.title, query.description));

  if (queryTokens.length === 0) {
    return candidates.map((c) => ({ id: c.id, textScore: 0 }));
  }

  const candidateTokensList = candidates.map((c) =>
    tokenize(buildText(c.title, c.description))
  );

  // Build a unified corpus so IDF is computed across all documents together
  const corpus = [queryTokens, ...candidateTokensList];
  const idf = computeIDF(corpus);

  const queryVector = buildVector(computeTF(queryTokens), idf);

  return candidates.map((candidate, idx) => {
    const tokens = candidateTokensList[idx];
    if (tokens.length === 0) return { id: candidate.id, textScore: 0 };

    const candidateVector = buildVector(computeTF(tokens), idf);
    const textScore = cosineSimilarity(queryVector, candidateVector);

    return { id: candidate.id, textScore };
  });
};
