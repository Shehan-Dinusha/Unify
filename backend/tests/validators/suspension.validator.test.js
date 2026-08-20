/**
 * Suspension Backend — Validation Test Suite
 * Tests the express-validator logic for creating suspensions and reactivating users.
 * Uses Node.js built-in test runner.
 *
 * Run from backend/: node --test tests/suspension.test.js
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createSuspensionSchema, reactivateUserSchema } from '../../src/validators/suspension.validator.js';
import { getError } from '../helpers/testUtils.js';

// ═══════════════════════════════════════════════════════════════════════════════
// TESTS
// ═══════════════════════════════════════════════════════════════════════════════

// ── createSuspension ─────────────────────────────────────────────────────────

describe('createSuspensionSchema — Validation', () => {
  const validPayload = {
    userId: 10,
    reason: 'Repeated toxic behavior in chat',
    reasonTag: 'Harassment',
    severity: 'High',
    effectiveDate: new Date().toISOString()
  };

  it('accepts valid suspension data', async () => {
    const error = await getError(createSuspensionSchema, validPayload);
    assert.equal(error, null);
  });

  it('accepts valid suspension data with admin notes', async () => {
    const payload = { ...validPayload, adminNotes: 'Reviewed by admin team' };
    const error = await getError(createSuspensionSchema, payload);
    assert.equal(error, null);
  });

  // userId tests
  it('rejects missing userId', async () => {
    const { userId, ...payload } = validPayload;
    const error = await getError(createSuspensionSchema, payload);
    assert.ok(error.includes('User ID is required'));
  });

  it('rejects non-integer userId', async () => {
    const payload = { ...validPayload, userId: 'abc' };
    const error = await getError(createSuspensionSchema, payload);
    assert.ok(error.includes('User ID must be an integer'));
  });

  // reason tests
  it('rejects missing reason', async () => {
    const { reason, ...payload } = validPayload;
    const error = await getError(createSuspensionSchema, payload);
    assert.ok(error.includes('Reason is required'));
  });

  it('rejects empty string reason', async () => {
    const payload = { ...validPayload, reason: '' };
    const error = await getError(createSuspensionSchema, payload);
    assert.ok(error.includes('Reason is required') || error.includes('not allowed to be empty') || error.includes('Reason must be a string'));
  });

  // reasonTag tests
  it('rejects missing reasonTag', async () => {
    const { reasonTag, ...payload } = validPayload;
    const error = await getError(createSuspensionSchema, payload);
    assert.ok(error.includes('Reason tag is required'));
  });

  it('rejects invalid reasonTag', async () => {
    const payload = { ...validPayload, reasonTag: 'Invalid Tag' };
    const error = await getError(createSuspensionSchema, payload);
    assert.ok(error.includes('Invalid reason tag'));
  });

  it('accepts all valid reasonTags', async () => {
    const tags = ['ToS Violation', 'Payment Failure', 'Suspicious Activity', 'Harassment'];
    for (const tag of tags) {
      const payload = { ...validPayload, reasonTag: tag };
      assert.equal(await getError(createSuspensionSchema, payload), null);
    }
  });

  // severity tests
  it('rejects missing severity', async () => {
    const { severity, ...payload } = validPayload;
    const error = await getError(createSuspensionSchema, payload);
    assert.ok(error.includes('Severity is required'));
  });

  it('rejects invalid severity', async () => {
    const payload = { ...validPayload, severity: 'Extreme' };
    const error = await getError(createSuspensionSchema, payload);
    assert.ok(error.includes('Invalid severity'));
  });

  it('accepts all valid severities', async () => {
    const severities = ['Critical', 'High', 'Medium', 'Low'];
    for (const severity of severities) {
      const payload = { ...validPayload, severity: severity };
      assert.equal(await getError(createSuspensionSchema, payload), null);
    }
  });

  // effectiveDate tests
  it('rejects missing effectiveDate', async () => {
    const { effectiveDate, ...payload } = validPayload;
    const error = await getError(createSuspensionSchema, payload);
    assert.ok(error.includes('Effective date is required'));
  });

  it('rejects invalid effectiveDate', async () => {
    const payload = { ...validPayload, effectiveDate: 'not-a-date' };
    const error = await getError(createSuspensionSchema, payload);
    assert.ok(error.includes('Invalid effective date'));
  });
});

// ── reactivateUser ───────────────────────────────────────────────────────────

describe('reactivateUserSchema — Validation', () => {
  const validPayload = {
    identityVerificationComplete: true,
    securityAuditPassed: true
  };

  it('accepts valid reactivation data', async () => {
    const error = await getError(reactivateUserSchema, validPayload);
    assert.equal(error, null);
  });

  it('accepts valid reactivation data with notes', async () => {
    const payload = { ...validPayload, reactivationNotes: 'All good' };
    const error = await getError(reactivateUserSchema, payload);
    assert.equal(error, null);
  });

  // identityVerificationComplete tests
  it('rejects missing identityVerificationComplete', async () => {
    const { identityVerificationComplete, ...payload } = validPayload;
    const error = await getError(reactivateUserSchema, payload);
    assert.ok(error.includes('Identity verification status is required'));
  });

  it('rejects false identityVerificationComplete', async () => {
    const payload = { ...validPayload, identityVerificationComplete: false };
    const error = await getError(reactivateUserSchema, payload);
    assert.ok(error.includes('Identity verification must be completed'));
  });

  // securityAuditPassed tests
  it('rejects missing securityAuditPassed', async () => {
    const { securityAuditPassed, ...payload } = validPayload;
    const error = await getError(reactivateUserSchema, payload);
    assert.ok(error.includes('Security audit status is required'));
  });

  it('rejects false securityAuditPassed', async () => {
    const payload = { ...validPayload, securityAuditPassed: false };
    const error = await getError(reactivateUserSchema, payload);
    assert.ok(error.includes('Security audit must be passed'));
  });
});
