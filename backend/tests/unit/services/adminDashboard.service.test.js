/**
 * Admin Dashboard Service — Unit Test Suite (Enhanced)
 * ─────────────────────────────────────────────────────
 * Industry-level tests for ALL pure functions exported from adminDashboard.service.js.
 * Tests pure helpers only (no DB calls).
 *
 * Run: node --test tests/unit/services/adminDashboard.service.test.js
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  formatStudentForDirectory,
  isStatusChangeRedundant,
  canForceLogout,
  canSendWarning,
} from '../../../src/services/adminDashboard.service.js';

// ═══════════════════════════════════════════════════════════════════════════════
// formatStudentForDirectory
// ═══════════════════════════════════════════════════════════════════════════════

describe('formatStudentForDirectory', () => {
  // ── Standard cases ─────────────────────────────────────────────────────────

  it('formats a student with all fields', () => {
    const user = { id: 1, name: 'Alex Johnson', status: 'Active', lastActive: new Date() };
    const faculty = { name: 'Faculty of Engineering' };
    const formatted = formatStudentForDirectory(user, faculty);

    assert.equal(formatted.id, 1);
    assert.equal(formatted.name, 'Alex Johnson');
    assert.equal(formatted.status, 'Active');
    assert.equal(formatted.faculty, 'Faculty of Engineering');
    assert.equal(formatted.lastActive, 'a few seconds ago');
  });

  it('handles null faculty', () => {
    const user = { id: 2, name: 'New User', status: 'Active', lastActive: null };
    const formatted = formatStudentForDirectory(user, null);

    assert.equal(formatted.faculty, 'Unknown');
    assert.equal(formatted.lastActive, 'Never');
  });

  it('handles faculty with no name', () => {
    const user = { id: 3, name: 'Jane', status: 'Suspended', lastActive: new Date() };
    const formatted = formatStudentForDirectory(user, {});

    assert.equal(formatted.faculty, 'Unknown');
  });

  // ── Edge cases ─────────────────────────────────────────────────────────────

  it('handles undefined faculty', () => {
    const user = { id: 4, name: 'Test', status: 'Active', lastActive: null };
    const formatted = formatStudentForDirectory(user, undefined);

    assert.equal(formatted.faculty, 'Unknown');
    assert.equal(formatted.lastActive, 'Never');
  });

  it('handles empty name', () => {
    const user = { id: 5, name: '', status: 'Active', lastActive: new Date() };
    const faculty = { name: 'Science' };
    const formatted = formatStudentForDirectory(user, faculty);

    assert.equal(formatted.name, '');
    assert.equal(formatted.faculty, 'Science');
  });

  it('handles special characters in name', () => {
    const user = { id: 6, name: "O'Brien-Smith", status: 'Active', lastActive: new Date() };
    const formatted = formatStudentForDirectory(user, { name: 'Arts & Design' });

    assert.equal(formatted.name, "O'Brien-Smith");
    assert.equal(formatted.faculty, 'Arts & Design');
  });

  it('preserves user ID as-is', () => {
    const user = { id: 999999, name: 'Big ID', status: 'Active', lastActive: null };
    const formatted = formatStudentForDirectory(user, null);

    assert.equal(formatted.id, 999999);
  });

  it('formats lastActive for old dates', () => {
    const oldDate = new Date('2020-01-01T00:00:00Z');
    const user = { id: 7, name: 'Old User', status: 'Active', lastActive: oldDate };
    const formatted = formatStudentForDirectory(user, null);

    // Should be a relative time string like "6 years ago"
    assert.ok(typeof formatted.lastActive === 'string');
    assert.notEqual(formatted.lastActive, 'Never');
    assert.ok(formatted.lastActive.includes('ago'));
  });

  it('returns all expected keys', () => {
    const user = { id: 1, name: 'Test', status: 'Active', lastActive: null };
    const formatted = formatStudentForDirectory(user, null);
    const keys = Object.keys(formatted);

    assert.ok(keys.includes('id'));
    assert.ok(keys.includes('name'));
    assert.ok(keys.includes('status'));
    assert.ok(keys.includes('faculty'));
    assert.ok(keys.includes('lastActive'));
    assert.equal(keys.length, 5);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// isStatusChangeRedundant
// ═══════════════════════════════════════════════════════════════════════════════

describe('isStatusChangeRedundant', () => {
  it('returns true when status is unchanged: Suspended → Suspended', () => {
    assert.equal(isStatusChangeRedundant('Suspended', 'Suspended'), true);
  });

  it('returns true when status is unchanged: Active → Active', () => {
    assert.equal(isStatusChangeRedundant('Active', 'Active'), true);
  });

  it('returns false when status changes: Active → Suspended', () => {
    assert.equal(isStatusChangeRedundant('Active', 'Suspended'), false);
  });

  it('returns false when status changes: Suspended → Active', () => {
    assert.equal(isStatusChangeRedundant('Suspended', 'Active'), false);
  });

  it('returns false for different statuses', () => {
    assert.equal(isStatusChangeRedundant('Active', 'Inactive'), false);
  });

  it('is case-sensitive: "active" ≠ "Active"', () => {
    assert.equal(isStatusChangeRedundant('active', 'Active'), false);
  });

  it('handles empty string comparison', () => {
    assert.equal(isStatusChangeRedundant('', ''), true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// canForceLogout
// ═══════════════════════════════════════════════════════════════════════════════

describe('canForceLogout', () => {
  it('returns true when user is online (boolean true)', () => {
    assert.equal(canForceLogout(true), true);
  });

  it('returns false when user is offline (boolean false)', () => {
    assert.equal(canForceLogout(false), false);
  });

  it('returns false for null', () => {
    assert.equal(canForceLogout(null), false);
  });

  it('returns false for undefined', () => {
    assert.equal(canForceLogout(undefined), false);
  });

  it('returns false for truthy non-boolean: 1', () => {
    assert.equal(canForceLogout(1), false);
  });

  it('returns false for truthy non-boolean: "online"', () => {
    assert.equal(canForceLogout('online'), false);
  });

  it('returns false for 0', () => {
    assert.equal(canForceLogout(0), false);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// canSendWarning
// ═══════════════════════════════════════════════════════════════════════════════

describe('canSendWarning', () => {
  it('returns true for Active students', () => {
    assert.equal(canSendWarning('Active'), true);
  });

  it('returns false for Suspended students', () => {
    assert.equal(canSendWarning('Suspended'), false);
  });

  it('returns true for Inactive status', () => {
    assert.equal(canSendWarning('Inactive'), true);
  });

  it('returns true for unknown status', () => {
    assert.equal(canSendWarning('SomeOtherStatus'), true);
  });

  it('returns true for null (not "Suspended")', () => {
    assert.equal(canSendWarning(null), true);
  });

  it('returns true for undefined', () => {
    assert.equal(canSendWarning(undefined), true);
  });

  it('returns true for empty string', () => {
    assert.equal(canSendWarning(''), true);
  });

  it('is case-sensitive: "suspended" (lowercase) returns true', () => {
    assert.equal(canSendWarning('suspended'), true);
  });
});
