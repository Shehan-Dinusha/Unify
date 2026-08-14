import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildReviewFeedbackTitle,
  buildFollowerTitle,
  truncateComment,
} from '../../../src/services/notification.service.js';

// ── buildFollowerTitle ────────────────────────────────────────────────────────

describe('buildFollowerTitle', () => {
  it('formats single follower correctly', () => {
    const title = buildFollowerTitle([{ name: 'Alice' }]);
    assert.equal(title, 'Alice started following you');
  });

  it('formats two followers with "and"', () => {
    const title = buildFollowerTitle([{ name: 'Alice' }, { name: 'Bob' }]);
    assert.equal(title, 'Alice and Bob started following you');
  });

  it('formats three followers with "and N others"', () => {
    const title = buildFollowerTitle([
      { name: 'Alice' }, { name: 'Bob' }, { name: 'Charlie' },
    ]);
    assert.equal(title, 'Alice, Bob, and 1 others started following you');
  });

  it('formats four followers with correct others count', () => {
    const title = buildFollowerTitle([
      { name: 'Alice' }, { name: 'Bob' }, { name: 'Charlie' }, { name: 'Dana' },
    ]);
    assert.equal(title, 'Alice, Bob, and 2 others started following you');
  });

  it('uses first follower name for single-follower case', () => {
    const title = buildFollowerTitle([{ name: 'Kasun' }]);
    assert.ok(title.startsWith('Kasun'));
  });

  it('title always ends with "started following you"', () => {
    const cases = [
      [{ name: 'Alice' }],
      [{ name: 'Alice' }, { name: 'Bob' }],
      [{ name: 'Alice' }, { name: 'Bob' }, { name: 'Charlie' }],
    ];
    for (const followers of cases) {
      assert.ok(buildFollowerTitle(followers).endsWith('started following you'));
    }
  });
});

// ── buildReviewFeedbackTitle ──────────────────────────────────────────────────

describe('buildReviewFeedbackTitle', () => {
  it('formats single user with "helpful" action', () => {
    const title = buildReviewFeedbackTitle([{ name: 'Alice' }], 'helpful');
    assert.equal(title, 'Alice found your review helpful');
  });

  it('formats single user with "not_helpful" action', () => {
    const title = buildReviewFeedbackTitle([{ name: 'Alice' }], 'not_helpful');
    assert.equal(title, 'Alice found your review not helpful');
  });

  it('formats two users with "and"', () => {
    const title = buildReviewFeedbackTitle(
      [{ name: 'Alice' }, { name: 'Bob' }], 'helpful'
    );
    assert.equal(title, 'Alice and Bob found your review helpful');
  });

  it('formats three users with correct "others" count', () => {
    const title = buildReviewFeedbackTitle(
      [{ name: 'Alice' }, { name: 'Bob' }, { name: 'Charlie' }], 'helpful'
    );
    assert.equal(title, 'Alice, Bob, and 1 others found your review helpful');
  });

  it('formats five users with correct "others" count', () => {
    const users = [
      { name: 'A' }, { name: 'B' }, { name: 'C' }, { name: 'D' }, { name: 'E' },
    ];
    const title = buildReviewFeedbackTitle(users, 'helpful');
    assert.equal(title, 'A, B, and 3 others found your review helpful');
  });

  it('uses "not helpful" text for non-helpful action', () => {
    const title = buildReviewFeedbackTitle([{ name: 'Alice' }], 'not_helpful');
    assert.ok(title.includes('not helpful'));
  });

  it('uses "helpful" text for helpful action', () => {
    const title = buildReviewFeedbackTitle([{ name: 'Bob' }], 'helpful');
    assert.ok(title.includes('found your review helpful'));
    assert.ok(!title.includes('not helpful'));
  });
});

// ── Match dedupeKey format ────────────────────────────────────────────────────

describe('Match dedupeKey format', () => {
  it('constructs correct match dedupeKey', () => {
    const userId = 7, lostItemId = 12, foundItemId = 99;
    const key = `match:${userId}:${lostItemId}:${foundItemId}`;
    assert.equal(key, 'match:7:12:99');
  });

  it('dedupeKey starts with "match:"', () => {
    const key = `match:1:2:3`;
    assert.ok(key.startsWith('match:'));
  });

  it('different foundItemIds produce different dedupeKeys', () => {
    const key1 = `match:7:12:99`;
    const key2 = `match:7:12:100`;
    assert.notEqual(key1, key2);
  });

  it('different lostItemIds produce different dedupeKeys', () => {
    const key1 = `match:7:12:99`;
    const key2 = `match:7:13:99`;
    assert.notEqual(key1, key2);
  });
});

// ── Match score percentage formatting ─────────────────────────────────────────

describe('Match score percentage text', () => {
  it('formats score as integer percentage', () => {
    const score = 0.87;
    const text = ` (${Math.round(score * 100)}% match)`;
    assert.equal(text, ' (87% match)');
  });

  it('rounds to nearest integer', () => {
    const text = ` (${Math.round(0.756 * 100)}% match)`;
    assert.equal(text, ' (76% match)');
  });

  it('returns empty string when score is null', () => {
    const score = null;
    const text = score !== null ? ` (${Math.round(score * 100)}% match)` : '';
    assert.equal(text, '');
  });

  it('returns 100% for perfect match score', () => {
    const text = ` (${Math.round(1.0 * 100)}% match)`;
    assert.equal(text, ' (100% match)');
  });
});

// ── truncateComment (re-tested here in notification context) ──────────────────

describe('truncateComment (notification content)', () => {
  it('wraps result in quotes as notification content', () => {
    const truncated = truncateComment('Great post!');
    const content = `"${truncated}"`;
    assert.equal(content, '"Great post!"');
  });

  it('truncated + quoted content still ends with "..."', () => {
    const truncated = truncateComment('A'.repeat(100));
    const content = `"${truncated}"`;
    assert.ok(content.includes('...'));
    assert.ok(content.startsWith('"'));
    assert.ok(content.endsWith('"'));
  });
});
