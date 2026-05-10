import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// ─── Controller-level logic (extracted pure functions) ───────────────────────

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

// ═══════════════════════════════════════════════════════════════════════════════
// CONTROLLER LOGIC TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('computeFinancials', () => {
  it('computes correct financials for weekly package', () => {
    const r = computeFinancials(1000, 'Weeks', 2);
    assert.equal(r.subtotal, 1000);
    assert.equal(r.tax, 8);
    assert.equal(r.total, 1008);
    assert.equal(r.durationDays, 14);
    assert.equal(r.dailyRate, 71.43);
  });

  it('computes correct financials for daily package', () => {
    const r = computeFinancials(500, 'Days', 5);
    assert.equal(r.durationDays, 5);
    assert.equal(r.dailyRate, 100);
  });

  it('computes correct financials for hourly package', () => {
    const r = computeFinancials(100, 'Hours', 6);
    assert.equal(r.durationDays, 1);
  });
});

describe('validateStatusTransition', () => {
  it('allows Pending -> Active', () => {
    assert.equal(validateStatusTransition('Pending', 'Active').valid, true);
  });
  it('blocks Completed -> Active', () => {
    const r = validateStatusTransition('Completed', 'Active');
    assert.equal(r.valid, false);
    assert.match(r.message, /transition/);
  });
  it('allows Active -> Paused', () => {
    assert.equal(validateStatusTransition('Active', 'Paused').valid, true);
  });
  it('allows Active -> Completed', () => {
    assert.equal(validateStatusTransition('Active', 'Completed').valid, true);
  });
  it('blocks Paused -> Completed (direct)', () => {
    const r = validateStatusTransition('Paused', 'Completed');
    assert.equal(r.valid, false);
  });
  it('handles unknown status gracefully', () => {
    const r = validateStatusTransition('Unknown', 'Active');
    assert.equal(r.valid, false);
  });
});
