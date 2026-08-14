/**
 * Report — Validator Test Suite (Enhanced)
 * ─────────────────────────────────────────
 * Industry-level tests for ALL report validators:
 *   - createReportSchema
 *   - updateReportSchema
 *   - withdrawReportSchema
 *
 * Run: node --test tests/validators/report.validator.test.js
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { getError, getErrorWithParams } from '../helpers/testUtils.js';
import {
  createReportSchema,
  updateReportSchema,
  withdrawReportSchema,
} from '../../src/validators/report.validator.js';

// ═══════════════════════════════════════════════════════════════════════════════
// createReportSchema
// ═══════════════════════════════════════════════════════════════════════════════

describe('createReportSchema — Happy Paths', () => {
  const valid = {
    reportType: 'post',
    category: 'spam',
    reportedEntityId: '42',
  };

  it('accepts valid report with required fields only', async () => {
    assert.equal(await getError(createReportSchema, valid), null);
  });

  it('accepts with all optional fields', async () => {
    assert.equal(await getError(createReportSchema, {
      ...valid,
      additionalDetails: 'This post is clearly spam',
      evidenceUrl: 'https://example.com/evidence.png',
    }), null);
  });
});

describe('createReportSchema — reportType Validation', () => {
  const base = { category: 'spam', reportedEntityId: '42' };

  it('accepts all valid reportTypes', async () => {
    for (const reportType of ['post', 'comment', 'user']) {
      const err = await getError(createReportSchema, { ...base, reportType });
      assert.equal(err, null, `Expected reportType '${reportType}' to be valid`);
    }
  });

  it('rejects invalid reportType', async () => {
    const err = await getError(createReportSchema, { ...base, reportType: 'message' });
    assert.match(err, /report type/i);
  });

  it('rejects missing reportType', async () => {
    const err = await getError(createReportSchema, base);
    assert.match(err, /report type/i);
  });

  it('rejects empty string reportType', async () => {
    const err = await getError(createReportSchema, { ...base, reportType: '' });
    assert.match(err, /report type/i);
  });
});

describe('createReportSchema — category Validation', () => {
  const base = { reportType: 'post', reportedEntityId: '42' };

  it('accepts all valid categories', async () => {
    for (const category of ['inappropriate', 'spam', 'harassment', 'misinformation', 'other']) {
      const err = await getError(createReportSchema, { ...base, category });
      assert.equal(err, null, `Expected category '${category}' to be valid`);
    }
  });

  it('rejects invalid category', async () => {
    const err = await getError(createReportSchema, { ...base, category: 'bullying' });
    assert.match(err, /category/i);
  });

  it('rejects missing category', async () => {
    const err = await getError(createReportSchema, { reportType: 'post', reportedEntityId: '42' });
    assert.match(err, /category/i);
  });
});

describe('createReportSchema — reportedEntityId Validation', () => {
  it('rejects missing reportedEntityId', async () => {
    const err = await getError(createReportSchema, { reportType: 'post', category: 'spam' });
    assert.match(err, /id/i);
  });

  it('accepts string reportedEntityId', async () => {
    const err = await getError(createReportSchema, {
      reportType: 'post', category: 'spam', reportedEntityId: 'abc-123',
    });
    assert.equal(err, null);
  });

  it('accepts numeric reportedEntityId', async () => {
    const err = await getError(createReportSchema, {
      reportType: 'post', category: 'spam', reportedEntityId: '999',
    });
    assert.equal(err, null);
  });
});

describe('createReportSchema — Optional Fields', () => {
  const valid = { reportType: 'post', category: 'spam', reportedEntityId: '42' };

  it('accepts additionalDetails within limit', async () => {
    const err = await getError(createReportSchema, { ...valid, additionalDetails: 'Some details here' });
    assert.equal(err, null);
  });

  it('rejects additionalDetails over 5000 chars', async () => {
    const err = await getError(createReportSchema, { ...valid, additionalDetails: 'x'.repeat(5001) });
    assert.match(err, /5000/);
  });

  it('accepts additionalDetails at exactly 5000 chars', async () => {
    const err = await getError(createReportSchema, { ...valid, additionalDetails: 'x'.repeat(5000) });
    assert.equal(err, null);
  });

  it('rejects invalid evidenceUrl', async () => {
    const err = await getError(createReportSchema, { ...valid, evidenceUrl: 'not-a-url' });
    assert.match(err, /URL|link/i);
  });

  it('accepts valid evidenceUrl', async () => {
    const err = await getError(createReportSchema, { ...valid, evidenceUrl: 'https://cdn.unify.lk/screenshot.png' });
    assert.equal(err, null);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// updateReportSchema
// ═══════════════════════════════════════════════════════════════════════════════

describe('updateReportSchema — Status Updates', () => {
  it('accepts all valid statuses', async () => {
    for (const status of ['Pending Review', 'In Progress', 'Resolved', 'Dismissed']) {
      const err = await getErrorWithParams(updateReportSchema, { id: '1' }, { status });
      assert.equal(err, null, `Expected status '${status}' to be valid`);
    }
  });

  it('rejects invalid status', async () => {
    const err = await getErrorWithParams(updateReportSchema, { id: '1' }, { status: 'Deleted' });
    assert.ok(err);
  });
});

describe('updateReportSchema — Priority Updates', () => {
  it('accepts all valid priorities', async () => {
    for (const priority of ['Low', 'Medium', 'High', 'Critical']) {
      const err = await getErrorWithParams(updateReportSchema, { id: '1' }, { priority });
      assert.equal(err, null, `Expected priority '${priority}' to be valid`);
    }
  });

  it('rejects invalid priority', async () => {
    const err = await getErrorWithParams(updateReportSchema, { id: '1' }, { priority: 'Urgent' });
    assert.ok(err);
  });
});

describe('updateReportSchema — Action Moderation', () => {
  it('accepts all valid actions', async () => {
    for (const action of ['dismiss', 'resolve', 'delete_post', 'suspend_user', 'add_note']) {
      // dismiss and suspend_user need reason, others don't
      const body = ['dismiss', 'suspend_user'].includes(action)
        ? { action, reason: 'Valid reason for action' }
        : { action };
      const err = await getErrorWithParams(updateReportSchema, { id: '1' }, body);
      assert.equal(err, null, `Expected action '${action}' to be valid`);
    }
  });

  it('rejects invalid action', async () => {
    const err = await getErrorWithParams(updateReportSchema, { id: '1' }, { action: 'ban_user' });
    assert.ok(err);
  });

  it('rejects dismiss without reason', async () => {
    const err = await getErrorWithParams(updateReportSchema, { id: '1' }, { action: 'dismiss' });
    assert.ok(err);
  });

  it('rejects suspend_user without reason', async () => {
    const err = await getErrorWithParams(updateReportSchema, { id: '1' }, { action: 'suspend_user' });
    assert.ok(err);
  });

  it('accepts resolve without reason (not required)', async () => {
    const err = await getErrorWithParams(updateReportSchema, { id: '1' }, { action: 'resolve' });
    assert.equal(err, null);
  });

  it('accepts delete_post without reason', async () => {
    const err = await getErrorWithParams(updateReportSchema, { id: '1' }, { action: 'delete_post' });
    assert.equal(err, null);
  });

  it('accepts add_note without reason', async () => {
    const err = await getErrorWithParams(updateReportSchema, { id: '1' }, { action: 'add_note' });
    assert.equal(err, null);
  });
});

describe('updateReportSchema — ID Validation', () => {
  it('accepts numeric id', async () => {
    const err = await getErrorWithParams(updateReportSchema, { id: '5' }, { status: 'In Progress' });
    assert.equal(err, null);
  });

  it('accepts string reportId', async () => {
    const err = await getErrorWithParams(updateReportSchema, { id: '#RPT-20260421-ABCD' }, { status: 'In Progress' });
    assert.equal(err, null);
  });

  it('rejects missing id', async () => {
    const err = await getErrorWithParams(updateReportSchema, {}, { status: 'In Progress' });
    assert.ok(err);
  });
});

describe('updateReportSchema — Combined Updates', () => {
  it('accepts status + priority update', async () => {
    const err = await getErrorWithParams(updateReportSchema, { id: '1' }, {
      status: 'In Progress', priority: 'High',
    });
    assert.equal(err, null);
  });

  it('accepts action with reason', async () => {
    const err = await getErrorWithParams(updateReportSchema, { id: '1' }, {
      action: 'dismiss', reason: 'No violation found after investigation',
    });
    assert.equal(err, null);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// withdrawReportSchema
// ═══════════════════════════════════════════════════════════════════════════════

describe('withdrawReportSchema', () => {
  it('accepts valid withdrawal', async () => {
    const err = await getErrorWithParams(withdrawReportSchema, { id: '3' }, { reason: 'Resolved with the other party' });
    assert.equal(err, null);
  });

  it('rejects missing reason', async () => {
    const err = await getErrorWithParams(withdrawReportSchema, { id: '3' }, {});
    assert.ok(err);
  });

  it('rejects empty reason', async () => {
    const err = await getErrorWithParams(withdrawReportSchema, { id: '3' }, { reason: '' });
    assert.ok(err);
  });

  it('rejects reason shorter than 5 chars (boundary: 4 chars fails)', async () => {
    const err = await getErrorWithParams(withdrawReportSchema, { id: '3' }, { reason: 'Done' });
    assert.ok(err);
  });

  it('accepts reason at exactly 5 chars (boundary pass)', async () => {
    const err = await getErrorWithParams(withdrawReportSchema, { id: '3' }, { reason: 'Fixed' });
    assert.equal(err, null);
  });

  it('rejects reason shorter than 5 chars: 2 chars', async () => {
    const err = await getErrorWithParams(withdrawReportSchema, { id: '3' }, { reason: 'Ok' });
    assert.ok(err);
  });

  it('accepts long reason', async () => {
    const err = await getErrorWithParams(withdrawReportSchema, { id: '3' }, {
      reason: 'I spoke with the person who posted the content and they agreed to remove it. The issue has been resolved mutually.',
    });
    assert.equal(err, null);
  });

  it('rejects missing id', async () => {
    const err = await getErrorWithParams(withdrawReportSchema, {}, { reason: 'Resolved privately' });
    assert.ok(err);
  });
});
