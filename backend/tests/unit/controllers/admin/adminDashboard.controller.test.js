/**
 * Admin Dashboard Controller — Unit Test Suite (Industry-Level)
 * ──────────────────────────────────────────────────────────────
 * Tests all 7 admin dashboard controller endpoints.
 * Uses node:test mock.method to mock the AdminDashboardService.
 *
 * Run: node --test tests/unit/controllers/adminDashboard.controller.test.js
 */

import { describe, it, mock, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { mockRes, mockNext } from '../../../helpers/testUtils.js';
import AdminDashboardService from '../../../../src/services/adminDashboard.service.js';
import {
  getDashboardStats,
  getPlatformGrowth,
  getContentModeration,
  getBusinessEngagement,
  getRevenueOverview,
  getRevenueTrajectory,
  getRevenueBreakdown,
} from '../../../../src/controllers/admin/adminDashboard.controller.js';

// ─── Automatic Mock Cleanup ─────────────────────────────────────────────────
afterEach(() => {
  mock.restoreAll();
});

// ═══════════════════════════════════════════════════════════════════════════════
// getDashboardStats
// ═══════════════════════════════════════════════════════════════════════════════

describe('getDashboardStats Controller', () => {
  it('returns 200 with stats on success', async () => {
    const mockStats = { totalStudents: 1200, totalBusinesses: 45, lastUpdated: new Date().toISOString() };
    mock.method(AdminDashboardService, 'getDashboardStats', async () => mockStats);

    const req = { query: {} };
    const res = mockRes();
    const next = mockNext();

    await getDashboardStats(req, res, next);

    assert.equal(res._status, 200);
    assert.equal(res._json.success, true);
    assert.equal(res._json.data.totalStudents, 1200);
    assert.ok(res._json.data.timestamp);
    assert.equal(next.called, false);
  });

  it('forwards errors to next()', async () => {
    mock.method(AdminDashboardService, 'getDashboardStats', async () => {
      throw new Error('DB connection failed');
    });

    const req = { query: {} };
    const res = mockRes();
    const next = mockNext();

    await getDashboardStats(req, res, next);

    assert.equal(next.called, true);
    assert.equal(next.error.message, 'DB connection failed');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// getPlatformGrowth
// ═══════════════════════════════════════════════════════════════════════════════

describe('getPlatformGrowth Controller', () => {
  it('returns 200 with default range (month)', async () => {
    const mockData = { labels: ['Jan', 'Feb'], values: [10, 20], lastUpdated: new Date().toISOString() };
    mock.method(AdminDashboardService, 'getPlatformGrowth', async () => mockData);

    const req = { query: {} };
    const res = mockRes();
    const next = mockNext();

    await getPlatformGrowth(req, res, next);

    assert.equal(res._status, 200);
    assert.equal(res._json.success, true);
    assert.equal(res._json.data.meta.range, 'month');
    assert.equal(next.called, false);
  });

  it('accepts range=30days', async () => {
    mock.method(AdminDashboardService, 'getPlatformGrowth', async () => ({ lastUpdated: '' }));

    const req = { query: { range: '30days' } };
    const res = mockRes();
    const next = mockNext();

    await getPlatformGrowth(req, res, next);

    assert.equal(res._status, 200);
    assert.equal(res._json.data.meta.range, '30days');
  });

  it('accepts range=yearly', async () => {
    mock.method(AdminDashboardService, 'getPlatformGrowth', async () => ({ lastUpdated: '' }));

    const req = { query: { range: 'yearly' } };
    const res = mockRes();
    const next = mockNext();

    await getPlatformGrowth(req, res, next);

    assert.equal(res._status, 200);
  });

  it('rejects invalid range with 400', async () => {
    const req = { query: { range: 'weekly' } };
    const res = mockRes();
    const next = mockNext();

    await getPlatformGrowth(req, res, next);

    assert.equal(res._status, 400);
    assert.equal(res._json.success, false);
    assert.match(res._json.message, /Invalid range/);
  });

  it('rejects numeric range', async () => {
    const req = { query: { range: '7' } };
    const res = mockRes();
    const next = mockNext();

    await getPlatformGrowth(req, res, next);

    assert.equal(res._status, 400);
  });

  it('forwards service errors to next()', async () => {
    mock.method(AdminDashboardService, 'getPlatformGrowth', async () => {
      throw new Error('Service error');
    });

    const req = { query: { range: 'month' } };
    const res = mockRes();
    const next = mockNext();

    await getPlatformGrowth(req, res, next);

    assert.equal(next.called, true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// getContentModeration
// ═══════════════════════════════════════════════════════════════════════════════

describe('getContentModeration Controller', () => {
  it('returns 200 on success', async () => {
    mock.method(AdminDashboardService, 'getContentModeration', async () => ({
      resolved: 50, reviewing: 10, pending: 5, lastUpdated: ''
    }));

    const req = {};
    const res = mockRes();
    const next = mockNext();

    await getContentModeration(req, res, next);

    assert.equal(res._status, 200);
    assert.equal(res._json.success, true);
    assert.equal(res._json.data.resolved, 50);
  });

  it('forwards errors to next()', async () => {
    mock.method(AdminDashboardService, 'getContentModeration', async () => {
      throw new Error('fail');
    });

    const req = {};
    const res = mockRes();
    const next = mockNext();

    await getContentModeration(req, res, next);

    assert.equal(next.called, true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// getBusinessEngagement
// ═══════════════════════════════════════════════════════════════════════════════

describe('getBusinessEngagement Controller', () => {
  it('returns 200 with engagement data', async () => {
    mock.method(AdminDashboardService, 'getBusinessEngagement', async () => ([
      { category: 'Food', count: 30 },
    ]));

    const req = {};
    const res = mockRes();
    const next = mockNext();

    await getBusinessEngagement(req, res, next);

    assert.equal(res._status, 200);
    assert.equal(res._json.success, true);
    assert.ok(res._json.data.engagement);
  });

  it('forwards errors to next()', async () => {
    mock.method(AdminDashboardService, 'getBusinessEngagement', async () => {
      throw new Error('fail');
    });

    const req = {};
    const res = mockRes();
    const next = mockNext();

    await getBusinessEngagement(req, res, next);

    assert.equal(next.called, true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// getRevenueOverview
// ═══════════════════════════════════════════════════════════════════════════════

describe('getRevenueOverview Controller', () => {
  it('returns 200 with revenue data', async () => {
    mock.method(AdminDashboardService, 'getRevenueOverviewStats', async () => ({
      totalRevenue: 500000, lastUpdated: ''
    }));

    const req = {};
    const res = mockRes();
    const next = mockNext();

    await getRevenueOverview(req, res, next);

    assert.equal(res._status, 200);
    assert.equal(res._json.success, true);
    assert.equal(res._json.data.totalRevenue, 500000);
  });

  it('forwards errors to next()', async () => {
    mock.method(AdminDashboardService, 'getRevenueOverviewStats', async () => {
      throw new Error('fail');
    });

    const req = {};
    const res = mockRes();
    const next = mockNext();

    await getRevenueOverview(req, res, next);

    assert.equal(next.called, true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// getRevenueTrajectory
// ═══════════════════════════════════════════════════════════════════════════════

describe('getRevenueTrajectory Controller', () => {
  it('returns 200 with default year (no query)', async () => {
    mock.method(AdminDashboardService, 'getRevenueTrajectory', async () => ({
      months: [], lastUpdated: ''
    }));

    const req = { query: {} };
    const res = mockRes();
    const next = mockNext();

    await getRevenueTrajectory(req, res, next);

    assert.equal(res._status, 200);
    assert.equal(res._json.success, true);
    assert.equal(res._json.data.meta.year, new Date().getFullYear());
  });

  it('accepts valid year=2024', async () => {
    mock.method(AdminDashboardService, 'getRevenueTrajectory', async () => ({
      months: [], lastUpdated: ''
    }));

    const req = { query: { year: '2024' } };
    const res = mockRes();
    const next = mockNext();

    await getRevenueTrajectory(req, res, next);

    assert.equal(res._status, 200);
    assert.equal(res._json.data.meta.year, '2024');
  });

  it('accepts boundary year=2020', async () => {
    mock.method(AdminDashboardService, 'getRevenueTrajectory', async () => ({
      months: [], lastUpdated: ''
    }));

    const req = { query: { year: '2020' } };
    const res = mockRes();
    const next = mockNext();

    await getRevenueTrajectory(req, res, next);

    assert.equal(res._status, 200);
  });

  it('accepts boundary year=2100', async () => {
    mock.method(AdminDashboardService, 'getRevenueTrajectory', async () => ({
      months: [], lastUpdated: ''
    }));

    const req = { query: { year: '2100' } };
    const res = mockRes();
    const next = mockNext();

    await getRevenueTrajectory(req, res, next);

    assert.equal(res._status, 200);
  });

  it('rejects year=2019 (below minimum)', async () => {
    const req = { query: { year: '2019' } };
    const res = mockRes();
    const next = mockNext();

    await getRevenueTrajectory(req, res, next);

    assert.equal(res._status, 400);
    assert.equal(res._json.success, false);
    assert.match(res._json.message, /Invalid year/);
  });

  it('rejects year=2101 (above maximum)', async () => {
    const req = { query: { year: '2101' } };
    const res = mockRes();
    const next = mockNext();

    await getRevenueTrajectory(req, res, next);

    assert.equal(res._status, 400);
  });

  it('rejects non-numeric year', async () => {
    const req = { query: { year: 'abc' } };
    const res = mockRes();
    const next = mockNext();

    await getRevenueTrajectory(req, res, next);

    assert.equal(res._status, 400);
    assert.match(res._json.message, /Invalid year/);
  });

  it('forwards service errors to next()', async () => {
    mock.method(AdminDashboardService, 'getRevenueTrajectory', async () => {
      throw new Error('fail');
    });

    const req = { query: {} };
    const res = mockRes();
    const next = mockNext();

    await getRevenueTrajectory(req, res, next);

    assert.equal(next.called, true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// getRevenueBreakdown
// ═══════════════════════════════════════════════════════════════════════════════

describe('getRevenueBreakdown Controller', () => {
  it('returns 200 on success', async () => {
    mock.method(AdminDashboardService, 'getRevenueBreakdown', async () => ({
      categories: [{ name: 'Boosts', amount: 100000 }], lastUpdated: ''
    }));

    const req = {};
    const res = mockRes();
    const next = mockNext();

    await getRevenueBreakdown(req, res, next);

    assert.equal(res._status, 200);
    assert.equal(res._json.success, true);
  });

  it('forwards errors to next()', async () => {
    mock.method(AdminDashboardService, 'getRevenueBreakdown', async () => {
      throw new Error('fail');
    });

    const req = {};
    const res = mockRes();
    const next = mockNext();

    await getRevenueBreakdown(req, res, next);

    assert.equal(next.called, true);
  });
});
