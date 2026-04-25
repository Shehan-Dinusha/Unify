/**
 * Suspension Backend — Validation Test Suite
 * Tests the Joi validation logic for creating suspensions and reactivating users.
 * Uses Node.js built-in test runner — zero dependencies.
 *
 * Run from backend/: node --test tests/suspension.test.js
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createSuspensionSchema, reactivateUserSchema } from '../src/controllers/suspension/suspension.validator.js';

// Helper to extract error message
const getError = (schema, data) => {
  const { error } = schema.validate(data, { abortEarly: false });
  return error ? error.details.map(d => d.message).join(", ") : null;
};

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

  it('accepts valid suspension data', () => {
    const error = getError(createSuspensionSchema, validPayload);
    assert.equal(error, null);
  });

  it('accepts valid suspension data with admin notes', () => {
    const payload = { ...validPayload, adminNotes: 'Reviewed by admin team' };
    const error = getError(createSuspensionSchema, payload);
    assert.equal(error, null);
  });

  // userId tests
  it('rejects missing userId', () => {
    const { userId, ...payload } = validPayload;
    const error = getError(createSuspensionSchema, payload);
    assert.ok(error.includes('User ID is required'));
  });

  it('rejects non-integer userId', () => {
    const payload = { ...validPayload, userId: 'abc' };
    const error = getError(createSuspensionSchema, payload);
    assert.ok(error.includes('User ID must be an integer'));
  });

  // reason tests
  it('rejects missing reason', () => {
    const { reason, ...payload } = validPayload;
    const error = getError(createSuspensionSchema, payload);
    assert.ok(error.includes('Reason is required'));
  });

  it('rejects empty string reason', () => {
    const payload = { ...validPayload, reason: '' };
    const error = getError(createSuspensionSchema, payload);
    assert.ok(error.includes('Reason is required') || error.includes('not allowed to be empty'));
  });

  // reasonTag tests
  it('rejects missing reasonTag', () => {
    const { reasonTag, ...payload } = validPayload;
    const error = getError(createSuspensionSchema, payload);
    assert.ok(error.includes('Reason tag is required'));
  });

  it('rejects invalid reasonTag', () => {
    const payload = { ...validPayload, reasonTag: 'Invalid Tag' };
    const error = getError(createSuspensionSchema, payload);
    assert.ok(error.includes('Invalid reason tag'));
  });

  it('accepts all valid reasonTags', () => {
    const tags = ['ToS Violation', 'Payment Failure', 'Suspicious Activity', 'Harassment'];
    for (const tag of tags) {
      const payload = { ...validPayload, reasonTag: tag };
      assert.equal(getError(createSuspensionSchema, payload), null);
    }
  });

  // severity tests
  it('rejects missing severity', () => {
    const { severity, ...payload } = validPayload;
    const error = getError(createSuspensionSchema, payload);
    assert.ok(error.includes('Severity is required'));
  });

  it('rejects invalid severity', () => {
    const payload = { ...validPayload, severity: 'Extreme' };
    const error = getError(createSuspensionSchema, payload);
    assert.ok(error.includes('Invalid severity'));
  });

  it('accepts all valid severities', () => {
    const severities = ['Critical', 'High', 'Medium', 'Low'];
    for (const severity of severities) {
      const payload = { ...validPayload, severity: severity };
      assert.equal(getError(createSuspensionSchema, payload), null);
    }
  });

  // effectiveDate tests
  it('rejects missing effectiveDate', () => {
    const { effectiveDate, ...payload } = validPayload;
    const error = getError(createSuspensionSchema, payload);
    assert.ok(error.includes('Effective date is required'));
  });

  it('rejects invalid effectiveDate', () => {
    const payload = { ...validPayload, effectiveDate: 'not-a-date' };
    const error = getError(createSuspensionSchema, payload);
    assert.ok(error.includes('Invalid effective date'));
  });
});

// ── reactivateUser ───────────────────────────────────────────────────────────

describe('reactivateUserSchema — Validation', () => {
  const validPayload = {
    identityVerificationComplete: true,
    securityAuditPassed: true
  };

  it('accepts valid reactivation data', () => {
    const error = getError(reactivateUserSchema, validPayload);
    assert.equal(error, null);
  });

  it('accepts valid reactivation data with notes', () => {
    const payload = { ...validPayload, reactivationNotes: 'All good' };
    const error = getError(reactivateUserSchema, payload);
    assert.equal(error, null);
  });

  // identityVerificationComplete tests
  it('rejects missing identityVerificationComplete', () => {
    const { identityVerificationComplete, ...payload } = validPayload;
    const error = getError(reactivateUserSchema, payload);
    assert.ok(error.includes('Identity verification status is required'));
  });

  it('rejects false identityVerificationComplete', () => {
    const payload = { ...validPayload, identityVerificationComplete: false };
    const error = getError(reactivateUserSchema, payload);
    assert.ok(error.includes('Identity verification must be completed'));
  });

  // securityAuditPassed tests
  it('rejects missing securityAuditPassed', () => {
    const { securityAuditPassed, ...payload } = validPayload;
    const error = getError(reactivateUserSchema, payload);
    assert.ok(error.includes('Security audit status is required'));
  });

  it('rejects false securityAuditPassed', () => {
    const payload = { ...validPayload, securityAuditPassed: false };
    const error = getError(reactivateUserSchema, payload);
    assert.ok(error.includes('Security audit must be passed'));
  });
});
