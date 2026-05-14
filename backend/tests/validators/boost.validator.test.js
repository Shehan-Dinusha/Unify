import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { validationResult } from 'express-validator';
import {
  createPackageValidator,
  updatePackageValidator,
  purchaseBoostValidator,
  logsQueryValidator,
} from '../../src/validators/boost.validator.js';

const getError = async (schemaArray, data) => {
  const req = { body: data };
  for (const validation of schemaArray) {
    await validation.run(req);
  }
  const errors = validationResult(req);
  return errors.isEmpty() ? null : errors.array().map(e => e.msg).join(", ");
};

const getQueryError = async (schemaArray, data) => {
  const req = { query: data };
  for (const validation of schemaArray) {
    await validation.run(req);
  }
  const errors = validationResult(req);
  return errors.isEmpty() ? null : errors.array().map(e => e.msg).join(", ");
};

describe('createPackageValidator — Validation', () => {
  const valid = { name: 'Gold Boost', price: 49.99, durationValue: 7, durationUnit: 'Days' };

  it('accepts valid package', async () => {
    assert.equal(await getError(createPackageValidator, valid), null);
  });
  it('accepts with optional fields', async () => {
    const err = await getError(createPackageValidator, {
      ...valid, description: 'Great', badge: 'Most Popular', features: ['A', 'B'],
    });
    assert.equal(err, null);
  });
  it('rejects missing name', async () => {
    const err = await getError(createPackageValidator, { price: 1000, durationValue: 7, durationUnit: 'Days' });
    assert.match(err, /name/i);
  });
  it('rejects empty/whitespace name', async () => {
    const err = await getError(createPackageValidator, { ...valid, name: '   ' });
    assert.notEqual(err, null);
  });
  it('rejects non-positive price', async () => {
    const err = await getError(createPackageValidator, { ...valid, price: 0 });
    assert.match(err, /positive/);
  });
  it('rejects non-integer durationValue', async () => {
    const err = await getError(createPackageValidator, { ...valid, durationValue: 1.5 });
    assert.match(err, /integer/);
  });
  it('rejects invalid durationUnit', async () => {
    const err = await getError(createPackageValidator, { ...valid, durationUnit: 'Years' });
    assert.match(err, /Hours|Days|Weeks/);
  });
  it('rejects name over 100 chars', async () => {
    const err = await getError(createPackageValidator, { ...valid, name: 'x'.repeat(101) });
    assert.notEqual(err, null);
  });
  it('rejects description over 500 chars', async () => {
    const err = await getError(createPackageValidator, { ...valid, description: 'x'.repeat(501) });
    assert.notEqual(err, null);
  });
  it('accepts empty features array', async () => {
    const err = await getError(createPackageValidator, { ...valid, features: [] });
    assert.equal(err, null);
  });
  it('rejects non-string features', async () => {
    const err = await getError(createPackageValidator, { ...valid, features: [123] });
    assert.notEqual(err, null);
  });
  it('rejects invalid badge', async () => {
    const err = await getError(createPackageValidator, { ...valid, badge: 'Invalid' });
    assert.notEqual(err, null);
  });
});

describe('updatePackageValidator — Validation', () => {
  it('accepts partial update', async () => {
    const err = await getError(updatePackageValidator, { name: 'New Name' });
    assert.equal(err, null);
  });
  it('accepts empty object (no changes)', async () => {
    const err = await getError(updatePackageValidator, {});
    assert.equal(err, null);
  });
  it('rejects negative price', async () => {
    const err = await getError(updatePackageValidator, { price: -5 });
    assert.match(err, /positive/);
  });
  it('rejects invalid badge', async () => {
    const err = await getError(updatePackageValidator, { badge: 'Cheapest' });
    assert.notEqual(err, null);
  });
});

describe('purchaseBoostValidator — Validation', () => {
  it('accepts valid purchase', async () => {
    const err = await getError(purchaseBoostValidator, { packageId: 'pkg_1' });
    assert.equal(err, null);
  });
  it('accepts with optional postId', async () => {
    const err = await getError(purchaseBoostValidator, { packageId: 'pkg_1', postId: 42 });
    assert.equal(err, null);
  });
  it('rejects missing packageId', async () => {
    const err = await getError(purchaseBoostValidator, {});
    assert.match(err, /package/i);
  });
  it('rejects empty packageId', async () => {
    const err = await getError(purchaseBoostValidator, { packageId: '' });
    assert.notEqual(err, null);
  });
});

describe('logsQueryValidator — Validation', () => {
  it('accepts empty query', async () => {
    const err = await getQueryError(logsQueryValidator, {});
    assert.equal(err, null);
  });
  it('accepts valid params', async () => {
    const err = await getQueryError(logsQueryValidator, { page: '2', limit: '10', type: 'package_added' });
    assert.equal(err, null);
  });
  it('rejects limit over 100', async () => {
    const err = await getQueryError(logsQueryValidator, { limit: '999' });
    assert.notEqual(err, null);
  });
  it('rejects invalid type', async () => {
    const err = await getQueryError(logsQueryValidator, { type: 'invalid' });
    assert.notEqual(err, null);
  });
});
