/**
 * Admin Dashboard Controller — Unit Test Suite
 * ──────────────────────────────────────────────
 * Tests all 7 admin dashboard controller endpoints.
 * Uses node:test mock.method to mock the AdminDashboardService.
 *
 * Run: node --test tests/unit/controllers/adminDashboard.controller.test.js
 */

import { describe, it, beforeEach, mock } from 'node:test';
import assert from 'node:assert/strict';
import AdminDashboardService from '../../../src/services/adminDashboard.service.js';
import {
  getDashboardStats,
  getPlatformGrowth,
  getContentModeration,
  getBusinessEngagement,
  getRevenueOverview,
  getRevenueTrajectory,
  getRevenueBreakdown,
} from '../../../src/controllers/admin/adminDashboard.controller.js';

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
// getDashboardStats
// ═══════════════════════════════════════════════════════════════════════════════

describe('getDashboardStats Controller', () => {
  it('returns 200 with stats on success', async () => {
    const mockStats = { totalStudents: 1200, totalBusinesses: 45, lastUpdated: new Date().toISOString() };
    const restore = mock.method(AdminDashboardService, 'getDashboardStats', async () => mockStats);

    const req = { query: {} };
    const res = makeRes();
    const next = makeNext();

    await getDashboardStats(req, res, next);

    assert.equal(res._status, 200);
    assert.equal(res._json.success, true);
    assert.equal(res._json.data.totalStudents, 1200);
    assert.ok(res._json.data.timestamp);
    assert.equal(next.called, false);

    restore.mock.restore();
  });

  it('forwards errors to next()', async () => {
    const restore = mock.method(AdminDashboardService, 'getDashboardStats', async () => {
      throw new Error('DB connection failed');
    });

    const req = { query: {} };
    const res = makeRes();
    const next = makeNext();

    await getDashboardStats(req, res, next);

    assert.equal(next.called, true);
    assert.equal(next.error.message, 'DB connection failed');

    restore.mock.restore();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// getPlatformGrowth
// ═══════════════════════════════════════════════════════════════════════════════

describe('getPlatformGrowth Controller', () => {
  it('returns 200 with default range (month)', async () => {
    const mockData = { labels: ['Jan', 'Feb'], values: [10, 20], lastUpdated: new Date().toISOString() };
    const restore = mock.method(AdminDashboardService, 'getPlatformGrowth', async () => mockData);

    const req = { query: {} };
    const res = makeRes();
    const next = makeNext();

    await getPlatformGrowth(req, res, next);

    assert.equal(res._status, 200);
    assert.equal(res._json.success, true);
    assert.equal(res._json.data.meta.range, 'month');
    assert.equal(next.called, false);

    restore.mock.restore();
  });

  it('accepts range=30days', async () => {
    const restore = mock.method(AdminDashboardService, 'getPlatformGrowth', async () => ({ lastUpdated: '' }));

    const req = { query: { range: '30days' } };
    const res = makeRes();
    const next = makeNext();

    await getPlatformGrowth(req, res, next);

    assert.equal(res._status, 200);
    assert.equal(res._json.data.meta.range, '30days');

    restore.mock.restore();
  });

  it('accepts range=yearly', async () => {
    const restore = mock.method(AdminDashboardService, 'getPlatformGrowth', async () => ({ lastUpdated: '' }));

    const req = { query: { range: 'yearly' } };
    const res = makeRes();
    const next = makeNext();

    await getPlatformGrowth(req, res, next);

    assert.equal(res._status, 200);

    restore.mock.restore();
  });

  it('rejects invalid range with 400', async () => {
    const req = { query: { range: 'weekly' } };
    const res = makeRes();
    const next = makeNext();

    await getPlatformGrowth(req, res, next);

    assert.equal(res._status, 400);
    assert.equal(res._json.success, false);
    assert.match(res._json.message, /Invalid range/);
  });

  it('rejects numeric range', async () => {
    const req = { query: { range: '7' } };
    const res = makeRes();
    const next = makeNext();

    await getPlatformGrowth(req, res, next);

    assert.equal(res._status, 400);
  });

  it('forwards service errors to next()', async () => {
    const restore = mock.method(AdminDashboardService, 'getPlatformGrowth', async () => {
      throw new Error('Service error');
    });

    const req = { query: { range: 'month' } };
    const res = makeRes();
    const next = makeNext();

    await getPlatformGrowth(req, res, next);

    assert.equal(next.called, true);

    restore.mock.restore();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// getContentModeration
// ═══════════════════════════════════════════════════════════════════════════════

describe('getContentModeration Controller', () => {
  it('returns 200 on success', async () => {
    const restore = mock.method(AdminDashboardService, 'getContentModeration', async () => ({
      resolved: 50, reviewing: 10, pending: 5, lastUpdated: ''
    }));

    const req = {};
    const res = makeRes();
    const next = makeNext();

    await getContentModeration(req, res, next);

    assert.equal(res._status, 200);
    assert.equal(res._json.success, true);
    assert.equal(res._json.data.resolved, 50);

    restore.mock.restore();
  });

  it('forwards errors to next()', async () => {
    const restore = mock.method(AdminDashboardService, 'getContentModeration', async () => {
      throw new Error('fail');
    });

    const req = {};
    const res = makeRes();
    const next = makeNext();

    await getContentModeration(req, res, next);

    assert.equal(next.called, true);

    restore.mock.restore();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// getBusinessEngagement
// ═══════════════════════════════════════════════════════════════════════════════

describe('getBusinessEngagement Controller', () => {
  it('returns 200 with engagement data', async () => {
    const restore = mock.method(AdminDashboardService, 'getBusinessEngagement', async () => ([
      { category: 'Food', count: 30 },
    ]));

    const req = {};
    const res = makeRes();
    const next = makeNext();

    await getBusinessEngagement(req, res, next);

    assert.equal(res._status, 200);
    assert.equal(res._json.success, true);
    assert.ok(res._json.data.engagement);

    restore.mock.restore();
  });

  it('forwards errors to next()', async () => {
    const restore = mock.method(AdminDashboardService, 'getBusinessEngagement', async () => {
      throw new Error('fail');
    });

    const req = {};
    const res = makeRes();
    const next = makeNext();

    await getBusinessEngagement(req, res, next);

    assert.equal(next.called, true);

    restore.mock.restore();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// getRevenueOverview
// ═══════════════════════════════════════════════════════════════════════════════

describe('getRevenueOverview Controller', () => {
  it('returns 200 with revenue data', async () => {
    const restore = mock.method(AdminDashboardService, 'getRevenueOverviewStats', async () => ({
      totalRevenue: 500000, lastUpdated: ''
    }));

    const req = {};
    const res = makeRes();
    const next = makeNext();

    await getRevenueOverview(req, res, next);

    assert.equal(res._status, 200);
    assert.equal(res._json.success, true);
    assert.equal(res._json.data.totalRevenue, 500000);

    restore.mock.restore();
  });

  it('forwards errors to next()', async () => {
    const restore = mock.method(AdminDashboardService, 'getRevenueOverviewStats', async () => {
      throw new Error('fail');
    });

    const req = {};
    const res = makeRes();
    const next = makeNext();

    await getRevenueOverview(req, res, next);

    assert.equal(next.called, true);

    restore.mock.restore();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// getRevenueTrajectory
// ═══════════════════════════════════════════════════════════════════════════════

describe('getRevenueTrajectory Controller', () => {
  it('returns 200 with default year (no query)', async () => {
    const restore = mock.method(AdminDashboardService, 'getRevenueTrajectory', async () => ({
      months: [], lastUpdated: ''
    }));

    const req = { query: {} };
    const res = makeRes();
    const next = makeNext();

    await getRevenueTrajectory(req, res, next);

    assert.equal(res._status, 200);
    assert.equal(res._json.success, true);
    assert.equal(res._json.data.meta.year, new Date().getFullYear());

    restore.mock.restore();
  });

  it('accepts valid year=2024', async () => {
    const restore = mock.method(AdminDashboardService, 'getRevenueTrajectory', async () => ({
      months: [], lastUpdated: ''
    }));

    const req = { query: { year: '2024' } };
    const res = makeRes();
    const next = makeNext();

    await getRevenueTrajectory(req, res, next);

    assert.equal(res._status, 200);
    assert.equal(res._json.data.meta.year, '2024');

    restore.mock.restore();
  });

  it('accepts boundary year=2020', async () => {
    const restore = mock.method(AdminDashboardService, 'getRevenueTrajectory', async () => ({
      months: [], lastUpdated: ''
    }));

    const req = { query: { year: '2020' } };
    const res = makeRes();
    const next = makeNext();

    await getRevenueTrajectory(req, res, next);

    assert.equal(res._status, 200);

    restore.mock.restore();
  });

  it('accepts boundary year=2100', async () => {
    const restore = mock.method(AdminDashboardService, 'getRevenueTrajectory', async () => ({
      months: [], lastUpdated: ''
    }));

    const req = { query: { year: '2100' } };
    const res = makeRes();
    const next = makeNext();

    await getRevenueTrajectory(req, res, next);

    assert.equal(res._status, 200);

    restore.mock.restore();
  });

  it('rejects year=2019 (below minimum)', async () => {
    const req = { query: { year: '2019' } };
    const res = makeRes();
    const next = makeNext();

    await getRevenueTrajectory(req, res, next);

    assert.equal(res._status, 400);
    assert.equal(res._json.success, false);
    assert.match(res._json.message, /Invalid year/);
  });

  it('rejects year=2101 (above maximum)', async () => {
    const req = { query: { year: '2101' } };
    const res = makeRes();
    const next = makeNext();

    await getRevenueTrajectory(req, res, next);

    assert.equal(res._status, 400);
  });

  it('rejects non-numeric year', async () => {
    const req = { query: { year: 'abc' } };
    const res = makeRes();
    const next = makeNext();

    await getRevenueTrajectory(req, res, next);

    assert.equal(res._status, 400);
    assert.match(res._json.message, /Invalid year/);
  });

  it('forwards service errors to next()', async () => {
    const restore = mock.method(AdminDashboardService, 'getRevenueTrajectory', async () => {
      throw new Error('fail');
    });

    const req = { query: {} };
    const res = makeRes();
    const next = makeNext();

    await getRevenueTrajectory(req, res, next);

    assert.equal(next.called, true);

    restore.mock.restore();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// getRevenueBreakdown
// ═══════════════════════════════════════════════════════════════════════════════

describe('getRevenueBreakdown Controller', () => {
  it('returns 200 on success', async () => {
    const restore = mock.method(AdminDashboardService, 'getRevenueBreakdown', async () => ({
      categories: [{ name: 'Boosts', amount: 100000 }], lastUpdated: ''
    }));

    const req = {};
    const res = makeRes();
    const next = makeNext();

    await getRevenueBreakdown(req, res, next);

    assert.equal(res._status, 200);
    assert.equal(res._json.success, true);

    restore.mock.restore();
  });

  it('forwards errors to next()', async () => {
    const restore = mock.method(AdminDashboardService, 'getRevenueBreakdown', async () => {
      throw new Error('fail');
    });

    const req = {};
    const res = makeRes();
    const next = makeNext();

    await getRevenueBreakdown(req, res, next);

    assert.equal(next.called, true);

    restore.mock.restore();
  });
});
