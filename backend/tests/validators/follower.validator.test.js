import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { validationResult } from 'express-validator';
import { getErrorWithParams, getErrorWithQuery } from '../helpers/testUtils.js';
import {
  toggleFollowValidator,
  getFollowersValidator,
  getFollowingValidator,
  getPublicFollowersValidator,
} from '../../src/validators/follower.validator.js';

describe('toggleFollowValidator', () => {
  it('accepts valid clubId', async () => {
    assert.equal(await getErrorWithParams(toggleFollowValidator, { clubId: '5' }), null);
  });
  it('rejects non-integer', async () => {
    assert.ok(await getErrorWithParams(toggleFollowValidator, { clubId: 'abc' }));
  });
  it('rejects missing clubId', async () => {
    assert.ok(await getErrorWithParams(toggleFollowValidator, {}));
  });
});

describe('getFollowersValidator', () => {
  it('accepts without optional query params', async () => {
    assert.equal(await getErrorWithQuery(getFollowersValidator, {}), null);
  });
  it('accepts valid limit and page', async () => {
    assert.equal(await getErrorWithQuery(getFollowersValidator, { limit: '10', page: '1' }), null);
  });
  it('rejects zero limit', async () => {
    assert.ok(await getErrorWithQuery(getFollowersValidator, { limit: '0' }));
  });
});

describe('getFollowingValidator', () => {
  it('accepts without optional query params', async () => {
    assert.equal(await getErrorWithQuery(getFollowingValidator, {}), null);
  });
  it('rejects negative page', async () => {
    assert.ok(await getErrorWithQuery(getFollowingValidator, { page: '-1' }));
  });
  it('accepts valid sortOrder', async () => {
    assert.equal(
      await getErrorWithQuery(getFollowingValidator, { sortOrder: 'asc' }),
      null,
    );
    assert.equal(
      await getErrorWithQuery(getFollowingValidator, { sortOrder: 'desc' }),
      null,
    );
    assert.equal(
      await getErrorWithQuery(getFollowingValidator, { sortOrder: 'newest' }),
      null,
    );
    assert.equal(
      await getErrorWithQuery(getFollowingValidator, { sortOrder: 'oldest' }),
      null,
    );
  });
  it('rejects invalid sortOrder', async () => {
    assert.ok(
      await getErrorWithQuery(getFollowingValidator, { sortOrder: 'invalid' }),
    );
  });
});

describe('getPublicFollowersValidator', () => {
  it('accepts valid userId', async () => {
    assert.equal(
      await getErrorWithParams(getPublicFollowersValidator, { userId: '5' }),
      null,
    );
  });
  it('accepts with optional query params', async () => {
    const req = { body: {}, params: { userId: '5' }, query: { limit: '20', page: '1' } };
    for (const validation of getPublicFollowersValidator) {
      await validation.run(req);
    }
    const errors = validationResult(req);
    assert.equal(errors.isEmpty(), true);
  });
  it('rejects non-integer userId', async () => {
    assert.ok(
      await getErrorWithParams(getPublicFollowersValidator, { userId: 'abc' }),
    );
  });
  it('rejects missing userId', async () => {
    assert.ok(
      await getErrorWithParams(getPublicFollowersValidator, {}),
    );
  });
  it('rejects zero limit', async () => {
    assert.ok(
      await getErrorWithQuery(getPublicFollowersValidator, { limit: '0' }),
    );
  });
});
