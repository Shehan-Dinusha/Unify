/**
 * Business Management Controller — Unit Test Suite
 * ──────────────────────────────────────────────────
 * Tests for all business/club management endpoints using mocked DB models.
 *
 * Run: node --test tests/unit/controllers/businessManagement.controller.test.js
 */

import { describe, it, mock } from 'node:test';
import assert from 'node:assert/strict';
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
// getBusinessProfile
// ═══════════════════════════════════════════════════════════════════════════════

describe('getBusinessProfile Controller', () => {
  it('returns 404 when business/club not found', async () => {
    const findMock = mock.method(models.User, 'findOne', async () => null);

    const { getBusinessProfile } = await import('../../../src/controllers/admin/businessManagement.controller.js');

    const req = { params: { id: '99999' } };
    const res = makeRes();
    const next = makeNext();

    await getBusinessProfile(req, res, next);

    assert.equal(res._status, 404);
    assert.equal(res._json.success, false);
    assert.match(res._json.message, /not found/i);

    findMock.mock.restore();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// updateBusinessStatus
// ═══════════════════════════════════════════════════════════════════════════════

describe('updateBusinessStatus Controller', () => {
  it('returns 401 when admin is not authenticated', async () => {
    const { updateBusinessStatus } = await import('../../../src/controllers/admin/businessManagement.controller.js');

    const req = {
      params: { id: '1' },
      body: { status: 'Suspended' },
      user: null,
    };
    const res = makeRes();
    const next = makeNext();

    await updateBusinessStatus(req, res, next);

    assert.equal(res._status, 401);
    assert.equal(res._json.success, false);
  });

  it('returns 404 when business not found', async () => {
    const findMock = mock.method(models.User, 'findByPk', async () => null);

    const { updateBusinessStatus } = await import('../../../src/controllers/admin/businessManagement.controller.js');

    const req = {
      params: { id: '99999' },
      body: { status: 'Suspended' },
      user: { id: 1 },
    };
    const res = makeRes();
    const next = makeNext();

    await updateBusinessStatus(req, res, next);

    assert.equal(res._status, 404);

    findMock.mock.restore();
  });

  it('returns 404 when user role is not Business or Club', async () => {
    const findMock = mock.method(models.User, 'findByPk', async () => ({
      id: 1, role: 'Student', status: 'Active',
    }));

    const { updateBusinessStatus } = await import('../../../src/controllers/admin/businessManagement.controller.js');

    const req = {
      params: { id: '1' },
      body: { status: 'Suspended' },
      user: { id: 99 },
    };
    const res = makeRes();
    const next = makeNext();

    await updateBusinessStatus(req, res, next);

    assert.equal(res._status, 404);
    assert.match(res._json.message, /not found/i);

    findMock.mock.restore();
  });

  it('returns 400 when status is already the same', async () => {
    const findMock = mock.method(models.User, 'findByPk', async () => ({
      id: 1, role: 'Business', status: 'Active',
    }));

    const { updateBusinessStatus } = await import('../../../src/controllers/admin/businessManagement.controller.js');

    const req = {
      params: { id: '1' },
      body: { status: 'Active' },
      user: { id: 99 },
    };
    const res = makeRes();
    const next = makeNext();

    await updateBusinessStatus(req, res, next);

    assert.equal(res._status, 400);
    assert.match(res._json.message, /already/i);

    findMock.mock.restore();
  });

  it('accepts Club role for status update', async () => {
    // This test verifies the role check accepts 'Club' as a valid role
    const mockUser = {
      id: 1, role: 'Club', status: 'Active',
      save: mock.fn(async () => {}),
    };
    const findMock = mock.method(models.User, 'findByPk', async () => mockUser);
    const logMock = mock.method(models.AdminLog, 'create', async () => ({}));

    const { updateBusinessStatus } = await import('../../../src/controllers/admin/businessManagement.controller.js');

    const req = {
      params: { id: '1' },
      body: { status: 'Inactive' },
      user: { id: 99 },
    };
    const res = makeRes();
    const next = makeNext();

    // This should NOT return 404 since 'Club' is valid
    await updateBusinessStatus(req, res, next);

    // Status should change (not 404 or 400)
    assert.notEqual(res._status, 404);
    assert.notEqual(res._status, 400);

    findMock.mock.restore();
    logMock.mock.restore();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// addBusinessNote
// ═══════════════════════════════════════════════════════════════════════════════

describe('addBusinessNote Controller', () => {
  it('returns 401 when admin is not authenticated', async () => {
    const { addBusinessNote } = await import('../../../src/controllers/admin/businessManagement.controller.js');

    const req = {
      params: { id: '1' },
      body: { text: 'Some note' },
      user: {},
    };
    const res = makeRes();
    const next = makeNext();

    await addBusinessNote(req, res, next);

    assert.equal(res._status, 401);
  });

  it('returns 404 when business profile not found', async () => {
    const findMock = mock.method(models.BusinessProfile, 'findOne', async () => null);

    const { addBusinessNote } = await import('../../../src/controllers/admin/businessManagement.controller.js');

    const req = {
      params: { id: '99999' },
      body: { text: 'Some note' },
      user: { name: 'Admin' },
    };
    const res = makeRes();
    const next = makeNext();

    await addBusinessNote(req, res, next);

    assert.equal(res._status, 404);
    assert.match(res._json.message, /not found/i);

    findMock.mock.restore();
  });

  it('adds note successfully and returns 201', async () => {
    const mockProfile = {
      adminNotes: [],
      save: mock.fn(async () => {}),
    };
    const findMock = mock.method(models.BusinessProfile, 'findOne', async () => mockProfile);

    const { addBusinessNote } = await import('../../../src/controllers/admin/businessManagement.controller.js');

    const req = {
      params: { id: '1' },
      body: { text: 'Business is performing well' },
      user: { name: 'Admin User' },
    };
    const res = makeRes();
    const next = makeNext();

    await addBusinessNote(req, res, next);

    assert.equal(res._status, 201);
    assert.equal(res._json.success, true);
    assert.equal(res._json.data.length, 1);
    assert.equal(res._json.data[0].text, 'Business is performing well');
    assert.equal(res._json.data[0].adminName, 'Admin User');

    findMock.mock.restore();
  });

  it('appends to existing notes', async () => {
    const mockProfile = {
      adminNotes: [{ text: 'Old note', adminName: 'Admin1' }],
      save: mock.fn(async () => {}),
    };
    const findMock = mock.method(models.BusinessProfile, 'findOne', async () => mockProfile);

    const { addBusinessNote } = await import('../../../src/controllers/admin/businessManagement.controller.js');

    const req = {
      params: { id: '1' },
      body: { text: 'New note' },
      user: { name: 'Admin2' },
    };
    const res = makeRes();
    const next = makeNext();

    await addBusinessNote(req, res, next);

    assert.equal(res._json.data.length, 2);
    assert.equal(res._json.data[1].text, 'New note');

    findMock.mock.restore();
  });

  it('handles null adminNotes gracefully', async () => {
    const mockProfile = {
      adminNotes: null,
      save: mock.fn(async () => {}),
    };
    const findMock = mock.method(models.BusinessProfile, 'findOne', async () => mockProfile);

    const { addBusinessNote } = await import('../../../src/controllers/admin/businessManagement.controller.js');

    const req = {
      params: { id: '1' },
      body: { text: 'First note' },
      user: { name: 'Admin' },
    };
    const res = makeRes();
    const next = makeNext();

    await addBusinessNote(req, res, next);

    assert.equal(res._status, 201);
    assert.equal(res._json.data.length, 1);

    findMock.mock.restore();
  });
});
