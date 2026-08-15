import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  computeLocationSimilarity,
  computeTimeRelevance,
} from '../../../src/services/lostAndFoundMatcher.service.js';

// ── computeLocationSimilarity ─────────────────────────────────────────────────

describe('computeLocationSimilarity', () => {
  it('returns 0 when locA is null', () => {
    assert.equal(computeLocationSimilarity(null, 'Library'), 0);
  });

  it('returns 0 when locB is null', () => {
    assert.equal(computeLocationSimilarity('Library', null), 0);
  });

  it('returns 0 when both locations are null', () => {
    assert.equal(computeLocationSimilarity(null, null), 0);
  });

  it('returns 1 for identical locations', () => {
    assert.equal(computeLocationSimilarity('Main Library', 'Main Library'), 1);
  });

  it('returns high score for heavily overlapping tokens', () => {
    const score = computeLocationSimilarity('Library 1st Floor', 'Library Ground Floor');
    assert.ok(score > 0.4, `Expected > 0.4, got ${score}`);
  });

  it('returns expected Jaccard score for partial substring match (Library vs Library 1st Floor)', () => {
    const score = computeLocationSimilarity('Library 1st Floor', 'Library');
    assert.ok(score > 0.3, `Expected > 0.3, got ${score}`);
  });

  it('returns 0 for completely different locations', () => {
    const score = computeLocationSimilarity('Cafeteria', 'Sports Complex');
    assert.equal(score, 0);
  });

  it('handles short abbreviations like B2 (len=2)', () => {
    const score = computeLocationSimilarity('B2', 'B2');
    assert.ok(score > 0, `Expected > 0 for identical short codes, got ${score}`);
  });

  it('is case-insensitive', () => {
    const lower = computeLocationSimilarity('library', 'Library');
    const upper = computeLocationSimilarity('LIBRARY', 'library');
    assert.ok(lower > 0.9);
    assert.ok(upper > 0.9);
  });

  it('returns score in [0, 1]', () => {
    const score = computeLocationSimilarity('Main Library Block A', 'Library');
    assert.ok(score >= 0 && score <= 1, `Score out of range: ${score}`);
  });
});

// ── computeTimeRelevance ──────────────────────────────────────────────────────

describe('computeTimeRelevance', () => {
  it('returns 1.00 for items on the same day', () => {
    assert.equal(computeTimeRelevance('2026-05-01', '2026-05-01'), 1.0);
  });

  it('returns 1.00 for items within 1 day', () => {
    assert.equal(computeTimeRelevance('2026-05-01', '2026-05-02'), 1.0);
  });

  it('returns 0.80 for items 2 days apart', () => {
    assert.equal(computeTimeRelevance('2026-05-01', '2026-05-03'), 0.80);
  });

  it('returns 0.80 for items exactly 3 days apart', () => {
    assert.equal(computeTimeRelevance('2026-05-01', '2026-05-04'), 0.80);
  });

  it('returns 0.60 for items 4 days apart', () => {
    assert.equal(computeTimeRelevance('2026-05-01', '2026-05-05'), 0.60);
  });

  it('returns 0.60 for items exactly 7 days apart', () => {
    assert.equal(computeTimeRelevance('2026-05-01', '2026-05-08'), 0.60);
  });

  it('returns 0.40 for items 8 days apart', () => {
    assert.equal(computeTimeRelevance('2026-05-01', '2026-05-09'), 0.40);
  });

  it('returns 0.40 for items exactly 14 days apart', () => {
    assert.equal(computeTimeRelevance('2026-05-01', '2026-05-15'), 0.40);
  });

  it('returns 0.20 for items 15 days apart', () => {
    assert.equal(computeTimeRelevance('2026-05-01', '2026-05-16'), 0.20);
  });

  it('returns 0.20 for items exactly 30 days apart', () => {
    assert.equal(computeTimeRelevance('2026-05-01', '2026-05-31'), 0.20);
  });

  it('returns 0.05 for items more than 30 days apart', () => {
    assert.equal(computeTimeRelevance('2026-01-01', '2026-04-01'), 0.05);
  });

  it('returns 0.1 for null dateA', () => {
    assert.equal(computeTimeRelevance(null, '2026-05-01'), 0.1);
  });

  it('returns 0.1 for null dateB', () => {
    assert.equal(computeTimeRelevance('2026-05-01', null), 0.1);
  });

  it('returns 0.1 for both null dates', () => {
    assert.equal(computeTimeRelevance(null, null), 0.1);
  });

  it('returns 0.1 for invalid date strings', () => {
    assert.equal(computeTimeRelevance('not-a-date', '2026-05-01'), 0.1);
    assert.equal(computeTimeRelevance('2026-05-01', 'bad-date'), 0.1);
  });

  it('score is symmetric (order of dates does not matter)', () => {
    const a = computeTimeRelevance('2026-05-01', '2026-05-10');
    const b = computeTimeRelevance('2026-05-10', '2026-05-01');
    assert.equal(a, b);
  });
});
