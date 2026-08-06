import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import boostService, { VALID_TRANSITIONS, validateStatusTransition, generateFeaturesFromConfig } from '../../../src/services/boost.service.js';

describe('BoostService.calculateExpiryDate', () => {
  it('adds hours correctly', () => {
    const start = new Date('2026-01-01T00:00:00Z');
    const result = boostService.calculateExpiryDate(start, 6, 'Hours');
    assert.equal(result.toISOString(), '2026-01-01T06:00:00.000Z');
  });

  it('adds days correctly', () => {
    const start = new Date('2026-01-01T00:00:00Z');
    const result = boostService.calculateExpiryDate(start, 5, 'Days');
    assert.equal(result.toISOString(), '2026-01-06T00:00:00.000Z');
  });

  it('adds weeks correctly', () => {
    const start = new Date('2026-01-01T00:00:00Z');
    const result = boostService.calculateExpiryDate(start, 2, 'Weeks');
    assert.equal(result.toISOString(), '2026-01-15T00:00:00.000Z');
  });

  it('defaults to days for unknown unit', () => {
    const start = new Date('2026-01-01T00:00:00Z');
    const result = boostService.calculateExpiryDate(start, 10, 'Months');
    assert.equal(result.toISOString(), '2026-01-11T00:00:00.000Z');
  });
});

describe('BoostService.generateTransactionId', () => {
  it('returns a string starting with TXN-', () => {
    const id = boostService.generateTransactionId();
    assert.ok(id.startsWith('TXN-'));
  });

  it('produces unique ids on successive calls', () => {
    const a = boostService.generateTransactionId();
    const b = boostService.generateTransactionId();
    assert.notEqual(a, b);
  });
});

describe('validateStatusTransition', () => {
  it('allows Pending -> Active', () => {
    assert.equal(validateStatusTransition('Pending', 'Active').valid, true);
  });

  it('allows Pending -> Cancelled', () => {
    assert.equal(validateStatusTransition('Pending', 'Cancelled').valid, true);
  });

  it('allows Active -> Paused', () => {
    assert.equal(validateStatusTransition('Active', 'Paused').valid, true);
  });

  it('allows Active -> Completed', () => {
    assert.equal(validateStatusTransition('Active', 'Completed').valid, true);
  });

  it('allows Active -> Cancelled', () => {
    assert.equal(validateStatusTransition('Active', 'Cancelled').valid, true);
  });

  it('allows Paused -> Active', () => {
    assert.equal(validateStatusTransition('Paused', 'Active').valid, true);
  });

  it('allows Paused -> Cancelled', () => {
    assert.equal(validateStatusTransition('Paused', 'Cancelled').valid, true);
  });

  it('blocks Completed -> Active', () => {
    const r = validateStatusTransition('Completed', 'Active');
    assert.equal(r.valid, false);
    assert.match(r.message, /transition/);
  });

  it('blocks Completed -> any', () => {
    assert.equal(validateStatusTransition('Completed', 'Cancelled').valid, false);
  });

  it('blocks Cancelled -> any', () => {
    assert.equal(validateStatusTransition('Cancelled', 'Pending').valid, false);
  });

  it('blocks Paused -> Completed (direct)', () => {
    const r = validateStatusTransition('Paused', 'Completed');
    assert.equal(r.valid, false);
  });

  it('handles unknown current status gracefully', () => {
    const r = validateStatusTransition('Unknown', 'Active');
    assert.equal(r.valid, false);
  });
});

describe('VALID_TRANSITIONS constant', () => {
  it('defines all expected states', () => {
    assert.ok(Array.isArray(VALID_TRANSITIONS.Pending));
    assert.ok(Array.isArray(VALID_TRANSITIONS.Active));
    assert.ok(Array.isArray(VALID_TRANSITIONS.Paused));
    assert.ok(Array.isArray(VALID_TRANSITIONS.Completed));
    assert.ok(Array.isArray(VALID_TRANSITIONS.Cancelled));
  });

  it('Completed and Cancelled are terminal', () => {
    assert.equal(VALID_TRANSITIONS.Completed.length, 0);
    assert.equal(VALID_TRANSITIONS.Cancelled.length, 0);
  });
});

describe('generateFeaturesFromConfig', () => {
  it('adds top priority feature when feedPriority is 1', () => {
    const config = { feedPriority: 1 };
    const features = generateFeaturesFromConfig(config, 7, 'Days');
    assert.ok(features.includes('Always #1 in Feed'));
  });

  it('adds numbered priority when feedPriority is between 2 and 9', () => {
    const config = { feedPriority: 5 };
    const features = generateFeaturesFromConfig(config, 7, 'Days');
    assert.ok(features.includes('Priority #5 Feed Placement'));
  });

  it('adds visibility multiplier when > 1', () => {
    const config = { visibilityMultiplier: 3 };
    const features = generateFeaturesFromConfig(config, 7, 'Days');
    assert.ok(features.includes('3x Visibility Boost'));
  });

  it('does not add visibility multiplier when 1', () => {
    const config = { visibilityMultiplier: 1 };
    const features = generateFeaturesFromConfig(config, 7, 'Days');
    assert.ok(!features.some(f => f.includes('Visibility Boost')));
  });

  it('adds highlight style labels correctly', () => {
    const subtle = generateFeaturesFromConfig({ highlightStyle: 'subtle' }, 7, 'Days');
    assert.ok(subtle.some(f => f.includes('Sponsored Label on Post')));

    const blue = generateFeaturesFromConfig({ highlightStyle: 'blue' }, 7, 'Days');
    assert.ok(blue.some(f => f.includes('Blue Highlighted')));

    const gold = generateFeaturesFromConfig({ highlightStyle: 'gold' }, 7, 'Days');
    assert.ok(gold.some(f => f.includes('Gold Premium')));
  });

  it('does not add highlight feature when none', () => {
    const features = generateFeaturesFromConfig({ highlightStyle: 'none' }, 7, 'Days');
    assert.ok(!features.some(f => f.includes('Card') || f.includes('Label')));
  });

  it('adds cross category reach', () => {
    const features = generateFeaturesFromConfig({ crossCategoryReach: true }, 7, 'Days');
    assert.ok(features.includes('Appears in All Category Feeds'));
  });

  it('adds analytics dashboard', () => {
    const features = generateFeaturesFromConfig({ analyticsAccess: true }, 7, 'Days');
    assert.ok(features.includes('Boost Analytics Dashboard'));
  });

  it('adds auto-refresh when > 0', () => {
    const features = generateFeaturesFromConfig({ autoRefreshHours: 12 }, 7, 'Days');
    assert.ok(features.includes('Auto-Refresh Every 12 Hours'));
  });

  it('does not add auto-refresh when 0', () => {
    const features = generateFeaturesFromConfig({}, 7, 'Days');
    assert.ok(!features.some(f => f.includes('Auto-Refresh')));
  });

  it('adds duration line', () => {
    const features = generateFeaturesFromConfig({}, 7, 'Days');
    assert.ok(features.includes('7 Days Promotion Period'));
  });

  it('combines multiple features', () => {
    const config = {
      feedPriority: 1,
      visibilityMultiplier: 2,
      highlightStyle: 'gold',
      crossCategoryReach: true,
      analyticsAccess: true,
      autoRefreshHours: 6,
    };
    const features = generateFeaturesFromConfig(config, 14, 'Days');
    assert.equal(features.length, 7);
  });
});
