import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { validationResult } from 'express-validator';
import {
  toggleFollowValidator,
  getFollowersValidator,
  getFollowingValidator,
} from '../../src/validators/follower.validator.js';

const getErrorWithParams = async (schemaArray, params) => {
  const req = { body: {}, params, query: {} };
  for (const validation of schemaArray) {
    await validation.run(req);
  }
  const errors = validationResult(req);
  return errors.isEmpty() ? null : errors.array().map(e => e.msg).join(", ");
};

const getErrorWithQuery = async (schemaArray, query) => {
  const req = { body: {}, params: {}, query };
  for (const validation of schemaArray) {
    await validation.run(req);
  }
  const errors = validationResult(req);
  return errors.isEmpty() ? null : errors.array().map(e => e.msg).join(", ");
};

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
});
