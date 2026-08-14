/**
 * Boost — Validator Test Suite (Enhanced)
 * ─────────────────────────────────────────
 * Industry-level tests for ALL boost validators including nested boostConfig fields:
 *   - createPackageValidator
 *   - updatePackageValidator
 *   - purchaseBoostValidator
 *   - logsQueryValidator
 *
 * Run: node --test tests/validators/boost.validator.test.js
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { validationResult } from 'express-validator';
import {
  createPackageValidator,
  updatePackageValidator,
  purchaseBoostValidator,
  logsQueryValidator,
} from '../../src/validators/boost.validator.js';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const getError = async (schemaArray, data) => {
  const req = { body: data, params: {}, query: {} };
  for (const v of schemaArray) await v.run(req);
  const errors = validationResult(req);
  return errors.isEmpty() ? null : errors.array().map(e => e.msg).join(', ');
};

const getQueryError = async (schemaArray, data) => {
  const req = { body: {}, params: {}, query: data };
  for (const v of schemaArray) await v.run(req);
  const errors = validationResult(req);
  return errors.isEmpty() ? null : errors.array().map(e => e.msg).join(', ');
};

// ═══════════════════════════════════════════════════════════════════════════════
// createPackageValidator
// ═══════════════════════════════════════════════════════════════════════════════

describe('createPackageValidator — Core Fields', () => {
  const valid = { name: 'Gold Boost', price: 49.99, durationValue: 7, durationUnit: 'Days' };

  // ── Happy paths ────────────────────────────────────────────────────────────

  it('accepts valid package', async () => {
    assert.equal(await getError(createPackageValidator, valid), null);
  });

  it('accepts with all optional fields', async () => {
    const err = await getError(createPackageValidator, {
      ...valid,
      description: 'Great package',
      badge: 'Most Popular',
      features: ['Priority Feed', 'Analytics'],
      boostConfig: { feedPriority: 1, visibilityMultiplier: 3 },
    });
    assert.equal(err, null);
  });

  // ── name ──────────────────────────────────────────────────────────────────

  it('rejects missing name', async () => {
    const err = await getError(createPackageValidator, { price: 1000, durationValue: 7, durationUnit: 'Days' });
    assert.match(err, /name/i);
  });

  it('rejects empty/whitespace name', async () => {
    const err = await getError(createPackageValidator, { ...valid, name: '   ' });
    assert.notEqual(err, null);
  });

  it('rejects name over 100 chars', async () => {
    const err = await getError(createPackageValidator, { ...valid, name: 'x'.repeat(101) });
    assert.notEqual(err, null);
  });

  it('accepts name at exactly 100 chars', async () => {
    const err = await getError(createPackageValidator, { ...valid, name: 'x'.repeat(100) });
    assert.equal(err, null);
  });

  // ── price ─────────────────────────────────────────────────────────────────

  it('rejects zero price', async () => {
    const err = await getError(createPackageValidator, { ...valid, price: 0 });
    assert.match(err, /positive/);
  });

  it('rejects negative price', async () => {
    const err = await getError(createPackageValidator, { ...valid, price: -10 });
    assert.match(err, /positive/);
  });

  it('rejects non-numeric price', async () => {
    const err = await getError(createPackageValidator, { ...valid, price: 'free' });
    assert.notEqual(err, null);
  });

  it('accepts decimal price', async () => {
    const err = await getError(createPackageValidator, { ...valid, price: 0.01 });
    assert.equal(err, null);
  });

  // ── durationValue ─────────────────────────────────────────────────────────

  it('rejects non-integer durationValue', async () => {
    const err = await getError(createPackageValidator, { ...valid, durationValue: 1.5 });
    assert.match(err, /integer/);
  });

  it('rejects zero durationValue', async () => {
    const err = await getError(createPackageValidator, { ...valid, durationValue: 0 });
    assert.notEqual(err, null);
  });

  it('rejects negative durationValue', async () => {
    const err = await getError(createPackageValidator, { ...valid, durationValue: -1 });
    assert.notEqual(err, null);
  });

  // ── durationUnit ──────────────────────────────────────────────────────────

  it('rejects invalid durationUnit', async () => {
    const err = await getError(createPackageValidator, { ...valid, durationUnit: 'Years' });
    assert.match(err, /Hours|Days|Weeks/);
  });

  it('accepts Hours', async () => {
    assert.equal(await getError(createPackageValidator, { ...valid, durationUnit: 'Hours' }), null);
  });

  it('accepts Weeks', async () => {
    assert.equal(await getError(createPackageValidator, { ...valid, durationUnit: 'Weeks' }), null);
  });

  // ── description ───────────────────────────────────────────────────────────

  it('rejects description over 500 chars', async () => {
    const err = await getError(createPackageValidator, { ...valid, description: 'x'.repeat(501) });
    assert.notEqual(err, null);
  });

  it('accepts description at exactly 500 chars', async () => {
    const err = await getError(createPackageValidator, { ...valid, description: 'x'.repeat(500) });
    assert.equal(err, null);
  });

  // ── badge ─────────────────────────────────────────────────────────────────

  it('rejects invalid badge', async () => {
    const err = await getError(createPackageValidator, { ...valid, badge: 'Cheapest' });
    assert.notEqual(err, null);
  });

  it('accepts all valid badges', async () => {
    for (const badge of ['No Badge', 'Most Popular', 'Premium', 'Best Value']) {
      const err = await getError(createPackageValidator, { ...valid, badge });
      assert.equal(err, null, `Expected badge '${badge}' to be valid`);
    }
  });

  // ── features ──────────────────────────────────────────────────────────────

  it('accepts empty features array', async () => {
    assert.equal(await getError(createPackageValidator, { ...valid, features: [] }), null);
  });

  it('rejects non-string features', async () => {
    const err = await getError(createPackageValidator, { ...valid, features: [123] });
    assert.notEqual(err, null);
  });

  it('rejects non-array features', async () => {
    const err = await getError(createPackageValidator, { ...valid, features: 'Priority Feed' });
    assert.notEqual(err, null);
  });
});

describe('createPackageValidator — boostConfig Nested Fields', () => {
  const valid = { name: 'Gold Boost', price: 49.99, durationValue: 7, durationUnit: 'Days' };

  // ── feedPriority ──────────────────────────────────────────────────────────

  it('accepts feedPriority=1 (highest)', async () => {
    const err = await getError(createPackageValidator, {
      ...valid, boostConfig: { feedPriority: 1 },
    });
    assert.equal(err, null);
  });

  it('accepts feedPriority=10 (lowest)', async () => {
    const err = await getError(createPackageValidator, {
      ...valid, boostConfig: { feedPriority: 10 },
    });
    assert.equal(err, null);
  });

  it('rejects feedPriority=0 (below minimum)', async () => {
    const err = await getError(createPackageValidator, {
      ...valid, boostConfig: { feedPriority: 0 },
    });
    assert.notEqual(err, null);
  });

  it('rejects feedPriority=11 (above maximum)', async () => {
    const err = await getError(createPackageValidator, {
      ...valid, boostConfig: { feedPriority: 11 },
    });
    assert.notEqual(err, null);
  });

  // ── visibilityMultiplier ──────────────────────────────────────────────────

  it('accepts visibilityMultiplier=1 (minimum)', async () => {
    const err = await getError(createPackageValidator, {
      ...valid, boostConfig: { visibilityMultiplier: 1 },
    });
    assert.equal(err, null);
  });

  it('accepts visibilityMultiplier=5 (maximum)', async () => {
    const err = await getError(createPackageValidator, {
      ...valid, boostConfig: { visibilityMultiplier: 5 },
    });
    assert.equal(err, null);
  });

  it('rejects visibilityMultiplier=0', async () => {
    const err = await getError(createPackageValidator, {
      ...valid, boostConfig: { visibilityMultiplier: 0 },
    });
    assert.notEqual(err, null);
  });

  it('rejects visibilityMultiplier=6', async () => {
    const err = await getError(createPackageValidator, {
      ...valid, boostConfig: { visibilityMultiplier: 6 },
    });
    assert.notEqual(err, null);
  });

  // ── highlightStyle ────────────────────────────────────────────────────────

  it('accepts all valid highlight styles', async () => {
    for (const style of ['none', 'subtle', 'blue', 'gold']) {
      const err = await getError(createPackageValidator, {
        ...valid, boostConfig: { highlightStyle: style },
      });
      assert.equal(err, null, `Expected style '${style}' to be valid`);
    }
  });

  it('rejects invalid highlight style', async () => {
    const err = await getError(createPackageValidator, {
      ...valid, boostConfig: { highlightStyle: 'rainbow' },
    });
    assert.match(err, /Invalid highlight style/);
  });

  // ── autoRefreshHours ──────────────────────────────────────────────────────

  it('accepts all valid autoRefreshHours values', async () => {
    for (const hours of [0, 6, 12, 24]) {
      const err = await getError(createPackageValidator, {
        ...valid, boostConfig: { autoRefreshHours: hours },
      });
      assert.equal(err, null, `Expected autoRefreshHours=${hours} to be valid`);
    }
  });

  it('rejects invalid autoRefreshHours', async () => {
    const err = await getError(createPackageValidator, {
      ...valid, boostConfig: { autoRefreshHours: 3 },
    });
    assert.match(err, /Auto-refresh hours/);
  });

  // ── Full config ───────────────────────────────────────────────────────────

  it('accepts full boostConfig with all fields', async () => {
    const err = await getError(createPackageValidator, {
      ...valid,
      boostConfig: {
        feedPriority: 1,
        visibilityMultiplier: 5,
        highlightStyle: 'gold',
        crossCategoryReach: true,
        analyticsAccess: true,
        autoRefreshHours: 6,
      },
    });
    assert.equal(err, null);
  });

  it('rejects non-object boostConfig', async () => {
    const err = await getError(createPackageValidator, {
      ...valid, boostConfig: 'invalid',
    });
    assert.match(err, /object/i);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// updatePackageValidator
// ═══════════════════════════════════════════════════════════════════════════════

describe('updatePackageValidator', () => {
  it('accepts partial update (name only)', async () => {
    assert.equal(await getError(updatePackageValidator, { name: 'New Name' }), null);
  });

  it('accepts empty object (no changes)', async () => {
    assert.equal(await getError(updatePackageValidator, {}), null);
  });

  it('rejects negative price', async () => {
    const err = await getError(updatePackageValidator, { price: -5 });
    assert.match(err, /positive/);
  });

  it('rejects invalid badge', async () => {
    const err = await getError(updatePackageValidator, { badge: 'Cheapest' });
    assert.notEqual(err, null);
  });

  it('accepts partial boostConfig update', async () => {
    const err = await getError(updatePackageValidator, {
      boostConfig: { feedPriority: 3 },
    });
    assert.equal(err, null);
  });

  it('rejects boostConfig with invalid feedPriority', async () => {
    const err = await getError(updatePackageValidator, {
      boostConfig: { feedPriority: 99 },
    });
    assert.notEqual(err, null);
  });

  it('accepts update with all fields at once', async () => {
    const err = await getError(updatePackageValidator, {
      name: 'Platinum',
      price: 199.99,
      durationValue: 30,
      durationUnit: 'Days',
      badge: 'Premium',
      description: 'Top-tier package',
      boostConfig: { feedPriority: 1, highlightStyle: 'gold' },
    });
    assert.equal(err, null);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// purchaseBoostValidator
// ═══════════════════════════════════════════════════════════════════════════════

describe('purchaseBoostValidator', () => {
  it('accepts valid purchase', async () => {
    assert.equal(await getError(purchaseBoostValidator, { packageId: 'pkg_1' }), null);
  });

  it('accepts with optional postId', async () => {
    assert.equal(await getError(purchaseBoostValidator, { packageId: 'pkg_1', postId: 42 }), null);
  });

  it('rejects missing packageId', async () => {
    const err = await getError(purchaseBoostValidator, {});
    assert.match(err, /package/i);
  });

  it('rejects empty packageId', async () => {
    const err = await getError(purchaseBoostValidator, { packageId: '' });
    assert.notEqual(err, null);
  });

  it('rejects negative postId', async () => {
    const err = await getError(purchaseBoostValidator, { packageId: 'pkg_1', postId: -1 });
    assert.notEqual(err, null);
  });

  it('rejects zero postId', async () => {
    const err = await getError(purchaseBoostValidator, { packageId: 'pkg_1', postId: 0 });
    assert.notEqual(err, null);
  });

  it('rejects float postId', async () => {
    const err = await getError(purchaseBoostValidator, { packageId: 'pkg_1', postId: 1.5 });
    assert.notEqual(err, null);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// logsQueryValidator
// ═══════════════════════════════════════════════════════════════════════════════

describe('logsQueryValidator', () => {
  it('accepts empty query', async () => {
    assert.equal(await getQueryError(logsQueryValidator, {}), null);
  });

  it('accepts valid params', async () => {
    assert.equal(await getQueryError(logsQueryValidator, { page: '2', limit: '10', type: 'package_added' }), null);
  });

  it('accepts all valid log types', async () => {
    for (const type of ['package_added', 'package_updated', 'package_deleted']) {
      const err = await getQueryError(logsQueryValidator, { type });
      assert.equal(err, null, `Expected type '${type}' to be valid`);
    }
  });

  it('rejects limit over 100', async () => {
    const err = await getQueryError(logsQueryValidator, { limit: '999' });
    assert.notEqual(err, null);
  });

  it('rejects limit of 0', async () => {
    const err = await getQueryError(logsQueryValidator, { limit: '0' });
    assert.notEqual(err, null);
  });

  it('rejects negative limit', async () => {
    const err = await getQueryError(logsQueryValidator, { limit: '-5' });
    assert.notEqual(err, null);
  });

  it('rejects invalid type', async () => {
    const err = await getQueryError(logsQueryValidator, { type: 'invalid' });
    assert.notEqual(err, null);
  });

  it('rejects page=0', async () => {
    const err = await getQueryError(logsQueryValidator, { page: '0' });
    assert.notEqual(err, null);
  });

  it('accepts limit at boundary: 1', async () => {
    assert.equal(await getQueryError(logsQueryValidator, { limit: '1' }), null);
  });

  it('accepts limit at boundary: 100', async () => {
    assert.equal(await getQueryError(logsQueryValidator, { limit: '100' }), null);
  });
});
