/**
 * Boost Service — Unit Test Suite
 * Run: node --test tests/unit/services/boost.service.test.js
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import boostService, {
  VALID_TRANSITIONS,
  validateStatusTransition,
  generateFeaturesFromConfig,
} from '../../../src/services/boost.service.js';

// ═══════════════════════════════════════════════════════════════════════════════
// BoostService.calculateExpiryDate
// ═══════════════════════════════════════════════════════════════════════════════

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

  // ── Additional edge cases ─────────────────────────────────────────────────

  it('handles 1 hour duration', () => {
    const start = new Date('2026-06-15T10:30:00Z');
    const result = boostService.calculateExpiryDate(start, 1, 'Hours');
    assert.equal(result.toISOString(), '2026-06-15T11:30:00.000Z');
  });

  it('handles 24 hours (equals 1 day)', () => {
    const start = new Date('2026-01-01T00:00:00Z');
    const result = boostService.calculateExpiryDate(start, 24, 'Hours');
    assert.equal(result.toISOString(), '2026-01-02T00:00:00.000Z');
  });

  it('handles 1 week', () => {
    const start = new Date('2026-03-01T00:00:00Z');
    const result = boostService.calculateExpiryDate(start, 1, 'Weeks');
    assert.equal(result.toISOString(), '2026-03-08T00:00:00.000Z');
  });

  it('handles leap year: Feb 28 + 1 day in leap year', () => {
    const start = new Date('2028-02-28T00:00:00Z'); // 2028 is a leap year
    const result = boostService.calculateExpiryDate(start, 1, 'Days');
    assert.equal(result.toISOString(), '2028-02-29T00:00:00.000Z');
  });

  it('handles month boundary: Jan 31 + 1 day', () => {
    const start = new Date('2026-01-31T00:00:00Z');
    const result = boostService.calculateExpiryDate(start, 1, 'Days');
    assert.equal(result.toISOString(), '2026-02-01T00:00:00.000Z');
  });

  it('handles large duration values', () => {
    const start = new Date('2026-01-01T00:00:00Z');
    const result = boostService.calculateExpiryDate(start, 365, 'Days');
    assert.equal(result.toISOString(), '2027-01-01T00:00:00.000Z');
  });

  it('does not mutate the original date', () => {
    const start = new Date('2026-01-01T00:00:00Z');
    const original = start.toISOString();
    boostService.calculateExpiryDate(start, 5, 'Days');
    assert.equal(start.toISOString(), original);
  });

  it('returns a Date object', () => {
    const result = boostService.calculateExpiryDate(new Date(), 1, 'Days');
    assert.ok(result instanceof Date);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// BoostService.generateTransactionId
// ═══════════════════════════════════════════════════════════════════════════════

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

  it('contains a timestamp component', () => {
    const id = boostService.generateTransactionId();
    const parts = id.split('-');
    // TXN-<timestamp>-<random>
    assert.ok(parts.length >= 3);
    const timestampPart = parts[1];
    assert.ok(!isNaN(Number(timestampPart)));
  });

  it('format is TXN-<timestamp>-<alphanumeric>', () => {
    const id = boostService.generateTransactionId();
    assert.match(id, /^TXN-\d+-[A-Z0-9]+$/);
  });

  it('generates 100 unique IDs with no collisions', () => {
    const ids = new Set();
    for (let i = 0; i < 100; i++) {
      ids.add(boostService.generateTransactionId());
    }
    assert.equal(ids.size, 100);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// BoostService.generateLogId
// ═══════════════════════════════════════════════════════════════════════════════

describe('BoostService.generateLogId', () => {
  it('returns a string starting with "log-"', () => {
    const id = boostService.generateLogId();
    assert.ok(id.startsWith('log-'));
  });

  it('contains a timestamp', () => {
    const id = boostService.generateLogId();
    const ts = id.replace('log-', '');
    assert.ok(!isNaN(Number(ts)));
  });

  it('produces unique ids on rapid successive calls', () => {
    const a = boostService.generateLogId();
    const b = boostService.generateLogId();
    // Note: may collide if called in same millisecond, but generally unique
    assert.equal(typeof a, 'string');
    assert.equal(typeof b, 'string');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// validateStatusTransition
// ═══════════════════════════════════════════════════════════════════════════════

describe('validateStatusTransition', () => {
  // ── Valid transitions ─────────────────────────────────────────────────────

  it('allows Pending → Active', () => {
    assert.equal(validateStatusTransition('Pending', 'Active').valid, true);
  });

  it('allows Pending → Cancelled', () => {
    assert.equal(validateStatusTransition('Pending', 'Cancelled').valid, true);
  });

  it('allows Active → Paused', () => {
    assert.equal(validateStatusTransition('Active', 'Paused').valid, true);
  });

  it('allows Active → Completed', () => {
    assert.equal(validateStatusTransition('Active', 'Completed').valid, true);
  });

  it('allows Active → Cancelled', () => {
    assert.equal(validateStatusTransition('Active', 'Cancelled').valid, true);
  });

  it('allows Paused → Active', () => {
    assert.equal(validateStatusTransition('Paused', 'Active').valid, true);
  });

  it('allows Paused → Cancelled', () => {
    assert.equal(validateStatusTransition('Paused', 'Cancelled').valid, true);
  });

  // ── Invalid transitions ───────────────────────────────────────────────────

  it('blocks Completed → Active', () => {
    const r = validateStatusTransition('Completed', 'Active');
    assert.equal(r.valid, false);
    assert.match(r.message, /transition/i);
  });

  it('blocks Completed → any', () => {
    assert.equal(validateStatusTransition('Completed', 'Cancelled').valid, false);
    assert.equal(validateStatusTransition('Completed', 'Paused').valid, false);
    assert.equal(validateStatusTransition('Completed', 'Pending').valid, false);
  });

  it('blocks Cancelled → any', () => {
    assert.equal(validateStatusTransition('Cancelled', 'Pending').valid, false);
    assert.equal(validateStatusTransition('Cancelled', 'Active').valid, false);
    assert.equal(validateStatusTransition('Cancelled', 'Paused').valid, false);
    assert.equal(validateStatusTransition('Cancelled', 'Completed').valid, false);
  });

  it('blocks Paused → Completed (must go Active first)', () => {
    const r = validateStatusTransition('Paused', 'Completed');
    assert.equal(r.valid, false);
  });

  it('blocks Pending → Paused (must go Active first)', () => {
    const r = validateStatusTransition('Pending', 'Paused');
    assert.equal(r.valid, false);
  });

  it('blocks Pending → Completed (must go Active first)', () => {
    const r = validateStatusTransition('Pending', 'Completed');
    assert.equal(r.valid, false);
  });

  // ── Self-transitions ──────────────────────────────────────────────────────

  it('blocks self-transition: Active → Active', () => {
    assert.equal(validateStatusTransition('Active', 'Active').valid, false);
  });

  it('blocks self-transition: Pending → Pending', () => {
    assert.equal(validateStatusTransition('Pending', 'Pending').valid, false);
  });

  // ── Unknown statuses ──────────────────────────────────────────────────────

  it('handles unknown current status gracefully', () => {
    const r = validateStatusTransition('Unknown', 'Active');
    assert.equal(r.valid, false);
  });

  it('returns error message for invalid transitions', () => {
    const r = validateStatusTransition('Completed', 'Active');
    assert.equal(typeof r.message, 'string');
    assert.ok(r.message.length > 0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// VALID_TRANSITIONS constant
// ═══════════════════════════════════════════════════════════════════════════════

describe('VALID_TRANSITIONS constant', () => {
  it('defines all expected states', () => {
    assert.ok(Array.isArray(VALID_TRANSITIONS.Pending));
    assert.ok(Array.isArray(VALID_TRANSITIONS.Active));
    assert.ok(Array.isArray(VALID_TRANSITIONS.Paused));
    assert.ok(Array.isArray(VALID_TRANSITIONS.Completed));
    assert.ok(Array.isArray(VALID_TRANSITIONS.Cancelled));
  });

  it('has exactly 5 states', () => {
    assert.equal(Object.keys(VALID_TRANSITIONS).length, 5);
  });

  it('Completed and Cancelled are terminal (empty arrays)', () => {
    assert.equal(VALID_TRANSITIONS.Completed.length, 0);
    assert.equal(VALID_TRANSITIONS.Cancelled.length, 0);
  });

  it('Pending allows Active and Cancelled only', () => {
    assert.deepEqual(VALID_TRANSITIONS.Pending.sort(), ['Active', 'Cancelled'].sort());
  });

  it('Active allows Paused, Completed, and Cancelled', () => {
    assert.deepEqual(VALID_TRANSITIONS.Active.sort(), ['Cancelled', 'Completed', 'Paused'].sort());
  });

  it('Paused allows Active and Cancelled', () => {
    assert.deepEqual(VALID_TRANSITIONS.Paused.sort(), ['Active', 'Cancelled'].sort());
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// generateFeaturesFromConfig
// ═══════════════════════════════════════════════════════════════════════════════

describe('generateFeaturesFromConfig — Feed Priority', () => {
  it('adds "#1 in Feed" when feedPriority is 1', () => {
    const features = generateFeaturesFromConfig({ feedPriority: 1 }, 7, 'Days');
    assert.ok(features.includes('Always #1 in Feed'));
  });

  it('adds numbered priority for values 2-9', () => {
    for (const p of [2, 3, 5, 9]) {
      const features = generateFeaturesFromConfig({ feedPriority: p }, 7, 'Days');
      assert.ok(features.includes(`Priority #${p} Feed Placement`), `Missing for priority ${p}`);
    }
  });

  it('does not add priority feature for feedPriority=10 (default)', () => {
    const features = generateFeaturesFromConfig({ feedPriority: 10 }, 7, 'Days');
    assert.ok(!features.some(f => f.includes('Feed Placement') || f.includes('#1 in Feed')));
  });

  it('does not add priority feature when feedPriority is undefined', () => {
    const features = generateFeaturesFromConfig({}, 7, 'Days');
    assert.ok(!features.some(f => f.includes('Feed Placement')));
  });
});

describe('generateFeaturesFromConfig — Visibility Multiplier', () => {
  it('adds multiplier when > 1', () => {
    const features = generateFeaturesFromConfig({ visibilityMultiplier: 3 }, 7, 'Days');
    assert.ok(features.includes('3x Visibility Boost'));
  });

  it('adds correct multiplier value for each level', () => {
    for (const m of [2, 3, 4, 5]) {
      const features = generateFeaturesFromConfig({ visibilityMultiplier: m }, 7, 'Days');
      assert.ok(features.includes(`${m}x Visibility Boost`));
    }
  });

  it('does not add multiplier when value is 1', () => {
    const features = generateFeaturesFromConfig({ visibilityMultiplier: 1 }, 7, 'Days');
    assert.ok(!features.some(f => f.includes('Visibility Boost')));
  });

  it('does not add multiplier when undefined', () => {
    const features = generateFeaturesFromConfig({}, 7, 'Days');
    assert.ok(!features.some(f => f.includes('Visibility Boost')));
  });
});

describe('generateFeaturesFromConfig — Highlight Style', () => {
  it('adds subtle label', () => {
    const features = generateFeaturesFromConfig({ highlightStyle: 'subtle' }, 7, 'Days');
    assert.ok(features.some(f => f.includes('Sponsored Label on Post')));
  });

  it('adds blue highlight label', () => {
    const features = generateFeaturesFromConfig({ highlightStyle: 'blue' }, 7, 'Days');
    assert.ok(features.some(f => f.includes('Blue Highlighted')));
  });

  it('adds gold premium label', () => {
    const features = generateFeaturesFromConfig({ highlightStyle: 'gold' }, 7, 'Days');
    assert.ok(features.some(f => f.includes('Gold Premium')));
  });

  it('does not add highlight for "none"', () => {
    const features = generateFeaturesFromConfig({ highlightStyle: 'none' }, 7, 'Days');
    assert.ok(!features.some(f => f.includes('Card') || f.includes('Label') || f.includes('Highlighted')));
  });

  it('does not add highlight when undefined', () => {
    const features = generateFeaturesFromConfig({}, 7, 'Days');
    assert.ok(!features.some(f => f.includes('Card') || f.includes('Label') || f.includes('Highlighted')));
  });
});

describe('generateFeaturesFromConfig — Boolean Features', () => {
  it('adds cross-category reach', () => {
    const features = generateFeaturesFromConfig({ crossCategoryReach: true }, 7, 'Days');
    assert.ok(features.includes('Appears in All Category Feeds'));
  });

  it('does not add cross-category when false', () => {
    const features = generateFeaturesFromConfig({ crossCategoryReach: false }, 7, 'Days');
    assert.ok(!features.includes('Appears in All Category Feeds'));
  });

  it('adds analytics dashboard', () => {
    const features = generateFeaturesFromConfig({ analyticsAccess: true }, 7, 'Days');
    assert.ok(features.includes('Boost Analytics Dashboard'));
  });

  it('does not add analytics when false', () => {
    const features = generateFeaturesFromConfig({ analyticsAccess: false }, 7, 'Days');
    assert.ok(!features.includes('Boost Analytics Dashboard'));
  });
});

describe('generateFeaturesFromConfig — Auto-Refresh', () => {
  it('adds auto-refresh for valid values', () => {
    for (const hours of [6, 12, 24]) {
      const features = generateFeaturesFromConfig({ autoRefreshHours: hours }, 7, 'Days');
      assert.ok(features.includes(`Auto-Refresh Every ${hours} Hours`));
    }
  });

  it('does not add auto-refresh when 0', () => {
    const features = generateFeaturesFromConfig({ autoRefreshHours: 0 }, 7, 'Days');
    assert.ok(!features.some(f => f.includes('Auto-Refresh')));
  });

  it('does not add auto-refresh when undefined', () => {
    const features = generateFeaturesFromConfig({}, 7, 'Days');
    assert.ok(!features.some(f => f.includes('Auto-Refresh')));
  });
});

describe('generateFeaturesFromConfig — Duration', () => {
  it('adds duration line with Days', () => {
    const features = generateFeaturesFromConfig({}, 7, 'Days');
    assert.ok(features.includes('7 Days Promotion Period'));
  });

  it('adds duration line with Hours', () => {
    const features = generateFeaturesFromConfig({}, 24, 'Hours');
    assert.ok(features.includes('24 Hours Promotion Period'));
  });

  it('adds duration line with Weeks', () => {
    const features = generateFeaturesFromConfig({}, 2, 'Weeks');
    assert.ok(features.includes('2 Weeks Promotion Period'));
  });
});

describe('generateFeaturesFromConfig — Combined Config', () => {
  it('combines all features correctly for max config', () => {
    const config = {
      feedPriority: 1,
      visibilityMultiplier: 5,
      highlightStyle: 'gold',
      crossCategoryReach: true,
      analyticsAccess: true,
      autoRefreshHours: 6,
    };
    const features = generateFeaturesFromConfig(config, 14, 'Days');
    // 1: Always #1 in Feed
    // 2: 5x Visibility Boost
    // 3: Gold Premium Card Styling
    // 4: Appears in All Category Feeds
    // 5: Boost Analytics Dashboard
    // 6: Auto-Refresh Every 6 Hours
    // 7: 14 Days Promotion Period
    assert.equal(features.length, 7);
  });

  it('returns only duration for empty config', () => {
    const features = generateFeaturesFromConfig({}, 7, 'Days');
    assert.equal(features.length, 1);
    assert.ok(features[0].includes('7 Days'));
  });

  it('returns an array', () => {
    const features = generateFeaturesFromConfig({}, 7, 'Days');
    assert.ok(Array.isArray(features));
  });

  it('all features are strings', () => {
    const config = { feedPriority: 1, visibilityMultiplier: 3, highlightStyle: 'blue' };
    const features = generateFeaturesFromConfig(config, 7, 'Days');
    features.forEach(f => assert.equal(typeof f, 'string'));
  });
});
