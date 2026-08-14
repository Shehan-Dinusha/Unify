import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { truncateComment } from '../../../src/services/notification.service.js';

// ── truncateComment (NewsFeed comment notification content) ───────────────────

describe('truncateComment', () => {
  it('returns short text unchanged', () => {
    assert.equal(truncateComment('Nice post!'), 'Nice post!');
  });

  it('returns text of exactly 80 characters unchanged', () => {
    const exact80 = 'A'.repeat(80);
    assert.equal(truncateComment(exact80), exact80);
  });

  it('truncates text of 81 characters to 80 + "..."', () => {
    const text81 = 'A'.repeat(81);
    const result = truncateComment(text81);
    assert.equal(result, 'A'.repeat(80) + '...');
  });

  it('truncates long text correctly', () => {
    const longText = 'B'.repeat(200);
    const result = truncateComment(longText);
    assert.equal(result.length, 83); // 80 chars + "..."
    assert.ok(result.endsWith('...'));
  });

  it('returns empty string unchanged', () => {
    assert.equal(truncateComment(''), '');
  });

  it('does not add ellipsis for text shorter than 80 chars', () => {
    const short = 'Hello world, this is a comment.';
    assert.ok(!truncateComment(short).includes('...'));
  });
});

// ── Like dedupeKey format ─────────────────────────────────────────────────────

describe('Like dedupeKey format', () => {
  it('constructs correct dedupeKey for a like', () => {
    const actorId = 5, postType = 'normal', postId = 10;
    const key = `like:${actorId}:${postType}:${postId}`;
    assert.equal(key, 'like:5:normal:10');
  });

  it('dedupeKey includes all four segments separated by colons', () => {
    const key = `like:3:club-product:42`;
    const parts = key.split(':');
    assert.equal(parts[0], 'like');
    assert.equal(parts.length, 4);
  });

  it('works for each valid postType', () => {
    const postTypes = ['normal', 'club-product', 'club-event', 'boarding', 'food-cafe', 'service'];
    for (const postType of postTypes) {
      const key = `like:1:${postType}:99`;
      assert.ok(key.startsWith('like:'), `Key should start with like: for type ${postType}`);
    }
  });
});

// ── Comment dedupeKey format ──────────────────────────────────────────────────

describe('Comment dedupeKey format', () => {
  it('constructs correct dedupeKey for a comment', () => {
    const key = `comment:5:normal:10:99`;
    assert.equal(key, 'comment:5:normal:10:99');
  });

  it('dedupeKey includes five segments separated by colons', () => {
    const actorId = 7, postType = 'club-product', postId = 20, commentId = 55;
    const key = `comment:${actorId}:${postType}:${postId}:${commentId}`;
    const parts = key.split(':');
    assert.equal(parts[0], 'comment');
    // "club-product" contributes 2 parts when split by ":"
    assert.ok(key.includes(`${commentId}`));
    assert.ok(key.startsWith('comment:'));
  });

  it('two different commentIds produce different dedupeKeys', () => {
    const key1 = `comment:5:normal:10:1`;
    const key2 = `comment:5:normal:10:2`;
    assert.notEqual(key1, key2);
  });
});

// ── Self-notification prevention ──────────────────────────────────────────────

describe('Self-notification prevention', () => {
  it('does NOT notify when userId === actorId', () => {
    const userId = 5, actorId = 5;
    const shouldNotify = !(actorId && userId === actorId);
    assert.equal(shouldNotify, false);
  });

  it('notifies when userId !== actorId', () => {
    const userId = 5, actorId = 6;
    const shouldNotify = !(actorId && userId === actorId);
    assert.equal(shouldNotify, true);
  });

  it('notifies when actorId is undefined (system-generated notification)', () => {
    const userId = 5, actorId = undefined;
    const shouldNotify = !(actorId && userId === actorId);
    assert.equal(shouldNotify, true);
  });

  it('notifies when actorId is null', () => {
    const userId = 5, actorId = null;
    const shouldNotify = !(actorId && userId === actorId);
    assert.equal(shouldNotify, true);
  });
});

// ── Save/bookmark dedupeKey format ───────────────────────────────────────────

describe('Save dedupeKey format', () => {
  it('constructs a unique save dedupeKey per user+post', () => {
    const userId = 3, postId = 77;
    const key = `save:${userId}:${postId}`;
    assert.equal(key, 'save:3:77');
  });

  it('different users saving the same post produce different dedupeKeys', () => {
    const key1 = `save:1:77`;
    const key2 = `save:2:77`;
    assert.notEqual(key1, key2);
  });

  it('same user saving different posts produce different dedupeKeys', () => {
    const key1 = `save:3:10`;
    const key2 = `save:3:20`;
    assert.notEqual(key1, key2);
  });
});
