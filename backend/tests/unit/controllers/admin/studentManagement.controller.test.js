/**
 * Student Management Controller — Unit Test Suite (Industry-Level)
 * ─────────────────────────────────────────────────────────────────
 * Tests for all student management endpoints using mocked DB models.
 * Each controller function is tested for:
 *   - Happy path (success response)
 *   - Auth checks (missing user)
 *   - Not found scenarios
 *   - Edge cases and guard clauses
 *   - Error forwarding to next()
 *
 * Run: node --test tests/unit/controllers/studentManagement.controller.test.js
 */

import { describe, it, mock, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { mockRes, mockNext } from '../../../helpers/testUtils.js';

// We test the controller logic by importing the real controllers
// and mocking the Sequelize models they depend on.
import * as models from '../../../../src/modules/index.js';

// ─── Automatic Mock Cleanup ─────────────────────────────────────────────────
afterEach(() => {
  mock.restoreAll();
});

// ═══════════════════════════════════════════════════════════════════════════════
// getStudentStats
// ═══════════════════════════════════════════════════════════════════════════════

describe('getStudentStats Controller', () => {
  it('returns 200 with calculated stats', async () => {
    // Mock User.count to return different values for different queries
    mock.method(models.User, 'count', async (opts) => {
      if (!opts?.where) return 100;
      if (opts.where.status === 'Active') return 85;
      if (opts.where.lastActive) return 60;
      return 100;
    });

    mock.method(models.StudentReport, 'count', async () => 3);

    // Import after mocking
    const { getStudentStats } = await import('../../../../src/controllers/admin/studentManagement.controller.js');

    const req = {};
    const res = mockRes();
    const next = mockNext();

    await getStudentStats(req, res, next);

    assert.equal(res._status, 200);
    assert.equal(res._json.success, true);
    assert.ok(res._json.data.activityRate);
    assert.ok(res._json.data.flaggedSessions !== undefined);
    assert.equal(next.called, false);
  });

  it('forwards unexpected errors to next()', async () => {
    mock.method(models.User, 'count', async () => {
      throw new Error('DB connection refused');
    });

    const { getStudentStats } = await import('../../../../src/controllers/admin/studentManagement.controller.js');

    const req = {};
    const res = mockRes();
    const next = mockNext();

    await getStudentStats(req, res, next);

    assert.equal(next.called, true);
    assert.ok(next.error instanceof Error);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// getStudentProfile
// ═══════════════════════════════════════════════════════════════════════════════

describe('getStudentProfile Controller', () => {
  it('returns 404 when student not found', async () => {
    mock.method(models.User, 'findOne', async () => null);

    const { getStudentProfile } = await import('../../../../src/controllers/admin/studentManagement.controller.js');

    const req = { params: { id: '99999' } };
    const res = mockRes();
    const next = mockNext();

    await getStudentProfile(req, res, next);

    assert.equal(res._status, 404);
    assert.equal(res._json.success, false);
    assert.match(res._json.message, /not found/i);
  });

  it('returns 200 with formatted student profile on success', async () => {
    // Mock User.findOne to return a full student
    mock.method(models.User, 'findOne', async () => ({
      id: 1,
      name: 'Test Student',
      email: 'test@student.com',
      avatar: null,
      status: 'Active',
      isOnline: true,
      createdAt: new Date('2026-01-01'),
      studentProfile: {
        registrationNumber: 'REG-001',
        faculty: { name: 'Information Technology' },
        tier: 'Premium',
        reputationScore: 85,
        adminNotes: [],
      },
    }));

    // Mock Post/Comment/Report counts
    mock.method(models.Post, 'count', async () => 25);
    mock.method(models.Comment, 'count', async () => 40);
    mock.method(models.StudentReport, 'count', async () => 0);
    mock.method(models.UserActivityLog, 'findAll', async () => []);

    const { getStudentProfile } = await import('../../../../src/controllers/admin/studentManagement.controller.js');

    const req = { params: { id: '1' } };
    const res = mockRes();
    const next = mockNext();

    await getStudentProfile(req, res, next);

    assert.equal(res._status, 200);
    assert.equal(res._json.success, true);
    assert.equal(res._json.data.name, 'Test Student');
    assert.equal(res._json.data.email, 'test@student.com');
    assert.equal(res._json.data.status, 'Active');
    assert.ok(res._json.data.stats);
    assert.ok(res._json.data.stats.totalPosts);
    assert.ok(res._json.data.stats.comments);
    assert.ok(res._json.data.stats.reputation);
    assert.ok(Array.isArray(res._json.data.activityLog));
  });

  it('forwards unexpected errors to next()', async () => {
    mock.method(models.User, 'findOne', async () => {
      throw new Error('DB timeout');
    });

    const { getStudentProfile } = await import('../../../../src/controllers/admin/studentManagement.controller.js');

    const req = { params: { id: '1' } };
    const res = mockRes();
    const next = mockNext();

    await getStudentProfile(req, res, next);

    assert.equal(next.called, true);
    assert.equal(next.error.message, 'DB timeout');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// updateStudentStatus
// ═══════════════════════════════════════════════════════════════════════════════

describe('updateStudentStatus Controller', () => {
  it('returns 401 when admin is not authenticated', async () => {
    const { updateStudentStatus } = await import('../../../../src/controllers/admin/studentManagement.controller.js');

    const req = {
      params: { id: '1' },
      body: { status: 'Suspended' },
      user: null,
    };
    const res = mockRes();
    const next = mockNext();

    await updateStudentStatus(req, res, next);

    assert.equal(res._status, 401);
    assert.equal(res._json.success, false);
    assert.match(res._json.message, /Admin/i);
  });

  it('returns 404 when student not found', async () => {
    mock.method(models.User, 'findByPk', async () => null);

    const { updateStudentStatus } = await import('../../../../src/controllers/admin/studentManagement.controller.js');

    const req = {
      params: { id: '99999' },
      body: { status: 'Suspended' },
      user: { id: 1 },
    };
    const res = mockRes();
    const next = mockNext();

    await updateStudentStatus(req, res, next);

    assert.equal(res._status, 404);
    assert.equal(res._json.success, false);
  });

  it('returns 404 when user is not a Student role', async () => {
    mock.method(models.User, 'findByPk', async () => ({
      id: 1, role: 'Business', status: 'Active',
    }));

    const { updateStudentStatus } = await import('../../../../src/controllers/admin/studentManagement.controller.js');

    const req = {
      params: { id: '1' },
      body: { status: 'Suspended' },
      user: { id: 99 },
    };
    const res = mockRes();
    const next = mockNext();

    await updateStudentStatus(req, res, next);

    assert.equal(res._status, 404);
  });

  it('returns 400 when status is already the same', async () => {
    mock.method(models.User, 'findByPk', async () => ({
      id: 1, role: 'Student', status: 'Active',
    }));

    const { updateStudentStatus } = await import('../../../../src/controllers/admin/studentManagement.controller.js');

    const req = {
      params: { id: '1' },
      body: { status: 'Active' },
      user: { id: 99 },
    };
    const res = mockRes();
    const next = mockNext();

    await updateStudentStatus(req, res, next);

    assert.equal(res._status, 400);
    assert.match(res._json.message, /already/i);
  });

  it('successfully suspends a student (200)', async () => {
    mock.method(models.User, 'findByPk', async () => ({
      id: 1, role: 'Student', status: 'Active', email: 'test@student.com',
    }));

    // Mock the suspension service (imported dynamically by the controller)
    const UserSuspensionService = (await import('../../../../src/services/userSuspension.service.js')).default;
    mock.method(UserSuspensionService, 'createSuspension', async () => ({}));
    mock.method(models.AdminLog, 'create', async () => ({}));

    const { updateStudentStatus } = await import('../../../../src/controllers/admin/studentManagement.controller.js');

    const req = {
      params: { id: '1' },
      body: { status: 'Suspended', reason: 'Policy violation', suspensionCategory: 'Spam' },
      user: { id: 99 },
    };
    const res = mockRes();
    const next = mockNext();

    await updateStudentStatus(req, res, next);

    assert.equal(res._status, 200);
    assert.equal(res._json.success, true);
    assert.equal(res._json.data.status, 'Suspended');
  });

  it('successfully reactivates a suspended student (200)', async () => {
    const mockUser = {
      id: 1, role: 'Student', status: 'Suspended', email: 'test@student.com',
      save: mock.fn(async () => {}),
    };
    mock.method(models.User, 'findByPk', async () => mockUser);

    const UserSuspensionService = (await import('../../../../src/services/userSuspension.service.js')).default;
    mock.method(UserSuspensionService, 'reactivateUser', async () => ({}));
    mock.method(models.AdminLog, 'create', async () => ({}));

    const { updateStudentStatus } = await import('../../../../src/controllers/admin/studentManagement.controller.js');

    const req = {
      params: { id: '1' },
      body: { status: 'Active' },
      user: { id: 99 },
    };
    const res = mockRes();
    const next = mockNext();

    await updateStudentStatus(req, res, next);

    assert.equal(res._status, 200);
    assert.equal(res._json.success, true);
    assert.equal(res._json.data.status, 'Active');
  });

  it('forwards unexpected errors to next()', async () => {
    mock.method(models.User, 'findByPk', async () => {
      throw new Error('DB connection failed');
    });

    const { updateStudentStatus } = await import('../../../../src/controllers/admin/studentManagement.controller.js');

    const req = {
      params: { id: '1' },
      body: { status: 'Suspended' },
      user: { id: 99 },
    };
    const res = mockRes();
    const next = mockNext();

    await updateStudentStatus(req, res, next);

    assert.equal(next.called, true);
    assert.equal(next.error.message, 'DB connection failed');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// addStudentNote
// ═══════════════════════════════════════════════════════════════════════════════

describe('addStudentNote Controller', () => {
  it('returns 401 when admin is not authenticated', async () => {
    const { addStudentNote } = await import('../../../../src/controllers/admin/studentManagement.controller.js');

    const req = {
      params: { id: '1' },
      body: { text: 'Some note' },
      user: {},
    };
    const res = mockRes();
    const next = mockNext();

    await addStudentNote(req, res, next);

    assert.equal(res._status, 401);
  });

  it('returns 404 when student profile not found', async () => {
    mock.method(models.StudentProfile, 'findOne', async () => null);

    const { addStudentNote } = await import('../../../../src/controllers/admin/studentManagement.controller.js');

    const req = {
      params: { id: '99999' },
      body: { text: 'Some note' },
      user: { name: 'Admin User' },
    };
    const res = mockRes();
    const next = mockNext();

    await addStudentNote(req, res, next);

    assert.equal(res._status, 404);
    assert.match(res._json.message, /not found/i);
  });

  it('adds note successfully and returns 201', async () => {
    const mockProfile = {
      adminNotes: [{ text: 'Old note', adminName: 'Admin1', createdAt: '2026-01-01' }],
      save: mock.fn(async () => {}),
    };
    mock.method(models.StudentProfile, 'findOne', async () => mockProfile);

    const { addStudentNote } = await import('../../../../src/controllers/admin/studentManagement.controller.js');

    const req = {
      params: { id: '1' },
      body: { text: 'New admin note about this student' },
      user: { name: 'Admin Two' },
    };
    const res = mockRes();
    const next = mockNext();

    await addStudentNote(req, res, next);

    assert.equal(res._status, 201);
    assert.equal(res._json.success, true);
    assert.equal(res._json.data.length, 2);
    assert.equal(res._json.data[1].text, 'New admin note about this student');
    assert.equal(res._json.data[1].adminName, 'Admin Two');
  });

  it('handles empty existing notes (null adminNotes)', async () => {
    const mockProfile = {
      adminNotes: null,
      save: mock.fn(async () => {}),
    };
    mock.method(models.StudentProfile, 'findOne', async () => mockProfile);

    const { addStudentNote } = await import('../../../../src/controllers/admin/studentManagement.controller.js');

    const req = {
      params: { id: '1' },
      body: { text: 'First note ever' },
      user: { name: 'Admin' },
    };
    const res = mockRes();
    const next = mockNext();

    await addStudentNote(req, res, next);

    assert.equal(res._status, 201);
    assert.equal(res._json.data.length, 1);
  });

  it('forwards unexpected errors to next()', async () => {
    mock.method(models.StudentProfile, 'findOne', async () => {
      throw new Error('DB write failed');
    });

    const { addStudentNote } = await import('../../../../src/controllers/admin/studentManagement.controller.js');

    const req = {
      params: { id: '1' },
      body: { text: 'Some note' },
      user: { name: 'Admin' },
    };
    const res = mockRes();
    const next = mockNext();

    await addStudentNote(req, res, next);

    assert.equal(next.called, true);
    assert.equal(next.error.message, 'DB write failed');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// forceLogout
// ═══════════════════════════════════════════════════════════════════════════════

describe('forceLogout Controller', () => {
  it('returns 401 when admin is not authenticated', async () => {
    const { forceLogout } = await import('../../../../src/controllers/admin/studentManagement.controller.js');

    const req = { params: { id: '1' }, user: null };
    const res = mockRes();
    const next = mockNext();

    await forceLogout(req, res, next);

    assert.equal(res._status, 401);
  });

  it('returns 404 when student not found', async () => {
    mock.method(models.User, 'findByPk', async () => null);

    const { forceLogout } = await import('../../../../src/controllers/admin/studentManagement.controller.js');

    const req = { params: { id: '99999' }, user: { id: 1 } };
    const res = mockRes();
    const next = mockNext();

    await forceLogout(req, res, next);

    assert.equal(res._status, 404);
  });

  it('returns 404 when user is not a Student', async () => {
    mock.method(models.User, 'findByPk', async () => ({
      id: 1, role: 'Business', isOnline: true,
    }));

    const { forceLogout } = await import('../../../../src/controllers/admin/studentManagement.controller.js');

    const req = { params: { id: '1' }, user: { id: 99 } };
    const res = mockRes();
    const next = mockNext();

    await forceLogout(req, res, next);

    assert.equal(res._status, 404);
  });

  it('returns 400 when student is already offline', async () => {
    mock.method(models.User, 'findByPk', async () => ({
      id: 1, role: 'Student', isOnline: false,
    }));

    const { forceLogout } = await import('../../../../src/controllers/admin/studentManagement.controller.js');

    const req = { params: { id: '1' }, user: { id: 99 } };
    const res = mockRes();
    const next = mockNext();

    await forceLogout(req, res, next);

    assert.equal(res._status, 400);
    assert.match(res._json.message, /already logged out/i);
  });

  it('successfully forces logout and returns 200', async () => {
    const mockUser = {
      id: 1, role: 'Student', isOnline: true,
      save: mock.fn(async () => {}),
    };
    mock.method(models.User, 'findByPk', async () => mockUser);
    mock.method(models.UserSession, 'update', async () => [1]);
    mock.method(models.AdminLog, 'create', async () => ({}));

    const { forceLogout } = await import('../../../../src/controllers/admin/studentManagement.controller.js');

    const req = { params: { id: '1' }, user: { id: 99 } };
    const res = mockRes();
    const next = mockNext();

    await forceLogout(req, res, next);

    assert.equal(res._status, 200);
    assert.equal(res._json.success, true);
    assert.equal(mockUser.isOnline, false);
  });

  it('forwards unexpected errors to next()', async () => {
    mock.method(models.User, 'findByPk', async () => {
      throw new Error('DB read failed');
    });

    const { forceLogout } = await import('../../../../src/controllers/admin/studentManagement.controller.js');

    const req = { params: { id: '1' }, user: { id: 99 } };
    const res = mockRes();
    const next = mockNext();

    await forceLogout(req, res, next);

    assert.equal(next.called, true);
    assert.equal(next.error.message, 'DB read failed');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// sendStudentWarning
// ═══════════════════════════════════════════════════════════════════════════════

describe('sendStudentWarning Controller', () => {
  it('returns 401 when admin is not authenticated', async () => {
    const { sendStudentWarning } = await import('../../../../src/controllers/admin/studentManagement.controller.js');

    const req = {
      params: { id: '1' },
      body: { message: 'Warning', category: 'Spam', severity: 'Low' },
      user: null,
    };
    const res = mockRes();
    const next = mockNext();

    await sendStudentWarning(req, res, next);

    assert.equal(res._status, 401);
  });

  it('returns 404 when student not found', async () => {
    mock.method(models.User, 'findByPk', async () => null);

    const { sendStudentWarning } = await import('../../../../src/controllers/admin/studentManagement.controller.js');

    const req = {
      params: { id: '99999' },
      body: { message: 'Warning', category: 'Spam', severity: 'Low' },
      user: { id: 1 },
    };
    const res = mockRes();
    const next = mockNext();

    await sendStudentWarning(req, res, next);

    assert.equal(res._status, 404);
  });

  it('returns 400 when student is already suspended', async () => {
    mock.method(models.User, 'findByPk', async () => ({
      id: 1, role: 'Student', status: 'Suspended',
    }));

    const { sendStudentWarning } = await import('../../../../src/controllers/admin/studentManagement.controller.js');

    const req = {
      params: { id: '1' },
      body: { message: 'Warning', category: 'Spam', severity: 'Low' },
      user: { id: 99 },
    };
    const res = mockRes();
    const next = mockNext();

    await sendStudentWarning(req, res, next);

    assert.equal(res._status, 400);
    assert.match(res._json.message, /suspended/i);
  });

  it('sends warning successfully and returns 200', async () => {
    mock.method(models.User, 'findByPk', async () => ({
      id: 1, role: 'Student', status: 'Active', email: 'test@student.com',
    }));
    mock.method(models.AdminLog, 'create', async () => ({}));

    // Mock reputation service
    const { updateStudentReputation } = await import('../../../../src/services/reputation.service.js');
    mock.method({ updateStudentReputation }, 'updateStudentReputation', async () => ({}));

    const { sendStudentWarning } = await import('../../../../src/controllers/admin/studentManagement.controller.js');

    const req = {
      params: { id: '1' },
      body: { message: 'Stop spamming', category: 'Spam', severity: 'Medium' },
      user: { id: 99 },
    };
    const res = mockRes();
    const next = mockNext();

    await sendStudentWarning(req, res, next);

    assert.equal(res._status, 200);
    assert.equal(res._json.success, true);
    assert.match(res._json.message, /warning sent/i);
  });

  it('forwards unexpected errors to next()', async () => {
    mock.method(models.User, 'findByPk', async () => {
      throw new Error('Service unavailable');
    });

    const { sendStudentWarning } = await import('../../../../src/controllers/admin/studentManagement.controller.js');

    const req = {
      params: { id: '1' },
      body: { message: 'Warning', category: 'Spam', severity: 'Low' },
      user: { id: 99 },
    };
    const res = mockRes();
    const next = mockNext();

    await sendStudentWarning(req, res, next);

    assert.equal(next.called, true);
    assert.equal(next.error.message, 'Service unavailable');
  });
});
