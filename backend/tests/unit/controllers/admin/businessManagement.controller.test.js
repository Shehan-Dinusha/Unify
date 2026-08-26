/**
 * Business Management Controller — Unit Test Suite 
 * 
 * Run: node --test tests/unit/controllers/businessManagement.controller.test.js
 */

import { describe, it, mock, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { mockRes, mockNext } from '../../../helpers/testUtils.js';
import * as models from '../../../../src/modules/index.js';

// ─── Automatic Mock Cleanup ─────────────────────────────────────────────────
afterEach(() => {
  mock.restoreAll();
});

// ═══════════════════════════════════════════════════════════════════════════════
// getBusinessProfile
// ═══════════════════════════════════════════════════════════════════════════════

describe('getBusinessProfile Controller', () => {
  it('returns 404 when business/club not found', async () => {
    mock.method(models.User, 'findOne', async () => null);

    const { getBusinessProfile } = await import('../../../../src/controllers/admin/businessManagement.controller.js');

    const req = { params: { id: '99999' } };
    const res = mockRes();
    const next = mockNext();

    await getBusinessProfile(req, res, next);

    assert.equal(res._status, 404);
    assert.equal(res._json.success, false);
    assert.match(res._json.message, /not found/i);
  });

  it('forwards unexpected errors to next()', async () => {
    mock.method(models.User, 'findOne', async () => {
      throw new Error('DB connection lost');
    });

    const { getBusinessProfile } = await import('../../../../src/controllers/admin/businessManagement.controller.js');

    const req = { params: { id: '1' } };
    const res = mockRes();
    const next = mockNext();

    await getBusinessProfile(req, res, next);

    assert.equal(next.called, true);
    assert.equal(next.error.message, 'DB connection lost');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// updateBusinessStatus
// ═══════════════════════════════════════════════════════════════════════════════

describe('updateBusinessStatus Controller', () => {
  it('returns 401 when admin is not authenticated', async () => {
    const { updateBusinessStatus } = await import('../../../../src/controllers/admin/businessManagement.controller.js');

    const req = {
      params: { id: '1' },
      body: { status: 'Suspended' },
      user: null,
    };
    const res = mockRes();
    const next = mockNext();

    await updateBusinessStatus(req, res, next);

    assert.equal(res._status, 401);
    assert.equal(res._json.success, false);
  });

  it('returns 404 when business not found', async () => {
    mock.method(models.User, 'findByPk', async () => null);

    const { updateBusinessStatus } = await import('../../../../src/controllers/admin/businessManagement.controller.js');

    const req = {
      params: { id: '99999' },
      body: { status: 'Suspended' },
      user: { id: 1 },
    };
    const res = mockRes();
    const next = mockNext();

    await updateBusinessStatus(req, res, next);

    assert.equal(res._status, 404);
  });

  it('returns 404 when user role is not Business or Club', async () => {
    mock.method(models.User, 'findByPk', async () => ({
      id: 1, role: 'Student', status: 'Active',
    }));

    const { updateBusinessStatus } = await import('../../../../src/controllers/admin/businessManagement.controller.js');

    const req = {
      params: { id: '1' },
      body: { status: 'Suspended' },
      user: { id: 99 },
    };
    const res = mockRes();
    const next = mockNext();

    await updateBusinessStatus(req, res, next);

    assert.equal(res._status, 404);
    assert.match(res._json.message, /not found/i);
  });

  it('returns 400 when status is already the same', async () => {
    mock.method(models.User, 'findByPk', async () => ({
      id: 1, role: 'Business', status: 'Active',
    }));

    const { updateBusinessStatus } = await import('../../../../src/controllers/admin/businessManagement.controller.js');

    const req = {
      params: { id: '1' },
      body: { status: 'Active' },
      user: { id: 99 },
    };
    const res = mockRes();
    const next = mockNext();

    await updateBusinessStatus(req, res, next);

    assert.equal(res._status, 400);
    assert.match(res._json.message, /already/i);
  });

  it('accepts Club role for status update', async () => {
    // This test verifies the role check accepts 'Club' as a valid role
    const mockUser = {
      id: 1, role: 'Club', status: 'Active',
      save: mock.fn(async () => {}),
    };
    mock.method(models.User, 'findByPk', async () => mockUser);
    mock.method(models.AdminLog, 'create', async () => ({}));

    const { updateBusinessStatus } = await import('../../../../src/controllers/admin/businessManagement.controller.js');

    const req = {
      params: { id: '1' },
      body: { status: 'Inactive' },
      user: { id: 99 },
    };
    const res = mockRes();
    const next = mockNext();

    // This should NOT return 404 since 'Club' is valid
    await updateBusinessStatus(req, res, next);

    // Status should change (not 404 or 400)
    assert.notEqual(res._status, 404);
    assert.notEqual(res._status, 400);
  });

  it('successfully suspends a business (200)', async () => {
    mock.method(models.User, 'findByPk', async () => ({
      id: 1, role: 'Business', status: 'Active', email: 'biz@test.com',
    }));

    const UserSuspensionService = (await import('../../../../src/services/userSuspension.service.js')).default;
    mock.method(UserSuspensionService, 'createSuspension', async () => ({}));

    const { updateBusinessStatus } = await import('../../../../src/controllers/admin/businessManagement.controller.js');

    const req = {
      params: { id: '1' },
      body: { status: 'Suspended', reason: 'TOS violation', suspensionCategory: 'Fraud' },
      user: { id: 99 },
    };
    const res = mockRes();
    const next = mockNext();

    await updateBusinessStatus(req, res, next);

    assert.equal(res._status, 200);
    assert.equal(res._json.success, true);
    assert.match(res._json.message, /Suspended/);
  });

  it('successfully reactivates a suspended business (200)', async () => {
    const mockUser = {
      id: 1, role: 'Business', status: 'Suspended', email: 'biz@test.com',
      save: mock.fn(async () => {}),
    };
    mock.method(models.User, 'findByPk', async () => mockUser);

    const UserSuspensionService = (await import('../../../../src/services/userSuspension.service.js')).default;
    mock.method(UserSuspensionService, 'reactivateUser', async () => ({}));

    const { updateBusinessStatus } = await import('../../../../src/controllers/admin/businessManagement.controller.js');

    const req = {
      params: { id: '1' },
      body: { status: 'Active' },
      user: { id: 99 },
    };
    const res = mockRes();
    const next = mockNext();

    await updateBusinessStatus(req, res, next);

    assert.equal(res._status, 200);
    assert.equal(res._json.success, true);
    assert.match(res._json.message, /Active/);
  });

  it('returns 500 via sendResponse when service throws', async () => {
    // NOTE: updateBusinessStatus uses sendResponse(res, 500) instead of next(error)
    mock.method(models.User, 'findByPk', async () => {
      throw new Error('Unexpected DB failure');
    });

    const { updateBusinessStatus } = await import('../../../../src/controllers/admin/businessManagement.controller.js');

    const req = {
      params: { id: '1' },
      body: { status: 'Suspended' },
      user: { id: 99 },
    };
    const res = mockRes();
    const next = mockNext();

    await updateBusinessStatus(req, res, next);

    assert.equal(res._status, 500);
    assert.equal(res._json.success, false);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// addBusinessNote
// ═══════════════════════════════════════════════════════════════════════════════

describe('addBusinessNote Controller', () => {
  it('returns 401 when admin is not authenticated', async () => {
    const { addBusinessNote } = await import('../../../../src/controllers/admin/businessManagement.controller.js');

    const req = {
      params: { id: '1' },
      body: { text: 'Some note' },
      user: {},
    };
    const res = mockRes();
    const next = mockNext();

    await addBusinessNote(req, res, next);

    assert.equal(res._status, 401);
  });

  it('returns 404 when business profile not found', async () => {
    mock.method(models.BusinessProfile, 'findOne', async () => null);

    const { addBusinessNote } = await import('../../../../src/controllers/admin/businessManagement.controller.js');

    const req = {
      params: { id: '99999' },
      body: { text: 'Some note' },
      user: { name: 'Admin' },
    };
    const res = mockRes();
    const next = mockNext();

    await addBusinessNote(req, res, next);

    assert.equal(res._status, 404);
    assert.match(res._json.message, /not found/i);
  });

  it('adds note successfully and returns 201', async () => {
    const mockProfile = {
      adminNotes: [],
      save: mock.fn(async () => {}),
    };
    mock.method(models.BusinessProfile, 'findOne', async () => mockProfile);

    const { addBusinessNote } = await import('../../../../src/controllers/admin/businessManagement.controller.js');

    const req = {
      params: { id: '1' },
      body: { text: 'Business is performing well' },
      user: { name: 'Admin User' },
    };
    const res = mockRes();
    const next = mockNext();

    await addBusinessNote(req, res, next);

    assert.equal(res._status, 201);
    assert.equal(res._json.success, true);
    assert.equal(res._json.data.length, 1);
    assert.equal(res._json.data[0].text, 'Business is performing well');
    assert.equal(res._json.data[0].adminName, 'Admin User');
  });

  it('appends to existing notes', async () => {
    const mockProfile = {
      adminNotes: [{ text: 'Old note', adminName: 'Admin1' }],
      save: mock.fn(async () => {}),
    };
    mock.method(models.BusinessProfile, 'findOne', async () => mockProfile);

    const { addBusinessNote } = await import('../../../../src/controllers/admin/businessManagement.controller.js');

    const req = {
      params: { id: '1' },
      body: { text: 'New note' },
      user: { name: 'Admin2' },
    };
    const res = mockRes();
    const next = mockNext();

    await addBusinessNote(req, res, next);

    assert.equal(res._json.data.length, 2);
    assert.equal(res._json.data[1].text, 'New note');
  });

  it('handles null adminNotes gracefully', async () => {
    const mockProfile = {
      adminNotes: null,
      save: mock.fn(async () => {}),
    };
    mock.method(models.BusinessProfile, 'findOne', async () => mockProfile);

    const { addBusinessNote } = await import('../../../../src/controllers/admin/businessManagement.controller.js');

    const req = {
      params: { id: '1' },
      body: { text: 'First note' },
      user: { name: 'Admin' },
    };
    const res = mockRes();
    const next = mockNext();

    await addBusinessNote(req, res, next);

    assert.equal(res._status, 201);
    assert.equal(res._json.data.length, 1);
  });

  it('forwards unexpected errors to next()', async () => {
    mock.method(models.BusinessProfile, 'findOne', async () => {
      throw new Error('DB write error');
    });

    const { addBusinessNote } = await import('../../../../src/controllers/admin/businessManagement.controller.js');

    const req = {
      params: { id: '1' },
      body: { text: 'Some note' },
      user: { name: 'Admin' },
    };
    const res = mockRes();
    const next = mockNext();

    await addBusinessNote(req, res, next);

    assert.equal(next.called, true);
    assert.equal(next.error.message, 'DB write error');
  });
});
