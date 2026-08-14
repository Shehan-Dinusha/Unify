/**
 * Boost Controller — Unit Test Suite
 * ────────────────────────────────────
 * Tests for key boost controllers:
 *   - createCampaign
 *   - getCampaigns
 *   - updateCampaignStatus
 *   - getAdminStats
 *
 * Run: node --test tests/unit/controllers/boost.controller.test.js
 */

import { describe, it, mock } from 'node:test';
import assert from 'node:assert/strict';
import BoostCampaign from '../../../src/modules/BoostCampaign.model.js';
import BoostPackage from '../../../src/modules/BoostPackage.model.js';
import boostService from '../../../src/services/boost.service.js';

// ─── Test Helpers ────────────────────────────────────────────────────────────

const makeRes = () => {
  const res = { _status: null, _json: null };
  res.status = (code) => { res._status = code; return res; };
  res.json = (data) => { res._json = data; return res; };
  return res;
};

const makeNext = () => {
  const fn = (err) => { fn.called = true; fn.error = err; };
  fn.called = false;
  fn.error = null;
  return fn;
};

// ═══════════════════════════════════════════════════════════════════════════════
// createCampaign Controller
// ═══════════════════════════════════════════════════════════════════════════════

describe('createCampaign Controller', () => {
  it('returns 401 when user is not authenticated', async () => {
    const { createCampaign } = await import('../../../src/controllers/boost/createCampaign.controller.js');

    const req = { user: null, body: { postId: 1, packageId: 'PKG-1' } };
    const res = makeRes();
    const next = makeNext();

    await createCampaign(req, res, next);

    assert.equal(res._status, 401);
    assert.equal(res._json.success, false);
  });

  it('returns 400 when postId is missing', async () => {
    const { createCampaign } = await import('../../../src/controllers/boost/createCampaign.controller.js');

    const req = { user: { id: 1 }, body: { packageId: 'PKG-1' } };
    const res = makeRes();
    const next = makeNext();

    await createCampaign(req, res, next);

    assert.equal(res._status, 400);
    assert.match(res._json.message, /post/i);
  });

  it('returns 400 when packageId is missing', async () => {
    const { createCampaign } = await import('../../../src/controllers/boost/createCampaign.controller.js');

    const req = { user: { id: 1 }, body: { postId: 1 } };
    const res = makeRes();
    const next = makeNext();

    await createCampaign(req, res, next);

    assert.equal(res._status, 400);
    assert.match(res._json.message, /package/i);
  });

  it('returns 404 when package is not found', async () => {
    const findMock = mock.method(BoostPackage, 'findByPk', async () => null);

    const { createCampaign } = await import('../../../src/controllers/boost/createCampaign.controller.js');

    const req = { user: { id: 1 }, body: { postId: 1, packageId: 'PKG-NONEXIST' } };
    const res = makeRes();
    const next = makeNext();

    await createCampaign(req, res, next);

    assert.equal(res._status, 404);
    assert.match(res._json.message, /not found/i);

    findMock.mock.restore();
  });

  it('returns 400 when package is archived (not live)', async () => {
    const findMock = mock.method(BoostPackage, 'findByPk', async () => ({
      id: 'PKG-1', status: 'archived', price: 100, durationValue: 7, durationUnit: 'Days',
    }));

    const { createCampaign } = await import('../../../src/controllers/boost/createCampaign.controller.js');

    const req = { user: { id: 1 }, body: { postId: 1, packageId: 'PKG-1' } };
    const res = makeRes();
    const next = makeNext();

    await createCampaign(req, res, next);

    assert.equal(res._status, 400);
    assert.match(res._json.message, /no longer available/i);

    findMock.mock.restore();
  });

  it('returns 409 when duplicate active campaign exists', async () => {
    const pkgMock = mock.method(BoostPackage, 'findByPk', async () => ({
      id: 'PKG-1', status: 'live', price: 500, durationValue: 7, durationUnit: 'Days',
    }));
    const campMock = mock.method(BoostCampaign, 'findOne', async () => ({
      id: 1, status: 'Active',
    }));

    const { createCampaign } = await import('../../../src/controllers/boost/createCampaign.controller.js');

    const req = { user: { id: 1 }, body: { postId: 42, packageId: 'PKG-1' } };
    const res = makeRes();
    const next = makeNext();

    await createCampaign(req, res, next);

    assert.equal(res._status, 409);
    assert.match(res._json.message, /already exists/i);

    pkgMock.mock.restore();
    campMock.mock.restore();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// getCampaigns Controller
// ═══════════════════════════════════════════════════════════════════════════════

describe('getCampaigns Controller', () => {
  it('returns 401 when user is not authenticated', async () => {
    const { getCampaigns } = await import('../../../src/controllers/boost/getCampaigns.controller.js');

    const req = { user: null, query: {} };
    const res = makeRes();
    const next = makeNext();

    await getCampaigns(req, res, next);

    assert.equal(res._status, 401);
  });

  it('returns 200 with campaigns on success', async () => {
    const findMock = mock.method(BoostCampaign, 'findAndCountAll', async () => ({
      count: 2,
      rows: [
        { id: 1, name: 'Campaign A', status: 'Active' },
        { id: 2, name: 'Campaign B', status: 'Pending' },
      ],
    }));

    const { getCampaigns } = await import('../../../src/controllers/boost/getCampaigns.controller.js');

    const req = { user: { id: 1 }, query: {} };
    const res = makeRes();
    const next = makeNext();

    await getCampaigns(req, res, next);

    assert.equal(res._status, 200);
    assert.equal(res._json.success, true);
    assert.equal(res._json.data.campaigns.length, 2);
    assert.equal(res._json.data.pagination.total, 2);

    findMock.mock.restore();
  });

  it('returns empty array when no campaigns found', async () => {
    const findMock = mock.method(BoostCampaign, 'findAndCountAll', async () => ({
      count: 0, rows: [],
    }));

    const { getCampaigns } = await import('../../../src/controllers/boost/getCampaigns.controller.js');

    const req = { user: { id: 1 }, query: {} };
    const res = makeRes();
    const next = makeNext();

    await getCampaigns(req, res, next);

    assert.equal(res._status, 200);
    assert.equal(res._json.data.campaigns.length, 0);

    findMock.mock.restore();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// updateCampaignStatus Controller
// ═══════════════════════════════════════════════════════════════════════════════

describe('updateCampaignStatus Controller', () => {
  it('returns 401 when user is not authenticated', async () => {
    const { updateCampaignStatus } = await import('../../../src/controllers/boost/updateCampaignStatus.controller.js');

    const req = { params: { id: '1' }, body: { status: 'Active' }, user: null };
    const res = makeRes();
    const next = makeNext();

    await updateCampaignStatus(req, res, next);

    assert.equal(res._status, 401);
  });

  it('returns 400 for invalid status value', async () => {
    const { updateCampaignStatus } = await import('../../../src/controllers/boost/updateCampaignStatus.controller.js');

    const req = { params: { id: '1' }, body: { status: 'Running' }, user: { id: 1 } };
    const res = makeRes();
    const next = makeNext();

    await updateCampaignStatus(req, res, next);

    assert.equal(res._status, 400);
    assert.match(res._json.message, /Invalid status/i);
  });

  it('returns 400 for missing status', async () => {
    const { updateCampaignStatus } = await import('../../../src/controllers/boost/updateCampaignStatus.controller.js');

    const req = { params: { id: '1' }, body: {}, user: { id: 1 } };
    const res = makeRes();
    const next = makeNext();

    await updateCampaignStatus(req, res, next);

    assert.equal(res._status, 400);
  });

  it('returns 404 when campaign not found', async () => {
    const findMock = mock.method(BoostCampaign, 'findOne', async () => null);

    const { updateCampaignStatus } = await import('../../../src/controllers/boost/updateCampaignStatus.controller.js');

    const req = { params: { id: '99999' }, body: { status: 'Active' }, user: { id: 1 } };
    const res = makeRes();
    const next = makeNext();

    await updateCampaignStatus(req, res, next);

    assert.equal(res._status, 404);

    findMock.mock.restore();
  });

  it('returns 400 for invalid state transition (Completed → Active)', async () => {
    const findMock = mock.method(BoostCampaign, 'findOne', async () => ({
      id: 1, userId: 1, status: 'Completed', campaignId: '#Campaign-1234-A',
    }));

    const { updateCampaignStatus } = await import('../../../src/controllers/boost/updateCampaignStatus.controller.js');

    const req = { params: { id: '1' }, body: { status: 'Active' }, user: { id: 1 } };
    const res = makeRes();
    const next = makeNext();

    await updateCampaignStatus(req, res, next);

    assert.equal(res._status, 400);
    assert.match(res._json.message, /Cannot transition/i);

    findMock.mock.restore();
  });

  it('returns 403 when non-owner tries to update (not cancel)', async () => {
    const findMock = mock.method(BoostCampaign, 'findOne', async () => ({
      id: 1, userId: 5, status: 'Pending', campaignId: '#Campaign-1234-A',
    }));

    const { updateCampaignStatus } = await import('../../../src/controllers/boost/updateCampaignStatus.controller.js');

    // User 1 tries to activate campaign owned by user 5
    const req = { params: { id: '1' }, body: { status: 'Active' }, user: { id: 1 } };
    const res = makeRes();
    const next = makeNext();

    await updateCampaignStatus(req, res, next);

    assert.equal(res._status, 403);
    assert.match(res._json.message, /permission/i);

    findMock.mock.restore();
  });

  it('successfully updates Pending → Active', async () => {
    const campaign = {
      id: 1, userId: 1, status: 'Pending', campaignId: '#Campaign-1234-A',
      startDate: null, durationDays: 7,
      save: mock.fn(async () => {}),
    };
    const findMock = mock.method(BoostCampaign, 'findOne', async () => campaign);

    const { updateCampaignStatus } = await import('../../../src/controllers/boost/updateCampaignStatus.controller.js');

    const req = { params: { id: '1' }, body: { status: 'Active' }, user: { id: 1 } };
    const res = makeRes();
    const next = makeNext();

    await updateCampaignStatus(req, res, next);

    assert.equal(res._status, 200);
    assert.equal(res._json.success, true);
    assert.equal(res._json.data.status, 'Active');
    // Should set startDate when transitioning to Active
    assert.ok(campaign.startDate);

    findMock.mock.restore();
  });

  it('successfully transitions Active → Paused', async () => {
    const campaign = {
      id: 1, userId: 1, status: 'Active', campaignId: '#Campaign-1234-A',
      startDate: new Date(), endDate: new Date(), durationDays: 7,
      save: mock.fn(async () => {}),
    };
    const findMock = mock.method(BoostCampaign, 'findOne', async () => campaign);

    const { updateCampaignStatus } = await import('../../../src/controllers/boost/updateCampaignStatus.controller.js');

    const req = { params: { id: '1' }, body: { status: 'Paused' }, user: { id: 1 } };
    const res = makeRes();
    const next = makeNext();

    await updateCampaignStatus(req, res, next);

    assert.equal(res._status, 200);
    assert.equal(res._json.data.status, 'Paused');

    findMock.mock.restore();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// getAdminStats Controller (Boost Admin)
// ═══════════════════════════════════════════════════════════════════════════════

describe('getAdminStats Controller (Boost)', () => {
  it('returns 200 with stats on success', async () => {
    const restore = mock.method(boostService, 'getAdminStats', async () => ({
      activePackages: 5,
      monthlyRevenue: 150000,
      revenueChange: 12,
      totalBoosts30d: 80,
      boostsChange: 15,
      avgDurationDays: 7.5,
    }));

    const { getAdminStats } = await import('../../../src/controllers/boost/getAdminStats.controller.js');

    const req = {};
    const res = makeRes();
    const next = makeNext();

    await getAdminStats(req, res, next);

    assert.equal(res._status, 200);
    assert.equal(res._json.success, true);
    assert.equal(res._json.data.activePackages, 5);
    assert.equal(res._json.data.monthlyRevenue, 150000);

    restore.mock.restore();
  });

  it('forwards errors to next()', async () => {
    const restore = mock.method(boostService, 'getAdminStats', async () => {
      throw new Error('DB error');
    });

    const { getAdminStats } = await import('../../../src/controllers/boost/getAdminStats.controller.js');

    const req = {};
    const res = makeRes();
    const next = makeNext();

    await getAdminStats(req, res, next);

    assert.equal(next.called, true);
    assert.equal(next.error.message, 'DB error');

    restore.mock.restore();
  });
});
