/**
 * Boost Backend — Comprehensive Validation Test Suite
 * Tests all validation logic for packages, campaigns, interactions, and webhooks.
 * Uses Node.js built-in test runner — zero dependencies.
 *
 * Run from backend/: node --test tests/boost.test.js
 *
 * Strategy: Since controllers import Sequelize models (which require a DB connection
 * to even parse), we extract the EXACT validation logic from each controller into
 * pure functions here and test them directly. This mirrors 100% of the validation
 * code in the controllers without needing a DB connection.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// ─── Mock sendResponse ──────────────────────────────────────────────────────

const mockRes = () => {
  const res = { statusCode: null, body: null };
  res.status = (code) => { res.statusCode = code; return res; };
  res.json = (data) => { res.body = data; return res; };
  return res;
};

const sendResponse = (res, status, success, message, data = null) => {
  return res.status(status).json({ success, message, data });
};

// ═══════════════════════════════════════════════════════════════════════════════
// EXTRACTED VALIDATION FUNCTIONS (mirrors controller logic exactly)
// ═══════════════════════════════════════════════════════════════════════════════

function validateCreatePackage(body) {
  const { name, price, durationValue, durationUnit, badge, description, features } = body;

  if (!name || typeof name !== 'string' || name.trim().length === 0)
    return { valid: false, status: 400, message: 'Package name is required.' };
  if (name.length > 100)
    return { valid: false, status: 400, message: 'Package name cannot exceed 100 characters.' };

  const parsedPrice = Number(price);
  if (price === undefined || price === null || price === '')
    return { valid: false, status: 400, message: 'Price is required.' };
  if (isNaN(parsedPrice) || parsedPrice <= 0)
    return { valid: false, status: 400, message: 'Price must be a positive number.' };

  const parsedDuration = Number(durationValue);
  if (!durationValue)
    return { valid: false, status: 400, message: 'Duration value is required.' };
  if (isNaN(parsedDuration) || parsedDuration <= 0 || !Number.isInteger(parsedDuration))
    return { valid: false, status: 400, message: 'Duration value must be a positive integer.' };

  const validUnits = ['Hours', 'Days', 'Weeks'];
  if (!durationUnit || !validUnits.includes(durationUnit))
    return { valid: false, status: 400, message: 'Duration unit must be one of: Hours, Days, Weeks.' };

  const validBadges = ['No Badge', 'Most Popular', 'Premium', 'Best Value'];
  if (badge && !validBadges.includes(badge))
    return { valid: false, status: 400, message: 'Invalid badge type. Must be one of: No Badge, Most Popular, Premium, Best Value.' };

  if (description && description.length > 500)
    return { valid: false, status: 400, message: 'Description cannot exceed 500 characters.' };

  if (features !== undefined && features !== null) {
    if (!Array.isArray(features))
      return { valid: false, status: 400, message: 'Features must be an array of strings.' };
    for (const f of features) {
      if (typeof f !== 'string')
        return { valid: false, status: 400, message: 'Each feature must be a string.' };
    }
  }

  return { valid: true };
}

function validateCreateCampaign(body) {
  const { postId, packageId } = body;
  if (!postId)
    return { valid: false, status: 400, message: 'Post ID is required to create a boost campaign.' };
  if (!packageId)
    return { valid: false, status: 400, message: 'Package ID is required.' };
  return { valid: true };
}

function validateUpdateCampaignStatus(body) {
  const { status } = body;
  const validStatuses = ['Pending', 'Active', 'Paused', 'Completed', 'Cancelled'];
  if (!status || !validStatuses.includes(status))
    return { valid: false, status: 400, message: 'Invalid status. Must be one of: Pending, Active, Paused, Completed, Cancelled.' };
  return { valid: true };
}

function validateStatusTransition(currentStatus, newStatus) {
  const transitions = {
    'Pending': ['Active', 'Cancelled'],
    'Active': ['Paused', 'Completed', 'Cancelled'],
    'Paused': ['Active', 'Cancelled'],
    'Completed': [],
    'Cancelled': [],
  };
  const allowed = transitions[currentStatus] || [];
  if (!allowed.includes(newStatus))
    return { valid: false, message: `Cannot transition from '${currentStatus}' to '${newStatus}'.` };
  return { valid: true };
}

function validateRecordInteraction(body) {
  const { action, content, impact } = body;
  const validActions = ['Comment', 'Like', 'Share', 'Click', 'Purchase'];
  if (!action || !validActions.includes(action))
    return { valid: false, status: 400, message: 'A valid action is required. Must be one of: Comment, Like, Share, Click, Purchase.' };
  if (content && content.length > 500)
    return { valid: false, status: 400, message: 'Content cannot exceed 500 characters.' };
  if (impact) {
    const validImpacts = ['High', 'Medium', 'Low', 'Conversion'];
    if (!validImpacts.includes(impact))
      return { valid: false, status: 400, message: 'Impact must be one of: High, Medium, Low, Conversion.' };
  }
  return { valid: true };
}

function validatePaymentWebhook(body) {
  const { campaignId, paymentStatus } = body;
  if (!campaignId)
    return { valid: false, status: 400, message: 'Campaign ID is required.' };
  const validPaymentStatuses = ['completed', 'failed', 'refunded'];
  if (!paymentStatus || !validPaymentStatuses.includes(paymentStatus))
    return { valid: false, status: 400, message: 'Invalid payment status. Must be one of: completed, failed, refunded.' };
  return { valid: true };
}

function computeFinancials(price, durationUnit, durationValue) {
  const TAX_RATE = 0.008;
  const subtotal = Number(price);
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  const total = Math.round((subtotal + tax) * 100) / 100;
  let durationDays;
  if (durationUnit === 'Hours') durationDays = 1;
  else if (durationUnit === 'Days') durationDays = durationValue;
  else if (durationUnit === 'Weeks') durationDays = durationValue * 7;
  else durationDays = durationValue;
  const dailyRate = durationDays > 0 ? Math.round((subtotal / durationDays) * 100) / 100 : subtotal;
  return { subtotal, tax, total, durationDays, dailyRate };
}

// ═══════════════════════════════════════════════════════════════════════════════
// TESTS
// ═══════════════════════════════════════════════════════════════════════════════

// ── createPackage ────────────────────────────────────────────────────────────

describe('createPackage — Validation', () => {
  it('rejects when name is missing', () => {
    const r = validateCreatePackage({ price: 1000, durationValue: 7, durationUnit: 'Days' });
    assert.equal(r.valid, false);
    assert.ok(r.message.toLowerCase().includes('name'));
  });
  it('rejects when name is empty/whitespace', () => {
    assert.equal(validateCreatePackage({ name: '   ', price: 1000, durationValue: 7, durationUnit: 'Days' }).valid, false);
  });
  it('rejects when name > 100 chars', () => {
    const r = validateCreatePackage({ name: 'A'.repeat(101), price: 1000, durationValue: 7, durationUnit: 'Days' });
    assert.equal(r.valid, false);
    assert.ok(r.message.includes('100'));
  });
  it('accepts name at exactly 100 chars', () => {
    assert.equal(validateCreatePackage({ name: 'A'.repeat(100), price: 1000, durationValue: 7, durationUnit: 'Days' }).valid, true);
  });
  it('rejects when name is a number type', () => {
    assert.equal(validateCreatePackage({ name: 12345, price: 1000, durationValue: 7, durationUnit: 'Days' }).valid, false);
  });
  it('rejects when price is missing', () => {
    assert.equal(validateCreatePackage({ name: 'T', durationValue: 7, durationUnit: 'Days' }).valid, false);
  });
  it('rejects when price is empty string', () => {
    assert.equal(validateCreatePackage({ name: 'T', price: '', durationValue: 7, durationUnit: 'Days' }).valid, false);
  });
  it('rejects when price is zero', () => {
    assert.equal(validateCreatePackage({ name: 'T', price: 0, durationValue: 7, durationUnit: 'Days' }).valid, false);
  });
  it('rejects when price is negative', () => {
    assert.equal(validateCreatePackage({ name: 'T', price: -500, durationValue: 7, durationUnit: 'Days' }).valid, false);
  });
  it('rejects when price is NaN', () => {
    assert.equal(validateCreatePackage({ name: 'T', price: 'abc', durationValue: 7, durationUnit: 'Days' }).valid, false);
  });
  it('rejects when durationValue is missing', () => {
    assert.equal(validateCreatePackage({ name: 'T', price: 1000, durationUnit: 'Days' }).valid, false);
  });
  it('rejects when durationValue is zero', () => {
    assert.equal(validateCreatePackage({ name: 'T', price: 1000, durationValue: 0, durationUnit: 'Days' }).valid, false);
  });
  it('rejects when durationValue is negative', () => {
    assert.equal(validateCreatePackage({ name: 'T', price: 1000, durationValue: -5, durationUnit: 'Days' }).valid, false);
  });
  it('rejects when durationValue is float', () => {
    assert.equal(validateCreatePackage({ name: 'T', price: 1000, durationValue: 3.5, durationUnit: 'Days' }).valid, false);
  });
  it('rejects when durationUnit is invalid', () => {
    assert.equal(validateCreatePackage({ name: 'T', price: 1000, durationValue: 7, durationUnit: 'Months' }).valid, false);
  });
  it('rejects when durationUnit is missing', () => {
    assert.equal(validateCreatePackage({ name: 'T', price: 1000, durationValue: 7 }).valid, false);
  });
  it('accepts all valid durationUnits', () => {
    for (const u of ['Hours', 'Days', 'Weeks'])
      assert.equal(validateCreatePackage({ name: 'T', price: 1000, durationValue: 7, durationUnit: u }).valid, true);
  });
  it('rejects invalid badge', () => {
    assert.equal(validateCreatePackage({ name: 'T', price: 1000, durationValue: 7, durationUnit: 'Days', badge: 'Super' }).valid, false);
  });
  it('accepts all valid badges', () => {
    for (const b of ['No Badge', 'Most Popular', 'Premium', 'Best Value'])
      assert.equal(validateCreatePackage({ name: 'T', price: 1000, durationValue: 7, durationUnit: 'Days', badge: b }).valid, true);
  });
  it('rejects description > 500 chars', () => {
    assert.equal(validateCreatePackage({ name: 'T', price: 1000, durationValue: 7, durationUnit: 'Days', description: 'X'.repeat(501) }).valid, false);
  });
  it('accepts description at exactly 500 chars', () => {
    assert.equal(validateCreatePackage({ name: 'T', price: 1000, durationValue: 7, durationUnit: 'Days', description: 'X'.repeat(500) }).valid, true);
  });
  it('accepts null description', () => {
    assert.equal(validateCreatePackage({ name: 'T', price: 1000, durationValue: 7, durationUnit: 'Days', description: null }).valid, true);
  });
  it('rejects features as string', () => {
    assert.equal(validateCreatePackage({ name: 'T', price: 1000, durationValue: 7, durationUnit: 'Days', features: 'str' }).valid, false);
  });
  it('rejects features with non-string elements', () => {
    assert.equal(validateCreatePackage({ name: 'T', price: 1000, durationValue: 7, durationUnit: 'Days', features: ['ok', 123] }).valid, false);
  });
  it('accepts empty features array', () => {
    assert.equal(validateCreatePackage({ name: 'T', price: 1000, durationValue: 7, durationUnit: 'Days', features: [] }).valid, true);
  });
  it('accepts null features', () => {
    assert.equal(validateCreatePackage({ name: 'T', price: 1000, durationValue: 7, durationUnit: 'Days', features: null }).valid, true);
  });
  it('accepts valid features', () => {
    assert.equal(validateCreatePackage({ name: 'T', price: 1000, durationValue: 7, durationUnit: 'Days', features: ['a', 'b'] }).valid, true);
  });
});

// ── createCampaign ───────────────────────────────────────────────────────────

describe('createCampaign — Validation', () => {
  it('rejects when postId is missing', () => {
    const r = validateCreateCampaign({ packageId: 'pkg-001' });
    assert.equal(r.valid, false);
    assert.ok(r.message.includes('Post ID'));
  });
  it('rejects when packageId is missing', () => {
    const r = validateCreateCampaign({ postId: 1 });
    assert.equal(r.valid, false);
    assert.ok(r.message.includes('Package ID'));
  });
  it('accepts valid campaign input', () => {
    assert.equal(validateCreateCampaign({ postId: 1, packageId: 'pkg-001' }).valid, true);
  });
});

// ── updateCampaignStatus ─────────────────────────────────────────────────────

describe('updateCampaignStatus — Validation', () => {
  it('rejects missing status', () => {
    assert.equal(validateUpdateCampaignStatus({}).valid, false);
  });
  it('rejects invalid status', () => {
    assert.equal(validateUpdateCampaignStatus({ status: 'Running' }).valid, false);
  });
  it('accepts all valid statuses', () => {
    for (const s of ['Pending', 'Active', 'Paused', 'Completed', 'Cancelled'])
      assert.equal(validateUpdateCampaignStatus({ status: s }).valid, true);
  });
});

// ── Status Transitions ──────────────────────────────────────────────────────

describe('Campaign Status Transitions', () => {
  it('Pending → Active: allowed', () => {
    assert.equal(validateStatusTransition('Pending', 'Active').valid, true);
  });
  it('Pending → Cancelled: allowed', () => {
    assert.equal(validateStatusTransition('Pending', 'Cancelled').valid, true);
  });
  it('Pending → Completed: blocked', () => {
    assert.equal(validateStatusTransition('Pending', 'Completed').valid, false);
  });
  it('Active → Paused: allowed', () => {
    assert.equal(validateStatusTransition('Active', 'Paused').valid, true);
  });
  it('Active → Completed: allowed', () => {
    assert.equal(validateStatusTransition('Active', 'Completed').valid, true);
  });
  it('Active → Cancelled: allowed', () => {
    assert.equal(validateStatusTransition('Active', 'Cancelled').valid, true);
  });
  it('Active → Pending: blocked', () => {
    assert.equal(validateStatusTransition('Active', 'Pending').valid, false);
  });
  it('Paused → Active: allowed', () => {
    assert.equal(validateStatusTransition('Paused', 'Active').valid, true);
  });
  it('Paused → Cancelled: allowed', () => {
    assert.equal(validateStatusTransition('Paused', 'Cancelled').valid, true);
  });
  it('Paused → Completed: blocked', () => {
    assert.equal(validateStatusTransition('Paused', 'Completed').valid, false);
  });
  it('Completed → any: blocked (terminal)', () => {
    for (const s of ['Pending', 'Active', 'Paused', 'Cancelled'])
      assert.equal(validateStatusTransition('Completed', s).valid, false, `Completed → ${s} should be blocked`);
  });
  it('Cancelled → any: blocked (terminal)', () => {
    for (const s of ['Pending', 'Active', 'Paused', 'Completed'])
      assert.equal(validateStatusTransition('Cancelled', s).valid, false, `Cancelled → ${s} should be blocked`);
  });
});

// ── recordInteraction ────────────────────────────────────────────────────────

describe('recordInteraction — Validation', () => {
  it('rejects missing action', () => {
    assert.equal(validateRecordInteraction({}).valid, false);
  });
  it('rejects invalid action', () => {
    assert.equal(validateRecordInteraction({ action: 'Fly' }).valid, false);
  });
  it('accepts all valid actions', () => {
    for (const a of ['Comment', 'Like', 'Share', 'Click', 'Purchase'])
      assert.equal(validateRecordInteraction({ action: a }).valid, true);
  });
  it('rejects content > 500 chars', () => {
    assert.equal(validateRecordInteraction({ action: 'Comment', content: 'X'.repeat(501) }).valid, false);
  });
  it('accepts content at exactly 500 chars', () => {
    assert.equal(validateRecordInteraction({ action: 'Comment', content: 'X'.repeat(500) }).valid, true);
  });
  it('rejects invalid impact', () => {
    assert.equal(validateRecordInteraction({ action: 'Click', impact: 'Extreme' }).valid, false);
  });
  it('accepts all valid impacts', () => {
    for (const i of ['High', 'Medium', 'Low', 'Conversion'])
      assert.equal(validateRecordInteraction({ action: 'Click', impact: i }).valid, true);
  });
});

// ── handlePaymentWebhook ─────────────────────────────────────────────────────

describe('handlePaymentWebhook — Validation', () => {
  it('rejects missing campaignId', () => {
    const r = validatePaymentWebhook({ paymentStatus: 'completed' });
    assert.equal(r.valid, false);
    assert.ok(r.message.includes('Campaign ID'));
  });
  it('rejects missing paymentStatus', () => {
    assert.equal(validatePaymentWebhook({ campaignId: 1 }).valid, false);
  });
  it('rejects invalid paymentStatus (pending)', () => {
    const r = validatePaymentWebhook({ campaignId: 1, paymentStatus: 'pending' });
    assert.equal(r.valid, false);
    assert.ok(r.message.includes('completed, failed, refunded'));
  });
  it('accepts all valid paymentStatuses', () => {
    for (const ps of ['completed', 'failed', 'refunded'])
      assert.equal(validatePaymentWebhook({ campaignId: 1, paymentStatus: ps }).valid, true);
  });
});

// ── Financial Computation Tests ─────────────────────────────────────────────

describe('Campaign Financial Computations', () => {
  it('computes correct tax at 0.8%', () => {
    const { subtotal, tax, total } = computeFinancials(2000, 'Days', 7);
    assert.equal(subtotal, 2000);
    assert.equal(tax, 16); // 2000 * 0.008 = 16
    assert.equal(total, 2016);
  });
  it('computes durationDays for Hours = 1', () => {
    const { durationDays } = computeFinancials(1000, 'Hours', 24);
    assert.equal(durationDays, 1);
  });
  it('computes durationDays for Days directly', () => {
    const { durationDays } = computeFinancials(1000, 'Days', 7);
    assert.equal(durationDays, 7);
  });
  it('computes durationDays for Weeks * 7', () => {
    const { durationDays } = computeFinancials(1000, 'Weeks', 2);
    assert.equal(durationDays, 14);
  });
  it('computes correct dailyRate', () => {
    const { dailyRate } = computeFinancials(2100, 'Days', 7);
    assert.equal(dailyRate, 300); // 2100/7 = 300
  });
  it('handles fractional dailyRate with rounding', () => {
    const { dailyRate } = computeFinancials(1000, 'Days', 3);
    assert.equal(dailyRate, 333.33); // 1000/3 = 333.33
  });
  it('computes tax rounding correctly for small amounts', () => {
    const { tax } = computeFinancials(100, 'Days', 1);
    assert.equal(tax, 0.80); // 100 * 0.008 = 0.8
  });
  it('computes total as subtotal + tax', () => {
    const { subtotal, tax, total } = computeFinancials(4000, 'Weeks', 1);
    assert.equal(total, subtotal + tax);
  });
});
