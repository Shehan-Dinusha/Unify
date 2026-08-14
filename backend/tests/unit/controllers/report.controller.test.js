/**
 * Report Controller — Unit Test Suite
 * ─────────────────────────────────────
 * Tests for all report controllers:
 *   - createReport (student)
 *   - getStudentReports (student)
 *   - withdrawReport (student)
 *   - updateReport (admin actions: dismiss, resolve, delete_post, suspend_user, add_note)
 *   - getReportQueue (admin)
 *   - getStatistics (admin)
 *
 * Run: node --test tests/unit/controllers/report.controller.test.js
 */

import { describe, it, mock } from 'node:test';
import assert from 'node:assert/strict';
import StudentReport from '../../../src/modules/StudentReport.model.js';

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
// createReport Controller
// ═══════════════════════════════════════════════════════════════════════════════

describe('createReport Controller', () => {
  it('returns 401 when student is not authenticated', async () => {
    const { createReport } = await import('../../../src/controllers/report/createReport.controller.js');

    const req = { user: null, body: { reportType: 'post', category: 'spam', reportedEntityId: '42' } };
    const res = makeRes();
    const next = makeNext();

    await createReport(req, res, next);

    assert.equal(res._status, 401);
    assert.equal(res._json.success, false);
    assert.match(res._json.message, /authentication/i);
  });

  it('returns 409 when duplicate report exists', async () => {
    const findMock = mock.method(StudentReport, 'findOne', async () => ({
      id: 1, status: 'Pending Review',
    }));

    const { createReport } = await import('../../../src/controllers/report/createReport.controller.js');

    const req = {
      user: { id: 10 },
      body: { reportType: 'post', category: 'spam', reportedEntityId: '42' },
      files: null,
    };
    const res = makeRes();
    const next = makeNext();

    await createReport(req, res, next);

    assert.equal(res._status, 409);
    assert.equal(res._json.success, false);
    assert.match(res._json.message, /already reported/i);

    findMock.mock.restore();
  });

  it('creates report successfully and returns 201', async () => {
    const findMock = mock.method(StudentReport, 'findOne', async () => null);
    const createMock = mock.method(StudentReport, 'create', async (data) => ({
      id: 1, reportId: data.reportId, status: data.status,
    }));

    const { createReport } = await import('../../../src/controllers/report/createReport.controller.js');

    const req = {
      user: { id: 10 },
      body: {
        reportType: 'user',
        category: 'harassment',
        reportedEntityId: '5',
        additionalDetails: 'This user is harassing me',
      },
      files: null,
    };
    const res = makeRes();
    const next = makeNext();

    await createReport(req, res, next);

    assert.equal(res._status, 201);
    assert.equal(res._json.success, true);
    assert.ok(res._json.data.reportId);
    assert.equal(res._json.data.status, 'Pending Review');

    findMock.mock.restore();
    createMock.mock.restore();
  });

  it('handles file uploads', async () => {
    const findMock = mock.method(StudentReport, 'findOne', async () => null);
    let capturedData;
    const createMock = mock.method(StudentReport, 'create', async (data) => {
      capturedData = data;
      return { id: 2, reportId: data.reportId, status: data.status };
    });

    const { createReport } = await import('../../../src/controllers/report/createReport.controller.js');

    const req = {
      user: { id: 10 },
      body: { reportType: 'post', category: 'inappropriate', reportedEntityId: '99' },
      files: [
        { location: 'uploads/evidence-1.jpg' },
        { location: 'uploads/evidence-2.png' },
      ],
    };
    const res = makeRes();
    const next = makeNext();

    await createReport(req, res, next);

    assert.equal(res._status, 201);
    assert.equal(capturedData.evidenceFiles.length, 2);
    assert.equal(capturedData.evidenceFiles[0], 'uploads/evidence-1.jpg');

    findMock.mock.restore();
    createMock.mock.restore();
  });

  it('generates correct title format', async () => {
    const findMock = mock.method(StudentReport, 'findOne', async () => null);
    let capturedTitle;
    const createMock = mock.method(StudentReport, 'create', async (data) => {
      capturedTitle = data.title;
      return { id: 3, reportId: data.reportId, status: data.status };
    });

    const { createReport } = await import('../../../src/controllers/report/createReport.controller.js');

    const req = {
      user: { id: 10 },
      body: { reportType: 'comment', category: 'spam', reportedEntityId: '7' },
      files: null,
    };
    const res = makeRes();
    const next = makeNext();

    await createReport(req, res, next);

    assert.equal(capturedTitle, 'Report: Spam in Comment');

    findMock.mock.restore();
    createMock.mock.restore();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// getStudentReports Controller
// ═══════════════════════════════════════════════════════════════════════════════

describe('getStudentReports Controller', () => {
  it('returns 401 when student is not authenticated', async () => {
    const { getStudentReports } = await import('../../../src/controllers/report/getStudentReports.controller.js');

    const req = { user: null, query: {} };
    const res = makeRes();
    const next = makeNext();

    await getStudentReports(req, res, next);

    assert.equal(res._status, 401);
  });

  it('returns 200 with reports on success', async () => {
    const findMock = mock.method(StudentReport, 'findAndCountAll', async () => ({
      count: 1,
      rows: [{
        id: 1, reportId: '#RPT-20260725-ABCD', title: 'Report: Spam in Post',
        category: 'spam', createdAt: new Date(), status: 'Pending Review',
        reportType: 'post', reportedEntityId: '42', additionalDetails: 'Test',
      }],
    }));

    const { getStudentReports } = await import('../../../src/controllers/report/getStudentReports.controller.js');

    const req = { user: { id: 10 }, query: {} };
    const res = makeRes();
    const next = makeNext();

    await getStudentReports(req, res, next);

    assert.equal(res._status, 200);
    assert.equal(res._json.success, true);
    assert.ok(res._json.data.reports);
    assert.ok(res._json.data.pagination);

    findMock.mock.restore();
  });

  it('returns empty array when no reports', async () => {
    const findMock = mock.method(StudentReport, 'findAndCountAll', async () => ({
      count: 0, rows: [],
    }));

    const { getStudentReports } = await import('../../../src/controllers/report/getStudentReports.controller.js');

    const req = { user: { id: 10 }, query: {} };
    const res = makeRes();
    const next = makeNext();

    await getStudentReports(req, res, next);

    assert.equal(res._status, 200);
    assert.equal(res._json.data.reports.length, 0);
    assert.equal(res._json.data.pagination.total, 0);

    findMock.mock.restore();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// withdrawReport Controller
// ═══════════════════════════════════════════════════════════════════════════════

describe('withdrawReport Controller', () => {
  it('returns 401 when student is not authenticated', async () => {
    const { withdrawReport } = await import('../../../src/controllers/report/withdrawReport.controller.js');

    const req = { params: { id: '1' }, body: { withdrawalReason: 'Resolved privately' }, user: null };
    const res = makeRes();
    const next = makeNext();

    await withdrawReport(req, res, next);

    assert.equal(res._status, 401);
  });

  it('returns 400 for withdrawal reason too short (< 5 chars)', async () => {
    const { withdrawReport } = await import('../../../src/controllers/report/withdrawReport.controller.js');

    const req = { params: { id: '1' }, body: { withdrawalReason: 'Ok' }, user: { id: 10 } };
    const res = makeRes();
    const next = makeNext();

    await withdrawReport(req, res, next);

    assert.equal(res._status, 400);
    assert.match(res._json.message, /5/);
  });

  it('returns 400 for withdrawal reason too long (> 500 chars)', async () => {
    const { withdrawReport } = await import('../../../src/controllers/report/withdrawReport.controller.js');

    const req = {
      params: { id: '1' },
      body: { withdrawalReason: 'x'.repeat(501) },
      user: { id: 10 },
    };
    const res = makeRes();
    const next = makeNext();

    await withdrawReport(req, res, next);

    assert.equal(res._status, 400);
    assert.match(res._json.message, /500/);
  });

  it('returns 404 when report not found', async () => {
    const findMock = mock.method(StudentReport, 'findOne', async () => null);

    const { withdrawReport } = await import('../../../src/controllers/report/withdrawReport.controller.js');

    const req = {
      params: { id: '99999' },
      body: { withdrawalReason: 'Resolved privately' },
      user: { id: 10 },
    };
    const res = makeRes();
    const next = makeNext();

    await withdrawReport(req, res, next);

    assert.equal(res._status, 404);
    assert.match(res._json.message, /not found/i);

    findMock.mock.restore();
  });

  it('returns 400 when report is already Withdrawn', async () => {
    const findMock = mock.method(StudentReport, 'findOne', async () => ({
      id: 1, status: 'Withdrawn', studentId: 10,
    }));

    const { withdrawReport } = await import('../../../src/controllers/report/withdrawReport.controller.js');

    const req = {
      params: { id: '1' },
      body: { withdrawalReason: 'Changed my mind' },
      user: { id: 10 },
    };
    const res = makeRes();
    const next = makeNext();

    await withdrawReport(req, res, next);

    assert.equal(res._status, 400);
    assert.match(res._json.message, /Withdrawn/);

    findMock.mock.restore();
  });

  it('returns 400 when report is already Resolved', async () => {
    const findMock = mock.method(StudentReport, 'findOne', async () => ({
      id: 1, status: 'Resolved', studentId: 10,
    }));

    const { withdrawReport } = await import('../../../src/controllers/report/withdrawReport.controller.js');

    const req = {
      params: { id: '1' },
      body: { withdrawalReason: 'Changed my mind' },
      user: { id: 10 },
    };
    const res = makeRes();
    const next = makeNext();

    await withdrawReport(req, res, next);

    assert.equal(res._status, 400);
    assert.match(res._json.message, /Resolved/);

    findMock.mock.restore();
  });

  it('withdraws successfully and returns 200', async () => {
    const mockReport = {
      id: 1, reportId: '#RPT-20260725-ABCD', status: 'Pending Review', studentId: 10,
      save: mock.fn(async () => {}),
    };
    const findMock = mock.method(StudentReport, 'findOne', async () => mockReport);

    const { withdrawReport } = await import('../../../src/controllers/report/withdrawReport.controller.js');

    const req = {
      params: { id: '1' },
      body: { withdrawalReason: 'Resolved privately with the other party' },
      user: { id: 10 },
    };
    const res = makeRes();
    const next = makeNext();

    await withdrawReport(req, res, next);

    assert.equal(res._status, 200);
    assert.equal(res._json.success, true);
    assert.equal(res._json.data.status, 'Withdrawn');
    assert.ok(res._json.data.withdrawnAt);

    findMock.mock.restore();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// updateReport Controller (Admin Actions)
// ═══════════════════════════════════════════════════════════════════════════════

describe('updateReport Controller', () => {
  it('returns 404 when report not found', async () => {
    const findMock = mock.method(StudentReport, 'findOne', async () => null);

    const { updateReport } = await import('../../../src/controllers/report/updateReport.controller.js');

    const req = {
      params: { id: '99999' },
      body: { status: 'In Progress' },
      user: { id: 1 },
    };
    const res = makeRes();
    const next = makeNext();

    await updateReport(req, res, next);

    assert.equal(res._status, 404);
    assert.match(res._json.message, /not found/i);

    findMock.mock.restore();
  });

  it('returns 400 when report is already Withdrawn', async () => {
    const findMock = mock.method(StudentReport, 'findOne', async () => ({
      id: 1, status: 'Withdrawn',
    }));

    const { updateReport } = await import('../../../src/controllers/report/updateReport.controller.js');

    const req = {
      params: { id: '1' },
      body: { status: 'In Progress' },
      user: { id: 1 },
    };
    const res = makeRes();
    const next = makeNext();

    await updateReport(req, res, next);

    assert.equal(res._status, 400);
    assert.match(res._json.message, /withdrawn/i);

    findMock.mock.restore();
  });

  it('returns 400 when report is already Resolved', async () => {
    const findMock = mock.method(StudentReport, 'findOne', async () => ({
      id: 1, status: 'Resolved',
    }));

    const { updateReport } = await import('../../../src/controllers/report/updateReport.controller.js');

    const req = {
      params: { id: '1' },
      body: { action: 'resolve' },
      user: { id: 1 },
    };
    const res = makeRes();
    const next = makeNext();

    await updateReport(req, res, next);

    assert.equal(res._status, 400);
    assert.match(res._json.message, /finalized/i);

    findMock.mock.restore();
  });

  it('returns 400 when report is already Dismissed', async () => {
    const findMock = mock.method(StudentReport, 'findOne', async () => ({
      id: 1, status: 'Dismissed',
    }));

    const { updateReport } = await import('../../../src/controllers/report/updateReport.controller.js');

    const req = {
      params: { id: '1' },
      body: { action: 'resolve' },
      user: { id: 1 },
    };
    const res = makeRes();
    const next = makeNext();

    await updateReport(req, res, next);

    assert.equal(res._status, 400);

    findMock.mock.restore();
  });

  // ── Action: dismiss ───────────────────────────────────────────────────────

  it('returns 400 for dismiss without reason', async () => {
    const mockReport = {
      id: 1, status: 'Pending Review', studentId: 5, adminNotes: null,
      save: mock.fn(async () => {}),
    };
    const findMock = mock.method(StudentReport, 'findOne', async () => mockReport);

    const { updateReport } = await import('../../../src/controllers/report/updateReport.controller.js');

    const req = {
      params: { id: '1' },
      body: { action: 'dismiss' },
      user: { id: 1 },
    };
    const res = makeRes();
    const next = makeNext();

    await updateReport(req, res, next);

    assert.equal(res._status, 400);
    assert.match(res._json.message, /reason/i);

    findMock.mock.restore();
  });

  // ── Action: add_note ──────────────────────────────────────────────────────

  it('returns 400 for add_note with empty notes', async () => {
    const mockReport = {
      id: 1, status: 'In Progress', studentId: 5, adminNotes: null,
      save: mock.fn(async () => {}),
    };
    const findMock = mock.method(StudentReport, 'findOne', async () => mockReport);

    const { updateReport } = await import('../../../src/controllers/report/updateReport.controller.js');

    const req = {
      params: { id: '1' },
      body: { action: 'add_note', notes: '' },
      user: { id: 1 },
    };
    const res = makeRes();
    const next = makeNext();

    await updateReport(req, res, next);

    assert.equal(res._status, 400);
    assert.match(res._json.message, /note content/i);

    findMock.mock.restore();
  });

  it('returns 400 for add_note with whitespace-only notes', async () => {
    const mockReport = {
      id: 1, status: 'In Progress', studentId: 5, adminNotes: null,
      save: mock.fn(async () => {}),
    };
    const findMock = mock.method(StudentReport, 'findOne', async () => mockReport);

    const { updateReport } = await import('../../../src/controllers/report/updateReport.controller.js');

    const req = {
      params: { id: '1' },
      body: { action: 'add_note', notes: '   ' },
      user: { id: 1 },
    };
    const res = makeRes();
    const next = makeNext();

    await updateReport(req, res, next);

    assert.equal(res._status, 400);

    findMock.mock.restore();
  });

  // ── Action: invalid ───────────────────────────────────────────────────────

  it('returns 400 for invalid action', async () => {
    const mockReport = {
      id: 1, status: 'Pending Review', studentId: 5, adminNotes: null,
      save: mock.fn(async () => {}),
    };
    const findMock = mock.method(StudentReport, 'findOne', async () => mockReport);

    const { updateReport } = await import('../../../src/controllers/report/updateReport.controller.js');

    const req = {
      params: { id: '1' },
      body: { action: 'ban_user' },
      user: { id: 1 },
    };
    const res = makeRes();
    const next = makeNext();

    await updateReport(req, res, next);

    assert.equal(res._status, 400);
    assert.match(res._json.message, /Invalid action/i);

    findMock.mock.restore();
  });

  // ── Legacy status update ──────────────────────────────────────────────────

  it('updates status via legacy path (no action)', async () => {
    const mockReport = {
      id: 1, status: 'Pending Review', studentId: 5, adminNotes: null,
      save: mock.fn(async () => {}),
    };
    const findMock = mock.method(StudentReport, 'findOne', async () => mockReport);

    const { updateReport } = await import('../../../src/controllers/report/updateReport.controller.js');

    const req = {
      params: { id: '1' },
      body: { status: 'In Progress' },
      user: { id: 1 },
    };
    const res = makeRes();
    const next = makeNext();

    await updateReport(req, res, next);

    assert.equal(res._status, 200);
    assert.equal(res._json.success, true);
    assert.equal(mockReport.status, 'In Progress');

    findMock.mock.restore();
  });

  it('updates priority via legacy path', async () => {
    const mockReport = {
      id: 1, status: 'In Progress', priority: 'Medium', studentId: 5, adminNotes: null,
      save: mock.fn(async () => {}),
    };
    const findMock = mock.method(StudentReport, 'findOne', async () => mockReport);

    const { updateReport } = await import('../../../src/controllers/report/updateReport.controller.js');

    const req = {
      params: { id: '1' },
      body: { priority: 'Critical' },
      user: { id: 1 },
    };
    const res = makeRes();
    const next = makeNext();

    await updateReport(req, res, next);

    assert.equal(res._status, 200);
    assert.equal(mockReport.priority, 'Critical');

    findMock.mock.restore();
  });

  it('sets resolvedAt when resolving via legacy path', async () => {
    const mockReport = {
      id: 1, status: 'In Progress', studentId: 5, adminNotes: null,
      resolvedAt: null,
      save: mock.fn(async () => {}),
    };
    const findMock = mock.method(StudentReport, 'findOne', async () => mockReport);

    const { updateReport } = await import('../../../src/controllers/report/updateReport.controller.js');

    const req = {
      params: { id: '1' },
      body: { status: 'Resolved' },
      user: { id: 1 },
    };
    const res = makeRes();
    const next = makeNext();

    await updateReport(req, res, next);

    assert.equal(res._status, 200);
    assert.ok(mockReport.resolvedAt);
    assert.ok(mockReport.resolvedAt instanceof Date);

    findMock.mock.restore();
  });

  it('transitions Pending Review → In Progress when adminNotes added (legacy)', async () => {
    const mockReport = {
      id: 1, status: 'Pending Review', studentId: 5, adminNotes: null,
      save: mock.fn(async () => {}),
    };
    const findMock = mock.method(StudentReport, 'findOne', async () => mockReport);

    const { updateReport } = await import('../../../src/controllers/report/updateReport.controller.js');

    const req = {
      params: { id: '1' },
      body: { adminNotes: 'Looking into this report' },
      user: { id: 1 },
    };
    const res = makeRes();
    const next = makeNext();

    await updateReport(req, res, next);

    assert.equal(res._status, 200);
    assert.equal(mockReport.status, 'In Progress');

    findMock.mock.restore();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// getReportQueue Controller (Admin)
// ═══════════════════════════════════════════════════════════════════════════════

describe('getReportQueue Controller', () => {
  it('returns 200 with report queue', async () => {
    const findMock = mock.method(StudentReport, 'findAndCountAll', async () => ({
      count: 5,
      rows: [
        { id: 1, reportId: '#RPT-1', title: 'Test', status: 'Pending Review' },
      ],
    }));

    const { getReportQueue } = await import('../../../src/controllers/report/getReportQueue.controller.js');

    const req = { query: {} };
    const res = makeRes();
    const next = makeNext();

    await getReportQueue(req, res, next);

    assert.equal(res._status, 200);
    assert.equal(res._json.success, true);
    assert.ok(res._json.data.reports);
    assert.ok(res._json.data.pagination);

    findMock.mock.restore();
  });

  it('returns empty array for no results', async () => {
    const findMock = mock.method(StudentReport, 'findAndCountAll', async () => ({
      count: 0, rows: [],
    }));

    const { getReportQueue } = await import('../../../src/controllers/report/getReportQueue.controller.js');

    const req = { query: {} };
    const res = makeRes();
    const next = makeNext();

    await getReportQueue(req, res, next);

    assert.equal(res._status, 200);
    assert.equal(res._json.data.reports.length, 0);

    findMock.mock.restore();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// getStatistics Controller (Admin)
// ═══════════════════════════════════════════════════════════════════════════════

describe('getStatistics Controller', () => {
  it('returns 200 with all summary stats', async () => {
    const countMock = mock.method(StudentReport, 'count', async (opts) => {
      if (!opts?.where) return 100;
      if (opts.where.status === 'Pending Review') return 20;
      if (opts.where.status === 'In Progress') return 15;
      if (opts.where.status === 'Resolved') return 60;
      return 5; // criticalFlags or resolvedToday
    });

    const findAllMock = mock.method(StudentReport, 'findAll', async () => [
      { category: 'spam', count: '30' },
      { category: 'harassment', count: '20' },
    ]);

    const { getStatistics } = await import('../../../src/controllers/report/getStatistics.controller.js');

    const req = {};
    const res = makeRes();
    const next = makeNext();

    await getStatistics(req, res, next);

    assert.equal(res._status, 200);
    assert.equal(res._json.success, true);
    assert.ok(res._json.data.summary);
    assert.ok(res._json.data.byCategory);
    assert.ok(res._json.data.byType);
    assert.ok(res._json.data.summary.total !== undefined);
    assert.ok(res._json.data.summary.pending !== undefined);

    countMock.mock.restore();
    findAllMock.mock.restore();
  });
});
