/**
 * Admin Management — Validator Test Suite
 * ─────────────────────────────────────────
 * Industry-level tests for ALL admin management validators:
 *   - studentDirectoryValidator
 *   - businessDirectoryValidator
 *   - updateStatusValidator
 *   - addNoteValidator
 *   - sendWarningValidator
 *
 * Run: node --test tests/validators/adminManagement.validator.test.js
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { validationResult } from 'express-validator';
import { getError, getErrorWithQuery } from '../helpers/testUtils.js';
import {
  studentDirectoryValidator,
  businessDirectoryValidator,
  updateStatusValidator,
  addNoteValidator,
  sendWarningValidator,
} from '../../src/validators/adminManagement.validator.js';

// ═══════════════════════════════════════════════════════════════════════════════
// studentDirectoryValidator
// ═══════════════════════════════════════════════════════════════════════════════

describe('studentDirectoryValidator', () => {
  it('accepts empty query (no filters)', async () => {
    assert.equal(await getErrorWithQuery(studentDirectoryValidator, {}), null);
  });

  it('accepts valid status filter: Active', async () => {
    assert.equal(await getErrorWithQuery(studentDirectoryValidator, { status: 'Active' }), null);
  });

  it('accepts valid status filter: Suspended', async () => {
    assert.equal(await getErrorWithQuery(studentDirectoryValidator, { status: 'Suspended' }), null);
  });

  it('accepts status filter: all', async () => {
    assert.equal(await getErrorWithQuery(studentDirectoryValidator, { status: 'all' }), null);
  });

  it('accepts lowercase status: active', async () => {
    assert.equal(await getErrorWithQuery(studentDirectoryValidator, { status: 'active' }), null);
  });

  it('accepts lowercase status: suspended', async () => {
    assert.equal(await getErrorWithQuery(studentDirectoryValidator, { status: 'suspended' }), null);
  });

  it('rejects invalid status', async () => {
    const err = await getErrorWithQuery(studentDirectoryValidator, { status: 'Banned' });
    assert.match(err, /Invalid status/);
  });

  it('accepts faculty filter', async () => {
    assert.equal(await getErrorWithQuery(studentDirectoryValidator, { faculty: 'Engineering' }), null);
  });

  it('accepts search query', async () => {
    assert.equal(await getErrorWithQuery(studentDirectoryValidator, { search: 'john' }), null);
  });

  it('accepts combined filters', async () => {
    assert.equal(await getErrorWithQuery(studentDirectoryValidator, {
      status: 'Active', faculty: 'IT', search: 'smith'
    }), null);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// businessDirectoryValidator
// ═══════════════════════════════════════════════════════════════════════════════

describe('businessDirectoryValidator', () => {
  it('accepts empty query', async () => {
    assert.equal(await getErrorWithQuery(businessDirectoryValidator, {}), null);
  });

  it('accepts valid status: Active', async () => {
    assert.equal(await getErrorWithQuery(businessDirectoryValidator, { status: 'Active' }), null);
  });

  it('accepts status: all', async () => {
    assert.equal(await getErrorWithQuery(businessDirectoryValidator, { status: 'all' }), null);
  });

  it('rejects invalid status', async () => {
    const err = await getErrorWithQuery(businessDirectoryValidator, { status: 'Deleted' });
    assert.match(err, /Invalid status/);
  });

  it('accepts category filter', async () => {
    assert.equal(await getErrorWithQuery(businessDirectoryValidator, { category: 'Food & Cafe' }), null);
  });

  it('accepts search query', async () => {
    assert.equal(await getErrorWithQuery(businessDirectoryValidator, { search: 'pizza' }), null);
  });

  it('accepts combined filters', async () => {
    assert.equal(await getErrorWithQuery(businessDirectoryValidator, {
      status: 'Suspended', category: 'Boarding', search: 'near campus'
    }), null);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// updateStatusValidator
// ═══════════════════════════════════════════════════════════════════════════════

describe('updateStatusValidator', () => {
  // ── Happy paths ────────────────────────────────────────────────────────────

  it('accepts valid suspension request', async () => {
    const err = await getError(updateStatusValidator, {
      status: 'Suspended',
      reason: 'Policy violation',
      suspensionCategory: 'Violation of Terms',
      sendEmail: true,
    }, { id: '1' });
    assert.equal(err, null);
  });

  it('accepts Active status without optional fields', async () => {
    const err = await getError(updateStatusValidator, { status: 'Active' }, { id: '5' });
    assert.equal(err, null);
  });

  it('accepts Inactive status', async () => {
    const err = await getError(updateStatusValidator, { status: 'Inactive' }, { id: '5' });
    assert.equal(err, null);
  });

  // ── Status validation ─────────────────────────────────────────────────────

  it('rejects missing status', async () => {
    const err = await getError(updateStatusValidator, {}, { id: '1' });
    assert.match(err, /Status/);
  });

  it('rejects invalid status value', async () => {
    const err = await getError(updateStatusValidator, { status: 'Banned' }, { id: '1' });
    assert.match(err, /Invalid status/);
  });

  it('rejects empty string status', async () => {
    const err = await getError(updateStatusValidator, { status: '' }, { id: '1' });
    assert.ok(err);
  });

  // ── ID validation ─────────────────────────────────────────────────────────

  it('rejects non-integer id param', async () => {
    const err = await getError(updateStatusValidator, { status: 'Active' }, { id: 'abc' });
    assert.match(err, /integer/i);
  });

  it('rejects missing id param', async () => {
    const err = await getError(updateStatusValidator, { status: 'Active' }, {});
    assert.ok(err);
  });

  // ── Suspension category ───────────────────────────────────────────────────

  it('rejects invalid suspension category', async () => {
    const err = await getError(updateStatusValidator, {
      status: 'Suspended', suspensionCategory: 'Bad Behavior',
    }, { id: '1' });
    assert.match(err, /Invalid suspension category/);
  });

  it('accepts all valid suspension categories', async () => {
    const valid = ['Violation of Terms', 'Spam Activity', 'Harassment', 'Non-payment'];
    for (const category of valid) {
      const err = await getError(updateStatusValidator, {
        status: 'Suspended', suspensionCategory: category,
      }, { id: '1' });
      assert.equal(err, null, `Expected '${category}' to be valid`);
    }
  });

  // ── sendEmail ─────────────────────────────────────────────────────────────

  it('rejects non-boolean sendEmail', async () => {
    const err = await getError(updateStatusValidator, {
      status: 'Active', sendEmail: 'yes',
    }, { id: '1' });
    assert.match(err, /boolean/i);
  });

  it('accepts sendEmail=false', async () => {
    const err = await getError(updateStatusValidator, {
      status: 'Suspended', sendEmail: false,
    }, { id: '1' });
    assert.equal(err, null);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// addNoteValidator
// ═══════════════════════════════════════════════════════════════════════════════

describe('addNoteValidator', () => {
  it('accepts valid note', async () => {
    const err = await getError(addNoteValidator, { text: 'Student needs follow-up.' }, { id: '7' });
    assert.equal(err, null);
  });

  it('accepts long note (within limit)', async () => {
    const err = await getError(addNoteValidator, { text: 'x'.repeat(2000) }, { id: '1' });
    assert.equal(err, null);
  });

  it('rejects empty text', async () => {
    const err = await getError(addNoteValidator, { text: '' }, { id: '1' });
    assert.ok(err);
  });

  it('rejects missing text', async () => {
    const err = await getError(addNoteValidator, {}, { id: '1' });
    assert.match(err, /Note text/i);
  });

  it('rejects text over 2000 chars', async () => {
    const err = await getError(addNoteValidator, { text: 'x'.repeat(2001) }, { id: '1' });
    assert.ok(err);
  });

  it('rejects non-integer id', async () => {
    const err = await getError(addNoteValidator, { text: 'Some note' }, { id: 'abc' });
    assert.match(err, /integer/i);
  });

  it('rejects missing id', async () => {
    const err = await getError(addNoteValidator, { text: 'Some note' }, {});
    assert.ok(err);
  });

  it('accepts note with special characters', async () => {
    const err = await getError(addNoteValidator, { text: 'Note with <html> & "special" chars ✅' }, { id: '1' });
    assert.equal(err, null);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// sendWarningValidator
// ═══════════════════════════════════════════════════════════════════════════════

describe('sendWarningValidator', () => {
  const validWarning = {
    message: 'This is a formal warning about your behavior on the platform.',
    category: 'Code of Conduct Violation',
    severity: 'Level 1 - Formal Caution',
  };

  // ── Happy paths ────────────────────────────────────────────────────────────

  it('accepts valid warning request', async () => {
    const err = await getError(sendWarningValidator, validWarning, { id: '1' });
    assert.equal(err, null);
  });

  // ── All valid violation categories ─────────────────────────────────────────

  it('accepts all valid violation categories', async () => {
    const valid = [
      'Academic Integrity Violation',
      'Code of Conduct Violation',
      'Harassment or Bullying',
      'Spam or Misuse',
      'Inappropriate Content',
    ];
    for (const category of valid) {
      const err = await getError(sendWarningValidator, {
        ...validWarning, category,
      }, { id: '1' });
      assert.equal(err, null, `Expected '${category}' to be valid`);
    }
  });

  // ── All valid severity levels ──────────────────────────────────────────────

  it('accepts all valid severity levels', async () => {
    const valid = [
      'Level 1 - Formal Caution',
      'Level 2 - Official Warning',
      'Level 3 - Severe Warning',
      'Level 4 - Final Warning',
    ];
    for (const severity of valid) {
      const err = await getError(sendWarningValidator, {
        ...validWarning, severity,
      }, { id: '1' });
      assert.equal(err, null, `Expected '${severity}' to be valid`);
    }
  });

  // ── Rejection cases ───────────────────────────────────────────────────────

  it('rejects invalid violation category', async () => {
    const err = await getError(sendWarningValidator, {
      ...validWarning, category: 'Bad Behavior',
    }, { id: '1' });
    assert.match(err, /Invalid violation category/);
  });

  it('rejects invalid severity level', async () => {
    const err = await getError(sendWarningValidator, {
      ...validWarning, severity: 'Level 5 - Super Serious',
    }, { id: '1' });
    assert.match(err, /Invalid severity level/);
  });

  it('rejects missing message', async () => {
    const err = await getError(sendWarningValidator, {
      category: 'Spam or Misuse', severity: 'Level 1 - Formal Caution',
    }, { id: '1' });
    assert.match(err, /Warning message/i);
  });

  it('rejects short warning message (< 5 chars)', async () => {
    const err = await getError(sendWarningValidator, {
      ...validWarning, message: 'Hi',
    }, { id: '1' });
    assert.ok(err);
  });

  it('accepts message at exactly 5 chars', async () => {
    const err = await getError(sendWarningValidator, {
      ...validWarning, message: 'Hello',
    }, { id: '1' });
    assert.equal(err, null);
  });

  it('rejects message over 1000 chars', async () => {
    const err = await getError(sendWarningValidator, {
      ...validWarning, message: 'x'.repeat(1001),
    }, { id: '1' });
    assert.ok(err);
  });

  it('accepts message at exactly 1000 chars', async () => {
    const err = await getError(sendWarningValidator, {
      ...validWarning, message: 'x'.repeat(1000),
    }, { id: '1' });
    assert.equal(err, null);
  });

  it('rejects missing category', async () => {
    const err = await getError(sendWarningValidator, {
      message: 'This is a formal warning.', severity: 'Level 1 - Formal Caution',
    }, { id: '1' });
    assert.match(err, /Violation category/i);
  });

  it('rejects missing severity', async () => {
    const err = await getError(sendWarningValidator, {
      message: 'This is a formal warning.', category: 'Spam or Misuse',
    }, { id: '1' });
    assert.match(err, /Severity level/i);
  });

  it('rejects non-integer user id', async () => {
    const err = await getError(sendWarningValidator, validWarning, { id: 'abc' });
    assert.match(err, /integer/i);
  });

  it('rejects missing user id', async () => {
    const err = await getError(sendWarningValidator, validWarning, {});
    assert.ok(err);
  });
});
