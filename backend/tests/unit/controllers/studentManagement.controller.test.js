/**
 * Student Management Controller — Unit Test Suite
 * ─────────────────────────────────────────────────
 * Tests for all student management endpoints using mocked DB models.
 * Each controller function is tested for:
 *   - Happy path (success response)
 *   - Auth checks (missing user)
 *   - Not found scenarios
 *   - Edge cases and guard clauses
 *
 * Run: node --test tests/unit/controllers/studentManagement.controller.test.js
 */

import { describe, it, mock } from 'node:test';
import assert from 'node:assert/strict';

// We test the controller logic by importing the real controllers
// and mocking the Sequelize models they depend on.
import * as models from '../../../src/modules/index.js';

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
// getStudentStats
// ═══════════════════════════════════════════════════════════════════════════════

describe('getStudentStats Controller', () => {
  it('returns 200 with calculated stats', async () => {
    // Mock User.count to return different values for different queries
    const countMock = mock.method(models.User, 'count', async (opts) => {
      if (!opts?.where) return 100;
      if (opts.where.status === 'Active') return 85;
      if (opts.where.lastActive) return 60;
      return 100;
    });

    const reportCountMock = mock.method(models.StudentReport, 'count', async () => 3);

    // Import after mocking
    const { getStudentStats } = await import('../../../src/controllers/admin/studentManagement.controller.js');

    const req = {};
    const res = makeRes();
    const next = makeNext();

    await getStudentStats(req, res, next);

    assert.equal(res._status, 200);
    assert.equal(res._json.success, true);
    assert.ok(res._json.data.activityRate);
    assert.ok(res._json.data.flaggedSessions !== undefined);
    assert.equal(next.called, false);

    countMock.mock.restore();
    reportCountMock.mock.restore();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// getStudentProfile
// ═══════════════════════════════════════════════════════════════════════════════

describe('getStudentProfile Controller', () => {
  it('returns 404 when student not found', async () => {
    const findOneMock = mock.method(models.User, 'findOne', async () => null);

    const { getStudentProfile } = await import('../../../src/controllers/admin/studentManagement.controller.js');

    const req = { params: { id: '99999' } };
    const res = makeRes();
    const next = makeNext();

    await getStudentProfile(req, res, next);

    assert.equal(res._status, 404);
    assert.equal(res._json.success, false);
    assert.match(res._json.message, /not found/i);

    findOneMock.mock.restore();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// updateStudentStatus
// ═══════════════════════════════════════════════════════════════════════════════

describe('updateStudentStatus Controller', () => {
  it('returns 401 when admin is not authenticated', async () => {
    const { updateStudentStatus } = await import('../../../src/controllers/admin/studentManagement.controller.js');

    const req = {
      params: { id: '1' },
      body: { status: 'Suspended' },
      user: null,
    };
    const res = makeRes();
    const next = makeNext();

    await updateStudentStatus(req, res, next);

    assert.equal(res._status, 401);
    assert.equal(res._json.success, false);
    assert.match(res._json.message, /Admin/i);
  });

  it('returns 404 when student not found', async () => {
    const findMock = mock.method(models.User, 'findByPk', async () => null);

    const { updateStudentStatus } = await import('../../../src/controllers/admin/studentManagement.controller.js');

    const req = {
      params: { id: '99999' },
      body: { status: 'Suspended' },
      user: { id: 1 },
    };
    const res = makeRes();
    const next = makeNext();

    await updateStudentStatus(req, res, next);

    assert.equal(res._status, 404);
    assert.equal(res._json.success, false);

    findMock.mock.restore();
  });

  it('returns 404 when user is not a Student role', async () => {
    const findMock = mock.method(models.User, 'findByPk', async () => ({
      id: 1, role: 'Business', status: 'Active',
    }));

    const { updateStudentStatus } = await import('../../../src/controllers/admin/studentManagement.controller.js');

    const req = {
      params: { id: '1' },
      body: { status: 'Suspended' },
      user: { id: 99 },
    };
    const res = makeRes();
    const next = makeNext();

    await updateStudentStatus(req, res, next);

    assert.equal(res._status, 404);

    findMock.mock.restore();
  });

  it('returns 400 when status is already the same', async () => {
    const findMock = mock.method(models.User, 'findByPk', async () => ({
      id: 1, role: 'Student', status: 'Active',
    }));

    const { updateStudentStatus } = await import('../../../src/controllers/admin/studentManagement.controller.js');

    const req = {
      params: { id: '1' },
      body: { status: 'Active' },
      user: { id: 99 },
    };
    const res = makeRes();
    const next = makeNext();

    await updateStudentStatus(req, res, next);

    assert.equal(res._status, 400);
    assert.match(res._json.message, /already/i);

    findMock.mock.restore();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// addStudentNote
// ═══════════════════════════════════════════════════════════════════════════════

describe('addStudentNote Controller', () => {
  it('returns 401 when admin is not authenticated', async () => {
    const { addStudentNote } = await import('../../../src/controllers/admin/studentManagement.controller.js');

    const req = {
      params: { id: '1' },
      body: { text: 'Some note' },
      user: {},
    };
    const res = makeRes();
    const next = makeNext();

    await addStudentNote(req, res, next);

    assert.equal(res._status, 401);
  });

  it('returns 404 when student profile not found', async () => {
    const findMock = mock.method(models.StudentProfile, 'findOne', async () => null);

    const { addStudentNote } = await import('../../../src/controllers/admin/studentManagement.controller.js');

    const req = {
      params: { id: '99999' },
      body: { text: 'Some note' },
      user: { name: 'Admin User' },
    };
    const res = makeRes();
    const next = makeNext();

    await addStudentNote(req, res, next);

    assert.equal(res._status, 404);
    assert.match(res._json.message, /not found/i);

    findMock.mock.restore();
  });

  it('adds note successfully and returns 201', async () => {
    const mockProfile = {
      adminNotes: [{ text: 'Old note', adminName: 'Admin1', createdAt: '2026-01-01' }],
      save: mock.fn(async () => {}),
    };
    const findMock = mock.method(models.StudentProfile, 'findOne', async () => mockProfile);

    const { addStudentNote } = await import('../../../src/controllers/admin/studentManagement.controller.js');

    const req = {
      params: { id: '1' },
      body: { text: 'New admin note about this student' },
      user: { name: 'Admin Two' },
    };
    const res = makeRes();
    const next = makeNext();

    await addStudentNote(req, res, next);

    assert.equal(res._status, 201);
    assert.equal(res._json.success, true);
    assert.equal(res._json.data.length, 2);
    assert.equal(res._json.data[1].text, 'New admin note about this student');
    assert.equal(res._json.data[1].adminName, 'Admin Two');

    findMock.mock.restore();
  });

  it('handles empty existing notes (null adminNotes)', async () => {
    const mockProfile = {
      adminNotes: null,
      save: mock.fn(async () => {}),
    };
    const findMock = mock.method(models.StudentProfile, 'findOne', async () => mockProfile);

    const { addStudentNote } = await import('../../../src/controllers/admin/studentManagement.controller.js');

    const req = {
      params: { id: '1' },
      body: { text: 'First note ever' },
      user: { name: 'Admin' },
    };
    const res = makeRes();
    const next = makeNext();

    await addStudentNote(req, res, next);

    assert.equal(res._status, 201);
    assert.equal(res._json.data.length, 1);

    findMock.mock.restore();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// forceLogout
// ═══════════════════════════════════════════════════════════════════════════════

describe('forceLogout Controller', () => {
  it('returns 401 when admin is not authenticated', async () => {
    const { forceLogout } = await import('../../../src/controllers/admin/studentManagement.controller.js');

    const req = { params: { id: '1' }, user: null };
    const res = makeRes();
    const next = makeNext();

    await forceLogout(req, res, next);

    assert.equal(res._status, 401);
  });

  it('returns 404 when student not found', async () => {
    const findMock = mock.method(models.User, 'findByPk', async () => null);

    const { forceLogout } = await import('../../../src/controllers/admin/studentManagement.controller.js');

    const req = { params: { id: '99999' }, user: { id: 1 } };
    const res = makeRes();
    const next = makeNext();

    await forceLogout(req, res, next);

    assert.equal(res._status, 404);

    findMock.mock.restore();
  });

  it('returns 404 when user is not a Student', async () => {
    const findMock = mock.method(models.User, 'findByPk', async () => ({
      id: 1, role: 'Business', isOnline: true,
    }));

    const { forceLogout } = await import('../../../src/controllers/admin/studentManagement.controller.js');

    const req = { params: { id: '1' }, user: { id: 99 } };
    const res = makeRes();
    const next = makeNext();

    await forceLogout(req, res, next);

    assert.equal(res._status, 404);

    findMock.mock.restore();
  });

  it('returns 400 when student is already offline', async () => {
    const findMock = mock.method(models.User, 'findByPk', async () => ({
      id: 1, role: 'Student', isOnline: false,
    }));

    const { forceLogout } = await import('../../../src/controllers/admin/studentManagement.controller.js');

    const req = { params: { id: '1' }, user: { id: 99 } };
    const res = makeRes();
    const next = makeNext();

    await forceLogout(req, res, next);

    assert.equal(res._status, 400);
    assert.match(res._json.message, /already logged out/i);

    findMock.mock.restore();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// sendStudentWarning
// ═══════════════════════════════════════════════════════════════════════════════

describe('sendStudentWarning Controller', () => {
  it('returns 401 when admin is not authenticated', async () => {
    const { sendStudentWarning } = await import('../../../src/controllers/admin/studentManagement.controller.js');

    const req = {
      params: { id: '1' },
      body: { message: 'Warning', category: 'Spam', severity: 'Low' },
      user: null,
    };
    const res = makeRes();
    const next = makeNext();

    await sendStudentWarning(req, res, next);

    assert.equal(res._status, 401);
  });

  it('returns 404 when student not found', async () => {
    const findMock = mock.method(models.User, 'findByPk', async () => null);

    const { sendStudentWarning } = await import('../../../src/controllers/admin/studentManagement.controller.js');

    const req = {
      params: { id: '99999' },
      body: { message: 'Warning', category: 'Spam', severity: 'Low' },
      user: { id: 1 },
    };
    const res = makeRes();
    const next = makeNext();

    await sendStudentWarning(req, res, next);

    assert.equal(res._status, 404);

    findMock.mock.restore();
  });

  it('returns 400 when student is already suspended', async () => {
    const findMock = mock.method(models.User, 'findByPk', async () => ({
      id: 1, role: 'Student', status: 'Suspended',
    }));

    const { sendStudentWarning } = await import('../../../src/controllers/admin/studentManagement.controller.js');

    const req = {
      params: { id: '1' },
      body: { message: 'Warning', category: 'Spam', severity: 'Low' },
      user: { id: 99 },
    };
    const res = makeRes();
    const next = makeNext();

    await sendStudentWarning(req, res, next);

    assert.equal(res._status, 400);
    assert.match(res._json.message, /suspended/i);

    findMock.mock.restore();
  });
});
