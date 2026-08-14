import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { getError, getErrorWithParams } from '../helpers/testUtils.js';
import {
  submitReviewValidator,
  deleteReviewValidator,
  getTargetReviewsValidator,
  toggleReviewFeedbackValidator,
  toggleOwnerLikeValidator,
  replyToReviewValidator,
} from '../../src/validators/review.validator.js';

describe('submitReviewValidator', () => {
  const valid = { targetId: 1, rating: 4 };

  it('accepts valid review', async () => {
    assert.equal(await getError(submitReviewValidator, valid), null);
  });

  it('accepts review with optional text', async () => {
    assert.equal(await getError(submitReviewValidator, { ...valid, review: 'Great service!', isAnonymous: false }), null);
  });

  it('rejects missing targetId', async () => {
    assert.match(await getError(submitReviewValidator, { rating: 4 }), /target/i);
  });

  it('rejects missing rating', async () => {
    assert.match(await getError(submitReviewValidator, { targetId: 1 }), /rating/i);
  });

  it('rejects rating below 1', async () => {
    assert.match(await getError(submitReviewValidator, { targetId: 1, rating: 0 }), /rating/i);
  });

  it('rejects rating above 5', async () => {
    assert.match(await getError(submitReviewValidator, { targetId: 1, rating: 6 }), /rating/i);
  });

  it('rejects non-integer targetId', async () => {
    assert.match(await getError(submitReviewValidator, { targetId: 'abc', rating: 3 }), /integer/i);
  });

  it('rejects review over 500 chars', async () => {
    assert.match(await getError(submitReviewValidator, { ...valid, review: 'x'.repeat(501) }), /500|characters/i);
  });
});

describe('deleteReviewValidator', () => {
  it('accepts valid param', async () => {
    assert.equal(await getErrorWithParams(deleteReviewValidator, { id: '10' }), null);
  });
  it('rejects non-integer', async () => {
    assert.ok(await getErrorWithParams(deleteReviewValidator, { id: 'x' }));
  });
});

describe('getTargetReviewsValidator', () => {
  it('accepts valid param', async () => {
    assert.equal(await getErrorWithParams(getTargetReviewsValidator, { targetId: '5' }), null);
  });
});

describe('toggleReviewFeedbackValidator', () => {
  it('accepts helpful action', async () => {
    assert.equal(await getErrorWithParams(toggleReviewFeedbackValidator, { reviewId: '3' }, { action: 'helpful' }), null);
  });
  it('accepts not_helpful action', async () => {
    assert.equal(await getErrorWithParams(toggleReviewFeedbackValidator, { reviewId: '3' }, { action: 'not_helpful' }), null);
  });
  it('rejects invalid action', async () => {
    assert.ok(await getErrorWithParams(toggleReviewFeedbackValidator, { reviewId: '3' }, { action: 'bad' }));
  });
});

describe('toggleOwnerLikeValidator', () => {
  it('accepts valid param', async () => {
    assert.equal(await getErrorWithParams(toggleOwnerLikeValidator, { reviewId: '7' }), null);
  });
});

describe('replyToReviewValidator', () => {
  it('accepts valid reply', async () => {
    assert.equal(await getErrorWithParams(replyToReviewValidator, { reviewId: '2' }, { content: 'Thank you!' }), null);
  });
  it('rejects missing content', async () => {
    assert.ok(await getErrorWithParams(replyToReviewValidator, { reviewId: '2' }, {}));
  });
});
