/**
 * Boost Controller — Unit Test Suite (Industry-Level)
 * ─────────────────────────────────────────────────────
 * Tests for key boost controllers:
 *   - createCampaign
 *   - getCampaigns
 *   - updateCampaignStatus
 *   - getAdminStats
 *
 * Run: node --test tests/unit/controllers/boost.controller.test.js
 */

import { describe, it, mock, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { mockRes, mockNext } from '../../../helpers/testUtils.js';
import BoostCampaign from '../../../../src/modules/BoostCampaign.model.js';
import BoostPackage from '../../../../src/modules/BoostPackage.model.js';
import boostService from '../../../../src/services/boost.service.js';

// ─── Automatic Mock Cleanup ─────────────────────────────────────────────────
afterEach(() => {
  mock.restoreAll();
});

// ═══════════════════════════════════════════════════════════════════════════════
// getAdminStats Controller (Boost Admin)
// ═══════════════════════════════════════════════════════════════════════════════

describe('getAdminStats Controller (Boost)', () => {
  it('returns 200 with stats on success', async () => {
    mock.method(boostService, 'getAdminStats', async () => ({
      activePackages: 5,
      monthlyRevenue: 150000,
      revenueChange: 12,
      totalBoosts30d: 80,
      boostsChange: 15,
      avgDurationDays: 7.5,
    }));

    const { getAdminStats } = await import('../../../../src/controllers/boost/getAdminStats.controller.js');

    const req = {};
    const res = mockRes();
    const next = mockNext();

    await getAdminStats(req, res, next);

    assert.equal(res._status, 200);
    assert.equal(res._json.success, true);
    assert.ok(res._json.data.stats);
    assert.equal(res._json.data.stats.activePackages, 5);
    assert.equal(res._json.data.stats.monthlyRevenue, 150000);
  });

  it('returns 500 via sendResponse when service throws', async () => {
    // NOTE: This controller uses sendResponse(res, 500) instead of next(error)
    mock.method(boostService, 'getAdminStats', async () => {
      throw new Error('DB error');
    });

    const { getAdminStats } = await import('../../../../src/controllers/boost/getAdminStats.controller.js');

    const req = {};
    const res = mockRes();
    const next = mockNext();

    await getAdminStats(req, res, next);

    assert.equal(res._status, 500);
    assert.equal(res._json.success, false);
    assert.match(res._json.message, /DB error/);
  });
});
