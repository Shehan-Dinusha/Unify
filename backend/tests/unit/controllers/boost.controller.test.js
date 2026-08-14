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
import { mockRes, mockNext } from '../../helpers/testUtils.js';
import BoostCampaign from '../../../src/modules/BoostCampaign.model.js';
import BoostPackage from '../../../src/modules/BoostPackage.model.js';
import boostService from '../../../src/services/boost.service.js';

// ─── Automatic Mock Cleanup ─────────────────────────────────────────────────
afterEach(() => {
  mock.restoreAll();
});

// ═══════════════════════════════════════════════════════════════════════════════
// createCampaign Controller
// ═══════════════════════════════════════════════════════════════════════════════

describe('createCampaign Controller', () => {
  it('returns 401 when user is not authenticated', async () => {
    const { createCampaign } = await import('../../../src/controllers/boost/createCampaign.controller.js');

    const req = { user: null, body: { postId: 1, packageId: 'PKG-1' } };
    const res = mockRes();
    const next = mockNext();

    await createCampaign(req, res, next);

    assert.equal(res._status, 401);
    assert.equal(res._json.success, false);
  });

  it('returns 400 when postId is missing', async () => {
    const { createCampaign } = await import('../../../src/controllers/boost/createCampaign.controller.js');

    const req = { user: { id: 1 }, body: { packageId: 'PKG-1' } };
    const res = mockRes();
    const next = mockNext();

    await createCampaign(req, res, next);

    assert.equal(res._status, 400);
    assert.match(res._json.message, /post/i);
  });

  it('returns 400 when packageId is missing', async () => {
    const { createCampaign } = await import('../../../src/controllers/boost/createCampaign.controller.js');

    const req = { user: { id: 1 }, body: { postId: 1 } };
    const res = mockRes();
    const next = mockNext();

    await createCampaign(req, res, next);

    assert.equal(res._status, 400);
    assert.match(res._json.message, /package/i);
  });

  it('returns 404 when package is not found', async () => {
    mock.method(BoostPackage, 'findByPk', async () => null);

    const { createCampaign } = await import('../../../src/controllers/boost/createCampaign.controller.js');

    const req = { user: { id: 1 }, body: { postId: 1, packageId: 'PKG-NONEXIST' } };
    const res = mockRes();
    const next = mockNext();

    await createCampaign(req, res, next);

    assert.equal(res._status, 404);
    assert.match(res._json.message, /not found/i);
  });

  it('returns 400 when package is archived (not live)', async () => {
    mock.method(BoostPackage, 'findByPk', async () => ({
      id: 'PKG-1', status: 'archived', price: 100, durationValue: 7, durationUnit: 'Days',
    }));

    const { createCampaign } = await import('../../../src/controllers/boost/createCampaign.controller.js');

    const req = { user: { id: 1 }, body: { postId: 1, packageId: 'PKG-1' } };
    const res = mockRes();
    const next = mockNext();

    await createCampaign(req, res, next);

    assert.equal(res._status, 400);
    assert.match(res._json.message, /no longer available/i);
  });

  it('returns 409 when duplicate active campaign exists', async () => {
    mock.method(BoostPackage, 'findByPk', async () => ({
      id: 'PKG-1', status: 'live', price: 500, durationValue: 7, durationUnit: 'Days',
    }));
    mock.method(BoostCampaign, 'findOne', async () => ({
      id: 1, status: 'Active',
    }));

    const { createCampaign } = await import('../../../src/controllers/boost/createCampaign.controller.js');

    const req = { user: { id: 1 }, body: { postId: 42, packageId: 'PKG-1' } };
    const res = mockRes();
    const next = mockNext();

    await createCampaign(req, res, next);

    assert.equal(res._status, 409);
    assert.match(res._json.message, /already exists/i);
  });

  it('returns 201 and creates campaign successfully with correct financials', async () => {
    const pkgPrice = 1000;
    const taxRate = 0.008;
    const expectedTax = Math.round(pkgPrice * taxRate * 100) / 100; // 8.00
    const expectedTotal = Math.round((pkgPrice + expectedTax) * 100) / 100; // 1008.00

    mock.method(BoostPackage, 'findByPk', async () => ({
      id: 'PKG-1', status: 'live', price: pkgPrice, durationValue: 7, durationUnit: 'Days',
    }));
    mock.method(BoostCampaign, 'findOne', async () => null); // No duplicate
    mock.method(BoostCampaign, 'create', async (data) => ({
      id: 1,
      campaignId: data.campaignId,
      status: data.status,
      paymentStatus: data.paymentStatus,
      budget: data.budget,
      durationDays: data.durationDays,
      subtotal: data.subtotal,
      tax: data.tax,
      total: data.total,
      startDate: data.startDate,
      endDate: data.endDate,
    }));

    const { createCampaign } = await import('../../../src/controllers/boost/createCampaign.controller.js');

    const req = {
      user: { id: 1 },
      body: { postId: 42, packageId: 'PKG-1', name: 'My Boost Campaign' },
    };
    const res = mockRes();
    const next = mockNext();

    await createCampaign(req, res, next);

    assert.equal(res._status, 201);
    assert.equal(res._json.success, true);
    assert.match(res._json.data.campaignId, /^#Campaign-\d{4}-[A-Z]$/);
    assert.equal(res._json.data.status, 'Pending');
    assert.equal(res._json.data.paymentStatus, 'pending');
    assert.equal(res._json.data.subtotal, pkgPrice);
    assert.equal(res._json.data.tax, expectedTax);
    assert.equal(res._json.data.total, expectedTotal);
    assert.equal(res._json.data.durationDays, 7);
    assert.ok(res._json.data.startDate);
    assert.ok(res._json.data.endDate);
    assert.equal(next.called, false);
  });

  it('forwards unexpected errors to next()', async () => {
    mock.method(BoostPackage, 'findByPk', async () => {
      throw new Error('Connection refused');
    });

    const { createCampaign } = await import('../../../src/controllers/boost/createCampaign.controller.js');

    const req = { user: { id: 1 }, body: { postId: 1, packageId: 'PKG-1' } };
    const res = mockRes();
    const next = mockNext();

    await createCampaign(req, res, next);

    assert.equal(next.called, true);
    assert.equal(next.error.message, 'Connection refused');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// getCampaigns Controller
// ═══════════════════════════════════════════════════════════════════════════════

describe('getCampaigns Controller', () => {
  it('returns 401 when user is not authenticated', async () => {
    const { getCampaigns } = await import('../../../src/controllers/boost/getCampaigns.controller.js');

    const req = { user: null, query: {} };
    const res = mockRes();
    const next = mockNext();

    await getCampaigns(req, res, next);

    assert.equal(res._status, 401);
  });

  it('returns 200 with campaigns on success', async () => {
    mock.method(BoostCampaign, 'findAndCountAll', async () => ({
      count: 2,
      rows: [
        { id: 1, name: 'Campaign A', status: 'Active' },
        { id: 2, name: 'Campaign B', status: 'Pending' },
      ],
    }));

    const { getCampaigns } = await import('../../../src/controllers/boost/getCampaigns.controller.js');

    const req = { user: { id: 1 }, query: {} };
    const res = mockRes();
    const next = mockNext();

    await getCampaigns(req, res, next);

    assert.equal(res._status, 200);
    assert.equal(res._json.success, true);
    assert.equal(res._json.data.campaigns.length, 2);
    assert.equal(res._json.data.pagination.total, 2);
  });

  it('returns empty array when no campaigns found', async () => {
    mock.method(BoostCampaign, 'findAndCountAll', async () => ({
      count: 0, rows: [],
    }));

    const { getCampaigns } = await import('../../../src/controllers/boost/getCampaigns.controller.js');

    const req = { user: { id: 1 }, query: {} };
    const res = mockRes();
    const next = mockNext();

    await getCampaigns(req, res, next);

    assert.equal(res._status, 200);
    assert.equal(res._json.data.campaigns.length, 0);
  });

  it('forwards unexpected errors to next()', async () => {
    mock.method(BoostCampaign, 'findAndCountAll', async () => {
      throw new Error('Query timeout');
    });

    const { getCampaigns } = await import('../../../src/controllers/boost/getCampaigns.controller.js');

    const req = { user: { id: 1 }, query: {} };
    const res = mockRes();
    const next = mockNext();

    await getCampaigns(req, res, next);

    assert.equal(next.called, true);
    assert.equal(next.error.message, 'Query timeout');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// updateCampaignStatus Controller
// ═══════════════════════════════════════════════════════════════════════════════

describe('updateCampaignStatus Controller', () => {
  it('returns 401 when user is not authenticated', async () => {
    const { updateCampaignStatus } = await import('../../../src/controllers/boost/updateCampaignStatus.controller.js');

    const req = { params: { id: '1' }, body: { status: 'Active' }, user: null };
    const res = mockRes();
    const next = mockNext();

    await updateCampaignStatus(req, res, next);

    assert.equal(res._status, 401);
  });

  it('returns 400 for invalid status value', async () => {
    const { updateCampaignStatus } = await import('../../../src/controllers/boost/updateCampaignStatus.controller.js');

    const req = { params: { id: '1' }, body: { status: 'Running' }, user: { id: 1 } };
    const res = mockRes();
    const next = mockNext();

    await updateCampaignStatus(req, res, next);

    assert.equal(res._status, 400);
    assert.match(res._json.message, /Invalid status/i);
  });

  it('returns 400 for missing status', async () => {
    const { updateCampaignStatus } = await import('../../../src/controllers/boost/updateCampaignStatus.controller.js');

    const req = { params: { id: '1' }, body: {}, user: { id: 1 } };
    const res = mockRes();
    const next = mockNext();

    await updateCampaignStatus(req, res, next);

    assert.equal(res._status, 400);
  });

  it('returns 404 when campaign not found', async () => {
    mock.method(BoostCampaign, 'findOne', async () => null);

    const { updateCampaignStatus } = await import('../../../src/controllers/boost/updateCampaignStatus.controller.js');

    const req = { params: { id: '99999' }, body: { status: 'Active' }, user: { id: 1 } };
    const res = mockRes();
    const next = mockNext();

    await updateCampaignStatus(req, res, next);

    assert.equal(res._status, 404);
  });

  it('returns 400 for invalid state transition (Completed → Active)', async () => {
    mock.method(BoostCampaign, 'findOne', async () => ({
      id: 1, userId: 1, status: 'Completed', campaignId: '#Campaign-1234-A',
    }));

    const { updateCampaignStatus } = await import('../../../src/controllers/boost/updateCampaignStatus.controller.js');

    const req = { params: { id: '1' }, body: { status: 'Active' }, user: { id: 1 } };
    const res = mockRes();
    const next = mockNext();

    await updateCampaignStatus(req, res, next);

    assert.equal(res._status, 400);
    assert.match(res._json.message, /Cannot transition/i);
  });

  it('returns 403 when non-owner tries to update (not cancel)', async () => {
    mock.method(BoostCampaign, 'findOne', async () => ({
      id: 1, userId: 5, status: 'Pending', campaignId: '#Campaign-1234-A',
    }));

    const { updateCampaignStatus } = await import('../../../src/controllers/boost/updateCampaignStatus.controller.js');

    // User 1 tries to activate campaign owned by user 5
    const req = { params: { id: '1' }, body: { status: 'Active' }, user: { id: 1 } };
    const res = mockRes();
    const next = mockNext();

    await updateCampaignStatus(req, res, next);

    assert.equal(res._status, 403);
    assert.match(res._json.message, /permission/i);
  });

  it('successfully updates Pending → Active', async () => {
    const campaign = {
      id: 1, userId: 1, status: 'Pending', campaignId: '#Campaign-1234-A',
      startDate: null, durationDays: 7,
      save: mock.fn(async () => {}),
    };
    mock.method(BoostCampaign, 'findOne', async () => campaign);

    const { updateCampaignStatus } = await import('../../../src/controllers/boost/updateCampaignStatus.controller.js');

    const req = { params: { id: '1' }, body: { status: 'Active' }, user: { id: 1 } };
    const res = mockRes();
    const next = mockNext();

    await updateCampaignStatus(req, res, next);

    assert.equal(res._status, 200);
    assert.equal(res._json.success, true);
    assert.equal(res._json.data.status, 'Active');
    // Should set startDate when transitioning to Active
    assert.ok(campaign.startDate);
  });

  it('successfully transitions Active → Paused', async () => {
    const campaign = {
      id: 1, userId: 1, status: 'Active', campaignId: '#Campaign-1234-A',
      startDate: new Date(), endDate: new Date(), durationDays: 7,
      save: mock.fn(async () => {}),
    };
    mock.method(BoostCampaign, 'findOne', async () => campaign);

    const { updateCampaignStatus } = await import('../../../src/controllers/boost/updateCampaignStatus.controller.js');

    const req = { params: { id: '1' }, body: { status: 'Paused' }, user: { id: 1 } };
    const res = mockRes();
    const next = mockNext();

    await updateCampaignStatus(req, res, next);

    assert.equal(res._status, 200);
    assert.equal(res._json.data.status, 'Paused');
  });

  it('forwards unexpected errors to next()', async () => {
    mock.method(BoostCampaign, 'findOne', async () => {
      throw new Error('DB connection lost');
    });

    const { updateCampaignStatus } = await import('../../../src/controllers/boost/updateCampaignStatus.controller.js');

    const req = { params: { id: '1' }, body: { status: 'Active' }, user: { id: 1 } };
    const res = mockRes();
    const next = mockNext();

    await updateCampaignStatus(req, res, next);

    assert.equal(next.called, true);
    assert.equal(next.error.message, 'DB connection lost');
  });
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

    const { getAdminStats } = await import('../../../src/controllers/boost/getAdminStats.controller.js');

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

    const { getAdminStats } = await import('../../../src/controllers/boost/getAdminStats.controller.js');

    const req = {};
    const res = mockRes();
    const next = mockNext();

    await getAdminStats(req, res, next);

    assert.equal(res._status, 500);
    assert.equal(res._json.success, false);
    assert.match(res._json.message, /DB error/);
  });
});
