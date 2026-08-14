/**
 * Lost & Found Controller — Unit Test Suite
 * ─────────────────────────────────────────────
 * Tests for:
 *   createItem · getItems · getItemById · editItem · deleteItem · claimItem
 *
 * Run individually:
 *   node --test tests/unit/controllers/lostAndFound.controller.test.js
 *
 * Mocking strategy (matches existing boost.controller.test.js pattern):
 *   - Sequelize model static methods are patched with mock.method(Model, 'method', fn)
 *     because class static properties are configurable/writable.
 *   - s3Service is a default-export plain object, so mock.method works there too.
 *   - Named ESM exports (notifyUser, runMatchingEngine) are live bindings and
 *     cannot be patched. Tests that reach those code paths mock the Notification
 *     model underneath so the call completes silently without a real DB/network.
 */

import { describe, it, mock, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { mockRes, mockNext } from '../../../helpers/testUtils.js';

// ─── Sequelize model imports (for mock.method patching) ───────────────────────
import LostAndFound from '../../../../src/modules/LostAndFound.model.js';
import { ClaimRequest, User } from '../../../../src/modules/index.js';
import Notification from '../../../../src/modules/Notification.model.js';

// ─── Default-export service (for mock.method patching) ────────────────────────
import s3Service from '../../../../src/services/s3.service.js';

// ─── Helper to run catchAsync controllers ──────────────────────────────────────
const runController = (controller, req, res, next) => {
  return new Promise((resolve) => {
    const origJson = res.json.bind(res);
    res.json = (data) => {
      origJson(data);
      resolve();
      return res;
    };
    const origNext = next;
    const newNext = (err) => {
      origNext(err);
      resolve();
    };
    controller(req, res, newNext);
  });
};

// ─── Automatic mock cleanup ────────────────────────────────────────────────────
afterEach(() => {
  mock.restoreAll();
});

// ═══════════════════════════════════════════════════════════════════════════════
// createItem Controller
// ═══════════════════════════════════════════════════════════════════════════════

describe('createItem Controller', () => {
  it('returns 201 and creates item successfully (no files)', async () => {
    const createdItem = {
      id: 1, userId: 5, type: 'Lost', title: 'Blue Wallet',
      description: 'Leather wallet', location: 'Library',
      date: '2026-05-01', timeOfDay: '14:30', images: [], status: 'Active',
    };
    mock.method(LostAndFound, 'create', async () => createdItem);
    // Mock Notification so the fire-and-forget runMatchingEngine doesn't crash
    mock.method(LostAndFound, 'findAll', async () => []);
    mock.method(Notification, 'create', async () => ({}));

    const { createItem } = await import('../../../../src/controllers/lostAndFound/createItem.controller.js');

    const req = {
      user: { id: 5 },
      body: { type: 'Lost', title: 'Blue Wallet', description: 'Leather wallet', location: 'Library', date: '2026-05-01', timeOfDay: '14:30' },
      files: null,
    };
    const res = mockRes();
    const next = mockNext();

    await runController(createItem, req, res, next);

    assert.equal(res._status, 201);
    assert.equal(res._json.success, true);
    assert.equal(res._json.data.title, 'Blue Wallet');
    assert.equal(next.called, false);
  });

  it('extracts S3 keys from uploaded files and stores them', async () => {
    let capturedData;
    mock.method(LostAndFound, 'create', async (data) => {
      capturedData = data;
      return { id: 2, ...data };
    });
    mock.method(LostAndFound, 'findAll', async () => []);

    const { createItem } = await import('../../../../src/controllers/lostAndFound/createItem.controller.js');

    const req = {
      user: { id: 5 },
      body: { type: 'Found', title: 'Keys', description: 'Found near gate', location: 'Cafeteria', date: '2026-05-01', timeOfDay: '10:00' },
      files: [
        { location: 'lost-and-found/abc123.jpg' },
        { location: 'lost-and-found/def456.jpg' },
      ],
    };
    const res = mockRes();
    const next = mockNext();

    await runController(createItem, req, res, next);

    assert.equal(res._status, 201);
    assert.deepEqual(capturedData.images, ['lost-and-found/abc123.jpg', 'lost-and-found/def456.jpg']);
  });

  it('stores empty images array when no files are uploaded', async () => {
    let capturedData;
    mock.method(LostAndFound, 'create', async (data) => {
      capturedData = data;
      return { id: 3, ...data };
    });
    mock.method(LostAndFound, 'findAll', async () => []);

    const { createItem } = await import('../../../../src/controllers/lostAndFound/createItem.controller.js');

    const req = {
      user: { id: 5 },
      body: { type: 'Lost', title: 'Wallet', description: 'Desc', location: 'Lib', date: '2026-05-01', timeOfDay: '10:00' },
      files: [],
    };
    const res = mockRes();
    const next = mockNext();

    await runController(createItem, req, res, next);

    assert.equal(res._status, 201);
    assert.deepEqual(capturedData.images, []);
  });

  it('forwards DB errors to next()', async () => {
    mock.method(LostAndFound, 'create', async () => {
      throw new Error('DB write failed');
    });

    const { createItem } = await import('../../../../src/controllers/lostAndFound/createItem.controller.js');

    const req = {
      user: { id: 5 },
      body: { type: 'Lost', title: 'W', description: 'D', location: 'L', date: '2026-05-01', timeOfDay: '10:00' },
      files: null,
    };
    const res = mockRes();
    const next = mockNext();

    await runController(createItem, req, res, next);

    assert.equal(next.called, true);
    assert.equal(next.error.message, 'DB write failed');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// getItems Controller
// ═══════════════════════════════════════════════════════════════════════════════

describe('getItems Controller', () => {
  const makeItem = (overrides = {}) => ({
    id: 1, type: 'Lost', title: 'Blue Wallet', location: 'Library',
    createdAt: new Date('2026-05-01'), images: [],
    user: {
      name: 'Alice', avatar: null,
      studentProfile: { degree: { name: 'CS' } },
    },
    ...overrides,
  });

  it('returns 200 with a formatted item list', async () => {
    mock.method(LostAndFound, 'findAll', async () => [makeItem()]);

    const { getItems } = await import('../../../../src/controllers/lostAndFound/getItems.controller.js');

    const req = { query: {} };
    const res = mockRes();
    const next = mockNext();

    await runController(getItems, req, res, next);

    assert.equal(res._status, 200);
    assert.equal(res._json.success, true);
    assert.equal(res._json.data.length, 1);
    assert.equal(res._json.data[0].title, 'Blue Wallet');
    assert.equal(res._json.data[0].type, 'lost');        // lowercased
    assert.equal(res._json.data[0].postedBy.name, 'Alice');
    assert.equal(res._json.data[0].postedBy.degree, 'CS');
  });

  it('applies type filter when type is not "All"', async () => {
    let capturedWhere;
    mock.method(LostAndFound, 'findAll', async ({ where }) => {
      capturedWhere = where;
      return [];
    });

    const { getItems } = await import('../../../../src/controllers/lostAndFound/getItems.controller.js');

    await runController(getItems, { query: { type: 'Found' } }, mockRes(), mockNext());

    assert.equal(capturedWhere.type, 'Found');
    assert.equal(capturedWhere.status, 'Active');
  });

  it('omits type filter when type query param is "All"', async () => {
    let capturedWhere;
    mock.method(LostAndFound, 'findAll', async ({ where }) => {
      capturedWhere = where;
      return [];
    });

    const { getItems } = await import('../../../../src/controllers/lostAndFound/getItems.controller.js');

    await runController(getItems, { query: { type: 'All' } }, mockRes(), mockNext());

    assert.equal(capturedWhere.type, undefined);
  });

  it('uses fallback values when user profile data is missing', async () => {
    mock.method(LostAndFound, 'findAll', async () => [makeItem({ user: null })]);

    const { getItems } = await import('../../../../src/controllers/lostAndFound/getItems.controller.js');

    const res = mockRes();
    await runController(getItems, { query: {} }, res, mockNext());

    assert.equal(res._json.data[0].postedBy.name, 'Unknown');
    assert.equal(res._json.data[0].postedBy.degree, 'Unknown Degree');
  });

  it('returns 200 with empty array when no items exist', async () => {
    mock.method(LostAndFound, 'findAll', async () => []);

    const { getItems } = await import('../../../../src/controllers/lostAndFound/getItems.controller.js');

    const res = mockRes();
    await runController(getItems, { query: {} }, res, mockNext());

    assert.equal(res._status, 200);
    assert.equal(res._json.data.length, 0);
  });

  it('forwards DB errors to next()', async () => {
    mock.method(LostAndFound, 'findAll', async () => {
      throw new Error('DB timeout');
    });

    const { getItems } = await import('../../../../src/controllers/lostAndFound/getItems.controller.js');

    const next = mockNext();
    await runController(getItems, { query: {} }, mockRes(), next);

    assert.equal(next.called, true);
    assert.equal(next.error.message, 'DB timeout');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// getItemById Controller
// ═══════════════════════════════════════════════════════════════════════════════

describe('getItemById Controller', () => {
  it('returns 404 when item does not exist', async () => {
    mock.method(LostAndFound, 'findOne', async () => null);

    const { getItemById } = await import('../../../../src/controllers/lostAndFound/getItemById.controller.js');

    const res = mockRes();
    await runController(getItemById, { params: { id: '999' } }, res, mockNext());

    assert.equal(res._status, 404);
    assert.equal(res._json.success, false);
  });

  it('returns 200 with postId formatted as LF-{id}', async () => {
    const item = {
      id: 7, type: 'Found', title: 'Red Umbrella', description: 'Found near gate',
      location: 'Main Gate', date: '2026-05-10', timeOfDay: '09:00',
      createdAt: new Date('2026-05-10'), images: [],
      user: { name: 'Bob', avatar: null, studentProfile: { degree: { name: 'IT' } } },
    };
    mock.method(LostAndFound, 'findOne', async () => item);

    const { getItemById } = await import('../../../../src/controllers/lostAndFound/getItemById.controller.js');

    const res = mockRes();
    await runController(getItemById, { params: { id: '7' } }, res, mockNext());

    assert.equal(res._status, 200);
    assert.equal(res._json.success, true);
    assert.equal(res._json.data.postId, 'LF-7');
    assert.equal(res._json.data.type, 'found');          // lowercased
    assert.equal(res._json.data.title, 'Red Umbrella');
    assert.equal(res._json.data.postedBy.name, 'Bob');
    assert.equal(res._json.data.postedBy.degree, 'IT');
  });

  it('forwards DB errors to next()', async () => {
    mock.method(LostAndFound, 'findOne', async () => {
      throw new Error('Connection dropped');
    });

    const { getItemById } = await import('../../../../src/controllers/lostAndFound/getItemById.controller.js');

    const next = mockNext();
    await runController(getItemById, { params: { id: '7' } }, mockRes(), next);

    assert.equal(next.called, true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// deleteItem Controller
// ═══════════════════════════════════════════════════════════════════════════════

describe('deleteItem Controller', () => {
  it('returns 401 when user is not authenticated', async () => {
    const { deleteItem } = await import('../../../../src/controllers/lostAndFound/deleteItem.controller.js');

    const res = mockRes();
    await runController(deleteItem, { user: null, params: { id: '1' } }, res, mockNext());

    assert.equal(res._status, 401);
    assert.equal(res._json.success, false);
  });

  it('returns 404 when item does not exist', async () => {
    mock.method(LostAndFound, 'findByPk', async () => null);

    const { deleteItem } = await import('../../../../src/controllers/lostAndFound/deleteItem.controller.js');

    const res = mockRes();
    await runController(deleteItem, { user: { id: 1 }, params: { id: '999' } }, res, mockNext());

    assert.equal(res._status, 404);
    assert.match(res._json.message, /not found/i);
  });

  it('returns 403 when user is not the item owner', async () => {
    mock.method(LostAndFound, 'findByPk', async () => ({ id: 1, userId: 5, images: [] }));

    const { deleteItem } = await import('../../../../src/controllers/lostAndFound/deleteItem.controller.js');

    const res = mockRes();
    await runController(deleteItem, { user: { id: 9 }, params: { id: '1' } }, res, mockNext());

    assert.equal(res._status, 403);
    assert.match(res._json.message, /permission/i);
  });

  it('returns 200 and destroys item that has no images', async () => {
    const item = { id: 1, userId: 3, images: [], destroy: mock.fn(async () => {}) };
    mock.method(LostAndFound, 'findByPk', async () => item);

    const { deleteItem } = await import('../../../../src/controllers/lostAndFound/deleteItem.controller.js');

    const res = mockRes();
    await runController(deleteItem, { user: { id: 3 }, params: { id: '1' } }, res, mockNext());

    assert.equal(res._status, 200);
    assert.equal(res._json.success, true);
    assert.equal(item.destroy.mock.calls.length, 1);
  });

  it('deletes S3 images before destroying the DB record', async () => {
    const deletedKeys = [];
    const item = {
      id: 1, userId: 3,
      images: ['lost-and-found/img1.jpg', 'lost-and-found/img2.jpg'],
      destroy: mock.fn(async () => {}),
    };
    mock.method(LostAndFound, 'findByPk', async () => item);
    mock.method(s3Service, 'deleteFile', async (key) => { deletedKeys.push(key); });

    const { deleteItem } = await import('../../../../src/controllers/lostAndFound/deleteItem.controller.js');

    const res = mockRes();
    await runController(deleteItem, { user: { id: 3 }, params: { id: '1' } }, res, mockNext());

    assert.equal(res._status, 200);
    assert.deepEqual(deletedKeys.sort(), ['lost-and-found/img1.jpg', 'lost-and-found/img2.jpg'].sort());
    assert.equal(item.destroy.mock.calls.length, 1);
  });

  it('forwards DB errors to next()', async () => {
    mock.method(LostAndFound, 'findByPk', async () => { throw new Error('DB error'); });

    const { deleteItem } = await import('../../../../src/controllers/lostAndFound/deleteItem.controller.js');

    const next = mockNext();
    await runController(deleteItem, { user: { id: 3 }, params: { id: '1' } }, mockRes(), next);

    assert.equal(next.called, true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// claimItem Controller
// ═══════════════════════════════════════════════════════════════════════════════

describe('claimItem Controller', () => {
  it('returns 404 when the item does not exist', async () => {
    mock.method(LostAndFound, 'findByPk', async () => null);

    const { claimItem } = await import('../../../../src/controllers/lostAndFound/claimItem.controller.js');

    const res = mockRes();
    await runController(claimItem, 
      { user: { id: 2 }, params: { id: '999' }, body: { contactNumber: '0771234567', description: 'Mine' } },
      res, mockNext()
    );

    assert.equal(res._status, 404);
    assert.equal(res._json.success, false);
  });

  it('returns 400 when user tries to claim their own item', async () => {
    mock.method(LostAndFound, 'findByPk', async () => ({
      id: 1, userId: 2, type: 'Lost',
      user: { id: 2, name: 'Alice' },
    }));

    const { claimItem } = await import('../../../../src/controllers/lostAndFound/claimItem.controller.js');

    const res = mockRes();
    await runController(claimItem, 
      { user: { id: 2 }, params: { id: '1' }, body: { contactNumber: '0771234567', description: 'Mine' } },
      res, mockNext()
    );

    assert.equal(res._status, 400);
    assert.match(res._json.message, /cannot claim/i);
  });

  it('returns 400 when an existing claim already exists for this user', async () => {
    mock.method(LostAndFound, 'findByPk', async () => ({
      id: 1, userId: 5, type: 'Lost',
      user: { id: 5, name: 'Bob' },
    }));
    mock.method(ClaimRequest, 'findOne', async () => ({ id: 10, itemId: 1, claimantId: 2 }));

    const { claimItem } = await import('../../../../src/controllers/lostAndFound/claimItem.controller.js');

    const res = mockRes();
    await runController(claimItem, 
      { user: { id: 2 }, params: { id: '1' }, body: { contactNumber: '0771234567', description: 'Mine' } },
      res, mockNext()
    );

    assert.equal(res._status, 400);
    assert.match(res._json.message, /already submitted/i);
  });

  it('returns 201 and creates a claim record on success', async () => {
    mock.method(LostAndFound, 'findByPk', async () => ({
      id: 1, userId: 5, type: 'Lost',
      user: { id: 5, name: 'Bob' },
    }));
    mock.method(ClaimRequest, 'findOne', async () => null);
    mock.method(ClaimRequest, 'create', async (data) => ({ id: 11, ...data }));
    mock.method(User, 'findByPk', async () => ({ id: 2, name: 'Alice' }));
    // Mock Notification.create to prevent actual DB call from notifyUser
    mock.method(Notification, 'findOne', async () => null);
    mock.method(Notification, 'create', async () => ({ id: 99 }));

    const { claimItem } = await import('../../../../src/controllers/lostAndFound/claimItem.controller.js');

    const res = mockRes();
    await runController(claimItem, 
      { user: { id: 2 }, params: { id: '1' }, body: { contactNumber: '0771234567', description: 'I think this is mine' } },
      res, mockNext()
    );

    assert.equal(res._status, 201);
    assert.equal(res._json.success, true);
    assert.match(res._json.message, /submitted successfully/i);
  });

  it('forwards DB errors to next()', async () => {
    mock.method(LostAndFound, 'findByPk', async () => { throw new Error('Query failed'); });

    const { claimItem } = await import('../../../../src/controllers/lostAndFound/claimItem.controller.js');

    const next = mockNext();
    await runController(claimItem, 
      { user: { id: 2 }, params: { id: '1' }, body: { contactNumber: '077', description: 'Mine' } },
      mockRes(), next
    );

    assert.equal(next.called, true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// editItem Controller
// ═══════════════════════════════════════════════════════════════════════════════

describe('editItem Controller', () => {
  it('returns 404 when item does not exist', async () => {
    mock.method(LostAndFound, 'findByPk', async () => null);

    const { editItem } = await import('../../../../src/controllers/lostAndFound/editItem.controller.js');

    const res = mockRes();
    await runController(editItem, 
      { user: { id: 3 }, params: { id: '999' }, body: { title: 'Updated' }, files: null },
      res, mockNext()
    );

    assert.equal(res._status, 404);
    assert.match(res._json.message, /not found/i);
  });

  it('returns 403 when user is not the item owner', async () => {
    mock.method(LostAndFound, 'findByPk', async () => ({ id: 1, userId: 5, images: [] }));

    const { editItem } = await import('../../../../src/controllers/lostAndFound/editItem.controller.js');

    const res = mockRes();
    await runController(editItem, 
      { user: { id: 9 }, params: { id: '1' }, body: { title: 'Hack' }, files: null },
      res, mockNext()
    );

    assert.equal(res._status, 403);
    assert.match(res._json.message, /permission/i);
  });

  it('returns 200 with formatted updated item on success', async () => {
    const item = { id: 1, userId: 3, images: [], update: mock.fn(async () => {}) };
    const updatedItem = {
      id: 1, type: 'Lost', title: 'Updated Wallet', description: 'Updated desc',
      location: 'Block B', date: '2026-05-01', timeOfDay: '10:00',
      createdAt: new Date(), images: [], status: 'Active',
      user: { name: 'Alice', avatar: null, studentProfile: { degree: { name: 'CS' } } },
    };
    mock.method(LostAndFound, 'findByPk', async () => item);
    mock.method(LostAndFound, 'findOne', async () => updatedItem);

    const { editItem } = await import('../../../../src/controllers/lostAndFound/editItem.controller.js');

    const res = mockRes();
    await runController(editItem, 
      { user: { id: 3 }, params: { id: '1' }, body: { title: 'Updated Wallet' }, files: null },
      res, mockNext()
    );

    assert.equal(res._status, 200);
    assert.equal(res._json.success, true);
    assert.equal(res._json.data.title, 'Updated Wallet');
    assert.equal(res._json.data.type, 'lost');           // lowercased
    assert.equal(res._json.data.postedBy.name, 'Alice');
    assert.equal(item.update.mock.calls.length, 1);
  });

  it('forwards DB errors to next()', async () => {
    mock.method(LostAndFound, 'findByPk', async () => { throw new Error('Update failed'); });

    const { editItem } = await import('../../../../src/controllers/lostAndFound/editItem.controller.js');

    const next = mockNext();
    await runController(editItem, 
      { user: { id: 3 }, params: { id: '1' }, body: { title: 'X' }, files: null },
      mockRes(), next
    );

    assert.equal(next.called, true);
  });
});
